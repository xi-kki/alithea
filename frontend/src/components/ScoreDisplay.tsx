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
    <div className="w-full max-w-lg mb-apple-6">
      {/* Main Stats - Apple-style grid */}
      <div className="grid grid-cols-3 gap-apple-4 mb-apple-5">
        {/* Moves */}
        <div className="text-center">
          <div className="font-sf-display text-display-xxl font-bold text-white">
            {moves}
          </div>
          <div className="text-caption text-white/40">Moves</div>
        </div>
        
        {/* Time */}
        <div className="text-center">
          <div className="font-sf-display text-display-xxl font-bold text-alithea-accent">
            {formatTime(elapsed)}
          </div>
          <div className="text-caption text-white/40">Time</div>
        </div>
        
        {/* Score */}
        <div className="text-center">
          <div className="score-value text-display-xxl">
            {score}
          </div>
          <div className="text-caption text-white/40">Score</div>
        </div>
      </div>

      {/* Progress Bar - Apple-style */}
      <div className="mb-apple-4">
        <div className="flex justify-between text-caption text-white/40 mb-apple-2">
          <span>{matches} / {total} matched</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Combo Indicator - Apple-style badge */}
      {combo >= 2 && (
        <div className="text-center animate-fade-in">
          <span className="combo-badge">
            🔥 {combo}x Combo!
          </span>
        </div>
      )}
    </div>
  );
}
