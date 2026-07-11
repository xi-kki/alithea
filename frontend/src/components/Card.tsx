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
  14: '🌈',
  15: '🎲',
  16: '🃏',
  17: '✨',
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

  // Apple-inspired card states
  const getCardStyles = () => {
    if (isMatched) {
      return 'bg-alithea-success/20 border-alithea-success/50 glow-success';
    }
    if (isRevealed) {
      return 'bg-alithea-primary/20 border-alithea-primary/50 glow-primary';
    }
    return 'bg-alithea-card border-white/10 hover:border-white/20 hover:bg-alithea-card/80';
  };

  return (
    <div
      className={`card-container aspect-square cursor-pointer ${
        disabled ? 'cursor-not-allowed opacity-70' : ''
      }`}
      onClick={handleClick}
    >
      <div
        className={`card-inner w-full h-full relative ${
          isRevealed || isMatched ? 'flipped' : ''
        } ${isAnimating ? 'animate-match' : ''}`}
      >
        {/* Card Back (Hidden state) */}
        <div
          className={`card-front absolute inset-0 rounded-apple-md ${getCardStyles()} 
            flex items-center justify-center transition-all duration-200 border
            ${!isRevealed && !isMatched && !disabled ? 'hover:scale-105 cursor-pointer' : ''}
            ${isMatched ? 'ring-2 ring-alithea-success/30' : ''}`}
        >
          <span className="text-3xl md:text-4xl font-bold text-white/10">?</span>
        </div>

        {/* Card Front (Revealed state) */}
        <div
          className={`card-back absolute inset-0 rounded-apple-md 
            ${isMatched 
              ? 'bg-gradient-to-br from-alithea-success/30 to-alithea-success/10 border-alithea-success/50' 
              : 'bg-gradient-to-br from-alithea-primary/30 to-alithea-secondary/30 border-alithea-primary/50'
            }
            flex items-center justify-center border
            ${isMatched ? 'ring-2 ring-alithea-success/30' : ''}`}
        >
          <span className="text-4xl md:text-5xl drop-shadow-lg">
            {CARD_ICONS[cardType] || '❓'}
          </span>
        </div>
      </div>
    </div>
  );
}
