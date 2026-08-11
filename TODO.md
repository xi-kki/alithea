# Alithea — Memory Training Arena
> "Will you remember?"

## STATUS: LIVE — https://alitia.vercel.app

---

## COMPLETED

### Phase 1: Foundation
- [x] GitHub repo created (xi-kki/alithea, public)
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
- [x] Compile errors fixed (missing `mut` in chasing_stars + pathfinder, missing `;` after if-statements)
- [x] Published to Sui testnet — package `0x87326959ace8e0f0703054b5919c972f0309781e380b6d9784cb98f7779a0b6d` (see `contracts/Published.toml`)

### Phase 3: Frontend (10/10 game modes)
- [x] Next.js + Sui SDK setup
- [x] Wallet connection (dapp-kit ConnectButton, testnet RPC)
- [x] Apple design system (Tailwind + CSS)
- [x] Classic Pairs (`GameBoard.tsx` + `Card.tsx`)
- [x] Pattern Echo (`PatternEcho.tsx`)
- [x] Number Vault (`NumberVault.tsx`)
- [x] Chasing Stars (`ChasingStars.tsx`)
- [x] Color Cascade (`ColorCascade.tsx`)
- [x] Word Chain (`WordChain.tsx`)
- [x] Pathfinder (`Pathfinder.tsx`)
- [x] Rhythm Recall (`RhythmRecall.tsx`)
- [x] Spin the Cup (`SpinTheCup.tsx`) — the beginner game: 3 cups, 1 pebble, shuffled; follow the pebble
- [x] Spaceship Run (`Spaceship.tsx`) — remember the safe route through the asteroids, reach the planet
- [x] Score display + results screen
- [x] Main page with game selector (10 modes)
- [x] Landing page (Hero, About, How It Works, Guides, Token, FAQ, Footer)
- [x] Animated gradient background
- [x] Floating header with glass morphism

### Phase 4: No-Emoji Rule (lucide.dev only)
- [x] All emoji glyphs removed from page + components, replaced with lucide-react icons
- [x] Card faces: 18 lucide icons (Diamond, Zap, Moon, Flame, Star, Waves, Gem, Flower2, Theater, Bug, Clover, Target, Tent, Palette, Rainbow, Dices, Spade, Sparkles)

### Phase 5: Beginner Guides
- [x] Guides data in `src/lib/guides.ts` (how to play + beginner tips + pro tips + `updated` date per game)
- [x] Guide modal (`src/components/GameGuide.tsx`) — open from any game screen ("How to Play") or the Beginner Guides landing section
- [x] Guides are versioned and refreshed as the arena evolves

### Phase 6: Deployment
- [x] Vercel project `alitia` (root directory `frontend`) — LIVE at https://alitia.vercel.app
- [x] Env vars set: NEXT_PUBLIC_SUI_NETWORK, NEXT_PUBLIC_SUI_RPC_URL, NEXT_PUBLIC_CONTRACT_PACKAGE_ID, NEXT_PUBLIC_CONTRACT_MODULE
- [x] All 10 games verified clickable and playable on the live build (local smoke test + live check)
- [x] README.md updated

---

## FUTURE ENHANCEMENTS

- [ ] $ALITHEA token rewards
- [ ] Leaderboard (on-chain)
- [ ] Achievements (Soulbound NFTs)
- [ ] Tournament mode (multiplayer)
- [ ] Wire the deployed contract package ID into the frontend game flows (games are currently client-side)
- [ ] Mobile app (React Native)
- [ ] Mainnet deployment

---

## ARCHITECTURE

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
│   ├── src/components/     # 14 React components
│   ├── src/lib/guides.ts   # Per-game beginner guides
│   └── package.json
├── scripts/                # Deploy scripts
└── README.md
```

---

## SUCCESS CRITERIA

- [x] Move contracts written (8/8) and deployed to testnet
- [x] Frontend with all game modes (10/10), all clickable and functional
- [x] No emojis anywhere — lucide.dev icons only
- [x] Beginner guides for every game, versioned and updatable
- [x] Wallet integration functional
- [x] Apple design system
- [x] Animations & polish
- [x] Landing page
- [x] Deployed to Vercel — LIVE at https://alitia.vercel.app
- [x] Contracts deployed to testnet
- [x] Live and playable

---

*Built on Sui.*
