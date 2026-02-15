import { LucideIcon } from 'lucide-react';

// Re-export landing page types
export interface FeatureProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface StepProps {
  number: string;
  title: string;
  description: string;
  isLast?: boolean;
}

// ─── App Types ────────────────────────────────────────────────

export type IntentStatus = 'open' | 'accepted' | 'in_progress' | 'completed' | 'disputed' | 'expired';
export type AgentStatus = 'online' | 'offline' | 'busy';
export type TransactionType = 'sent' | 'received';
export type TransactionStatus = 'completed' | 'pending' | 'disputed';

export interface Agent {
  id: string;
  name: string;
  avatar?: string;
  reputation: number;
  completedIntents: number;
  successRate: number;
  totalVolume: number;
  avgResponseTime: number; // seconds
  location: string;
  skills: string[];
  status: AgentStatus;
  lastActive: string;
  bio?: string;
  endorsements?: Endorsement[];
  testimonials?: Testimonial[];
  walletAddress: string;
  balanceCUSD: number;
  joinedDate: string;
  activityStreak: number;
}

export interface Endorsement {
  skill: string;
  count: number;
}

export interface Testimonial {
  agentName: string;
  text: string;
  date: string;
}

export interface Intent {
  id: string;
  title: string;
  description: string;
  amount: number; // cUSD
  currency: string;
  deadline: number; // minutes
  location: string;
  category: string;
  skills: string[];
  minReputation: number;
  status: IntentStatus;
  confidence: number; // percentage
  creatorId: string;
  creatorName: string;
  createdAt: string;
  broadcastTime: number; // seconds ago
  offers: Offer[];
  merkleHash?: string;
  notes?: string;
}

export interface Offer {
  id: string;
  agentId: string;
  agentName: string;
  agentReputation: number;
  amount: number;
  message: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  hash: string;
  blockNumber: number;
  timestamp: string;
  description: string;
  counterAgentId: string;
  counterAgentName: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  reputationDelta: number;
}

export interface Conversation {
  id: string;
  agentId: string;
  agentName: string;
  agentStatus: AgentStatus;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

export interface ActivityItem {
  id: string;
  type: 'settled' | 'offer_received' | 'new_intent' | 'accepted' | 'reputation_update';
  title: string;
  description: string;
  amount?: number;
  reputationDelta?: number;
  timestamp: string;
  agentName?: string;
  intentId?: string;
}

export interface ReputationBreakdown {
  economicVolume: number;
  successRate: number;
  recency: number;
  humanAttestation: number;
  composite: number;
}
