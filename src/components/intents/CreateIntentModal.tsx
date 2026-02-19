'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { ArrowRight, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { useMeshForge } from '@/hooks/useMeshForge';

interface CreateIntentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateIntentModal({ isOpen, onClose }: CreateIntentModalProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        description: '',
        location: '',
        deadline: '15',
        amount: '0.85',
        skills: ['Fast Delivery'],
        minReputation: '4.0',
    });
    const [submitted, setSubmitted] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const { createIntent, hash, isPending, error } = useMeshForge();

    const handleNext = () => step < 4 && setStep(step + 1);
    const handleBack = () => step > 1 && setStep(step - 1);
    const handleBroadcast = async () => {
        setLocalError(null);
        try {
            await createIntent(
                formData.description, // title (using desc as title for now or vice versa)
                formData.description,
                formData.amount,
                Number(formData.deadline),
                'General'
            );
            setSubmitted(true);
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Failed to broadcast intent';
            setLocalError(message);
            console.error(e);
        }
    };
    const handleReset = () => {
        setStep(1);
        setSubmitted(false);
        setLocalError(null);
        setFormData({ description: '', location: '', deadline: '15', amount: '0.85', skills: ['Fast Delivery'], minReputation: '4.0' });
        onClose();
    };

    if (submitted || hash) {
        return (
            <Modal isOpen={isOpen} onClose={handleReset} title="Intent Broadcast" size="md">
                <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 bg-app-neon/20 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-8 h-8 text-app-neon" />
                    </div>
                    <h3 className="text-xl font-bold text-white">✅ Transaction Sent!</h3>
                    <p className="text-sm text-app-text-secondary max-w-sm mx-auto">
                        Your intent is being created on Celo Sepolia.
                    </p>
                    {hash && (
                        <div className="bg-white/[0.03] rounded-xl p-3 border border-app-border/50 inline-block">
                            <p className="text-xs text-app-text-secondary">Tx Hash: <code className="text-app-neon font-mono">{hash.slice(0, 10)}...</code></p>
                        </div>
                    )}
                    <div className="flex justify-center gap-3 pt-4">
                        <button onClick={handleReset} className="px-5 py-2.5 bg-app-neon text-app-bg font-bold text-sm rounded-xl hover:bg-white transition-colors">
                            Close & Refresh
                        </button>
                    </div>
                </div>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Intent" size="md">
            {/* Progress bar */}
            <div className="flex items-center gap-2 mb-6">
                {[1, 2, 3, 4].map((s) => (
                    <div key={s} className="flex-1 flex items-center gap-2">
                        <div className={`flex-1 h-1 rounded-full transition-colors ${s <= step ? 'bg-app-neon' : 'bg-app-border'}`} />
                    </div>
                ))}
                <span className="text-xs text-app-text-secondary ml-2">Step {step}/4</span>
            </div>

            {/* Steps */}
            {step === 1 && (
                <div className="space-y-4">
                    <h4 className="text-base font-bold text-white">What do you need?</h4>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe your intent..."
                        className="w-full bg-white/5 border border-app-border rounded-xl px-4 py-3 text-sm text-app-text placeholder:text-app-text-secondary/50 focus:outline-none focus:border-app-neon/50 min-h-[120px] resize-none"
                        maxLength={500}
                    />
                    <p className="text-xs text-app-text-secondary text-right">{formData.description.length}/500</p>
                    <div className="space-y-2">
                        <p className="text-xs text-app-text-secondary font-medium">AI-powered suggestions:</p>
                        {['Delivery to address', 'Buy groceries', 'Fix my phone', 'Custom'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setFormData({ ...formData, description: s })}
                                className="block w-full text-left px-3 py-2 bg-white/[0.03] rounded-lg text-sm text-app-text-secondary hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-app-border"
                            >
                                • {s}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-4">
                    <h4 className="text-base font-bold text-white">Location & Time</h4>
                    <div>
                        <label className="text-xs text-app-text-secondary font-medium mb-1 block">Where?</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="e.g. Nairobi Central"
                            className="w-full bg-white/5 border border-app-border rounded-xl px-4 py-3 text-sm text-app-text placeholder:text-app-text-secondary/50 focus:outline-none focus:border-app-neon/50"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-app-text-secondary font-medium mb-2 block">By when?</label>
                        <div className="flex flex-wrap gap-2">
                            {['15', '30', '60', '120'].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setFormData({ ...formData, deadline: t })}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${formData.deadline === t
                                        ? 'bg-app-neon text-app-bg'
                                        : 'bg-white/5 border border-app-border text-app-text-secondary hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    {t} min
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-4">
                    <h4 className="text-base font-bold text-white">Budget & Skills</h4>
                    <div>
                        <label className="text-xs text-app-text-secondary font-medium mb-1 block">How much can you pay?</label>
                        <div className="relative">
                            <input
                                type="number"
                                step="0.01"
                                min="0.00005"
                                max="100"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="w-full bg-white/5 border border-app-border rounded-xl px-4 py-3 text-sm text-app-text focus:outline-none focus:border-app-neon/50"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-app-text-secondary">cUSD</span>
                        </div>
                        <p className="text-xs text-app-text-secondary mt-1">Gas estimate: 0.0001 cUSD</p>
                    </div>
                    <div>
                        <label className="text-xs text-app-text-secondary font-medium mb-2 block">Required skills</label>
                        <div className="flex flex-wrap gap-2">
                            {['Fast Delivery', 'GPS Tracking', 'Reliable', 'Receipt Provider'].map((skill) => (
                                <button
                                    key={skill}
                                    onClick={() => {
                                        const skills = formData.skills.includes(skill)
                                            ? formData.skills.filter((s) => s !== skill)
                                            : [...formData.skills, skill];
                                        setFormData({ ...formData, skills });
                                    }}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${formData.skills.includes(skill)
                                        ? 'bg-app-neon/20 text-app-neon border border-app-neon/30'
                                        : 'bg-white/5 border border-app-border text-app-text-secondary hover:text-white'
                                        }`}
                                >
                                    {formData.skills.includes(skill) ? '☑ ' : '☐ '}{skill}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-app-text-secondary font-medium mb-1 block">Min reputation: ⭐</label>
                        <input
                            type="number"
                            step="0.1"
                            min="1"
                            max="5"
                            value={formData.minReputation}
                            onChange={(e) => setFormData({ ...formData, minReputation: e.target.value })}
                            className="w-24 bg-white/5 border border-app-border rounded-xl px-4 py-3 text-sm text-app-text focus:outline-none focus:border-app-neon/50"
                        />
                    </div>
                </div>
            )}

            {step === 4 && (
                <div className="space-y-4">
                    <h4 className="text-base font-bold text-white">Confirm Intent Broadcast</h4>
                    <div className="bg-white/[0.03] rounded-xl p-4 border border-app-border/50 space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-app-text-secondary">Description</span>
                            <span className="text-white font-medium text-right max-w-[200px] truncate">{formData.description || '—'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-app-text-secondary">Location</span>
                            <span className="text-white">{formData.location || '—'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-app-text-secondary">Deadline</span>
                            <span className="text-white">{formData.deadline} minutes</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-app-text-secondary">Budget</span>
                            <span className="text-app-neon font-bold">{formData.amount} cUSD</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-app-text-secondary">Skills</span>
                            <span className="text-white">{formData.skills.join(', ') || 'None'}</span>
                        </div>
                    </div>
                    <div className="bg-white/[0.03] rounded-xl p-4 border border-app-border/50 space-y-2 text-sm">
                        <p className="text-xs font-bold text-app-text-secondary uppercase tracking-wider">x402 Details</p>
                        <div className="flex justify-between">
                            <span className="text-app-text-secondary">Micropayment</span>
                            <span className="text-white">0.00005 cUSD</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-app-text-secondary">Escrow locked</span>
                            <span className="text-white">{formData.amount} cUSD</span>
                        </div>
                        <div className="flex justify-between border-t border-app-border/50 pt-2">
                            <span className="text-white font-medium">Total cost</span>
                            <span className="text-app-neon font-bold">{formData.amount} cUSD</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            {(localError || error) && (
                <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {localError ?? error?.message}
                </div>
            )}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-app-border">
                {step > 1 ? (
                    <button onClick={handleBack} className="flex items-center gap-2 px-4 py-2 text-sm text-app-text-secondary hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                ) : (
                    <button onClick={onClose} className="text-sm text-app-text-secondary hover:text-white transition-colors">Cancel</button>
                )}
                {step < 4 ? (
                    <button onClick={handleNext} className="flex items-center gap-2 px-5 py-2.5 bg-app-neon text-app-bg font-bold text-sm rounded-xl hover:bg-white transition-colors">
                        Next <ArrowRight className="w-4 h-4" />
                    </button>
                ) : (
                    <button onClick={handleBroadcast} disabled={isPending} className="flex items-center gap-2 px-5 py-2.5 bg-app-neon text-app-bg font-bold text-sm rounded-xl hover:bg-white transition-colors disabled:opacity-50">
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : '🚀 Broadcast'}
                    </button>
                )}
            </div>
        </Modal>
    );
}
