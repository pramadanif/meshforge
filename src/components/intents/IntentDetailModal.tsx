'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Intent } from '@/types';
import { Clock, MapPin, Shield, ExternalLink, Star, ArrowRight } from 'lucide-react';

interface IntentDetailModalProps {
    intent: Intent | null;
    onClose: () => void;
}

export function IntentDetailModal({ intent, onClose }: IntentDetailModalProps) {
    if (!intent) return null;

    return (
        <Modal isOpen={!!intent} onClose={onClose} title={intent.title} size="lg">
            <div className="space-y-6">
                {/* Header info */}
                <div className="flex flex-wrap items-center gap-3">
                    <StatusBadge status={intent.status} type="intent" />
                    <span className="text-xs text-app-text-secondary">Broadcast: {intent.broadcastTime}s ago</span>
                    <span className="text-xs text-app-text-secondary">Confidence: <span className="text-white font-bold">{intent.confidence}%</span></span>
                </div>

                {/* Description */}
                <div>
                    <h4 className="text-xs font-bold text-app-text-secondary uppercase tracking-wider mb-2">Description</h4>
                    <p className="text-sm text-app-text leading-relaxed">{intent.description}</p>
                </div>

                {/* Location & Timing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white/[0.03] rounded-xl p-4 border border-app-border/50">
                        <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-app-neon" />
                            <span className="text-xs font-bold text-app-text-secondary uppercase tracking-wider">Location</span>
                        </div>
                        <p className="text-sm text-white font-medium">{intent.location}</p>
                    </div>
                    <div className="bg-white/[0.03] rounded-xl p-4 border border-app-border/50">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-amber-400" />
                            <span className="text-xs font-bold text-app-text-secondary uppercase tracking-wider">Deadline</span>
                        </div>
                        <p className="text-sm text-white font-medium">{intent.deadline} minutes</p>
                    </div>
                </div>

                {/* Financial */}
                <div className="bg-white/[0.03] rounded-xl p-4 border border-app-border/50">
                    <h4 className="text-xs font-bold text-app-text-secondary uppercase tracking-wider mb-3">Financial Details (x402)</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-app-text-secondary">Amount</span>
                            <span className="text-app-neon font-bold">{intent.amount} {intent.currency}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-app-text-secondary">Escrow locked</span>
                            <span className="text-white">{intent.amount} {intent.currency}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-app-text-secondary">Gas estimate</span>
                            <span className="text-white">0.0001 cUSD</span>
                        </div>
                        <div className="flex justify-between border-t border-app-border/50 pt-2">
                            <span className="text-white font-medium">Settlement</span>
                            <span className="text-app-neon font-bold">On completion</span>
                        </div>
                    </div>
                </div>

                {/* Requirements */}
                <div>
                    <h4 className="text-xs font-bold text-app-text-secondary uppercase tracking-wider mb-2">Requirements</h4>
                    <div className="flex flex-wrap gap-2">
                        <span className="flex items-center gap-1 text-xs bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full">
                            <Star className="w-3 h-3" /> Min rep: {intent.minReputation}+
                        </span>
                        {intent.skills.map((skill) => (
                            <span key={skill} className="text-xs bg-app-neon/10 text-app-neon px-2.5 py-1 rounded-full">{skill}</span>
                        ))}
                    </div>
                    {intent.notes && (
                        <p className="text-xs text-app-text-secondary mt-2 italic">📝 {intent.notes}</p>
                    )}
                </div>

                {/* Merkle Proof */}
                {intent.merkleHash && (
                    <div className="bg-white/[0.03] rounded-xl p-4 border border-app-border/50">
                        <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-4 h-4 text-app-neon" />
                            <span className="text-xs font-bold text-app-text-secondary uppercase tracking-wider">Merkle Proof</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <code className="text-xs text-app-text-secondary font-mono bg-black/20 px-2 py-1 rounded">
                                {intent.merkleHash.slice(0, 10)}...{intent.merkleHash.slice(-8)}
                            </code>
                            <span className="text-xs text-app-neon">✓ Verified</span>
                            <a href="https://www.8004scan.io/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 ml-auto flex items-center gap-1 text-xs">
                                Explorer <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>
                )}

                {/* Counter Offers */}
                {intent.offers.length > 0 && (
                    <div>
                        <h4 className="text-xs font-bold text-app-text-secondary uppercase tracking-wider mb-3">
                            Counter Offers ({intent.offers.length})
                        </h4>
                        <div className="space-y-3">
                            {intent.offers.map((offer) => (
                                <div key={offer.id} className="bg-white/[0.03] rounded-xl p-4 border border-app-border/50">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <p className="text-sm font-semibold text-white">{offer.agentName}</p>
                                            <p className="text-xs text-app-text-secondary">⭐ {offer.agentReputation}</p>
                                        </div>
                                        <span className="text-sm font-bold text-app-neon">{offer.amount} cUSD</span>
                                    </div>
                                    <p className="text-xs text-app-text-secondary italic mb-3">&ldquo;{offer.message}&rdquo;</p>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1.5 bg-app-neon text-app-bg text-xs font-bold rounded-lg hover:bg-white transition-colors">Accept</button>
                                        <button className="px-3 py-1.5 bg-white/5 border border-app-border text-white text-xs font-bold rounded-lg hover:bg-white/10 transition-colors">Decline</button>
                                        <button className="px-3 py-1.5 bg-white/5 border border-app-border text-white text-xs font-bold rounded-lg hover:bg-white/10 transition-colors">Counter</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-2 border-t border-app-border">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-app-neon text-app-bg font-bold text-sm rounded-xl hover:bg-white transition-colors">
                        Make Offer
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    <button className="px-5 py-2.5 bg-white/5 border border-app-border text-white font-bold text-sm rounded-xl hover:bg-white/10 transition-colors">
                        Add to Favorites
                    </button>
                    <button className="px-5 py-2.5 bg-white/5 border border-app-border text-white font-bold text-sm rounded-xl hover:bg-white/10 transition-colors">
                        Share
                    </button>
                </div>
            </div>
        </Modal>
    );
}
