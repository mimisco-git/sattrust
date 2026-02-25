# ⚡ SatTrust

**Bitcoin-native payroll splitting & on-chain reputation protocol, built on OP_NET Layer 1.**

> Built for the OP_NET Vibecoding Challenge 2026 · By Amaka | MCJEH Digital

---

## What is SatTrust?

SatTrust solves two problems at once:

**1. Paying teams in Bitcoin is painful.** You'd need to send multiple transactions, calculate splits manually, or use wrapped tokens on other chains. SatTrust lets you lock BTC and define up to 10 recipients with percentage splits — distributed in one on-chain transaction, no bridges, no wrappers.

**2. Bitcoin wallets have no identity.** There's no way to know if a wallet is trustworthy. SatTrust changes this by writing a permanent reputation event to Bitcoin L1 every time a deal completes. Your SatScore (0–1000) builds automatically from real economic activity.

---

## Contracts

| Contract | Purpose |
|---|---|
| `ReputationRegistry` | Stores per-wallet stats and computes SatScore |
| `SplitDeal` | Escrows BTC and distributes to recipients by % on release |
| `DealFactory` | Creates SplitDeal instances, registers them in the Registry |

---

## SatScore

```
score = (deals × 10) + (unique payers × 25) + (volume bonus) − (disputes × 40) − (late × 20)
```

Capped at **1000**. Computed deterministically from on-chain data. No oracle needed.

---

## Frontend

- **Create Deal** — Lock BTC, define recipients and splits
- **Deal Detail** — Release, dispute, or refund
- **Wallet Profile** — Full SatScore breakdown for any wallet
- **Leaderboard** — Top builders by SatScore

---

## Setup

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full instructions.

---

*Powered by OP_NET · No bridges · No wrapped tokens · Just Bitcoin*
