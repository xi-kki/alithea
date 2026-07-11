# 🧠 Alithea — Memory Training Arena
> "Will you remember?"

## ⏱️ 1-HOUR SPRINT PLAN

### PHASE 1: Foundation (10 min) ✅ DONE
- [x] GitHub repo created
- [x] Project structure created
- [x] Move.toml configured
- [x] package.json + dependencies
- [x] .gitignore

### PHASE 2: Core Move Contract (20 min) ✅ DONE
- [x] Classic Pairs game logic
- [x] Board creation + shuffling
- [x] Card reveal + match checking
- [x] Score calculation
- [ ] Basic tests

### PHASE 3: Frontend (20 min) 🔄 IN PROGRESS
- [x] Next.js + Sui SDK setup
- [x] Wallet connection (providers.tsx)
- [x] Card component
- [ ] Game board component ← CURRENT
- [ ] Score display
- [ ] Main page

### PHASE 4: Connect & Ship (10 min) ⏳ PENDING
- [ ] Frontend ↔ Contract integration
- [ ] Test on testnet
- [ ] README
- [ ] Push to GitHub

---

## 🎮 GAME MODES (Full Version)

### MVP (Phase 1)
- [x] Classic Pairs (card matching)

### Phase 2
- [ ] Pattern Echo (Simon says)
- [ ] Number Vault (digit recall)
- [ ] Chasing Stars (spatial memory)

### Phase 3
- [ ] Color Cascade
- [ ] Word Chain
- [ ] Pathfinder
- [ ] Rhythm Recall

### Phase 4
- [ ] Competitive modes (Duel, Tournament)
- [ ] $ALITHEA token
- [ ] Achievements (Soulbound NFTs)
- [ ] Leaderboards

---

## 🏗️ ARCHITECTURE

```
alithea/
├── contracts/           # Sui Move contracts
│   ├── sources/
│   │   ├── game.move        # Core game logic
│   │   ├── board.move       # Board management
│   │   ├── scoring.move     # Score calculation
│   │   └── player.move      # Player profile
│   ├── tests/
│   └── Move.toml
├── frontend/            # Next.js + Sui SDK
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── lib/             # Utilities
│   │   └── types/           # TypeScript types
│   └── package.json
├── scripts/             # Deploy scripts
└── TODO.md
```

---

## 🎯 SUCCESS CRITERIA

- [ ] Move contract compiles
- [ ] Frontend connects to wallet
- [ ] Can create a game board
- [ ] Can flip and match cards
- [ ] Score calculates correctly
- [ ] Deployed to Sui testnet
- [ ] Pushed to GitHub

---

## 🧠 SKILLS MAP

| Phase | Skills |
|-------|--------|
| Foundation | `senior-engineer` |
| Move Contract | `sui` |
| Frontend | `frontend-patterns` |
| Quality | `security_scan` |
| Ship | `fast-deploy` |

---

*Let's build Alithea! 🚀*
