import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const logs = await prisma.executionLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 300,
  });

  const byIntent = new Map<number, typeof logs>();
  logs.forEach((log) => {
    const group = byIntent.get(log.intentId) ?? [];
    group.push(log);
    byIntent.set(log.intentId, group);
  });

  const conversations = [...byIntent.entries()].map(([intentId, intentLogs]) => {
    const sorted = [...intentLogs].sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
    const latest = sorted[sorted.length - 1];
    const lastMessage = `${latest.eventName} · Intent #${intentId}`;
    const latestAt = new Date(latest.createdAt);

    const messages = sorted.map((log) => ({
      id: String(log.id),
      senderId: 'system',
      text: `${log.eventName} executed for Intent #${intentId}`,
      timestamp: new Date(log.createdAt).toISOString(),
      isOwn: false,
    }));

    return {
      id: `intent-${intentId}`,
      agentId: `intent-${intentId}`,
      agentName: `Intent #${intentId}`,
      agentStatus: Date.now() - latestAt.getTime() < 1000 * 60 * 30 ? 'online' : 'offline',
      lastMessage,
      lastMessageTime: latestAt.toISOString(),
      unreadCount: 0,
      messages,
    };
  }).sort((a, b) => +new Date(b.lastMessageTime) - +new Date(a.lastMessageTime));

  return NextResponse.json({
    conversations,
    total: conversations.length,
    generatedAt: new Date().toISOString(),
  });
}