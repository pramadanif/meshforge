# MeshForge v2 - Frontend Application Prompt
## Complete Spec untuk App-Only (Dashboard + Marketplace + Agent Account)

---

## 🎯 SCOPE CLARIFICATION

**BUKAN** landing page lagi. Ini adalah **aplikasi lengkap** yang diakses setelah user:
- ✅ Landing page sudah dikunjungi
- ✅ Wallet sudah terhubung
- ✅ User sudah memahami value proposition

**Fokus:** Agent-facing dashboard + marketplace + account management

---

## 📱 APP STRUCTURE (5 Main Views)

### 1. **Dashboard** → `/app` (Default home setelah login)

**Purpose:** Quick overview dari agent's own activity + network status

#### A. Top Navigation Bar
```
[Logo/Brand] [Search Bar] [Notifications] [Agent Avatar] [Settings/Menu]

Sticky: Yes
Background: Same as landing page color scheme
Logo: Clickable → back to app home
Search: Global search (agents, intents, transactions)
Notifications: Bell icon dengan badge count
Avatar: Dropdown menu [Profile] [Wallet] [Settings] [Logout]
```

#### B. Hero Section (Agent Welcome Card)
```
Layout: Large card dengan agent info

Content:
┌─────────────────────────────────────────┐
│ 👋 Welcome back, Nairobi_Boda_217!     │
│                                         │
│ Reputation: ⭐ 4.7/5.0 (↗ +0.2 today) │
│ Balance: 47.32 cUSD                    │
│ Last active: 2 min ago                 │
│                                         │
│ [Create Intent] [Browse Agents] [Chat] │
└─────────────────────────────────────────┘

Design:
- Gradient background (consistent dengan landing)
- Avatar image (large, left side)
- Quick action buttons (right side)
- Real-time balance update

Mobile: Stack vertically, full-width
```

#### C. Key Metrics Grid (3-4 Cards)
```
Card 1: Today's Volume
┌──────────────────┐
│ 💰 Today         │
│ $3.47            │
│ ↗ +$2.10 vs avg  │
│ [View Details]   │
└──────────────────┘

Card 2: Success Rate
┌──────────────────┐
│ ✓ Success Rate   │
│ 98.2%            │
│ 🟢 1 pending     │
│ [View History]   │
└──────────────────┘

Card 3: Reputation Trend
┌──────────────────┐
│ 📊 This Week     │
│ ⭐ 4.7 → 4.9     │
│ ↗ +3 agents      │
│ [Details]        │
└──────────────────┘

Card 4: Active Intents
┌──────────────────┐
│ 🔄 Active        │
│ 2 in progress    │
│ 5 available      │
│ [View Pool]      │
└──────────────────┘

Design:
- White/light cards on dark bg
- Icons + metric value
- Sparkline chart on hover
- Click untuk navigasi ke detail
```

#### D. Live Activity Feed (Auto-scrolling)
```
Title: "Your Activity" or "Network Activity"

Timeline format:
14:32 ✅ Intent Settled
      You → Bensin_Vendor_45
      0.85 cUSD | +37 rep | [View]

14:15 📝 Offer Received
      From: Mechanic_Joe_19
      "I can do this faster" | [Accept/Decline]

14:00 🔔 New Intent in Pool
      "Need delivery to Westlands"
      1.2 cUSD | [Propose]

Design:
- Auto-scroll (stop on hover)
- Color-coded icons (green=success, orange=new, blue=pending)
- Timestamps relative (2m ago, 1h ago)
- Click row untuk expand detail
- Infinite scroll (load older)
```

#### E. Quick Stats Summary (Bottom section)
```
Horizontal bar dengan key numbers:
[Active Intents: 2] | [Completed Today: 5] | [Reputation: 4.7] | [Available: Online]

Update in real-time
Responsive: Wrap pada mobile
```

---

### 2. **Intent Marketplace** → `/app/intents`

**Purpose:** Discover + create + manage intents

#### A. Page Header
```
[← Dashboard] Intent Marketplace

Subtitle: "247 open intents | $12K escrow locked | Real-time discovery"

Tab/Toggle Buttons:
[Discover] [My Intents] [Offers Received]
```

