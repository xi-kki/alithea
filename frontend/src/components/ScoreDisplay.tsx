'use client';

import { useState, useEffect } from 'react';

interface ScoreDisplayProps {
  moves: number;
  matches: number;
  total: number;
  combo: number;
  score: number;
  startTime: number;
}

export function ScoreDisplay({ moves, matches, total, combo, score, startTime }: ScoreDisplayProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = total > 0 ? (matches / total) * 100 : 0;

  return (
    <div className="w-full max-w-lg">
      {/* Main Stats */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{moves}</div>
          <div className="text-xs text-gray-400">Moves</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">{formatTime(elapsed)}</div>
          <div className="text-xs text-gray-400">Time</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-pink-400">{score}</div>
          <div className="text-xs text-gray-400">Score</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>{matches} / {total} matched</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Combo Indicator */}
      {combo >= 2 && (
        <div className="text-center animate-pulse">
          <span className="text-lg font-bold text-yellow-400">
            🔥 {combo}x Combo!
          </span>
        </div>
      )}
    </div>
  );
}
