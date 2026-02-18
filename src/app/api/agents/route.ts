import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isX402Configured, settleX402Request } from '@/lib/x402';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const premium = url.searchParams.get('premium') === '1';

  if (premium) {
    if (!isX402Configured()) {
      return NextResponse.json(
        {
          error: 'x402 is not configured on server',
          requiredEnv: ['THIRDWEB_SECRET_KEY', 'THIRDWEB_SERVER_WALLET'],
        },
        { status: 500 }
      );
    }

    const settlement = await settleX402Request({
      request,
      resourceUrl: url.toString(),
      method: 'GET',
      price: '$0.01',
    });

    if (!settlement.ok) {
      return new NextResponse(JSON.stringify(settlement.responseBody), {
        status: settlement.status,
        headers: settlement.responseHeaders,
      });
    }
  }

  const logs = await prisma.executionLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 1500,
  });

  const reputations = await prisma.agentReputation.findMany({ take: 2000 });
  const repMap = new Map<number, bigint>();
  reputations.forEach((entry) => repMap.set(entry.agentId, entry.reputation));

  const recentByAgent = new Map<number, Date>();
  const activityByAgent = new Map<number, number>();
  const volumeByAgent = new Map<number, number>();
  const penaltyByAgent = new Map<number, number>();
  const nodeIds = new Set<number>();

  for (const log of logs) {
    const payload = (log.payload ?? {}) as Record<string, unknown>;
    const requesterAgentId = Number(payload.requesterAgentId ?? 0);
    const executorAgentId = Number(payload.executorAgentId ?? 0);
    const agentId = Number(payload.agentId ?? 0);
    const ts = new Date(log.createdAt);
    const amountRaw = Number(payload.amount ?? payload.value ?? 0);
    const amount = Number.isFinite(amountRaw) ? amountRaw / 1e18 : 0;

    if (requesterAgentId && !recentByAgent.has(requesterAgentId)) {
      recentByAgent.set(requesterAgentId, ts);
      nodeIds.add(requesterAgentId);
    }
    if (executorAgentId && !recentByAgent.has(executorAgentId)) {
      recentByAgent.set(executorAgentId, ts);
      nodeIds.add(executorAgentId);
    }

    if (requesterAgentId) {
      activityByAgent.set(requesterAgentId, (activityByAgent.get(requesterAgentId) ?? 0) + 1);
      volumeByAgent.set(requesterAgentId, (volumeByAgent.get(requesterAgentId) ?? 0) + amount);
    }

    if (executorAgentId) {
      activityByAgent.set(executorAgentId, (activityByAgent.get(executorAgentId) ?? 0) + 1);
      volumeByAgent.set(executorAgentId, (volumeByAgent.get(executorAgentId) ?? 0) + amount);
    }

    if (log.eventName === 'ReputationPenalized' && agentId) {
      nodeIds.add(agentId);
      penaltyByAgent.set(agentId, (penaltyByAgent.get(agentId) ?? 0) + Number(payload.penaltyPoints ?? 0));
    }
  }

  repMap.forEach((_, id) => nodeIds.add(id));

  const agents = [...nodeIds].sort((a, b) => a - b).map((id) => {
    const reputationRaw = Number(repMap.get(id) ?? BigInt(0));
    const completedIntents = activityByAgent.get(id) ?? 0;
    const totalVolume = volumeByAgent.get(id) ?? 0;
    const lastActiveAt = recentByAgent.get(id);
    const penalties = penaltyByAgent.get(id) ?? 0;

    return {
      id: String(id),
      name: `Agent ${id}`,
      reputation: Math.max(0, Math.min(5, reputationRaw / 20)),
      completedIntents,
      successRate: Math.max(60, Math.min(99, 85 + Math.round((reputationRaw - penalties) / 10))),
      totalVolume,
      avgResponseTime: Math.max(20, 120 - Math.min(100, completedIntents * 2)),
      location: 'On-chain network',
      skills: ['Intent Execution', 'Cross-Border', 'Escrow'],
      status: lastActiveAt && Date.now() - lastActiveAt.getTime() < 1000 * 60 * 30 ? 'online' : 'offline',
      lastActive: lastActiveAt ? lastActiveAt.toISOString() : null,
      walletAddress: 'N/A',
      penaltyPoints: penalties,
    };
  });

  return NextResponse.json({
    agents,
    total: agents.length,
    generatedAt: new Date().toISOString(),
  });
}