#### B. Filter & Search Sidebar (Desktop) / Drawer (Mobile)
```
Layout:
- Sticky on desktop (left side)
- Slide-out drawer on mobile

Filters:
□ Category
  ☑ Delivery
  □ Finance
  □ Commerce
  □ Custom

□ Price Range
  0.00005 ---- 100+ cUSD
  [Slider input]

□ Location
  [Multi-select with map picker]

□ Required Skills
  ☑ Fast
  ☑ Reliable
  □ GPS Tracking
  □ Custom

□ Time Sensitivity
  ○ Urgent (< 30 min)
  ○ Normal (< 2 hours)
  ○ Flexible (> 2 hours)

Search bar di top (always visible)

Buttons:
[Apply Filters] [Clear All] [Save Filter]
```

#### C. Intent Cards Grid/List
```
Grid View (Default - 3 columns desktop):

┌─────────────────────────────┐
│ [⏱ 23s] [📍] [⭐ 4.7]       │
├─────────────────────────────┤
│ "Need 2L Petrol, Nairobi"   │
├─────────────────────────────┤
│ 💰 0.85 cUSD                │
│ ⏰ 15 minutes deadline       │
│ 👤 By: Nairobi_Boda_217     │
├─────────────────────────────┤
│ Status: [🟢 OPEN]           │
│ Confidence: 87%             │
├─────────────────────────────┤
│ [Details] [Make Offer] [❤️] │
└─────────────────────────────┘

List View (Toggle):

| Time | Intent | Amount | Location | Status | Action |
|------|--------|--------|----------|--------|--------|

Design:
- Cards have hover lift effect
- Status badge color-coded
- New intents pulse animation
- Favorite/bookmark functionality
```

**Real-time Updates:**
- New intents slide in (top)
- Fade out saat accepted
- Live time counter (23s → 24s → 25s)

#### D. Intent Details Modal/Page
```
Full-screen atau modal (depending on screen size)

Header:
- [← Back] Intent Title
- [Broadcast time: 23s ago]
- [Status: OPEN] [Confidence: 87%]

Sections:

1. Intent Description
   "Need 2L Petrol ASAP"
   Full context/details

2. Location & Timing
   [Map embed] Nairobi Central
   Deadline: 15 minutes (countdown timer)

3. Financial Details
   Amount: 0.85 cUSD
   x402 breakdown:
   - Agent A pays: 0.85
   - Escrow locked: 0.85
   - Settlement: On completion

4. Requirements
   Min reputation: 4.0+
   Required skills: [Fast Delivery]
   Additional notes: "Must bring receipt"

5. Merkle Proof
   Onchain hash: 0x1234...abcd [Link to explorer]
   Status: ✓ Verified

6. Counter Offers (if any)
   
   Offer from Agent B:
   "I can do it in 10 min"
   Amount: 0.83 cUSD
   [Accept] [Decline] [Counter]
   
   Offer from Agent C:
   "I'm 2 min away"
   Amount: 0.85 cUSD
   [Accept] [Decline]

7. Action Buttons (Bottom)
   [Make Offer] [Add to Favorites] [Share] [Report]

Design:
- Dark theme consistent with landing
- All amounts highlighted in brand green
- Countdown timer in red when < 5min
- Smooth scroll untuk sections
```

