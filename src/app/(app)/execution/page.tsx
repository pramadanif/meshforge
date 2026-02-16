'use client';

import Link from 'next/link';
import { ArrowRight, Activity, CheckCircle2, CircleDollarSign } from 'lucide-react';
import { useIntents } from '@/hooks/useMeshForge';

export default function ExecutionHubPage() {
  const { intents, isLoading } = useIntents();
  const validIntents = intents.filter((intent): intent is NonNullable<typeof intent> => intent !== null);

  const inProgress = validIntents.filter((intent) => intent.status === 'in_progress');
  const completed = validIntents.filter((intent) => intent.status === 'completed');

  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-brand-dark">Execution Hub</h1>
        <p className="text-sm text-app-text-secondary mt-1">
          Lifecycle bergerak hanya dari event on-chain: EscrowLocked → ExecutionStarted → ProofSubmitted → SettlementReleased → SettlementRecorded.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="app-card p-5">
          <div className="flex items-center gap-2 text-app-text-secondary text-sm mb-2">
            <Activity className="w-4 h-4" /> Active Executions
          </div>
          <p className="text-2xl font-bold text-brand-dark">{inProgress.length}</p>
        </div>
        <div className="app-card p-5">
          <div className="flex items-center gap-2 text-app-text-secondary text-sm mb-2">
            <CheckCircle2 className="w-4 h-4" /> Settled Intents
          </div>
          <p className="text-2xl font-bold text-brand-dark">{completed.length}</p>
        </div>
        <div className="app-card p-5">
          <div className="flex items-center gap-2 text-app-text-secondary text-sm mb-2">
            <CircleDollarSign className="w-4 h-4" /> On-chain Intents
          </div>
          <p className="text-2xl font-bold text-brand-dark">{validIntents.length}</p>
        </div>
      </div>

      <div className="app-card p-5">
        <h2 className="text-lg font-bold text-brand-dark mb-4">Tracked Intents</h2>

        {isLoading ? (
          <p className="text-sm text-app-text-secondary">Loading on-chain intents...</p>
        ) : validIntents.length === 0 ? (
          <p className="text-sm text-app-text-secondary">Belum ada intent on-chain.</p>
        ) : (
          <div className="space-y-3">
            {validIntents.map((intent) => (
              <div key={intent.id} className="flex items-center justify-between rounded-xl border border-app-border bg-white p-4">
                <div>
                  <p className="font-semibold text-brand-dark">#{intent.id} · {intent.title}</p>
                  <p className="text-sm text-app-text-secondary">{intent.amount} cUSD · {intent.status.toUpperCase()}</p>
                </div>
                <Link
                  href={`/execution/${intent.id}`}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-brand-dark hover:text-brand-accent"
                >
                  Open <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
