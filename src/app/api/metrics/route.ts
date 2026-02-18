import { NextResponse } from 'next/server';
import { createPublicClient, formatEther, http } from 'viem';
import { celoSepolia } from 'viem/chains';
import { prisma } from '@/lib/prisma';

const regionNames: Record<number, string> = {
  1: 'Nairobi',
  2: 'Kampala',
  3: 'Uganda Border',
  4: 'Dar es Salaam',
  5: 'Lagos',
  6: 'Manila',
};

const client = createPublicClient({
  chain: celoSepolia,
  transport: http(process.env.CELO_RPC_URL ?? 'https://forno.celo-sepolia.celo-testnet.org'),
});

export async function GET() {
  const logs = await prisma.executionLog.findMany({
    where: {
      eventName: {
        in: ['IntentBroadcasted', 'CrossBorderRouteSet', 'CrossBorderStablecoinsSet', 'SettlementReleased'],
      },
    },
    orderBy: { createdAt: 'asc' },
    take: 2000,
  });

  const broadcastAt = new Map<number, number>();
  const routeByIntent = new Map<number, { source: number; destination: number }>();
  const stablePairByIntent = new Map<number, { sourceStable: string; destinationStable: string }>();
  const settlementAt = new Map<number, number>();
  const valueByIntent = new Map<number, number>();

  for (const log of logs) {
    const payload = (log.payload ?? {}) as Record<string, unknown>;
    const ts = new Date(log.createdAt).getTime();

    if (log.eventName === 'IntentBroadcasted') {
      broadcastAt.set(log.intentId, ts);
    }

    if (log.eventName === 'CrossBorderRouteSet') {
      const source = Number(payload.sourceRegion ?? 0);
      const destination = Number(payload.destinationRegion ?? 0);
      if (source && destination) {
        routeByIntent.set(log.intentId, { source, destination });
      }
    }

    if (log.eventName === 'CrossBorderStablecoinsSet') {
      const sourceStable = String(payload.sourceStable ?? 'N/A');
      const destinationStable = String(payload.destinationStable ?? 'N/A');
      stablePairByIntent.set(log.intentId, { sourceStable, destinationStable });
    }

    if (log.eventName === 'SettlementReleased') {
      settlementAt.set(log.intentId, ts);
      const amount = Number(payload.amount ?? 0);
      valueByIntent.set(log.intentId, amount / 1e18);
    }
  }

  const settlementLogs = logs.filter((l) => l.eventName === 'SettlementReleased' && !!l.txHash);
  const feeSamples: number[] = [];

  await Promise.all(settlementLogs.slice(0, 50).map(async (log) => {
    try {
      const receipt = await client.getTransactionReceipt({ hash: log.txHash as `0x${string}` });
      const feeWei = receipt.gasUsed * receipt.effectiveGasPrice;
      feeSamples.push(Number(formatEther(feeWei)));
    } catch {
      // ignore unavailable receipts
    }
  }));

  const routes = [...routeByIntent.entries()].map(([intentId, route]) => {
    const source = regionNames[route.source] ?? `Region ${route.source}`;
    const destination = regionNames[route.destination] ?? `Region ${route.destination}`;
    const stablePair = stablePairByIntent.get(intentId);
    return {
      intentId,
      route: `${source} → ${destination}`,
      stablePair: stablePair ? `${stablePair.sourceStable} → ${stablePair.destinationStable}` : 'N/A',
      valueCusd: valueByIntent.get(intentId) ?? 0,
      latencySeconds: broadcastAt.get(intentId) && settlementAt.get(intentId)
        ? Math.max(0, Math.round(((settlementAt.get(intentId) as number) - (broadcastAt.get(intentId) as number)) / 1000))
        : null,
    };
  });

  const completedRoutes = routes.filter((r) => r.latencySeconds !== null);
  const totalFundsMoved = routes.reduce((sum, r) => sum + r.valueCusd, 0);
  const avgLatency = completedRoutes.length
    ? Math.round(completedRoutes.reduce((sum, r) => sum + (r.latencySeconds ?? 0), 0) / completedRoutes.length)
    : 0;
  const avgFee = feeSamples.length
    ? feeSamples.reduce((sum, f) => sum + f, 0) / feeSamples.length
    : 0;

  return NextResponse.json({
    crossBorderFlowCount: routes.length,
    settledCrossBorderCount: completedRoutes.length,
    averageLatencySeconds: avgLatency,
    averageSettlementFeeCelo: avgFee,
    totalFundsMovedCusd: totalFundsMoved,
    routes,
    generatedAt: new Date().toISOString(),
  });
}