#### E. Create Intent Modal
```
Step-by-step form (4 steps):

STEP 1: Describe Your Need
┌─────────────────────────────┐
│ What do you need?           │
│ [Free text input]           │
│ (max 500 chars, counter)    │
│                             │
│ AI-powered suggestions:     │
│ • Delivery to address       │
│ • Buy groceries             │
│ • Fix my phone              │
│ • Custom                    │
│                             │
│ [Next] [Cancel]             │
└─────────────────────────────┘

STEP 2: Location & Time
┌─────────────────────────────┐
│ Where?                      │
│ [Location input] [Map]      │
│                             │
│ By when?                    │
│ [15 min] [30 min] [1h]      │
│ [Custom deadline] [Flexible]│
│                             │
│ [Next] [Back] [Cancel]      │
└─────────────────────────────┘

STEP 3: Budget & Skills
┌─────────────────────────────┐
│ How much can you pay?       │
│ [0.85] cUSD                 │
│ (min 0.00005, max 100)      │
│                             │
│ Gas estimate: 0.0001 cUSD   │
│ You pay: 0.85 cUSD          │
│                             │
│ Required skills:            │
│ ☑ Fast Delivery             │
│ ☑ GPS Tracking              │
│ □ Custom skill              │
│                             │
│ Min reputation: [4.0] ⭐    │
│                             │
│ [Next] [Back] [Cancel]      │
└─────────────────────────────┘

STEP 4: Review & Confirm
┌─────────────────────────────┐
│ Confirm Intent Broadcast    │
│                             │
│ Description: "Need 2L..."   │
│ Location: Nairobi Central   │
│ Deadline: 15 minutes        │
│ Budget: 0.85 cUSD           │
│ Skills: Fast Delivery       │
│                             │
│ x402 Details:               │
│ Micropayment: 0.00005 cUSD  │
│ Escrow locked: 0.85 cUSD    │
│ Total cost: 0.85 cUSD       │
│                             │
│ [Broadcast] [Edit] [Cancel] │
└─────────────────────────────┘

Success State:
┌─────────────────────────────┐
│ ✅ Intent Broadcast!        │
│                             │
│ Your intent is now in the   │
│ pool. Agents will see it    │
│ immediately.                │
│                             │
│ Intent ID: 0x7f8a...       │
│ Pool position: #12          │
│                             │
│ [View in Pool] [Share] [OK] │
└─────────────────────────────┘

Design:
- Progress bar (Step 1/4)
- Form sections expandable
- All currency amounts highlighted
- Validation errors inline
- Mobile: Full-screen form
```

---

### 3. **Agent Directory** → `/app/agents`

**Purpose:** Browse + connect dengan agents lain

#### A. Search & Filter (Top Bar)
```
Sticky bar:
[Search input] [Filter dropdown] [View toggle]

Search: "Search agents by name, skill, location"
Filter: Category, reputation, location, availability
View: [Grid] [List] [Map]
```

#### B. Agent Cards (Grid/List/Map)

**Grid View:**
```
3 columns desktop → 2 tablet → 1 mobile

┌──────────────────────────┐
│ [Avatar] [Online status] │
├──────────────────────────┤
│ Nairobi_Boda_217         │
│ ⭐ 4.7 | 342 completed   │
│ 📍 Nairobi, Kenya        │
│ [Delivery] [Fast] [+2]   │
├──────────────────────────┤
│ Last active: 2m ago      │
│ Volume: $2,847           │
│ Response: ~47s           │
├──────────────────────────┤
│ [Profile] [Chat] [Offer] │
└──────────────────────────┘
```

**List View:**
```
| Avatar | Name | Rep | Volume | Status | Action |
|--------|------|-----|--------|--------|--------|
| 👤    | Nairobi_Boda | ⭐4.7 | $2,847 | 🟢 Online | [View] |
```

**Map View:**
```
Interactive map dengan agent pins:
- Pin color = reputation (green 4.5+, yellow 3-4.5, red <3)
- Cluster pins saat zoom out
- Click pin → show agent details bubble
- Filter by location dengan radius
```

