'use client';

import { useState, useEffect, useCallback } from 'react';
import { Eye, Hand, Hourglass, XCircle } from 'lucide-react';

interface PatternEchoProps {
  gridSize: 3 | 4;
  onComplete: (score: number, rounds: number, time: number) => void;
}

export function PatternEcho({ gridSize, onComplete }: PatternEchoProps) {
  const totalCells = gridSize === 3 ? 9 : 16;
  const columns = gridSize;

  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<'watching' | 'input' | 'checking' | 'complete' | 'failed'>('watching');
  const [highlightedCell, setHighlightedCell] = useState<number | null>(null);
  const [startTime] = useState(Date.now());
  const [speed, setSpeed] = useState(800);

  // Generate random cell
  const getRandomCell = useCallback(() => {
    return Math.floor(Math.random() * totalCells);
  }, [totalCells]);

  // Start new round
  const startNewRound = useCallback(() => {
    const newCell = getRandomCell();
    const newSequence = [...sequence, newCell];
    setSequence(newSequence);
    setPlayerInput([]);
    setGameStatus('watching');

    // Play sequence
    let i = 0;
    const playSequence = () => {
      if (i < newSequence.length) {
        setHighlightedCell(newSequence[i]);
        setTimeout(() => {
          setHighlightedCell(null);
          setTimeout(() => {
            i++;
            playSequence();
          }, 100);
        }, speed);
      } else {
        setGameStatus('input');
      }
    };
    
    setTimeout(playSequence, 500);
  }, [sequence, speed, getRandomCell]);

  // Initialize first round
  useEffect(() => {
    startNewRound();
  }, []);

  // Handle cell click
  const handleCellClick = (cellIndex: number) => {
    if (gameStatus !== 'input') return;

    const newInput = [...playerInput, cellIndex];
    setPlayerInput(newInput);

    // Flash the clicked cell
    setHighlightedCell(cellIndex);
    setTimeout(() => setHighlightedCell(null), 200);

    // Check if input is complete
    if (newInput.length === sequence.length) {
      setGameStatus('checking');
      
      // Check if correct
      const isCorrect = newInput.every((val, idx) => val === sequence[idx]);
      
      if (isCorrect) {
        // Success!
        const roundScore = 100 + (currentRound * 10);
        setScore(score + roundScore);
        setCurrentRound(currentRound + 1);
        
        // Increase speed (make it harder)
        if (speed > 300) {
          setSpeed(speed - 50);
        }

        setTimeout(() => {
          startNewRound();
        }, 1000);
      } else {
        // Failed
        setGameStatus('failed');
        setTimeout(() => {
          const timeMs = Date.now() - startTime;
          onComplete(score, currentRound - 1, timeMs);
        }, 1500);
      }
    }
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
              {sequence.length}
            </div>
            <div className="text-caption text-white/40">Pattern</div>
          </div>
        </div>

        {/* Status */}
        <div className="text-center mb-apple-4">
          {gameStatus === 'watching' && (
            <div className="combo-badge animate-pulse">
              <span className="inline-flex items-center gap-2"><Eye className="w-5 h-5 text-cyan-300" /> Watch the pattern...</span>
            </div>
          )}
          {gameStatus === 'input' && (
            <div className="combo-badge">
              <span className="inline-flex items-center gap-2"><Hand className="w-5 h-5 text-white/80" /> Your turn! Repeat the pattern</span>
            </div>
          )}
          {gameStatus === 'checking' && (
            <div className="combo-badge">
              <span className="inline-flex items-center gap-2"><Hourglass className="w-5 h-5 text-amber-300" /> Checking...</span>
            </div>
          )}
          {gameStatus === 'failed' && (
            <div className="px-4 py-2 bg-alithea-danger/20 text-alithea-danger rounded-apple-full">
              <span className="inline-flex items-center gap-2"><XCircle className="w-5 h-5 text-red-400" /> Wrong pattern!</span>
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
            disabled={gameStatus !== 'input'}
            className={`
              aspect-square rounded-apple-md transition-all duration-200 border
              ${highlightedCell === index 
                ? 'bg-alithea-primary border-alithea-primary scale-95 glow-primary' 
                : 'bg-alithea-card border-white/10 hover:border-white/20 hover:bg-alithea-card/80'
              }
              ${gameStatus === 'input' ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
              ${gameStatus !== 'input' ? 'opacity-70' : ''}
            `}
          >
            <span className="text-2xl md:text-3xl font-bold text-white/20">
              {index + 1}
            </span>
          </button>
        ))}
      </div>

      {/* Progress dots */}
      <div className="flex gap-2">
        {sequence.map((_, idx) => (
          <div
            key={idx}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              idx < playerInput.length
                ? playerInput[idx] === sequence[idx]
                  ? 'bg-alithea-success'
                  : 'bg-alithea-danger'
                : 'bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
