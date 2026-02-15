'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, ArrowLeft } from 'lucide-react';
import { conversations as allConversations } from '@/data/mock';
import { Conversation, Message } from '@/types';

export default function ChatPage() {
    const [selectedConv, setSelectedConv] = useState<Conversation | null>(allConversations[0]);
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState(allConversations[0]?.messages || []);
    const [showList, setShowList] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSelectConv = (conv: Conversation) => {
        setSelectedConv(conv);
        setMessages(conv.messages);
        setShowList(false);
    };

    const handleSend = () => {
        if (!newMessage.trim()) return;
        const msg = {
            id: `msg-new-${Date.now()}`,
            senderId: 'agent-self',
            text: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOwn: true,
        };
        setMessages([...messages, msg]);
        setNewMessage('');
    };

    return (
        <div className="flex h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)]">
            {/* Conversation List */}
            <div className={`${showList ? 'flex' : 'hidden'} lg:flex flex-col w-full lg:w-80 bg-app-bg border-r border-app-border`}>
                <div className="p-4 border-b border-app-border">
                    <h2 className="text-lg font-display font-bold text-white mb-3">Messages</h2>
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        className="w-full bg-white/5 border border-app-border rounded-xl px-3 py-2 text-sm text-app-text placeholder:text-app-text-secondary/50 focus:outline-none focus:border-app-neon/50"
                    />
                </div>
                <div className="flex-1 overflow-y-auto app-scrollbar">
                    {allConversations.map((conv) => (
                        <button
                            key={conv.id}
                            onClick={() => handleSelectConv(conv)}
                            className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-white/[0.03] transition-colors border-b border-app-border/50 ${selectedConv?.id === conv.id ? 'bg-white/5' : ''
                                }`}
                        >
                            <div className="relative flex-shrink-0">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-app-neon to-app-purple flex items-center justify-center text-white font-bold text-sm">
                                    {conv.agentName.charAt(0)}
                                </div>
                                <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-app-bg ${conv.agentStatus === 'online' ? 'bg-emerald-400' : 'bg-gray-400'
                                    }`} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-sm font-semibold text-white truncate">{conv.agentName}</p>
                                    <span className="text-[10px] text-app-text-secondary flex-shrink-0">{conv.lastMessageTime}</span>
                                </div>
                                <p className="text-xs text-app-text-secondary truncate mt-0.5">{conv.lastMessage}</p>
                            </div>
                            {conv.unreadCount > 0 && (
                                <span className="flex-shrink-0 w-5 h-5 bg-app-neon rounded-full flex items-center justify-center text-[10px] font-bold text-app-bg mt-1">
                                    {conv.unreadCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            <div className={`${!showList ? 'flex' : 'hidden'} lg:flex flex-col flex-1 bg-app-bg`}>
                {selectedConv ? (
                    <>
                        {/* Chat Header */}
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-app-border">
                            <button onClick={() => setShowList(true)} className="lg:hidden p-1 text-app-text-secondary hover:text-white">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div className="relative">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-app-neon to-app-purple flex items-center justify-center text-white font-bold text-sm">
                                    {selectedConv.agentName.charAt(0)}
                                </div>
                                <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-app-bg ${selectedConv.agentStatus === 'online' ? 'bg-emerald-400' : 'bg-gray-400'
                                    }`} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white">{selectedConv.agentName}</p>
                                <p className="text-[10px] text-app-text-secondary capitalize">{selectedConv.agentStatus}</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 app-scrollbar">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${msg.isOwn
                                        ? 'bg-app-neon/20 text-white rounded-br-md'
                                        : 'bg-white/5 text-app-text rounded-bl-md border border-app-border/50'
                                        }`}>
                                        <p>{msg.text}</p>
                                        <p className={`text-[10px] mt-1 ${msg.isOwn ? 'text-app-neon/60' : 'text-app-text-secondary/60'} text-right`}>{msg.timestamp}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t border-app-border">
                            <div className="flex items-center gap-2">
                                <button className="p-2 text-app-text-secondary hover:text-white transition-colors">
                                    <Smile className="w-5 h-5" />
                                </button>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-white/5 border border-app-border rounded-xl px-4 py-2.5 text-sm text-app-text placeholder:text-app-text-secondary/50 focus:outline-none focus:border-app-neon/50"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!newMessage.trim()}
                                    className="p-2.5 bg-app-neon rounded-xl text-app-bg hover:bg-white transition-colors disabled:opacity-30 disabled:hover:bg-app-neon"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-app-text-secondary">Select a conversation to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
}
