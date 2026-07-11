'use client';

import { useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { WalletButton } from '@/components/WalletButton';
import { GameBoard } from '@/components/GameBoard';
import { PatternEcho } from '@/components/PatternEcho';
import { NumberVault } from '@/components/NumberVault';

type GameMode = 'menu' | '4x4' | '6x6' | 'pattern-3' | 'pattern-4' | 'number-forward' | 'number-reverse' | 'number-ascending' | 'complete';

export default function Home() {
  const account = useCurrentAccount();
  const [gameMode, setGameMode] = useState<GameMode>('menu');
  const [gameResult, setGameResult] = useState<{ score: number; moves: number; time: number } | null>(null);

  const handleGameComplete = (score: number, moves: number, time: number) => {
    setGameResult({ score, moves, time });
    setGameMode('complete');
  };

  const handlePlayAgain = () => {
    setGameResult(null);
    setGameMode('menu');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-alithea-darker via-alithea-dark to-alithea-darker grid-pattern">
      {/* Header - Apple-style nav */}
      <header className="sticky top-0 z-50 glass">
        <div className="container mx-auto px-apple-6 py-apple-4 flex justify-between items-center">
          <div className="flex items-center gap-apple-3">
            <span className="text-2xl">🧠</span>
            <div>
              <h1 className="font-sf-display text-heading-sm font-semibold text-white">
                Alithea
              </h1>
              <p className="text-caption text-white/50 hidden sm:block">Will you remember?</p>
            </div>
          </div>
          <WalletButton />
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-apple-6 py-apple-12">
        {gameMode === 'menu' && (
          <div className="max-w-2xl mx-auto text-center animate-fade-in">
            {/* Hero Section - Apple style */}
            <div className="mb-apple-16">
              <h2 className="font-sf-display text-display font-bold mb-apple-4">
                <span className="bg-gradient-to-r from-alithea-primary via-alithea-secondary to-alithea-accent bg-clip-text text-transparent">
                  Memory Training
                </span>
                <br />
                <span className="text-white">Arena</span>
              </h2>
              <p className="font-sf-text text-subheading text-white/60 max-w-lg mx-auto">
                Train your memory. Prove your skill. Earn your reward.
              </p>
            </div>

            {/* Game Mode Cards - Apple-style */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-apple-5 mb-apple-10">
              {/* Classic Pairs 4x4 */}
              <button
                onClick={() => setGameMode('4x4')}
                className="group relative overflow-hidden rounded-apple-md p-[1px] bg-gradient-to-br from-alithea-primary to-alithea-secondary hover:scale-[1.02] transition-all duration-300"
              >
                <div className="relative h-full rounded-apple-md bg-alithea-dark p-apple-6 text-left">
                  <div className="text-4xl mb-apple-3">👁️</div>
                  <h3 className="font-sf-display text-heading-sm font-semibold text-white mb-apple-2">
                    Classic Pairs
                  </h3>
                  <p className="font-sf-text text-body-sm text-white/50 mb-apple-4">
                    Match 8 pairs of cards. Remember their positions!
                  </p>
                  <div className="flex items-center gap-2 text-caption">
                    <span className="px-2 py-1 bg-alithea-primary/20 text-alithea-primary rounded-apple-full">
                      4×4 Grid
                    </span>
                    <span className="px-2 py-1 bg-alithea-success/20 text-alithea-success rounded-apple-full">
                      Beginner
                    </span>
                  </div>
                </div>
              </button>

              {/* Classic Pairs 6x6 */}
              <button
                onClick={() => setGameMode('6x6')}
                className="group relative overflow-hidden rounded-apple-md p-[1px] bg-gradient-to-br from-alithea-secondary to-alithea-accent hover:scale-[1.02] transition-all duration-300"
              >
                <div className="relative h-full rounded-apple-md bg-alithea-dark p-apple-6 text-left">
                  <div className="text-4xl mb-apple-3">🧠</div>
                  <h3 className="font-sf-display text-heading-sm font-semibold text-white mb-apple-2">
                    Challenge Mode
                  </h3>
                  <p className="font-sf-text text-body-sm text-white/50 mb-apple-4">
                    Match 18 pairs. Can you handle the pressure?
                  </p>
                  <div className="flex items-center gap-2 text-caption">
                    <span className="px-2 py-1 bg-alithea-secondary/20 text-alithea-secondary rounded-apple-full">
                      6×6 Grid
                    </span>
                    <span className="px-2 py-1 bg-alithea-warning/20 text-alithea-warning rounded-apple-full">
                      Hard
                    </span>
                  </div>
                </div>
              </button>
            </div>

            {/* Pattern Echo - Now Available! */}
            <div className="mb-apple-8">
              <h3 className="font-sf-display text-subheading font-semibold text-white/80 mb-apple-4">
                🧠 Memory Challenges
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-apple-4">
                <button
                  onClick={() => setGameMode('pattern-3')}
                  className="group relative overflow-hidden rounded-apple-md p-[1px] bg-gradient-to-br from-alithea-accent to-alithea-primary hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="relative h-full rounded-apple-md bg-alithea-dark p-apple-5 text-left">
                    <div className="text-3xl mb-apple-2">🔵</div>
                    <h4 className="font-sf-display text-heading-sm font-semibold text-white mb-apple-1">
                      Pattern Echo
                    </h4>
                    <p className="font-sf-text text-body-sm text-white/50">
                      Watch and repeat the pattern!
                    </p>
                    <span className="inline-block mt-apple-2 px-2 py-1 bg-alithea-accent/20 text-alithea-accent text-caption rounded-apple-full">
                      3×3 Grid
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => setGameMode('pattern-4')}
                  className="group relative overflow-hidden rounded-apple-md p-[1px] bg-gradient-to-br from-alithea-primary to-alithea-secondary hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="relative h-full rounded-apple-md bg-alithea-dark p-apple-5 text-left">
                    <div className="text-3xl mb-apple-2">🟢</div>
                    <h4 className="font-sf-display text-heading-sm font-semibold text-white mb-apple-1">
                      Pattern Echo
                    </h4>
                    <p className="font-sf-text text-body-sm text-white/50">
                      Harder pattern challenge!
                    </p>
                    <span className="inline-block mt-apple-2 px-2 py-1 bg-alithea-primary/20 text-alithea-primary text-caption rounded-apple-full">
                      4×4 Grid
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Number Vault */}
            <div className="mb-apple-8">
              <h3 className="font-sf-display text-subheading font-semibold text-white/80 mb-apple-4">
                🔢 Number Vault
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-apple-4">
                <button
                  onClick={() => setGameMode('number-forward')}
                  className="group relative overflow-hidden rounded-apple-md p-[1px] bg-gradient-to-br from-alithea-success to-alithea-accent hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="relative h-full rounded-apple-md bg-alithea-dark p-apple-5 text-left">
                    <div className="text-3xl mb-apple-2">➡️</div>
                    <h4 className="font-sf-display text-heading-sm font-semibold text-white mb-apple-1">
                      Forward
                    </h4>
                    <p className="font-sf-text text-body-sm text-white/50">
                      Remember in order
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => setGameMode('number-reverse')}
                  className="group relative overflow-hidden rounded-apple-md p-[1px] bg-gradient-to-br from-alithea-warning to-alithea-secondary hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="relative h-full rounded-apple-md bg-alithea-dark p-apple-5 text-left">
                    <div className="text-3xl mb-apple-2">⬅️</div>
                    <h4 className="font-sf-display text-heading-sm font-semibold text-white mb-apple-1">
                      Reverse
                    </h4>
                    <p className="font-sf-text text-body-sm text-white/50">
                      Remember backwards
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => setGameMode('number-ascending')}
                  className="group relative overflow-hidden rounded-apple-md p-[1px] bg-gradient-to-br from-alithea-danger to-alithea-primary hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="relative h-full rounded-apple-md bg-alithea-dark p-apple-5 text-left">
                    <div className="text-3xl mb-apple-2">🔢</div>
                    <h4 className="font-sf-display text-heading-sm font-semibold text-white mb-apple-1">
                      Ascending
                    </h4>
                    <p className="font-sf-text text-body-sm text-white/50">
                      Remember sorted
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Coming Soon */}
            <div className="card-apple p-apple-6 mb-apple-8">
              <h3 className="font-sf-display text-subheading font-semibold text-white/80 mb-apple-4">
                🚀 Coming Soon
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-apple-4 text-body-sm">
                <div className="text-white/40">⭐ Chasing Stars</div>
                <div className="text-white/40">🎨 Color Cascade</div>
                <div className="text-white/40">📝 Word Chain</div>
                <div className="text-white/40">🗺️ Pathfinder</div>
                <div className="text-white/40">🥁 Rhythm Recall</div>
                <div className="text-white/40">🏆 Tournaments</div>
                <div className="text-white/40">🪙 $ALITHEA Token</div>
                <div className="text-white/40">🏅 Achievements</div>
              </div>
            </div>

            {/* Stats Preview - Apple-style */}
            {account && (
              <div className="card-apple p-apple-6 animate-slide-up">
                <h3 className="font-sf-display text-subheading font-semibold text-white/80 mb-apple-4">
                  📊 Your Stats
                </h3>
                <div className="grid grid-cols-4 gap-apple-4">
                  <div>
                    <div className="font-sf-display text-display-xxl font-bold text-alithea-primary">0</div>
                    <div className="text-caption text-white/40">Games Played</div>
                  </div>
                  <div>
                    <div className="font-sf-display text-display-xxl font-bold text-alithea-secondary">0</div>
                    <div className="text-caption text-white/40">Best Score</div>
                  </div>
                  <div>
                    <div className="font-sf-display text-display-xxl font-bold text-alithea-accent">0</div>
                    <div className="text-caption text-white/40">Win Streak</div>
                  </div>
                  <div>
                    <div className="font-sf-display text-display-xxl font-bold text-alithea-warning">0</div>
                    <div className="text-caption text-white/40">$ALITHEA</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Classic Pairs Game Board */}
        {(gameMode === '4x4' || gameMode === '6x6') && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <button
              onClick={handlePlayAgain}
              className="btn-apple-ghost mb-apple-6 flex items-center gap-2"
            >
              ← Back to Menu
            </button>
            <GameBoard
              gridSize={gameMode === '4x4' ? 4 : 6}
              onComplete={handleGameComplete}
            />
          </div>
        )}

        {/* Pattern Echo Game */}
        {(gameMode === 'pattern-3' || gameMode === 'pattern-4') && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <button
              onClick={handlePlayAgain}
              className="btn-apple-ghost mb-apple-6 flex items-center gap-2"
            >
              ← Back to Menu
            </button>
            <PatternEcho
              gridSize={gameMode === 'pattern-3' ? 3 : 4}
              onComplete={handleGameComplete}
            />
          </div>
        )}

        {/* Number Vault Game */}
        {(gameMode === 'number-forward' || gameMode === 'number-reverse' || gameMode === 'number-ascending') && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <button
              onClick={handlePlayAgain}
              className="btn-apple-ghost mb-apple-6 flex items-center gap-2"
            >
              ← Back to Menu
            </button>
            <NumberVault
              recallMode={gameMode.replace('number-', '') as 'forward' | 'reverse' | 'ascending'}
              onComplete={handleGameComplete}
            />
          </div>
        )}

        {/* Game Complete */}
        {gameMode === 'complete' && gameResult && (
          <div className="max-w-md mx-auto text-center animate-slide-up">
            <div className="card-apple p-apple-10">
              <div className="text-6xl mb-apple-4">🎉</div>
              <h2 className="font-sf-display text-display-xxl font-bold text-white mb-apple-2">
                Memory Master!
              </h2>
              <p className="font-sf-text text-subheading text-white/50 mb-apple-8">
                You completed the challenge!
              </p>
              
              <div className="grid grid-cols-3 gap-apple-4 mb-apple-8">
                <div>
                  <div className="score-value">{gameResult.score}</div>
                  <div className="text-caption text-white/40">Score</div>
                </div>
                <div>
                  <div className="font-sf-display text-display-xxl font-bold text-alithea-secondary">
                    {gameResult.moves}
                  </div>
                  <div className="text-caption text-white/40">Moves</div>
                </div>
                <div>
                  <div className="font-sf-display text-display-xxl font-bold text-alithea-accent">
                    {Math.floor(gameResult.time / 1000)}s
                  </div>
                  <div className="text-caption text-white/40">Time</div>
                </div>
              </div>

              {gameResult.moves <= gameResult.time / 1000 && (
                <div className="combo-badge mb-apple-6 mx-auto w-fit">
                  ⚡ Speed Demon! Faster than 1 pair/second!
                </div>
              )}

              <div className="flex gap-apple-4">
                <button
                  onClick={handlePlayAgain}
                  className="btn-apple-primary flex-1"
                >
                  Play Again
                </button>
                <button
                  onClick={handlePlayAgain}
                  className="btn-apple-secondary flex-1"
                >
                  Main Menu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer - Apple style */}
      <footer className="container mx-auto px-apple-6 py-apple-8 text-center">
        <p className="text-caption text-white/30">
          Built on <span className="text-alithea-accent">Sui</span> | Powered by Move
        </p>
        <p className="text-caption text-white/20 mt-apple-2">
          🧠 Train your memory. 💰 Earn rewards. 🏆 Compete globally.
        </p>
      </footer>
    </main>
  );
}