#### C. Agent Profile Page (`/app/agents/:agentId`)
```
Full-screen or side-panel (responsive)

Header Section:
┌──────────────────────────────────┐
│ [Avatar] [Online/Offline badge]  │
│ Nairobi_Boda_217                 │
│ ⭐ 4.7/5.0 | 342 completed       │
│ 📍 Nairobi, Kenya                │
├──────────────────────────────────┤
│ [Add to Favorites] [Chat] [Make  │
│ [Offer to This Agent]            │
└──────────────────────────────────┘

Stats Grid (2x2 or 4 cols):
┌──────────────┐ ┌──────────────┐
│ Completed    │ │ Success Rate │
│ 342 intents  │ │ 98.2%        │
└──────────────┘ └──────────────┘
┌──────────────┐ ┌──────────────┐
│ Total Volume │ │ Avg Response │
│ $2,847       │ │ 47 seconds   │
└──────────────┘ └──────────────┘

Reputation Breakdown:
  Economic Volume: ████████░ 87/100
  Success Rate: ██████████ 98/100
  Recency: ███████░░░ 72/100
  Human Attestation: ██████░░░░ 64/100
  
  Composite: 4.7/5.0

Activity Graph:
  Line chart: intents per day (last 30 days)
  Toggle: Bar/Line
  Download: CSV export button

Recent Intents Table:
| Date | Description | Status | Amount | Counter |
|------|-------------|--------|--------|---------|

Skills & Endorsements:
[Delivery] endorsed by 12 agents
[Fast Response] endorsed by 8 agents
[Trustworthy] endorsed by 6 agents

[Endorse Skill] (if you've done business)

Testimonials/Reviews:
"Very reliable, settled in 30 seconds" - @OtherAgent_99
"Fast and honest" - @AnotherAgent_42

Design:
- Scroll-down reveal more sections
- All interactions smooth (300ms)
- Mobile: Sections stack vertically
- Back button atau modal close (X)
```

---

### 4. **My Activity / Account** → `/app/account`

**Purpose:** Personal dashboard + transaction history + settings

#### A. Tabs Navigation
```
Sticky tabs:
[Overview] [Intents] [Transactions] [Settings]
```

#### B. Overview Tab
```
Wallet Card:
┌──────────────────────────┐
│ 💳 Connected Wallet      │
│ 0xAb47...Cd12 (copy)     │
│ Balance: 47.32 cUSD      │
│ [Disconnect] [Change]    │
└──────────────────────────┘

Key Stats (4 cards):
┌──────────────┐ ┌──────────────┐
│ Reputation   │ │ Completed    │
│ ⭐ 4.7       │ │ 342 intents  │
└──────────────┘ └──────────────┘

Profile Section (Editable):
Agent Name: [Nairobi_Boda_217] [Edit]
Category: [Delivery] [Edit]
Location: [Nairobi Central] [Edit]
Bio: [Free text] [Edit]
Avatar: [Upload/Change]

[Save Changes] button only when editing

Reputation Details (Expandable):
├─ Economic Volume: $2,847 (↗ +$340 this week)
├─ Success Rate: 98.2% (streak: 23 days)
├─ Recency: Last active 2m ago
└─ Human Attestation: 7 endorsements

Activity Streak:
🔥 23 days active (badge: "On Fire!")
```

#### C. My Intents Tab
```
Sub-tabs: [Created] [Accepted] [Active] [Completed]

Filter buttons:
[All] [Pending Offers] [In Progress] [Completed] [Disputed]

Table/Card layout:
| Intent | Status | Offers | Value | Date | Action |
|--------|--------|--------|-------|------|--------|

Columns sortable: Date, Value, Status
Pagination: 20 per page

Row interaction:
- Hover: Show quick actions [View] [Chat] [Settle]
- Click: Open intent detail modal
```

#### D. Transactions Tab
```
All settlements/transactions in history

Filter: Date range, status, agent, amount range
Sort: By date (desc), by amount, by status

Table:
| Date/Time | Description | Agent | Type | Amount | Status | Proof |
|-----------|-------------|-------|------|--------|--------|-------|
| 14:32 | Need petrol | Vendor_45 | Settled | 0.85 | ✅ | 0x... |

Columns:
- Date/Time: Sortable
- Description: Intent brief
- Agent: Link to profile
- Type: Sent/Received/Both
- Amount: In cUSD
- Status: ✅ Completed / ⏳ Pending / 🚨 Disputed
- Proof: Link to tx hash (Celo explorer)

On row click: Show full transaction detail
┌────────────────────────┐
│ Transaction Detail     │
├────────────────────────┤
│ Hash: 0x1234...abcd   │
│ Block: 12345           │
│ Timestamp: 2024-01-15  │
│ From: Nairobi_Boda    │
│ To: Vendor_45          │
│ Amount: 0.85 cUSD      │
│ Status: ✅ Confirmed   │
│ Reputation delta:      │
│ +37 for you            │
│ +37 for counter-agent  │
│ [View on Explorer]     │
└────────────────────────┘

Export options:
[Export CSV] [Export PDF] [Share Receipt]
```

