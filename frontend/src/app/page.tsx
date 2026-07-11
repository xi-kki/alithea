'use client';

import { useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { WalletButton } from '@/components/WalletButton';
import { GameBoard } from '@/components/GameBoard';

type GameMode = 'menu' | '4x4' | '6x6' | 'complete';

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
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-alithea-primary via-alithea-secondary to-alithea-accent bg-clip-text text-transparent">
              🧠 Alithea
            </h1>
            <p className="text-gray-400 text-sm">Will you remember?</p>
          </div>
          <WalletButton />
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {gameMode === 'menu' && (
          <div className="max-w-2xl mx-auto text-center">
            {/* Hero */}
            <div className="mb-12">
              <h2 className="text-5xl md:text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  Memory Training
                </span>
                <br />
                <span className="text-white">Arena</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-lg mx-auto">
                Train your memory. Prove your skill. Earn your reward.
              </p>
            </div>

            {/* Game Modes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* Classic Pairs 4x4 */}
              <button
                onClick={() => setGameMode('4x4')}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 p-[2px] hover:scale-105 transition-all duration-300"
              >
                <div className="relative h-full rounded-2xl bg-alithea-dark p-6 text-left">
                  <div className="text-4xl mb-3">👁️</div>
                  <h3 className="text-xl font-bold text-white mb-2">Classic Pairs</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Match 8 pairs of cards. Remember their positions!
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded">4×4 Grid</span>
                    <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded">Beginner</span>
                  </div>
                </div>
              </button>

              {/* Classic Pairs 6x6 */}
              <button
                onClick={() => setGameMode('6x6')}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-600 to-cyan-600 p-[2px] hover:scale-105 transition-all duration-300"
              >
                <div className="relative h-full rounded-2xl bg-alithea-dark p-6 text-left">
                  <div className="text-4xl mb-3">🧠</div>
                  <h3 className="text-xl font-bold text-white mb-2">Challenge Mode</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Match 18 pairs. Can you handle the pressure?
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-2 py-1 bg-pink-500/20 text-pink-300 rounded">6×6 Grid</span>
                    <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded">Hard</span>
                  </div>
                </div>
              </button>
            </div>

            {/* Coming Soon */}
            <div className="bg-alithea-dark/50 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-gray-300 mb-4">🚀 Coming Soon</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-gray-500">🔵 Pattern Echo</div>
                <div className="text-gray-500">🔢 Number Vault</div>
                <div className="text-gray-500">⭐ Chasing Stars</div>
                <div className="text-gray-500">🎨 Color Cascade</div>
                <div className="text-gray-500">📝 Word Chain</div>
                <div className="text-gray-500">🗺️ Pathfinder</div>
                <div className="text-gray-500">🥁 Rhythm Recall</div>
                <div className="text-gray-500">🏆 Tournaments</div>
              </div>
            </div>

            {/* Stats Preview */}
            {account && (
              <div className="mt-8 bg-alithea-dark/50 rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-gray-300 mb-4">📊 Your Stats</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-purple-400">0</div>
                    <div className="text-xs text-gray-500">Games Played</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-pink-400">0</div>
                    <div className="text-xs text-gray-500">Best Score</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-cyan-400">0</div>
                    <div className="text-xs text-gray-500">Win Streak</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-400">0</div>
                    <div className="text-xs text-gray-500">$ALITHEA</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Game Board */}
        {(gameMode === '4x4' || gameMode === '6x6') && (
          <div className="max-w-2xl mx-auto">
            <button
              onClick={handlePlayAgain}
              className="mb-6 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              ← Back to Menu
            </button>
            <GameBoard
              gridSize={gameMode === '4x4' ? 4 : 6}
              onComplete={handleGameComplete}
            />
          </div>
        )}

        {/* Game Complete */}
        {gameMode === 'complete' && gameResult && (
          <div className="max-w-md mx-auto text-center">
            <div className="bg-alithea-dark/80 rounded-2xl p-8 border border-white/10">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-white mb-2">Memory Master!</h2>
              <p className="text-gray-400 mb-6">You completed the challenge!</p>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div>
                  <div className="text-3xl font-bold text-purple-400">{gameResult.score}</div>
                  <div className="text-sm text-gray-500">Score</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-pink-400">{gameResult.moves}</div>
                  <div className="text-sm text-gray-500">Moves</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cyan-400">
                    {Math.floor(gameResult.time / 1000)}s
                  </div>
                  <div className="text-sm text-gray-500">Time</div>
                </div>
              </div>

              {gameResult.moves <= gameResult.time / 1000 && (
                <div className="bg-yellow-500/10 text-yellow-400 rounded-lg p-3 mb-6">
                  ⚡ Speed Demon! You matched faster than 1 pair per second!
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handlePlayAgain}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-xl hover:scale-105 transition-transform"
                >
                  Play Again
                </button>
                <button
                  onClick={handlePlayAgain}
                  className="flex-1 bg-gray-700 text-white font-bold py-3 px-6 rounded-xl hover:bg-gray-600 transition-colors"
                >
                  Main Menu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-500 text-sm">
        <p>Built on <span className="text-cyan-400">Sui</span> | Powered by Move</p>
        <p className="mt-2">🧠 Train your memory. 💰 Earn rewards. 🏆 Compete globally.</p>
      </footer>
    </main>
  );
}
