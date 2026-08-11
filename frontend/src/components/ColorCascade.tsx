'use client';

import { useState, useEffect, useCallback } from 'react';
import { Eye, Hourglass, Palette, XCircle } from 'lucide-react';

interface ColorCascadeProps {
  difficulty: 'easy' | 'medium' | 'hard';
  onComplete: (score: number, rounds: number, time: number) => void;
}

const COLORS = [
  { name: 'red', bg: 'bg-red-500', glow: 'shadow-red-500/50', hex: '#ef4444' },
  { name: 'blue', bg: 'bg-blue-500', glow: 'shadow-blue-500/50', hex: '#3b82f6' },
  { name: 'green', bg: 'bg-green-500', glow: 'shadow-green-500/50', hex: '#22c55e' },
  { name: 'yellow', bg: 'bg-yellow-500', glow: 'shadow-yellow-500/50', hex: '#eab308' },
  { name: 'purple', bg: 'bg-purple-500', glow: 'shadow-purple-500/50', hex: '#a855f7' },
  { name: 'pink', bg: 'bg-pink-500', glow: 'shadow-pink-500/50', hex: '#ec4899' },
];

const DIFFICULTY_CONFIG = {
  easy: { colorCount: 4, startSpeed: 800, speedIncrease: 30 },
  medium: { colorCount: 5, startSpeed: 600, speedIncrease: 25 },
  hard: { colorCount: 6, startSpeed: 400, speedIncrease: 20 },
};

export function ColorCascade({ difficulty, onComplete }: ColorCascadeProps) {
  const config = DIFFICULTY_CONFIG[difficulty];
  const activeColors = COLORS.slice(0, config.colorCount);

  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<'watching' | 'input' | 'checking' | 'complete' | 'failed'>('watching');
  const [highlightedColor, setHighlightedColor] = useState<number | null>(null);
  const [startTime] = useState(Date.now());
  const [speed, setSpeed] = useState(config.startSpeed);
  const [lastClickedColor, setLastClickedColor] = useState<number | null>(null);

  // Generate random color
  const getRandomColor = useCallback(() => {
    return Math.floor(Math.random() * config.colorCount);
  }, [config.colorCount]);

  // Start new round
  const startNewRound = useCallback(() => {
    const newColor = getRandomColor();
    const newSequence = [...sequence, newColor];
    setSequence(newSequence);
    setPlayerInput([]);
    setGameStatus('watching');

    // Play sequence with colors
    let i = 0;
    const playSequence = () => {
      if (i < newSequence.length) {
        setHighlightedColor(newSequence[i]);
        setTimeout(() => {
          setHighlightedColor(null);
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
  }, [sequence, speed, getRandomColor]);

  useEffect(() => {
    startNewRound();
  }, []);

  // Handle color click
  const handleColorClick = (colorIndex: number) => {
    if (gameStatus !== 'input') return;

    setLastClickedColor(colorIndex);
    setTimeout(() => setLastClickedColor(null), 200);

    const newInput = [...playerInput, colorIndex];
    setPlayerInput(newInput);

    // Check if input is complete
    if (newInput.length === sequence.length) {
      setGameStatus('checking');

      const isCorrect = newInput.every((val, idx) => val === sequence[idx]);

      if (isCorrect) {
        const roundScore = 100 + (currentRound * 15);
        setScore(score + roundScore);
        setCurrentRound(currentRound + 1);

        if (speed > 200) {
          setSpeed(speed - config.speedIncrease);
        }

        setTimeout(() => {
          startNewRound();
        }, 1000);
      } else {
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
            <div className="text-caption text-white/40">Length</div>
          </div>
        </div>

        {/* Difficulty Badge */}
        <div className="text-center mb-apple-4">
          <span className="px-3 py-1 bg-alithea-accent/20 text-alithea-accent text-caption rounded-apple-full capitalize">
            {difficulty}
          </span>
        </div>

        {/* Status */}
        <div className="text-center mb-apple-4">
          {gameStatus === 'watching' && (
            <div className="combo-badge animate-pulse">
              <span className="inline-flex items-center gap-2"><Eye className="w-5 h-5 text-cyan-300" /> Watch the colors...</span>
            </div>
          )}
          {gameStatus === 'input' && (
            <div className="combo-badge">
              <span className="inline-flex items-center gap-2"><Palette className="w-5 h-5 text-pink-300" /> Repeat the pattern!</span>
            </div>
          )}
          {gameStatus === 'checking' && (
            <div className="combo-badge">
              <span className="inline-flex items-center gap-2"><Hourglass className="w-5 h-5 text-amber-300" /> Checking...</span>
            </div>
          )}
          {gameStatus === 'failed' && (
            <div className="px-4 py-2 bg-alithea-danger/20 text-alithea-danger rounded-apple-full">
              <span className="inline-flex items-center gap-2"><XCircle className="w-5 h-5 text-red-400" /> Wrong color!</span>
            </div>
          )}
        </div>
      </div>

      {/* Color Buttons */}
      <div className="w-full max-w-lg card-apple p-apple-6">
        <div className="grid grid-cols-3 gap-4">
          {activeColors.map((color, index) => (
            <button
              key={color.name}
              onClick={() => handleColorClick(index)}
              disabled={gameStatus !== 'input'}
              className={`
                aspect-square rounded-apple-lg transition-all duration-200 border-2
                ${highlightedColor === index || lastClickedColor === index
                  ? `shadow-lg ${color.glow} scale-95 border-white`
                  : `border-transparent hover:scale-105`
                }
                ${gameStatus !== 'input' ? 'cursor-default opacity-70' : 'cursor-pointer active:scale-95'}
              `}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </div>

      {/* Sequence Preview */}
      <div className="flex gap-2">
        {sequence.map((colorIdx, idx) => (
          <div
            key={idx}
            className={`w-4 h-4 rounded-full transition-all duration-200 ${
              idx < playerInput.length
                ? playerInput[idx] === sequence[idx]
                  ? 'ring-2 ring-alithea-success ring-offset-2 ring-offset-alithea-dark'
                  : 'ring-2 ring-alithea-danger ring-offset-2 ring-offset-alithea-dark'
                : ''
            }`}
            style={{ backgroundColor: COLORS[colorIdx].hex }}
          />
        ))}
      </div>
    </div>
  );
}