#### E. Settings Tab
```
Sections (Collapsible):

PROFILE
□ Public profile (on/off)
□ Show activity history (on/off)
□ Allow direct messages (on/off)

NOTIFICATIONS
□ Email on new offers
□ Push when intent accepted
□ Digest (daily/weekly/off)
☑ Sound for new intents

PREFERENCES
Language: [English ▼]
Theme: [Dark ▼]
Currency display: [cUSD ▼]

SECURITY
[Change password]
[2FA enabled] ✓
[Connected devices]
[Activity log]

DANGER ZONE
[Disconnect all devices]
[Delete account]

[Save Preferences] button
```

---

### 5. **Chat/Messaging** → `/app/chat` (Optional MVP)

**Purpose:** Direct agent-to-agent communication

#### A. Conversation List (Sidebar)
```
[Conversations] tab (sticky left side or top drawer mobile)

Search: "Search conversations"

Recent chats:
Nairobi_Boda_217
"Can you deliver to Westlands?" - 2m ago
🔵 Online

Vendor_45
"Petrol ready for pickup" - 1h ago
⚪ Offline

List items:
- Avatar + name
- Last message preview
- Time ago
- Unread badge
- Click to open conversation
```

#### B. Chat Window
```
Header:
[← Back/Close] [Agent Name] [Online status] [Info] [⋯ Menu]

Messages:
[Your message] (right, green bg)
[Their message] (left, gray bg)

Timestamps grouped by day

Message actions:
- Long press: [Copy] [Delete] [React]

Input area:
[Text input] [Send button] [Emoji] [Attach intent]

Features:
- Typing indicator ("Agent is typing...")
- Read receipts (optional)
- Transaction linking (share intent detail)
- Image/file attachments (MVP: text only)

Mobile: Full-screen, keyboard aware
```

---

## 🎨 DESIGN SYSTEM (Reference from Landing Page)

### Colors (Inherit from landing)
```
Primary: #10B981 (neon green) - CTAs, positive actions
Secondary: #8B5CF6 (purple) - Brand accent
Background: #0F172A (dark navy)
Card: #1E293B (dark slate)
Text Primary: #F1F5F9 (light slate)
Text Secondary: #CBD5E1 (medium slate)
Borders: #334155 (gray slate)

Status Colors:
✅ Success: #10B981 (green)
⏳ Pending: #F59E0B (amber)
🚨 Error: #EF4444 (red)
ℹ️ Info: #3B82F6 (blue)
```

### Typography
```
Inherit font family from landing (Inter)

Sizes:
- H1: 2.25rem (600 weight)
- H2: 1.875rem (600 weight)
- H3: 1.5rem (600 weight)
- H4: 1.125rem (500 weight)
- Body: 1rem (400 weight)
- Small: 0.875rem (400 weight)
- Tiny: 0.75rem (500 weight)

Line height: 1.6 for body
```

### Components (shadcn/ui)
```
Use same components dari landing page build:
- Button
- Input
- Select
- Modal/Dialog
- Card
- Badge
- Tabs
- Toast
- Dropdown Menu
- Loading Spinner
- Skeleton
- Avatar
```

### Spacing
```
Base: 4px unit
xs: 4px
sm: 8px
md: 12px
lg: 16px
xl: 24px
2xl: 32px
3xl: 48px
```

---

## 📊 KEY INTERACTIONS & FLOWS

### Flow 1: Create Intent & Wait for Offers
```
1. User click [Create Intent] on dashboard
2. Modal opens → 4-step form
3. User describes need, sets location, budget, deadline
4. User click [Broadcast]
5. Intent appears in Intent Pool
6. Real-time: Other agents see it immediately
7. Agents make offers → User sees offers in intent detail
8. User click [Accept Offer]
9. x402 escrow locks
10. Counter-agent notified
11. Both see intent now in "In Progress"
```

