# ⚡ SatTrust — Deployment Guide

> Bitcoin-native payroll splitting & reputation protocol on OP_NET Layer 1  
> Built for the OP_NET Vibecoding Challenge · By Amaka | MCJEH Digital

---

## Architecture

```
SatTrust
├── contracts/
│   ├── ReputationRegistry    — Stores per-wallet stats & computes SatScore (0–1000)
│   ├── SplitDeal             — Escrows BTC, distributes to up to 10 recipients by %
│   └── DealFactory           — Creates SplitDeals, registers them in the Registry
└── frontend/ (Next.js)
    ├── /create               — Create Deal page
    ├── /deal                 — Deal Detail + Release / Dispute / Refund
    ├── /profile              — Wallet Profile with SatScore breakdown
    └── /leaderboard          — Top wallets by SatScore
```

---

## Step 1 — Prerequisites

```bash
# Install OP Wallet (v1.8.1)
# Chrome: https://github.com/btc-vision/opwallet/releases/tag/v1.8.1
# Download opwallet-chrome-v1.8.1.zip → chrome://extensions → Load unpacked

# Get testnet BTC from faucet
# https://faucet.opnet.org

# Node.js 18+ required
node --version
```

---

## Step 2 — Install & Build Contracts

```bash
cd contracts

# Remove upstream AssemblyScript if present (CRITICAL)
npm uninstall assemblyscript

# Install dependencies
npm install

# Build ReputationRegistry
npx asc src/index-registry.ts \
  --transform @btc-vision/opnet-transform \
  --outFile build/ReputationRegistry.wasm \
  --optimize \
  --target release

# Build DealFactory  
npx asc src/index-factory.ts \
  --transform @btc-vision/opnet-transform \
  --outFile build/DealFactory.wasm \
  --optimize \
  --target release

# Build SplitDeal
npx asc src/index.ts \
  --transform @btc-vision/opnet-transform \
  --outFile build/SplitDeal.wasm \
  --optimize \
  --target release
```

> **VERIFY** that each .wasm exports `execute`, `onDeploy`, `onUpdate`:
> ```bash
> npx wasm-dis build/ReputationRegistry.wasm | grep "export"
> ```

---

## Step 3 — Deploy Contracts (via Bob at ai.opnet.org)

Deploy in this order — Registry must exist before Factory:

### 3a. Deploy ReputationRegistry
1. Go to [ai.opnet.org](https://ai.opnet.org)
2. Prompt Bob: *"Deploy the ReputationRegistry.wasm to OP_NET testnet"*
3. Confirm in OP Wallet
4. **Save the deployed contract address** → `REGISTRY_ADDRESS`

### 3b. Deploy DealFactory
1. Prompt Bob: *"Deploy DealFactory.wasm to OP_NET testnet with constructor arg: `<REGISTRY_ADDRESS>`"*
2. Confirm in OP Wallet
3. **Save the deployed contract address** → `FACTORY_ADDRESS`

### 3c. Allowlist the Factory in the Registry
```
Call ReputationRegistry.allowlistFactory(FACTORY_ADDRESS)
```
This gives the factory permission to write reputation data.

---

## Step 4 — Configure Frontend

```bash
cd frontend

# Create .env.local
cat > .env.local << EOF
NEXT_PUBLIC_REGISTRY_ADDRESS=<YOUR_REGISTRY_ADDRESS>
NEXT_PUBLIC_FACTORY_ADDRESS=<YOUR_FACTORY_ADDRESS>
NEXT_PUBLIC_OPNET_RPC=https://testnet.opnet.org
EOF

npm install
npm run dev
# Open http://localhost:3000
```

---

## Step 5 — Submit to Vibecoding Challenge

1. Go to [vibecode.finance/competitions](https://vibecode.finance/competitions)
2. Connect your OP Wallet
3. Fill in:
   - **Project Name:** SatTrust
   - **Description:** Bitcoin-native payroll splitting & reputation protocol. Lock BTC, split to any team by %, and build verifiable on-chain trust scores that accumulate with every deal — automatically.
   - **Contract Addresses:** ReputationRegistry + DealFactory
   - **Frontend URL:** (deploy to Vercel — see below)
   - **Category:** Week 1 — Bitcoin Activated

---

## Step 6 — Deploy Frontend to Vercel

```bash
cd frontend
npx vercel --prod
# Follow prompts, add env vars when asked
```

---

## SatScore Formula

```
score = (dealsCompleted × 10)
      + (uniquePayers × 25)
      + (totalReceived ÷ 1,000,000 sats × 5)   ← volume tier
      − (disputes × 40)
      − (lateReleases × 20)

score = clamp(0, 1000)
```

| Score | Level    |
|-------|----------|
| 0     | 🌱 New    |
| 1–99  | 🥉 Bronze |
| 100–299 | 🥈 Silver |
| 300–499 | 🥇 Gold  |
| 500–799 | 💎 Platinum |
| 800–1000 | ⚡ Diamond |

---

## Demo Data

Three pre-seeded wallets are included in `frontend/src/lib/sattrust.ts`:
- **Alice (Top Builder)** — Diamond tier, 42 deals, 0.85 BTC received
- **Bob (Regular)** — Silver tier, 12 deals, some disputes
- **Carol (New Builder)** — Bronze tier, 3 deals, clean record

---

*Built by Amaka | MCJEH Digital for the OP_NET Vibecoding Challenge 2026*
