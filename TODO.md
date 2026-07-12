# 🧠 Alithea — Memory Training Arena
> "Will you remember?"

## 📋 STATUS: 🟢 Vercel Deployment Ready

---

## ✅ COMPLETED

### Phase 1: Foundation
- [x] GitHub repo created
- [x] Project structure created
- [x] Move.toml configured
- [x] package.json + dependencies
- [x] .gitignore

### Phase 2: Core Move Contracts (8/8)
- [x] Classic Pairs (`game.move`)
- [x] Pattern Echo (`pattern_echo.move`)
- [x] Number Vault (`number_vault.move`)
- [x] Chasing Stars (`chasing_stars.move`)
- [x] Color Cascade (`color_cascade.move`)
- [x] Word Chain (`word_chain.move`)
- [x] Pathfinder (`pathfinder.move`)
- [x] Rhythm Recall (`rhythm_recall.move`)

### Phase 3: Frontend (8/8 game modes)
- [x] Next.js + Sui SDK setup
- [x] Wallet connection (`providers.tsx`)
- [x] Apple design system (Tailwind + CSS)
- [x] Classic Pairs (`GameBoard.tsx` + `Card.tsx`)
- [x] Pattern Echo (`PatternEcho.tsx`)
- [x] Number Vault (`NumberVault.tsx`)
- [x] Chasing Stars (`ChasingStars.tsx`)
- [x] Color Cascade (`ColorCascade.tsx`)
- [x] Word Chain (`WordChain.tsx`)
- [x] Pathfinder (`Pathfinder.tsx`)
- [x] Rhythm Recall (`RhythmRecall.tsx`)
- [x] Score display + results screen
- [x] Main page with game selector

### Phase 4: Deployment Config
- [x] vercel.json configured
- [x] .env.example for Vercel
- [x] .gitignore clean
- [x] README.md complete

---

## 🚀 DEPLOY TO VERCEL

### Steps:
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `xi-kki/alithea` from GitHub
3. **Root Directory**: `frontend`
4. Framework: **Next.js** (auto-detected)
5. Add env vars:
   - `NEXT_PUBLIC_SUI_NETWORK` = `testnet`
   - `NEXT_PUBLIC_SUI_RPC_URL` = `https://fullnode.testnet.sui.io:443`
   - `NEXT_PUBLIC_CONTRACT_PACKAGE_ID` = `0x...` (after contract deploy)
6. Deploy!

---

## 🔄 POST-DEPLOY TODO

### Immediate
- [ ] Deploy Move contracts to Sui testnet
- [ ] Fill in `NEXT_PUBLIC_CONTRACT_PACKAGE_ID`
- [ ] Test wallet connection on live site
- [ ] Test all 8 game modes

### Near-term
- [ ] Add scoring persistence (on-chain or local storage)
- [ ] Add $ALITHEA token rewards
- [ ] Add leaderboard (on-chain)
- [ ] Add achievements (Soulbound NFTs)

### Future
- [ ] Tournament mode (multiplayer)
- [ ] Mobile app (React Native)
- [ ] Mainnet deployment

---

## 🏗️ ARCHITECTURE

```
alithea/
├── contracts/sources/       # 8 Move smart contracts
│   ├── game.move           # Classic Pairs
│   ├── pattern_echo.move   # Simon Says
│   ├── number_vault.move   # Digit Recall
│   ├── chasing_stars.move  # Spatial Memory
│   ├── color_cascade.move  # Color Sequence
│   ├── word_chain.move     # Verbal Memory
│   ├── pathfinder.move     # Route Memory
│   └── rhythm_recall.move  # Auditory Memory
├── frontend/               # Next.js + Sui SDK
│   ├── src/app/            # Pages + layout
│   ├── src/components/     # 12 React components
│   └── package.json
├── vercel.json             # Vercel deployment config
└── README.md
```

---

## 🎯 SUCCESS CRITERIA

- [x] Move contracts written (8/8)
- [x] Frontend with all game modes (8/8)
- [x] Apple design system
- [x] Wallet integration
- [x] Vercel config ready
- [ ] Deployed to Vercel ← NEXT
- [ ] Contracts deployed to testnet
- [ ] Live and playable

---

*Built with ❤️ on Sui*