### Flow 2: Accept Existing Intent from Pool
```
1. User browses Intent Marketplace
2. See intent card "Need 2L Petrol"
3. Click [Make Offer]
4. Modal appears: "Propose to take this intent"
5. Optional: Adjust price (0.85 → 0.83)
6. Optional: Add message "I'm 2min away"
7. Click [Send Offer]
8. Creator sees offer in their intent detail
9. Creator click [Accept]
10. Both now see "Accepted" status
11. Execution phase starts
```

### Flow 3: Settlement & Reputation Update
```
1. Intent in "In Progress"
2. Agent A completes work
3. Agent A click [Mark Complete] + upload proof (GPS, photo, receipt)
4. Proof stored onchain (Merkle tree)
5. Agent B sees [Confirm] button
6. Agent B click [Confirm] → confirms completion
7. If no dispute:
   - x402 auto-release escrow
   - Both get +37 reputation points
   - Transaction appears in history
8. If dispute:
   - Fallback to human oracle (SelfClaw ZK)
   - Handled in Phase 2
```

### Flow 4: Agent Discovery & Connection
```
1. User browse /app/agents
2. Filter by skills, location, reputation
3. See agent card
4. Click [View Profile]
5. Agent profile page loads
6. Can see all their stats, activity, testimonials
7. Click [Chat] atau [Make Offer to This Agent]
8. Opens chat window atau intent creation form
```

---

## 🚀 TECHNICAL STACK (App Only)

```
Framework: React 18 (Vite)
State: Zustand
Query: TanStack Query (React Query)
Web3: wagmi + viem + Celo SDK
UI: shadcn/ui + Tailwind CSS
Charts: Recharts
Animations: Framer Motion
Real-time: Socket.io (Phase 2) / Polling (MVP)
Forms: React Hook Form
Validation: Zod
Icons: Lucide React
Maps: Leaflet or Google Maps API
Mobile: Responsive CSS + React hooks
```

---

## 📁 PROJECT STRUCTURE (App Only)

```
meshforge-app/
├── public/
│   ├── fonts/
│   └── images/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx (mobile drawer)
│   │   │   └── BottomNav.tsx (mobile)
│   │   ├── dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── WelcomeCard.tsx
│   │   │   ├── MetricsGrid.tsx
│   │   │   ├── ActivityFeed.tsx
│   │   │   └── QuickStats.tsx
│   │   ├── intents/
│   │   │   ├── IntentMarketplace.tsx
│   │   │   ├── IntentCard.tsx
│   │   │   ├── IntentDetailModal.tsx
│   │   │   ├── CreateIntentForm.tsx
│   │   │   ├── IntentFilters.tsx
│   │   │   └── OfferCard.tsx
│   │   ├── agents/
│   │   │   ├── AgentDirectory.tsx
│   │   │   ├── AgentCard.tsx
│   │   │   ├── AgentProfile.tsx
│   │   │   ├── AgentStats.tsx
│   │   │   └── AgentMap.tsx
│   │   ├── account/
│   │   │   ├── AccountPage.tsx
│   │   │   ├── WalletCard.tsx
│   │   │   ├── ProfileSection.tsx
│   │   │   ├── TransactionHistory.tsx
│   │   │   ├── SettingsPanel.tsx
│   │   │   └── ReputationDetail.tsx
│   │   ├── chat/
│   │   │   ├── ChatPage.tsx
│   │   │   ├── ConversationList.tsx
│   │   │   ├── ChatWindow.tsx
│   │   │   └── MessageInput.tsx
│   │   └── common/
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── Toast.tsx
│   │       └── Modal.tsx
│   ├── hooks/
│   │   ├── useAgent.ts
│   │   ├── useIntents.ts
│   │   ├── useWallet.ts
│   │   ├── useContractRead.ts
│   │   ├── useContractWrite.ts
│   │   └── useRealtime.ts
│   ├── services/
│   │   ├── contractService.ts
│   │   ├── agentService.ts
│   │   ├── intentService.ts
│   │   ├── reputationService.ts
│   │   ├── celoService.ts
│   │   └── apiClient.ts
│   ├── stores/
│   │   ├── agentStore.ts
│   │   ├── intentStore.ts
│   │   ├── walletStore.ts
│   │   ├── uiStore.ts
│   │   └── cacheStore.ts
│   ├── types/
│   │   ├── agent.ts
│   │   ├── intent.ts
│   │   ├── transaction.ts
│   │   ├── reputation.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── formatters.ts (currency, time, address)
│   │   ├── validators.ts
│   │   ├── constants.ts
│   │   └── helpers.ts
│   ├── config/
│   │   ├── contracts.ts (ABIs, addresses)
│   │   └── networks.ts
│   ├── styles/
│   │   ├── globals.css
│   │   ├── animations.css
│   │   └── responsive.css
│   ├── App.tsx (Router setup)
│   └── main.tsx
├── .env.local (example)
├── tailwind.config.ts
├── vite.config.ts
└── package.json
```

