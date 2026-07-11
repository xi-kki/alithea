'use client';

import { useState, useCallback, useEffect } from 'react';
import { Card } from './Card';
import { ScoreDisplay } from './ScoreDisplay';

interface GameState {
  cards: { type: number; isRevealed: boolean; isMatched: boolean }[];
  moveCount: number;
  matchCount: number;
  totalPairs: number;
  combo: number;
  score: number;
  startTime: number;
  isComplete: boolean;
  firstCardIndex: number | null;
}

interface GameBoardProps {
  gridSize: 4 | 6;
  onComplete: (score: number, moves: number, time: number) => void;
}

// Emoji icons for card types
const CARD_ICONS: Record<number, string> = {
  0: '🔮', 1: '⚡', 2: '🌙', 3: '🔥',
  4: '⭐', 5: '🌊', 6: '💎', 7: '🌸',
  8: '🎭', 9: '🦋', 10: '🍀', 11: '🎯',
  12: '🎪', 13: '🎨', 14: '🎭', 15: '🌈',
  16: '🎲', 17: '🃏',
};

export function GameBoard({ gridSize, onComplete }: GameBoardProps) {
  const totalPairs = gridSize === 4 ? 8 : 18;
  const totalCards = totalPairs * 2;
  const columns = gridSize === 4 ? 4 : 6;

  const [gameState, setGameState] = useState<GameState>({
    cards: [],
    moveCount: 0,
    matchCount: 0,
    totalPairs,
    combo: 0,
    score: 1000,
    startTime: Date.now(),
    isComplete: false,
    firstCardIndex: null,
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize game
  useEffect(() => {
    const cards = [];
    for (let i = 0; i < totalPairs; i++) {
      cards.push({ type: i, isRevealed: false, isMatched: false });
      cards.push({ type: i, isRevealed: false, isMatched: false });
    }
    // Shuffle
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    setGameState(prev => ({ ...prev, cards, startTime: Date.now() }));
  }, [totalPairs]);

  const handleReveal = useCallback((index: number) => {
    if (isProcessing || gameState.isComplete) return;
    if (gameState.cards[index].isRevealed || gameState.cards[index].isMatched) return;

    setGameState(prev => {
      const newCards = [...prev.cards];
      newCards[index] = { ...newCards[index], isRevealed: true };

      if (prev.firstCardIndex === null) {
        // First card
        return { ...prev, cards: newCards, firstCardIndex: index };
      } else {
        // Second card
        const firstCard = newCards[prev.firstCardIndex];
        const secondCard = newCards[index];

        if (prev.firstCardIndex === index) {
          // Same card - hide it
          newCards[index] = { ...newCards[index], isRevealed: false };
          return { ...prev, cards: newCards, firstCardIndex: null };
        }

        const newMoveCount = prev.moveCount + 1;

        if (firstCard.type === secondCard.type) {
          // Match!
          newCards[prev.firstCardIndex] = { ...newCards[prev.firstCardIndex], isMatched: true, isRevealed: false };
          newCards[index] = { ...newCards[index], isMatched: true, isRevealed: false };

          const newMatchCount = prev.matchCount + 1;
          const newCombo = prev.combo + 1;
          const comboBonus = newCombo >= 3 ? 200 : newCombo >= 2 ? 100 : 0;
          const newScore = prev.score + 50 + comboBonus;

          const isComplete = newMatchCount === prev.totalPairs;

          setTimeout(() => {
            if (isComplete) {
              const timeMs = Date.now() - prev.startTime;
              onComplete(newScore, newMoveCount, timeMs);
            }
          }, 500);

          return {
            ...prev,
            cards: newCards,
            firstCardIndex: null,
            moveCount: newMoveCount,
            matchCount: newMatchCount,
            combo: newCombo,
            score: newScore,
            isComplete,
          };
        } else {
          // No match
          setTimeout(() => {
            setGameState(prev2 => {
              const resetCards = [...prev2.cards];
              resetCards[prev.firstCardIndex] = { ...resetCards[prev.firstCardIndex], isRevealed: false };
              resetCards[index] = { ...resetCards[index], isRevealed: false };
              return { ...prev2, cards: resetCards, firstCardIndex: null, combo: 0 };
            });
            setIsProcessing(false);
          }, 1000);

          setIsProcessing(true);
          return {
            ...prev,
            cards: newCards,
            firstCardIndex: null,
            moveCount: newMoveCount,
            combo: 0,
          };
        }
      }
    });
  }, [gameState, isProcessing, onComplete]);

  return (
    <div className="flex flex-col items-center gap-6">
      <ScoreDisplay
        moves={gameState.moveCount}
        matches={gameState.matchCount}
        total={gameState.totalPairs}
        combo={gameState.combo}
        score={gameState.score}
        startTime={gameState.startTime}
      />

      <div
        className={`grid gap-3 md:gap-4 w-full max-w-lg`}
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {gameState.cards.map((card, index) => (
          <Card
            key={index}
            index={index}
            cardType={card.type}
            isRevealed={card.isRevealed}
            isMatched={card.isMatched}
            onReveal={handleReveal}
            disabled={isProcessing || gameState.isComplete}
          />
        ))}
      </div>

      {gameState.isComplete && (
        <div className="text-center animate-fade-in">
          <h2 className="text-3xl font-bold text-green-400 mb-2">🎉 Complete!</h2>
          <p className="text-gray-400">Calculating your score...</p>
        </div>
      )}
    </div>
  );
}
