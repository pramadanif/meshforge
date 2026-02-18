import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const logs = await prisma.executionLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const items = logs.map((log) => ({
    id: String(log.id),
    title: log.eventName,
    description: `Intent #${log.intentId} · ${new Date(log.createdAt).toLocaleString()}`,
    txHash: log.txHash,
    timestamp: new Date(log.createdAt).toISOString(),
    payload: log.payload,
  }));

  return NextResponse.json({ items });
}