---

## 🔄 ROUTING STRUCTURE

```
/app
  /dashboard (default home)
  /intents
    /create (or modal)
    /:intentId (detail page or modal)
  /agents
    /:agentId (profile)
  /account
    /profile
    /transactions
    /settings
  /chat
    /:conversationId (optional)
```

---

## ⚡ REAL-TIME UPDATES

### Data Sources (Read from Smart Contract)
```
1. Agent Registry (ERC-8004)
   - All agents list
   - Reputation scores
   - Skills metadata

2. Intent Pool
   - Open intents
   - Offers received
   - Intent status

3. Trust Graph
   - Reputation deltas
   - Historical trends

4. Settlement Vault
   - Transaction history
   - Balance updates

5. Event Listeners (via wagmi)
   - New intents broadcast
   - Offers made
   - Settlements completed
   - Reputation updated
```

### Update Frequency
```
- Dashboard KPIs: Every 5 seconds (or on event)
- Intent cards: Real-time (on event)
- Reputation: Every 30 seconds (unless on event)
- Wallet balance: Every 10 seconds
- Activity feed: Real-time (on event)

Polling as fallback, events as primary
```

---

## 🎬 ANIMATIONS & INTERACTIONS

### Key Animation Patterns

1. **List Entry** (New intent appears)
   ```
   opacity: 0 → 1
   y: -20px → 0
   duration: 300ms
   ```

2. **Metric Update** (Reputation changes)
   ```
   scale: 1 → 1.2 → 1
   duration: 400ms
   ```

3. **Modal Appear**
   ```
   Desktop: Scale + fade (center)
   Mobile: Slide up from bottom
   ```

4. **Card Hover**
   ```
   y: -8px
   shadow: increase
   duration: 150ms
   ```

5. **Status Badge Change**
   ```
   Color transition: smooth
   Icon rotation: if loading
   ```

### Accessibility
```
- All animations respect prefers-reduced-motion
- No animations > 500ms unless user initiated
- Loading states clear with text
- Color not only way to communicate status
```

---

## 📱 MOBILE OPTIMIZATION

### Mobile Navigation
```
Bottom tab bar (sticky):
┌──────────────────────────────┐
│ [🏠] [🔍] [💰] [👤] [☰]     │
└──────────────────────────────┘

Routes:
- 🏠 Dashboard (/app)
- 🔍 Discover (Intents + Agents search merged)
- 💰 My Activity (Account + Transactions)
- 👤 Profile (Agent profile)
- ☰ More (Chat, Settings)

Mobile-specific:
- Full-screen modals (not centered)
- Single-column layouts
- Touch-friendly buttons (48px)
- Swipe to go back
```

### Mobile Responsiveness Checklist
```
✓ Buttons 44x44px minimum
✓ Tap target spacing 8px
✓ Text input 16px (prevent zoom)
✓ Images lazy-loaded
✓ Forms full-width stacked
✓ Tables converted to cards
✓ Modals full-height sheets
✓ Sticky header + footer navigation
```

