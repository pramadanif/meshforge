# MeshForge — Karma Project Submission Draft

## General info

### Name
MeshForge

### Description
MeshForge is an intent-coordination protocol for autonomous agents on Celo Sepolia. It provides on-chain verifiability, escrowed execution, cross-border route metadata, live trust analytics, and an orchestration SDK that lets developers integrate complex agent-to-agent execution flows through a single high-level API.

## Add your socials

- Website: https://meshforge.app (replace with your final domain)
- GitHub: https://github.com/<your-org-or-username>/meshforge
- X / Twitter: https://x.com/<your-handle>
- Telegram: https://t.me/<your-community>
- Discord: https://discord.gg/<your-server>
- Demo Video: https://www.youtube.com/watch?v=<your-demo-id>

## Project stage

Production-ready MVP (live deployed contracts + live frontend integration + indexed analytics)

## Contact info

- Primary Contact Name: Muhammad Bagus Pramadani
- Email: <your-email>
- Telegram: @<your-telegram>
- Role: Founder / Protocol Engineer

---

## Problem
Autonomous agents can generate and accept tasks, but they still struggle to coordinate trust-minimized execution across multiple parties and regions. Most current systems are either off-chain and hard to verify, or on-chain but too low-level for agent developers to use safely at scale. This causes execution disputes, weak accountability, and poor interoperability for real cross-border agent economies.

## Solution
MeshForge provides a verifiable execution layer for agent-to-agent intents:

- Intent lifecycle enforcement on-chain (broadcast → accept → escrow → execute → prove → settle)
- Merkle-root commitments for off-chain execution traces
- Cross-border route and stablecoin rail metadata for analytics and monitoring
- Fallback dispute flow with reputation penalties
- Real-time trust graph and activity indexer for transparency
- High-level SDK (`fulfillIntent`) that abstracts protocol complexity for developers

This design gives both cryptographic accountability and practical developer UX.

## Mission Summary
Our mission is to make autonomous agents economically useful in the real world by giving them a trust-minimized coordination protocol that is verifiable, composable, and simple to integrate. MeshForge turns fragmented agent actions into reliable, auditable execution flows that can scale from local tasks to cross-border settlement corridors.

## Location of Impact (optional)

- Primary: Indonesia
- Regional: Southeast Asia and East Africa
- Global: Any EVM-compatible market with agent-based services and cross-border commerce needs

---

## Optional Grant Notes (if needed later)

- Chain: Celo Sepolia (current deployment), production migration path to Celo mainnet
- Core contracts: IntentMesh, AgentRegistry, MeshVault, AgentFactory
- SDK: orchestration middleware with risk profiles and automatic dispute gating
- Infra: Prisma + PostgreSQL indexer, API analytics, live frontend dashboard
