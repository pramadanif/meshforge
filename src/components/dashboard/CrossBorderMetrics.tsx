'use client';

import React, { useEffect, useState } from 'react';
import { Globe2, Timer, Wallet, Fuel } from 'lucide-react';

type MetricsResponse = {
  crossBorderFlowCount: number;
  settledCrossBorderCount: number;
  averageLatencySeconds: number;
  averageSettlementFeeCelo: number;
  totalFundsMovedCusd: number;
  routes: Array<{ intentId: number; route: string; stablePair: string; valueCusd: number; latencySeconds: number | null }>;
};

export function CrossBorderMetrics() {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);

  useEffect(() => {
    fetch('/api/metrics')
      .then((res) => res.json())
      .then(setMetrics)
      .catch(() => setMetrics(null));
  }, []);

  return (
    <div className="app-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-brand-dark flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-brand-accent" />
          Cross-Border Metrics
        </h3>
        <span className="text-xs text-app-text-secondary">Live from indexed on-chain events</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl border border-app-border p-3 bg-white">
          <p className="text-xs text-app-text-secondary">Flows</p>
          <p className="text-lg font-bold text-brand-dark mt-1">{metrics?.crossBorderFlowCount ?? 0}</p>
        </div>
        <div className="rounded-xl border border-app-border p-3 bg-white">
          <p className="text-xs text-app-text-secondary">Settled</p>
          <p className="text-lg font-bold text-brand-dark mt-1">{metrics?.settledCrossBorderCount ?? 0}</p>
        </div>
        <div className="rounded-xl border border-app-border p-3 bg-white">
          <p className="text-xs text-app-text-secondary flex items-center gap-1"><Timer className="w-3 h-3" /> Avg Latency</p>
          <p className="text-lg font-bold text-brand-dark mt-1">{metrics?.averageLatencySeconds ?? 0}s</p>
        </div>
        <div className="rounded-xl border border-app-border p-3 bg-white">
          <p className="text-xs text-app-text-secondary flex items-center gap-1"><Fuel className="w-3 h-3" /> Avg Fee</p>
          <p className="text-lg font-bold text-brand-dark mt-1">{(metrics?.averageSettlementFeeCelo ?? 0).toFixed(6)} CELO</p>
        </div>
      </div>

      <div className="rounded-xl border border-app-border p-3 bg-brand-surface/60">
        <p className="text-xs text-app-text-secondary flex items-center gap-1 mb-1"><Wallet className="w-3 h-3" /> Total Funds Moved</p>
        <p className="text-xl font-bold text-brand-dark">{(metrics?.totalFundsMovedCusd ?? 0).toFixed(4)} cUSD</p>
      </div>

      <div className="space-y-2">
        {(metrics?.routes ?? []).slice(0, 5).map((route) => (
          <div key={`${route.intentId}-${route.route}`} className="rounded-lg border border-app-border p-3 bg-white flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-brand-dark">{route.route}</p>
              <p className="text-xs text-app-text-secondary">Intent #{route.intentId} · {route.stablePair}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-brand-dark">{route.valueCusd.toFixed(4)} cUSD</p>
              <p className="text-xs text-app-text-secondary">{route.latencySeconds === null ? 'Pending' : `${route.latencySeconds}s`}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
