'use client';

import { useState, useEffect, useCallback } from 'react';

interface WordChainProps {
  difficulty: 'easy' | 'medium' | 'hard';
  onComplete: (score: number, rounds: number, time: number) => void;
}

const WORD_POOLS = {
  easy: [
    'cat', 'dog', 'sun', 'moon', 'star', 'tree', 'fish', 'bird',
    'book', 'door', 'hand', 'face', 'blue', 'red', 'big', 'hot',
    'run', 'jump', 'sing', 'walk', 'play', 'eat', 'drink', 'sleep',
  ],
  medium: [
    'ocean', 'mountain', 'forest', 'river', 'desert', 'island',
    'thunder', 'rainbow', 'crystal', 'phantom', 'galaxy', 'comet',
    'castle', 'dragon', 'wizard', 'knight', 'shield', 'sword',
    'puzzle', 'mystery', 'secret', 'hidden', 'ancient', 'magic',
  ],
  hard: [
    'algorithm', 'beautiful', 'dangerous', 'expensive', 'important',
    'mysterious', 'phenomenon', 'technology', 'universe', 'wonderful',
    'adventure', 'chocolate', 'dinosaur', 'elephant', 'fantastic',
    'hamburger', 'invisible', 'jellyfish', 'knowledge', 'landscape',
  ],
};

const DIFFICULTY_CONFIG = {
  easy: { startWords: 3, wordsPerRound: 1, showTime: 3000 },
  medium: { startWords: 4, wordsPerRound: 1, showTime: 2500 },
  hard: { startWords: 5, wordsPerRound: 1, showTime: 2000 },
};

export function WordChain({ difficulty, onComplete }: WordChainProps) {
  const config = DIFFICULTY_CONFIG[difficulty];
  const wordPool = WORD_POOLS[difficulty];

  const [words, setWords] = useState<string[]>([]);
  const [playerInput, setPlayerInput] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentRound, setCurrentRound] = useState(1);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<'showing' | 'input' | 'checking' | 'complete' | 'failed'>('showing');
  const [showTimer, setShowTimer] = useState(config.showTime / 1000);
  const [startTime] = useState(Date.now());
  const [wrongWord, setWrongWord] = useState<string | null>(null);

  // Generate random words
  const generateWords = useCallback((count: number) => {
    const shuffled = [...wordPool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }, [wordPool]);

  // Start new round
  const startNewRound = useCallback(() => {
    const wordsNeeded = config.startWords + (currentRound - 1) * config.wordsPerRound;
    const newWords = generateWords(Math.min(wordsNeeded, wordPool.length));
    setWords(newWords);
    setPlayerInput([]);
    setCurrentInput('');
    setWrongWord(null);
    setGameStatus('showing');
    setShowTimer(config.showTime / 1000);

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
  }, [currentRound, config, wordPool.length, generateWords]);

  useEffect(() => {
    startNewRound();
  }, []);

  // Handle word input
  const handleWordSubmit = () => {
    if (gameStatus !== 'input' || !currentInput.trim()) return;

    const trimmedInput = currentInput.trim().toLowerCase();
    const newInput = [...playerInput, trimmedInput];
    setPlayerInput(newInput);
    setCurrentInput('');

    const expectedWord = words[newInput.length - 1].toLowerCase();

    if (trimmedInput === expectedWord) {
      // Check if all words entered
      if (newInput.length === words.length) {
        setGameStatus('checking');
        const roundScore = 50 + (words.length * 15);
        setScore(score + roundScore);
        setCurrentRound(currentRound + 1);

        setTimeout(() => {
          startNewRound();
        }, 1000);
      }
    } else {
      // Wrong word
      setWrongWord(trimmedInput);
      setGameStatus('failed');
      setTimeout(() => {
        const timeMs = Date.now() - startTime;
        onComplete(score, currentRound - 1, timeMs);
      }, 1500);
    }
  };

  // Handle keyboard input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleWordSubmit();
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
              {playerInput.length}/{words.length}
            </div>
            <div className="text-caption text-white/40">Words</div>
          </div>
        </div>

        {/* Difficulty Badge */}
        <div className="text-center mb-apple-4">
          <span className="px-3 py-1 bg-alithea-secondary/20 text-alithea-secondary text-caption rounded-apple-full capitalize">
            {difficulty}
          </span>
        </div>

        {/* Status */}
        <div className="text-center mb-apple-4">
          {gameStatus === 'showing' && (
            <div className="combo-badge animate-pulse">
              📝 Memorize the words! {showTimer}s
            </div>
          )}
          {gameStatus === 'input' && (
            <div className="combo-badge">
              ✍️ Type each word and press Enter
            </div>
          )}
          {gameStatus === 'checking' && (
            <div className="combo-badge">
              ⏳ Checking...
            </div>
          )}
          {gameStatus === 'failed' && (
            <div className="px-4 py-2 bg-alithea-danger/20 text-alithea-danger rounded-apple-full">
              ❌ Wrong word! Expected: {words[playerInput.length]}
            </div>
          )}
        </div>
      </div>

      {/* Word Display / Input */}
      <div className="w-full max-w-lg card-apple p-apple-6">
        {gameStatus === 'showing' ? (
          // Show the words
          <div className="space-y-3">
            {words.map((word, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 bg-alithea-primary/10 border border-alithea-primary/30 rounded-apple-md"
              >
                <span className="w-8 h-8 flex items-center justify-center bg-alithea-primary/20 rounded-full text-alithea-primary font-bold text-sm">
                  {idx + 1}
                </span>
                <span className="font-sf-display text-heading-sm font-semibold text-white capitalize">
                  {word}
                </span>
              </div>
            ))}
          </div>
        ) : (
          // Input area
          <div>
            {/* Progress */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {playerInput.map((word, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-alithea-success/20 text-alithea-success rounded-apple-full text-body-sm capitalize"
                >
                  {word}
                </span>
              ))}
            </div>

            {/* Current Word Number */}
            <div className="text-center mb-4">
              <span className="text-white/50 text-body-sm">
                Word {playerInput.length + 1} of {words.length}
              </span>
            </div>

            {/* Input Field */}
            <div className="flex gap-2">
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={gameStatus !== 'input'}
                placeholder="Type the word..."
                className="flex-1 h-12 px-4 bg-alithea-card border border-white/20 rounded-apple-md text-white font-sf-text text-body placeholder-white/30 focus:outline-none focus:border-alithea-primary transition-colors"
                autoFocus
              />
              <button
                onClick={handleWordSubmit}
                disabled={gameStatus !== 'input' || !currentInput.trim()}
                className="h-12 px-6 bg-alithea-primary rounded-apple-md text-white font-semibold hover:bg-alithea-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                Enter
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Word Count Progress */}
      <div className="flex gap-2">
        {words.map((_, idx) => (
          <div
            key={idx}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              idx < playerInput.length ? 'bg-alithea-success' : 'bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
