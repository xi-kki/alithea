'use client';

import { useState, useEffect, useCallback } from 'react';

interface ChasingStarsProps {
  gridSize: 3 | 4 | 5;
  onComplete: (score: number, rounds: number, time: number) => void;
}

export function ChasingStars({ gridSize, onComplete }: ChasingStarsProps) {
  const totalCells = gridSize * gridSize;
  const columns = gridSize;

  const [starPositions, setStarPositions] = useState<number[]>([]);
  const [playerClicked, setPlayerClicked] = useState<number[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<'showing' | 'input' | 'checking' | 'complete' | 'failed'>('showing');
  const [showTimer, setShowTimer] = useState(3);
  const [startTime] = useState(Date.now());
  const [matchedStars, setMatchedStars] = useState<number[]>([]);
  const [wrongCell, setWrongCell] = useState<number | null>(null);

  // Generate random star positions
  const generateStars = useCallback((count: number) => {
    const positions = new Set<number>();
    while (positions.size < count) {
      positions.add(Math.floor(Math.random() * totalCells));
    }
    return Array.from(positions);
  }, [totalCells]);

  // Start new round
  const startNewRound = useCallback(() => {
    const starsNeeded = Math.min(2 + currentRound, Math.floor(totalCells * 0.6));
    const newStars = generateStars(starsNeeded);
    setStarPositions(newStars);
    setPlayerClicked([]);
    setMatchedStars([]);
    setWrongCell(null);
    setGameStatus('showing');
    setShowTimer(3);

    const timer = setInterval(() => {
      setShowTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameStatus('input');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentRound, totalCells, generateStars]);

  useEffect(() => {
    startNewRound();
  }, []);

  // Handle cell click
  const handleCellClick = (cellIndex: number) => {
    if (gameStatus !== 'input') return;
    if (playerClicked.includes(cellIndex)) return;

    const newClicked = [...playerClicked, cellIndex];
    setPlayerClicked(newClicked);

    if (starPositions.includes(cellIndex)) {
      // Correct star found!
      const newMatched = [...matchedStars, cellIndex];
      setMatchedStars(newMatched);

      // Check if all stars found
      if (newMatched.length === starPositions.length) {
        setGameStatus('checking');
        const roundScore = 100 + (currentRound * 20) + (starPositions.length * 10);
        setScore(score + roundScore);
        setCurrentRound(currentRound + 1);

        setTimeout(() => {
          startNewRound();
        }, 1000);
      }
    } else {
      // Wrong cell - game over
      setWrongCell(cellIndex);
      setGameStatus('failed');
      setTimeout(() => {
        const timeMs = Date.now() - startTime;
        onComplete(score, currentRound - 1, timeMs);
      }, 1500);
    }
  };

  // Reveal stars for showing phase
  const isStarVisible = (index: number) => {
    if (gameStatus === 'showing') return starPositions.includes(index);
    return matchedStars.includes(index);
  };

  return (
    <div className="flex flex-col items-center gap-apple-6">
      {/* Score Display */}
      <div className="w-full max-w-lg">
        <div className="grid grid-cols-3 gap-apple-4 mb-apple-4">
          <div className="text-center">
            <div className="font-sf-display text-display-xxl font-bold text-white">
              {currentRound}
            </div>
            <div className="text-caption text-white/40">Round</div>
          </div>
          <div className="text-center">
            <div className="score-value text-display-xxl">
              {score}
            </div>
            <div className="text-caption text-white/40">Score</div>
          </div>
          <div className="text-center">
            <div className="font-sf-display text-display-xxl font-bold text-alithea-accent">
              {matchedStars.length}/{starPositions.length}
            </div>
            <div className="text-caption text-white/40">Stars</div>
          </div>
        </div>

        {/* Status */}
        <div className="text-center mb-apple-4">
          {gameStatus === 'showing' && (
            <div className="combo-badge animate-pulse">
              ⭐ Memorize star positions! {showTimer}s
            </div>
          )}
          {gameStatus === 'input' && (
            <div className="combo-badge">
              ⭐ Find all the stars!
            </div>
          )}
          {gameStatus === 'checking' && (
            <div className="combo-badge">
              ✅ All stars found!
            </div>
          )}
          {gameStatus === 'failed' && (
            <div className="px-4 py-2 bg-alithea-danger/20 text-alithea-danger rounded-apple-full">
              ❌ No star there!
            </div>
          )}
        </div>
      </div>

      {/* Game Grid */}
      <div
        className="grid gap-3 md:gap-4 w-full max-w-lg p-apple-4 card-apple"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {Array.from({ length: totalCells }).map((_, index) => (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
            disabled={gameStatus !== 'input' || playerClicked.includes(index)}
            className={`
              aspect-square rounded-apple-md transition-all duration-200 border flex items-center justify-center
              ${isStarVisible(index)
                ? 'bg-alithea-warning/30 border-alithea-warning scale-95 glow-warning'
                : wrongCell === index
                  ? 'bg-alithea-danger/30 border-alithea-danger'
                  : matchedStars.includes(index)
                    ? 'bg-alithea-success/20 border-alithea-success/50'
                    : 'bg-alithea-card border-white/10 hover:border-white/20 hover:bg-alithea-card/80'
              }
              ${gameStatus === 'input' && !playerClicked.includes(index) ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
            `}
          >
            {isStarVisible(index) && (
              <span className="text-2xl md:text-3xl">⭐</span>
            )}
            {wrongCell === index && (
              <span className="text-2xl md:text-3xl">❌</span>
            )}
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="flex gap-2">
        {starPositions.map((_, idx) => (
          <div
            key={idx}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              idx < matchedStars.length ? 'bg-alithea-warning' : 'bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
