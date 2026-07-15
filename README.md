# 🧠 Alithea — Memory Training Arena

> *"Will you remember?"*

Alithea is a memory training game built on the **Sui blockchain**. Train your memory, prove your skill, and earn rewards. Named after the Greek concept of *Aletheia* (truth/unveiling) — because memory is about revealing what's hidden.

![Alithea](https://img.shields.io/badge/status-99%25%20Complete-brightgreen) ![Sui](https://img.shields.io/badge/built%20on-Sui-purple) ![Move](https://img.shields.io/badge/language-Move-blue) ![Next.js](https://img.shields.io/badge/Framework-Next.js-black)

## 🎮 Features

### MVP — Classic Pairs
- **4×4 Grid**: Match 8 pairs of cards (Beginner)
- **6×6 Grid**: Match 18 pairs of cards (Challenge)
- **Scoring System**: Base score + speed bonus + combo multipliers
- **Real-time Timer**: Track your speed
- **Wallet Integration**: Connect with Sui wallet

### Coming Soon
- 🔵 **Pattern Echo** — Simon says style sequence memory
- 🔢 **Number Vault** — Digit recall challenges
- ⭐ **Chasing Stars** — Spatial memory grid
- 🎨 **Color Cascade** — Color sequence memory
- 📝 **Word Chain** — Verbal memory challenges
- 🗺️ **Pathfinder** — Route memory
- 🥁 **Rhythm Recall** — Auditory memory
- 🏆 **Tournaments** — Competitive multiplayer
- 🪙 **$ALITHEA Token** — Play-to-earn rewards
- 🏅 **Achievements** — Soulbound NFTs

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Sui CLI ([Install Guide](https://docs.sui.io/build/install))
- Sui Wallet (Chrome Extension)

### Frontend Setup

```bash
# Clone the repo
git clone https://github.com/xi-kki/alithea.git
cd alithea/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Contract Setup

```bash
# Navigate to contracts
cd contracts

# Build the contract
sui move build

# Run tests
sui move test

# Deploy to testnet
sui client publish --gas-budget 100000000
```

## 🏗️ Architecture

```
alithea/
├── contracts/           # Sui Move smart contracts
│   ├── sources/
│   │   └── game.move    # Core game logic
│   ├── tests/
│   └── Move.toml
├── frontend/            # Next.js + Sui SDK
│   ├── src/
│   │   ├── app/         # Pages & routing
│   │   ├── components/  # React components
│   │   └── lib/         # Utilities
│   └── package.json
├── scripts/             # Deploy scripts
└── README.md
```

## 🎯 How to Play

1. **Connect Wallet** — Click "Connect Wallet" in the top right
2. **Choose Mode** — Select 4×4 (Beginner) or 6×6 (Challenge)
3. **Find Pairs** — Click cards to reveal them, remember their positions
4. **Match Cards** — Find all matching pairs to complete the game
5. **Earn Score** — Your score is based on:
   - **Moves**: Fewer moves = higher score
   - **Speed**: Complete under 30 seconds for bonus
   - **Combos**: Consecutive matches multiply your score

## 📊 Scoring System

```
BASE SCORE: 1,000

MOVES PENALTY:
  - Extra moves beyond minimum: -10 points each

SPEED BONUS:
  - Complete in < 30 seconds: +500 points

COMBO BONUS:
  - 2 consecutive matches: +100 points
  - 3+ consecutive matches: +200 points
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Blockchain** | Sui (Testnet) |
| **Smart Contracts** | Move Language |
| **Frontend** | Next.js 14 + TypeScript |
| **Styling** | Tailwind CSS |
| **Wallet** | @mysten/dapp-kit |
| **SDK** | @mysten/sui |

## 🎨 Card Themes

Classic Pairs features 18 unique card icons:

🔮 ⚡ 🌙 🔥 ⭐ 🌊 💎 🌸 🎭 🦋 🍀 🎯 🎪 🎨 🌈 🎲 🃏

## 📈 Progress

- [x] Phase 1: Foundation (Project setup)
- [x] Phase 2: Core Move Contract (Game logic)
- [x] Phase 3: Frontend (Game UI)
- [x] Phase 4: Additional Game Modes (8/8 complete)
- [ ] Phase 5: Token & Achievements (Future)
- [ ] Phase 6: Tournaments (Future)
- [ ] Phase 7: Mobile Optimization (Future)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## 🚀 Deployment

### Vercel (Frontend)

1. Push to GitHub
2. Import `xi-kki/alithea` on [Vercel](https://vercel.com/new)
3. Set Root Directory to `frontend`
4. Add environment variables:
   - `NEXT_PUBLIC_SUI_NETWORK=testnet`
   - `NEXT_PUBLIC_SUI_RPC_URL=https://fullnode.testnet.sui.io:443`
5. Deploy!

### Sui Testnet (Contracts)

```bash
cd contracts
sui move build
sui client publish --gas-budget 100000000
```

## 🔗 Links

- [GitHub](https://github.com/xi-kki/alithea)
- [Sui Documentation](https://docs.sui.io/)
- [Move Language](https://move-language.github.io/)

## 💬 Contact

Built with ❤️ on Sui

---

<p align="center">🧠 <b>Alithea</b> — Will you remember? 🧠</p>
