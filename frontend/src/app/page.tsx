'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { WalletButton } from '@/components/WalletButton';
import { GameBoard } from '@/components/GameBoard';
import { PatternEcho } from '@/components/PatternEcho';
import { NumberVault } from '@/components/NumberVault';
import { ChasingStars } from '@/components/ChasingStars';
import { ColorCascade } from '@/components/ColorCascade';
import { WordChain } from '@/components/WordChain';
import { Pathfinder } from '@/components/Pathfinder';
import { RhythmRecall } from '@/components/RhythmRecall';
import { SpinTheCup } from '@/components/SpinTheCup';
import { Spaceship } from '@/components/Spaceship';
import { GameGuide } from '@/components/GameGuide';
import { GUIDES } from '@/lib/guides';
import {
  BookOpen,
  ArrowLeft,
  BarChart3,
  Blocks,
  Brain,
  ChevronRight,
  Crown,
  CupSoda,
  Drum,
  Dumbbell,
  Eye,
  FileText,
  Flame,
  Gamepad2,
  Hash,
  Heart,
  Layers,
  Link,
  Map,
  Medal,
  Palette,
  PartyPopper,
  Rocket,
  Sparkles,
  Star,
  Swords,
  Target,
  Trophy,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ============ TYPES ============

type GameMode = 'home' | 'classic' | 'pattern' | 'number' | 'stars' | 'color' | 'words' | 'path' | 'rhythm' | 'spin' | 'ship';
type SubMode = string | null;

interface GameResult {
  score: number;
  moves: number;
  time: number;
}

// ============ GAME MODES ============

const GAME_MODES: Array<{
  id: GameMode;
  name: string;
  icon: LucideIcon;
  description: string;
  color: string;
  subModes: Array<{ id: string; label: string; desc: string }>;
}> = [

  {
    id: 'classic' as GameMode,
    name: 'Classic Pairs',
    icon: Layers,
    description: 'Flip, remember, match. The foundation of memory mastery.',
    color: 'from-purple-500 to-pink-500',
    subModes: [
      { id: '4x4', label: '4×4 Beginner', desc: '8 pairs' },
      { id: '6x6', label: '6×6 Challenge', desc: '18 pairs' },
    ],
  },
  {
    id: 'pattern' as GameMode,
    name: 'Pattern Echo',
    icon: Eye,
    description: 'Watch the sequence unfold. Then recreate it from memory.',
    color: 'from-cyan-500 to-blue-500',
    subModes: [
      { id: '3x3', label: '3×3 Grid', desc: '9 cells' },
      { id: '4x4', label: '4×4 Grid', desc: '16 cells' },
    ],
  },
  {
    id: 'number' as GameMode,
    name: 'Number Vault',
    icon: Hash,
    description: 'Digits flash on screen. Can you recall them all?',
    color: 'from-green-500 to-emerald-500',
    subModes: [
      { id: 'forward', label: 'Forward', desc: 'As shown' },
      { id: 'reverse', label: 'Reverse', desc: 'Backwards' },
      { id: 'ascending', label: 'Ascending', desc: 'Sorted' },
    ],
  },
  {
    id: 'stars' as GameMode,
    name: 'Chasing Stars',
    icon: Star,
    description: 'Stars appear and vanish. Trust your spatial memory.',
    color: 'from-yellow-500 to-orange-500',
    subModes: [
      { id: '3', label: '3×3 Grid', desc: 'Small' },
      { id: '4', label: '4×4 Grid', desc: 'Medium' },
      { id: '5', label: '5×5 Grid', desc: 'Large' },
    ],
  },
  {
    id: 'color' as GameMode,
    name: 'Color Cascade',
    icon: Palette,
    description: 'Colors pulse in sequence. How long can you keep up?',
    color: 'from-pink-500 to-rose-500',
    subModes: [
      { id: 'easy', label: 'Easy', desc: '4 colors' },
      { id: 'medium', label: 'Medium', desc: '5 colors' },
      { id: 'hard', label: 'Hard', desc: '6 colors' },
    ],
  },
  {
    id: 'words' as GameMode,
    name: 'Word Chain',
    icon: FileText,
    description: 'Words appear one by one. Stack them in your mind.',
    color: 'from-indigo-500 to-violet-500',
    subModes: [
      { id: 'easy', label: 'Easy', desc: 'Short words' },
      { id: 'medium', label: 'Medium', desc: 'Medium words' },
      { id: 'hard', label: 'Hard', desc: 'Long words' },
    ],
  },
  {
    id: 'path' as GameMode,
    name: 'Pathfinder',
    icon: Map,
    description: 'Trace the path. Then walk it blind.',
    color: 'from-teal-500 to-cyan-500',
    subModes: [
      { id: '4', label: '4×4 Grid', desc: 'Small' },
      { id: '5', label: '5×5 Grid', desc: 'Medium' },
      { id: '6', label: '6×6 Grid', desc: 'Large' },
    ],
  },
  {
    id: 'rhythm' as GameMode,
    name: 'Rhythm Recall',
    icon: Drum,
    description: 'Beats play in pattern. Your turn to repeat.',
    color: 'from-amber-500 to-orange-500',
    subModes: [
      { id: 'easy', label: 'Easy', desc: '4 pads' },
      { id: 'medium', label: 'Medium', desc: '6 pads' },
      { id: 'hard', label: 'Hard', desc: '8 pads' },
    ],
  },
  {
    id: 'spin' as GameMode,
    name: 'Spin the Cup',
    icon: CupSoda,
    description: 'Three cups, one pebble. Watch the shuffle and keep your eyes on the prize.',
    color: 'from-orange-500 to-amber-500',
    subModes: [
      { id: 'easy', label: 'Easy Shuffle', desc: '3 swaps' },
      { id: 'hard', label: 'Fast Shuffle', desc: '6 swaps' },
    ],
  },
  {
    id: 'ship' as GameMode,
    name: 'Spaceship Run',
    icon: Rocket,
    description: 'Remember the safe route through the asteroids. Reach the planet.',
    color: 'from-blue-500 to-indigo-500',
    subModes: [
      { id: 'easy', label: 'Short Route', desc: '3 steps' },
      { id: 'medium', label: 'Medium Route', desc: '5 steps' },
      { id: 'hard', label: 'Long Route', desc: '7 steps' },
    ],
  },
];

const FAQ_ITEMS = [
  {
    question: 'What is Alithea?',
    answer: 'Alithea is a memory training game built on the Sui blockchain. Train your memory across 8 unique game modes, prove your skill on-chain, and earn rewards. Named after the Greek concept of Aletheia — truth, unveiling — because memory is about revealing what\'s hidden.',
  },
  {
    question: 'Do I need crypto to play?',
    answer: 'No. Alithea is free to play. Connect your Sui wallet to save scores on-chain and earn rewards, but the games themselves cost nothing. Your skill is the only investment required.',
  },
  {
    question: 'How do I earn rewards?',
    answer: 'Your scores are recorded on-chain. Top performers earn $ALITHEA tokens through leaderboards, achievements, and tournament placements. The better your memory, the higher your rewards.',
  },
  {
    question: 'What makes Alithea different from other games?',
    answer: 'Alithea is a memory training game built on the Sui blockchain. Train your memory across 10 unique game modes, prove your skill on-chain, and earn rewards. Named after the Greek concept of Aletheia — truth, unveiling — because memory is about revealing what\'s hidden.',
  },
  {
    question: 'What is the $ALITHEA token?',
    answer: '$ALITHEA is the native utility token of the Alithea ecosystem. It\'s used for tournament entry fees, marketplace transactions, and as rewards for top memory performers. The token economy is designed to reward skill, not speculation.',
  },
  {
    question: 'Can I compete with other players?',
    answer: 'Yes. Tournaments are coming soon where you\'ll compete head-to-head in real-time memory challenges. Spectators can watch live and bet on outcomes. The best memories will be crowned champions.',
  },
  {
    question: 'What are Soulbound achievements?',
    answer: 'Soulbound NFTs are non-transferable badges that permanently record your achievements on-chain. They\'re proof of your memory mastery — unique to you, impossible to fake, and visible to everyone.',
  },
  {
    question: 'Is my data private?',
    answer: 'Your gameplay scores are public on-chain for leaderboard transparency, but your personal data stays private. We never sell user data. Your wallet address is the only identifier we need.',
  },
];

// ============ ANIMATED GRADIENT BACKGROUND ============

function GradientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#0d0d2b] to-[#0a0a1a]" />
      
      {/* Animated orbs */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[128px] animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-pink-600/15 blur-[128px] animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-cyan-600/10 blur-[128px] animate-float-slow" />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
    </div>
  );
}

