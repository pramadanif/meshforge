import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type EdgeAgg = {
  source: number;
  target: number;
  settlements: number;
  volume: number;
};

export async function GET() {
  const logs = await prisma.executionLog.findMany({
    where: {
      eventName: {
        in: ['IntentBroadcasted', 'IntentAccepted', 'SettlementRecorded', 'ReputationPenalized'],
      },
    },
    orderBy: { createdAt: 'asc' },
    take: 3000,
  });

  const requesterByIntent = new Map<number, number>();
  const executorByIntent = new Map<number, number>();
  const edges = new Map<string, EdgeAgg>();
  const penaltyByAgent = new Map<number, number>();

  for (const log of logs) {
    const payload = (log.payload ?? {}) as Record<string, unknown>;

    if (log.eventName === 'IntentBroadcasted') {
      const requesterAgentId = Number(payload.requesterAgentId ?? 0);
      if (requesterAgentId) requesterByIntent.set(log.intentId, requesterAgentId);
    }

    if (log.eventName === 'IntentAccepted') {
      const executorAgentId = Number(payload.executorAgentId ?? 0);
      if (executorAgentId) executorByIntent.set(log.intentId, executorAgentId);
    }

    if (log.eventName === 'SettlementRecorded') {
      const requester = requesterByIntent.get(log.intentId) ?? 0;
      const executor = executorByIntent.get(log.intentId) ?? Number(payload.agentId ?? 0);
      if (!requester || !executor) continue;

      const key = `${requester}-${executor}`;
      const current = edges.get(key) ?? { source: requester, target: executor, settlements: 0, volume: 0 };
      current.settlements += 1;
      current.volume += Number(payload.value ?? 0) / 1e18;
      edges.set(key, current);
    }

    if (log.eventName === 'ReputationPenalized') {
      const agentId = Number(payload.agentId ?? 0);
      const penalty = Number(payload.penaltyPoints ?? 0);
      if (agentId && penalty) {
        penaltyByAgent.set(agentId, (penaltyByAgent.get(agentId) ?? 0) + penalty);
      }
    }
  }

  const reputations = await prisma.agentReputation.findMany({ take: 200 });
  const repMap = new Map<number, bigint>();
  reputations.forEach((entry) => repMap.set(entry.agentId, entry.reputation));

  const nodeIds = new Set<number>();
  edges.forEach((edge) => {
    nodeIds.add(edge.source);
    nodeIds.add(edge.target);
  });

  const nodes = [...nodeIds].map((id) => ({
    id,
    label: `Agent ${id}`,
    reputation: Number(repMap.get(id) ?? BigInt(0)),
    penaltyPoints: penaltyByAgent.get(id) ?? 0,
  }));

  return NextResponse.json({
    nodes,
    edges: [...edges.values()],
    activeConnections: edges.size,
    generatedAt: new Date().toISOString(),
  });
}
