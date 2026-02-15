'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[calc(100vw-2rem)] md:max-w-4xl',
};

export function Modal({ isOpen, onClose, title, children, size = 'lg' }: ModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className={`relative w-full ${sizeClasses[size]} bg-app-card border border-app-border rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto app-scrollbar`}
                    >
                        {/* Header */}
                        {title && (
                            <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-app-border bg-app-card/95 backdrop-blur-sm rounded-t-2xl">
                                <h3 className="text-lg font-bold text-app-text">{title}</h3>
                                <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-app-text-secondary hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                        <div className="p-5">{children}</div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