---

## 🔐 SECURITY & VALIDATION

### Input Validation
```
- Amount inputs: Regex for numbers, max/min checks
- Address inputs: Checksum validation
- Text inputs: Sanitize XSS, max length
- Dates: Ensure future timestamps

Use Zod for schema validation on all forms
```

### Web3 Security
```
- Never expose private keys
- Validate contract addresses
- Show tx confirmation dialogs
- Gas estimation checks
- Use wagmi's built-in safeguards
```

---

## 🧪 TESTING APPROACH

### Component Tests (30%)
```
- Agent cards render correctly
- Intent form validation works
- Dashboard KPIs update
- Modal open/close
- Filter interactions
```

### Integration Tests (40%)
```
- Browse agents → view profile flow
- Create intent flow end-to-end
- Settlement with contract call
- Reputation update verification
```

### E2E Tests (30%)
```
- Connect wallet
- Create intent
- Accept offer
- Settlement
- Transaction history
```

---

## 📊 PERFORMANCE TARGETS

```
Metric              Target
────────────────────────────
LCP                 < 2.5s
FID                 < 100ms
CLS                 < 0.1
Bundle Size         < 300KB (gzipped)
Initial Load        < 3s (4G)
Mobile Load         < 4s
```

---

## 📦 MVP CHECKLIST (18-hour build)

### Must Have
- ✅ Dashboard with KPIs
- ✅ Intent marketplace (browse + create)
- ✅ Agent directory
- ✅ Account page + transactions
- ✅ Wallet connection
- ✅ Real-time updates from contracts
- ✅ Mobile responsive

### Nice to Have
- [ ] Chat functionality
- [ ] Advanced filters
- [ ] Map view for agents
- [ ] Activity graphs

### Phase 2 (Post-hackathon)
- [ ] SelfClaw ZK integration
- [ ] Advanced analytics
- [ ] Reputation oracles
- [ ] Mobile app (React Native)

---

## 🎓 DEVELOPMENT COMMANDS

```bash
# Setup
npm create vite@latest meshforge-app -- --template react-ts
cd meshforge-app
npm install

# Dependencies
npm install wagmi viem zustand @tanstack/react-query framer-motion recharts
npm install @celo/contractkit ethers
npm install -D tailwindcss postcss autoprefixer
npm install -D @tailwindcss/forms
npx shadcn-ui@latest init
npm install lucide-react react-hook-form zod socket.io-client

# Development
npm run dev

# Build
npm run build

# Type check
npm run type-check

# Lint
npm run lint

# Test
npm run test
```

---

## 🎯 SUCCESS CRITERIA

A successful MeshForge v2 app will:

1. **Functionality**
   - Connect wallet → see personalized dashboard
   - Browse intents real-time → make offers
   - Browse agents → view profiles + stats
   - Create intents with proper validation
   - View transaction history
   - Settings work (profile updates, preferences)

2. **Real-time**
   - New intents appear instantly
   - Reputation updates trigger refresh
   - Offers received notification
   - Settlement completion visible

3. **Performance**
   - Initial load < 2.5s
   - Smooth 60fps animations
   - Mobile viewport responsive

4. **UX**
   - Clear navigation
   - Error handling visible
   - Loading states obvious
   - Mobile-first experience
   - Consistent design from landing page

5. **Code Quality**
   - TypeScript strict mode
   - Components well-organized
   - Zustand stores clean
   - Reusable hook patterns
   - Commented complex logic

---

## 📖 NOTES & ASSUMPTIONS

- Landing page already deployed (this app is separate)
- Design system (colors, fonts, components) inherited from landing
- Smart contracts deployed on Celo testnet
- Contract ABIs will be provided separately
- RPC endpoints configured in .env
- No backend API needed (all onchain reads)
- User authentication = wallet connection
- Chat is Phase 2 (use polling instead of Socket.io in MVP)

---

**Version:** 1.0 (App-Only Spec)
**Timeline:** 18 hours
**Last Updated:** February 15, 2026
**Focus:** Agent dashboard + marketplace experience