'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Network } from 'lucide-react';
import { apiUrl } from '@/lib/api';

type Node = {
  id: number;
  label: string;
  reputation: number;
  penaltyPoints: number;
};

type Edge = {
  source: number;
  target: number;
  settlements: number;
  volume: number;
};

type TrustGraphResponse = {
  nodes: Node[];
  edges: Edge[];
  activeConnections: number;
};

const W = 680;
const H = 320;
const R = 118;

export function TrustGraphPanel() {
  const [graph, setGraph] = useState<TrustGraphResponse>({ nodes: [], edges: [], activeConnections: 0 });

  useEffect(() => {
    fetch(apiUrl('/api/trust-graph'))
      .then((res) => res.json())
      .then(setGraph)
      .catch(() => setGraph({ nodes: [], edges: [], activeConnections: 0 }));
  }, []);

  const positionedNodes = useMemo(() => {
    if (!graph.nodes.length) return [];
    return graph.nodes.map((node, i) => {
      const angle = (2 * Math.PI * i) / graph.nodes.length;
      return {
        ...node,
        x: W / 2 + R * Math.cos(angle),
        y: H / 2 + R * Math.sin(angle),
      };
    });
  }, [graph.nodes]);

  const nodeMap = useMemo(() => {
    const m = new Map<number, { x: number; y: number }>();
    positionedNodes.forEach((n) => m.set(n.id, { x: n.x, y: n.y }));
    return m;
  }, [positionedNodes]);

  return (
    <div className="app-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-app-text flex items-center gap-2">
          <Network className="w-4 h-4 text-brand-accent" />
          Trust Graph
        </h3>
        <span className="text-xs text-app-text-secondary">{graph.activeConnections} active connections</span>
      </div>

      <div className="rounded-xl border border-app-border bg-white/5 p-3 overflow-x-auto">
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          {graph.edges.map((edge, idx) => {
            const source = nodeMap.get(edge.source);
            const target = nodeMap.get(edge.target);
            if (!source || !target) return null;
            return (
              <line
                key={`${edge.source}-${edge.target}-${idx}`}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke="rgba(76,118,59,0.45)"
                strokeWidth={Math.min(6, Math.max(1.5, edge.settlements))}
              />
            );
          })}

          {positionedNodes.map((node) => (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={18}
                fill={node.penaltyPoints > 0 ? '#f59e0b' : '#043915'}
                opacity={0.9}
              />
              <text x={node.x} y={node.y + 4} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">
                {node.id}
              </text>
              <text x={node.x} y={node.y + 34} textAnchor="middle" fill="#4C763B" fontSize="10" fontWeight="600">
                R:{node.reputation}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
