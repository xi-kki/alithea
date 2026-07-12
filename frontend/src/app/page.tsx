'use client';

import { useState, useCallback } from 'react';
import { WalletButton } from '@/components/WalletButton';
import { GameBoard } from '@/components/GameBoard';
import { PatternEcho } from '@/components/PatternEcho';
import { NumberVault } from '@/components/NumberVault';
import { ChasingStars } from '@/components/ChasingStars';
import { ColorCascade } from '@/components/ColorCascade';
import { WordChain } from '@/components/WordChain';
import { Pathfinder } from '@/components/Pathfinder';
import { RhythmRecall } from '@/components/RhythmRecall';

// ============ TYPES ============

type GameMode = 'home' | 'classic' | 'pattern' | 'number' | 'stars' | 'color' | 'words' | 'path' | 'rhythm';
type SubMode = string | null;

interface GameResult {
  score: number;
  moves: number;
  time: number;
}

// ============ GAME MODES ============

const GAME_MODES = [
  {
    id: 'classic' as GameMode,
    name: 'Classic Pairs',
    icon: '🃏',
    description: 'Match pairs of cards',
    color: 'from-purple-500 to-pink-500',
    subModes: [
      { id: '4x4', label: '4×4 Beginner', desc: '8 pairs' },
      { id: '6x6', label: '6×6 Challenge', desc: '18 pairs' },
    ],
  },
  {
    id: 'pattern' as GameMode,
    name: 'Pattern Echo',
    icon: '👁️',
    description: 'Watch and repeat sequences',
    color: 'from-cyan-500 to-blue-500',
    subModes: [
      { id: '3x3', label: '3×3 Grid', desc: '9 cells' },
      { id: '4x4', label: '4×4 Grid', desc: '16 cells' },
    ],
  },
  {
    id: 'number' as GameMode,
    name: 'Number Vault',
    icon: '🔢',
    description: 'Recall number sequences',
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
    icon: '⭐',
    description: 'Find hidden star positions',
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
    icon: '🎨',
    description: 'Repeat color patterns',
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
    icon: '📝',
    description: 'Memorize word lists',
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
    icon: '🗺️',
    description: 'Trace hidden paths',
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
    icon: '🥁',
    description: 'Repeat beat patterns',
    color: 'from-amber-500 to-orange-500',
    subModes: [
      { id: 'easy', label: 'Easy', desc: '4 pads' },
      { id: 'medium', label: 'Medium', desc: '6 pads' },
      { id: 'hard', label: 'Hard', desc: '8 pads' },
    ],
  },
];

// ============ MAIN PAGE ============