// ============ FLOATING HEADER ============

function Header({ onGoHome }: { onGoHome: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass py-3' : 'py-5'}`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <button onClick={onGoHome} className="flex items-center gap-3 group">
          <Brain className="w-7 h-7 text-purple-400 group-hover:scale-110 transition-transform" />
          <span className="font-sf-display text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Alithea
          </span>
        </button>
        <div className="flex items-center gap-4">
          <a href="#games" className="hidden md:block text-sm text-white/60 hover:text-white transition-colors">
            Games
          </a>
          <a href="#about" className="hidden md:block text-sm text-white/60 hover:text-white transition-colors">
            About
          </a>
          <a href="#guides" className="hidden md:block text-sm text-white/60 hover:text-white transition-colors">
            Guides
          </a>
          <a href="#faq" className="hidden md:block text-sm text-white/60 hover:text-white transition-colors">
            FAQ
          </a>
          <WalletButton />
        </div>
      </div>
    </header>
  );
}

// ============ HERO SECTION ============

function HeroSection({ onPlay }: { onPlay: () => void }) {
  return (
    <section className="min-h-screen flex items-center justify-center relative px-6">
      <div className="text-center max-w-4xl">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm text-white/60">Built on Sui • Live on Testnet</span>
        </div>

        {/* Headline */}
        <h1 className="font-sf-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-in-up">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Will You Remember?
          </span>
        </h1>

        {/* Subheadline */}
        <p className="font-sf-text text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 animate-fade-in-up delay-100">
          Ten memory games that train one superpower: remembering. Play free,
          prove your skill on-chain, and climb the leaderboard.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200">
          <button
            onClick={onPlay}
            className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Training
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          
          <a
            href="#about"
            className="px-8 py-4 rounded-2xl border border-white/20 text-white/70 hover:text-white hover:bg-white/5 transition-all"
          >
            Learn More
          </a>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 md:gap-12 mt-16 animate-fade-in-up delay-300">
          <div className="text-center">
            <div className="font-sf-display text-2xl md:text-3xl font-bold text-white">10</div>
            <div className="text-sm text-white/40">Game Modes</div>
          </div>
          <div className="w-px h-12 bg-white/10" />
          <div className="text-center">
            <div className="font-sf-display text-2xl md:text-3xl font-bold text-white">3</div>
            <div className="text-sm text-white/40">Difficulty Tiers</div>
          </div>
          <div className="w-px h-12 bg-white/10" />
          <div className="text-center">
            <div className="font-sf-display text-2xl md:text-3xl font-bold text-white">∞</div>
            <div className="text-sm text-white/40">Replay Value</div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}

// ============ ABOUT SECTION ============

function AboutSection() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-sf-display text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white/40">Explore</span>{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Your Memory
            </span>
          </h2>
          <p className="font-sf-text text-lg text-white/50 max-w-2xl mx-auto">
            Ten distinct game modes, each training a different aspect of your memory. 
            From spatial awareness to sequential recall — master them all.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {GAME_MODES.map((mode, i) => (
            <div
              key={mode.id}
              className="group card-apple p-6 hover:scale-[1.02] transition-all duration-300"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mode.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                <mode.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-sf-display text-lg font-semibold text-white mb-2">
                {mode.name}
              </h3>
              <p className="font-sf-text text-sm text-white/40 leading-relaxed">
                {mode.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ HOW IT WORKS ============

function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Connect Your Wallet',
      description: 'Link your Sui wallet in one click. No downloads, no installations. Just connect and play.',
      icon: Link,
    },
    {
      number: '02',
      title: 'Choose Your Challenge',
      description: 'Pick from 10 game modes and 3 difficulty tiers. Whether you have 2 minutes or 2 hours, there\'s a challenge waiting.',
      icon: Gamepad2,
    },
    {
      number: '03',
      title: 'Train & Score',
      description: 'Your performance is tracked in real-time. Every move, every second counts toward your final score.',
      icon: BarChart3,
    },
    {
      number: '04',
      title: 'Earn On-Chain',
      description: 'Top scores earn $ALITHEA tokens and Soulbound achievements. Your memory mastery, permanently recorded.',
      icon: Blocks,
    },
  ];

  return (
    <section className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent" />
      
      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-16">
          <h2 className="font-sf-display text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white/40">How It</span>{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="font-sf-text text-lg text-white/50 max-w-2xl mx-auto">
            From first click to first reward in under 60 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-white/20 to-transparent" />
              )}
              <div className="card-apple p-6 h-full">
                <step.icon className="w-9 h-9 mb-4 text-purple-400" />
                <div className="font-sf-display text-sm text-purple-400 font-medium mb-2">
                  {step.number}
                </div>
                <h3 className="font-sf-display text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="font-sf-text text-sm text-white/40 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ TOKEN SECTION ============

function TokenSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <h2 className="font-sf-display text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white/40">Skill-Based</span>{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Rewards
              </span>
            </h2>
            <p className="font-sf-text text-lg text-white/50 mb-8 leading-relaxed">
              No pay-to-win. No luck. Just pure memory skill translated to on-chain rewards. 
              The better you remember, the more you earn.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h4 className="font-sf-display text-white font-semibold mb-1">$ALITHEA Token</h4>
                  <p className="font-sf-text text-sm text-white/40">Earn through leaderboards, tournaments, and daily challenges.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                  <Medal className="w-5 h-5 text-pink-300" />
                </div>
                <div>
                  <h4 className="font-sf-display text-white font-semibold mb-1">Soulbound Achievements</h4>
                  <p className="font-sf-text text-sm text-white/40">Non-transferable NFT badges proving your memory mastery.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <Swords className="w-5 h-5 text-cyan-300" />
                </div>
                <div>
                  <h4 className="font-sf-display text-white font-semibold mb-1">Tournaments</h4>
                  <p className="font-sf-text text-sm text-white/40">Compete head-to-head. Spectators watch live. Winners take all.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl" />
            <div className="relative card-apple p-8 rounded-3xl">
              {/* Mock leaderboard */}
              <div className="mb-6">
                <h4 className="font-sf-display text-sm text-white/40 uppercase tracking-wider mb-4">Top Memory Champions</h4>
                {[
                  { rank: 1, name: '0x7a3f...8d2e', score: '2,847', streak: 12 },
                  { rank: 2, name: '0x9c1b...4f5a', score: '2,634', streak: 8 },
                  { rank: 3, name: '0x2e8d...7c1f', score: '2,421', streak: 5 },
                  { rank: 4, name: '0x5f4a...9b3c', score: '2,198', streak: 3 },
                ].map((player) => (
                  <div key={player.rank} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
                    <span className={`font-sf-display text-lg font-bold ${player.rank === 1 ? 'text-yellow-400' : player.rank === 2 ? 'text-gray-300' : player.rank === 3 ? 'text-orange-400' : 'text-white/40'}`}>
                      #{player.rank}
                    </span>
                    <span className="font-mono text-sm text-white/60 flex-1">{player.name}</span>
                    <span className="font-sf-display font-semibold text-white">{player.score}</span>
                    <span className="inline-flex items-center gap-1 text-sm"><Flame className="w-4 h-4 text-orange-400" /> {player.streak}</span>
                  </div>
                ))}
              </div>
              
              <div className="text-center pt-4 border-t border-white/10">
                <span className="text-sm text-white/40">Live on Sui Testnet</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ FAQ SECTION ============

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-sf-display text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white/40">Got</span>{' '}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Questions?
            </span>
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className="card-apple overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-5 text-left flex items-center justify-between"
              >
                <span className="font-sf-display text-base font-medium text-white pr-4">
                  {item.question}
                </span>
                <svg
                  className={`w-5 h-5 text-white/40 flex-shrink-0 transition-transform duration-200 ${openIndex === i ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-96' : 'max-h-0'}`}
              >
                <p className="px-5 pb-5 text-sm text-white/50 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ FOOTER ============

function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-purple-400" />
            <span className="font-sf-display text-lg font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Alithea
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a href="https://github.com/xi-kki/alithea" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </a>
            <a href="https://docs.sui.io/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </a>
          </div>

          <div className="text-sm text-white/30">
            © 2024 Alithea. Built with <Heart className="inline w-4 h-4 text-pink-500" /> on Sui.
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============ MAIN PAGE ============
// ============ BEGINNER GUIDES SECTION ============

function GuideSection({ onOpenGuide }: { onOpenGuide: (id: string) => void }) {
  return (
    <section id="guides" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-sf-display text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white/40">Beginner</span>{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Guides
            </span>
          </h2>
          <p className="font-sf-text text-lg text-white/50 max-w-2xl mx-auto">
            New here? Every game has a step-by-step guide — refreshed as the
            arena evolves. Start with Spin the Cup, the friendliest way in.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GUIDES.map((guide) => {
            const mode = GAME_MODES.find((m) => m.id === guide.id);
            if (!mode) return null;
            return (
              <div key={guide.id} className="card-apple p-6 flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${mode.color} flex items-center justify-center flex-shrink-0`}>
                  <mode.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-sf-display text-subheading font-semibold text-white mb-1">
                    {guide.title}
                  </h3>
                  <p className="font-sf-text text-caption text-white/40 mb-3">
                    {guide.beginnerTips[0]}
                  </p>
                  <button
                    onClick={() => onOpenGuide(guide.id)}
                    className="btn-apple-secondary !px-4 !py-2 text-sm flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" /> Read Guide
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============ MAIN PAGE ============

export default function Home() {

  const [gameMode, setGameMode] = useState<GameMode>('home');
  const [subMode, setSubMode] = useState<SubMode>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [showLanding, setShowLanding] = useState(true);
  const [guideMode, setGuideMode] = useState<string | null>(null);
  const gameRef = useRef<HTMLDivElement>(null);

  const handleSelectMode = useCallback((mode: GameMode) => {
    setGameMode(mode);
    setSubMode(null);
    setResult(null);
  }, []);

  const handleSelectSubMode = useCallback((mode: SubMode) => {
    setSubMode(mode);
    setResult(null);
  }, []);

  const handleGameComplete = useCallback((score: number, moves: number, time: number) => {
    setResult({ score, moves, time });
  }, []);

  const handlePlayAgain = useCallback(() => {
    setSubMode(null);
    setResult(null);
  }, []);

  const handleGoHome = useCallback(() => {
    setGameMode('home');
    setSubMode(null);
    setResult(null);
    setShowLanding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleStartPlaying = useCallback(() => {
    setShowLanding(false);
    setGameMode('home');
    setTimeout(() => {
      gameRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  const currentMode = GAME_MODES.find(m => m.id === gameMode);

  // ============ RENDER ============

  return (
    <div className="min-h-screen">
      <GradientBackground />
      <Header onGoHome={handleGoHome} />

      {/* LANDING PAGE */}
      {showLanding && (
        <>
          <HeroSection onPlay={handleStartPlaying} />
          <AboutSection />
          <GuideSection onOpenGuide={setGuideMode} />
          <HowItWorks />
          <TokenSection />
          <FAQSection />
          <Footer />
        </>
      )}

      {/* GAME AREA */}
      {!showLanding && (
        <div ref={gameRef} className="pt-24 pb-12 px-4 md:px-8 min-h-screen">
          <div className="max-w-6xl mx-auto">
            {/* HOME: Game Selector */}
            {gameMode === 'home' && !result && (
              <div className="animate-fade-in">
                <button
                  onClick={handleGoHome}
                  className="btn-apple-ghost mb-8 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Home
                </button>

                <div className="text-center mb-12">
                  <h1 className="font-sf-display text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                    Choose Your Challenge
                  </h1>
                  <p className="font-sf-text text-lg text-white/50 max-w-lg mx-auto">
                    Ten ways to test your memory. Which will you master?
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {GAME_MODES.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => handleSelectMode(mode.id)}
                      className="group card-apple p-5 text-left hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    >
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${mode.color} flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform`}>
                        <mode.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-sf-display text-subheading font-semibold text-white mb-1">
                        {mode.name}
                      </h3>
                      <p className="font-sf-text text-caption text-white/40">
                        {mode.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-MODE SELECTOR */}
            {gameMode !== 'home' && !subMode && !result && currentMode && (
              <div className="w-full max-w-md mx-auto animate-slide-up">
                <button
                  onClick={() => handleSelectMode('home')}
                  className="btn-apple-ghost mb-6 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Games
                </button>

                <div className="text-center mb-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentMode.color} flex items-center justify-center text-4xl mx-auto mb-4`}>
                    <currentMode.icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="font-sf-display text-display-xl font-bold text-white mb-2">
                    {currentMode.name}
                  </h2>
                  <p className="font-sf-text text-body text-white/50">
                    {currentMode.description}
                  </p>
                </div>

                <button
                  onClick={() => setGuideMode(currentMode.id)}
                  className="w-full btn-apple-secondary mb-3 flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" /> How to Play
                </button>

                <div className="space-y-3">
                  {currentMode.subModes.map((sm) => (
                    <button
                      key={sm.id}
                      onClick={() => handleSelectSubMode(sm.id)}
                      className="w-full card-apple p-4 flex items-center justify-between hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    >
                      <div className="text-left">
                        <div className="font-sf-display text-subheading font-semibold text-white">
                          {sm.label}
                        </div>
                        <div className="font-sf-text text-caption text-white/40">
                          {sm.desc}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/30" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* GAME PLAY */}
            {gameMode !== 'home' && subMode && !result && (
              <div className="w-full animate-fade-in">
                <button
                  onClick={handlePlayAgain}
                  className="btn-apple-ghost mb-6 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Change Mode
                </button>

                {gameMode === 'classic' && (
                  <GameBoard
                    gridSize={subMode === '6x6' ? 6 : 4}
                    onComplete={handleGameComplete}
                  />
                )}
                {gameMode === 'pattern' && (
                  <PatternEcho
                    gridSize={subMode === '4x4' ? 4 : 3}
                    onComplete={handleGameComplete}
                  />
                )}
                {gameMode === 'number' && (
                  <NumberVault
                    recallMode={subMode as 'forward' | 'reverse' | 'ascending'}
                    onComplete={handleGameComplete}
                  />
                )}
                {gameMode === 'stars' && (
                  <ChasingStars
                    gridSize={Number(subMode) as 3 | 4 | 5}
                    onComplete={handleGameComplete}
                  />
                )}
                {gameMode === 'color' && (
                  <ColorCascade
                    difficulty={subMode as 'easy' | 'medium' | 'hard'}
                    onComplete={handleGameComplete}
                  />
                )}
                {gameMode === 'words' && (
                  <WordChain
                    difficulty={subMode as 'easy' | 'medium' | 'hard'}
                    onComplete={handleGameComplete}
                  />
                )}
                {gameMode === 'path' && (
                  <Pathfinder
                    gridSize={Number(subMode) as 4 | 5 | 6}
                    onComplete={handleGameComplete}
                  />
                )}
                {gameMode === 'rhythm' && (
                  <RhythmRecall
                    difficulty={subMode as 'easy' | 'medium' | 'hard'}
                    onComplete={handleGameComplete}
                  />
                )}
                {gameMode === 'spin' && (
                  <SpinTheCup
                    difficulty={subMode as 'easy' | 'hard'}
                    onComplete={handleGameComplete}
                  />
                )}
                {gameMode === 'ship' && (
                  <Spaceship
                    routeLength={subMode === 'medium' ? 5 : subMode === 'hard' ? 7 : 3}
                    onComplete={handleGameComplete}
                  />
                )}
              </div>
            )}

            {/* RESULTS SCREEN */}
            {result && (
              <div className="w-full max-w-md mx-auto text-center animate-slide-up">
                <div className="card-apple p-8">
                  <PartyPopper className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                  <h2 className="font-sf-display text-display-xl font-bold text-white mb-2">
                    Game Complete!
                  </h2>
                  {currentMode && (
                    <p className="font-sf-text text-body text-white/50 mb-6">
                      {currentMode.name}
                    </p>
                  )}

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div>
                      <div className="score-value text-display-xxl">{result.score}</div>
                      <div className="text-caption text-white/40">Score</div>
                    </div>
                    <div>
                      <div className="font-sf-display text-display-xxl font-bold text-white">
                        {result.moves}
                      </div>
                      <div className="text-caption text-white/40">
                        {gameMode === 'classic' ? 'Moves' : 'Rounds'}
                      </div>
                    </div>
                    <div>
                      <div className="font-sf-display text-display-xxl font-bold text-cyan-400">
                        {formatTime(result.time)}
                      </div>
                      <div className="text-caption text-white/40">Time</div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <ScoreRating score={result.score} />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handlePlayAgain}
                      className="flex-1 btn-apple-primary"
                    >
                      Play Again
                    </button>
                    <button
                      onClick={() => { handleSelectMode('home'); }}
                      className="flex-1 btn-apple-secondary"
                    >
                      All Games
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {guideMode && (
        <GameGuide guide={GUIDES.find((g) => g.id === guideMode)} onClose={() => setGuideMode(null)} />
      )}

    </div>
  );
}

// ============ HELPERS ============

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function ScoreRating({ score }: { score: number }) {
  let rating: string;
  let color: string;
  let RatingIcon: LucideIcon;

  if (score >= 2000) {
    rating = 'Legendary';
    color = 'text-yellow-400';
    RatingIcon = Crown;
  } else if (score >= 1500) {
    rating = 'Excellent';
    color = 'text-green-400';
    RatingIcon = Sparkles;
  } else if (score >= 1000) {
    rating = 'Great';
    color = 'text-purple-400';
    RatingIcon = Flame;
  } else if (score >= 500) {
    rating = 'Good';
    color = 'text-cyan-400';
    RatingIcon = Dumbbell;
  } else {
    rating = 'Keep Trying';
    color = 'text-white/50';
    RatingIcon = Target;
  }

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5">
      <RatingIcon className="w-5 h-5" />
      <span className={`font-sf-display text-subheading font-semibold ${color}`}>
        {rating}
      </span>
    </div>
  );
}
