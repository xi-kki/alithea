'use client';

import { useState, useEffect } from 'react';

interface CardProps {
  index: number;
  cardType: number;
  isRevealed: boolean;
  isMatched: boolean;
  onReveal: (index: number) => void;
  disabled: boolean;
}

// Emoji icons for card types
const CARD_ICONS: Record<number, string> = {
  0: '🔮',
  1: '⚡',
  2: '🌙',
  3: '🔥',
  4: '⭐',
  5: '🌊',
  6: '💎',
  7: '🌸',
  8: '🎭',
  9: '🦋',
  10: '🍀',
  11: '🎯',
  12: '🎪',
  13: '🎨',
  14: '🎭',
  15: '🌈',
  16: '🎲',
  17: '🃏',
};

export function Card({ index, cardType, isRevealed, isMatched, onReveal, disabled }: CardProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isRevealed || isMatched) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isRevealed, isMatched]);

  const handleClick = () => {
    if (!disabled && !isRevealed && !isMatched) {
      onReveal(index);
    }
  };

  const getCardColor = () => {
    if (isMatched) return 'from-green-500 to-emerald-600';
    if (isRevealed) return 'from-purple-500 to-pink-500';
    return 'from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700';
  };

  return (
    <div
      className={`card-container aspect-square cursor-pointer ${
        disabled ? 'cursor-not-allowed' : ''
      }`}
      onClick={handleClick}
    >
      <div
        className={`card-inner w-full h-full relative ${
          isRevealed || isMatched ? 'flipped' : ''
        } ${isAnimating ? 'animate-match' : ''}`}
      >
        {/* Card Back */}
        <div
          className={`card-front absolute inset-0 rounded-xl bg-gradient-to-br ${getCardColor()} 
            flex items-center justify-center transition-all duration-300
            ${!isRevealed && !isMatched ? 'hover:scale-105 hover:glow-primary' : ''}
            ${isMatched ? 'ring-2 ring-green-400 ring-opacity-50' : ''}
            border border-white/10`}
        >
          <span className="text-3xl md:text-4xl font-bold text-white/20">?</span>
        </div>

        {/* Card Front */}
        <div
          className={`card-back absolute inset-0 rounded-xl bg-gradient-to-br ${getCardColor()} 
            flex items-center justify-center border border-white/20
            ${isMatched ? 'ring-2 ring-green-400 ring-opacity-50' : ''}`}
        >
          <span className="text-4xl md:text-5xl">{CARD_ICONS[cardType] || '❓'}</span>
        </div>
      </div>
    </div>
  );
}