export default function Home() {
  const [gameMode, setGameMode] = useState<GameMode>('home');
  const [subMode, setSubMode] = useState<SubMode>(null);
  const [result, setResult] = useState<GameResult | null>(null);

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
  }, []);

  const currentMode = GAME_MODES.find(m => m.id === gameMode);

  // ============ RENDER ============

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={handleGoHome}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span className="text-2xl">🧠</span>
            <span className="font-sf-display text-heading-sm font-bold bg-gradient-to-r from-alithea-primary to-alithea-secondary bg-clip-text text-transparent">
              Alithea
            </span>
          </button>
          <WalletButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        {/* HOME: Game Selector */}
        {gameMode === 'home' && !result && (
          <div className="w-full max-w-4xl animate-fade-in">
            {/* Hero */}
            <div className="text-center mb-12">
              <h1 className="font-sf-display text-display font-bold mb-4 bg-gradient-to-r from-alithea-primary via-alithea-secondary to-alithea-accent bg-clip-text text-transparent">
                Memory Training Arena
              </h1>
              <p className="font-sf-text text-callout text-white/50 max-w-lg mx-auto">
                Train your memory. Prove your skill. Will you remember?
              </p>
            </div>

            {/* Game Mode Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {GAME_MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => handleSelectMode(mode.id)}
                  className="group card-apple p-5 text-left hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  <div className={`w-12 h-12 rounded-apple-md bg-gradient-to-br ${mode.color} flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform`}>
                    {mode.icon}
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
          <div className="w-full max-w-md animate-slide-up">
            <button
              onClick={handleGoHome}
              className="btn-apple-ghost mb-6 flex items-center gap-2"
            >
              ← Back to Games
            </button>

            <div className="text-center mb-8">
              <div className={`w-16 h-16 rounded-apple-lg bg-gradient-to-br ${currentMode.color} flex items-center justify-center text-4xl mx-auto mb-4`}>
                {currentMode.icon}
              </div>
              <h2 className="font-sf-display text-display-xl font-bold text-white mb-2">
                {currentMode.name}
              </h2>
              <p className="font-sf-text text-body text-white/50">
                {currentMode.description}
              </p>
            </div>

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
                  <span className="text-white/30 text-xl">→</span>
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
              ← Change Mode
            </button>

            {/* Classic Pairs */}
            {gameMode === 'classic' && (
              <GameBoard
                gridSize={subMode === '6x6' ? 6 : 4}
                onComplete={handleGameComplete}
              />
            )}

            {/* Pattern Echo */}
            {gameMode === 'pattern' && (
              <PatternEcho
                gridSize={subMode === '4x4' ? 4 : 3}
                onComplete={handleGameComplete}
              />
            )}

            {/* Number Vault */}
            {gameMode === 'number' && (
              <NumberVault
                recallMode={subMode as 'forward' | 'reverse' | 'ascending'}
                onComplete={handleGameComplete}
              />
            )}

            {/* Chasing Stars */}
            {gameMode === 'stars' && (
              <ChasingStars
                gridSize={Number(subMode) as 3 | 4 | 5}
                onComplete={handleGameComplete}
              />
            )}

            {/* Color Cascade */}
            {gameMode === 'color' && (
              <ColorCascade
                difficulty={subMode as 'easy' | 'medium' | 'hard'}
                onComplete={handleGameComplete}
              />
            )}

            {/* Word Chain */}
            {gameMode === 'words' && (
              <WordChain
                difficulty={subMode as 'easy' | 'medium' | 'hard'}
                onComplete={handleGameComplete}
              />
            )}

            {/* Pathfinder */}
            {gameMode === 'path' && (
              <Pathfinder
                gridSize={Number(subMode) as 4 | 5 | 6}
                onComplete={handleGameComplete}
              />
            )}

            {/* Rhythm Recall */}
            {gameMode === 'rhythm' && (
              <RhythmRecall
                difficulty={subMode as 'easy' | 'medium' | 'hard'}
                onComplete={handleGameComplete}
              />
            )}
          </div>
        )}

        {/* RESULTS SCREEN */}
        {result && (
          <div className="w-full max-w-md text-center animate-slide-up">
            <div className="card-apple p-8">
              <div className="text-6xl mb-4">🎉</div>
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
                  <div className="font-sf-display text-display-xxl font-bold text-alithea-accent">
                    {formatTime(result.time)}
                  </div>
                  <div className="text-caption text-white/40">Time</div>
                </div>
              </div>

              {/* Score Rating */}
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
                  onClick={handleGoHome}
                  className="flex-1 btn-apple-secondary"
                >
                  All Games
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-white/5">
        <p className="font-sf-text text-caption text-white/20">
          🧠 Alithea — Built on Sui
        </p>
      </footer>
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
  let emoji: string;

  if (score >= 2000) {
    rating = 'Legendary';
    color = 'text-yellow-400';
    emoji = '👑';
  } else if (score >= 1500) {
    rating = 'Excellent';
    color = 'text-alithea-success';
    emoji = '🌟';
  } else if (score >= 1000) {
    rating = 'Great';
    color = 'text-alithea-primary';
    emoji = '🔥';
  } else if (score >= 500) {
    rating = 'Good';
    color = 'text-alithea-accent';
    emoji = '💪';
  } else {
    rating = 'Keep Trying';
    color = 'text-white/50';
    emoji = '🎯';
  }

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-apple-full bg-white/5">
      <span>{emoji}</span>
      <span className={`font-sf-display text-subheading font-semibold ${color}`}>
        {rating}
      </span>
    </div>
  );
}
