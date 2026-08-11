'use client';

import { useState, useEffect, useCallback } from 'react';
import { Delete, Eye, Hand, Hourglass, XCircle } from 'lucide-react';

interface NumberVaultProps {
  recallMode: 'forward' | 'reverse' | 'ascending';
  onComplete: (score: number, rounds: number, time: number) => void;
}

export function NumberVault({ recallMode, onComplete }: NumberVaultProps) {
  const [digits, setDigits] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<string>('');
  const [currentRound, setCurrentRound] = useState(1);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<'showing' | 'input' | 'checking' | 'complete' | 'failed'>('showing');
  const [showTimer, setShowTimer] = useState(3);
  const [startTime] = useState(Date.now());

  // Generate random digits
  const generateDigits = useCallback((count: number) => {
    const newDigits = [];
    for (let i = 0; i < count; i++) {
      newDigits.push(Math.floor(Math.random() * 10));
    }
    return newDigits;
  }, []);

  // Start new round
  const startNewRound = useCallback(() => {
    const newDigits = generateDigits(3 + currentRound);
    setDigits(newDigits);
    setPlayerInput('');
    setGameStatus('showing');
    setShowTimer(3);

    // Countdown
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
  }, [currentRound, generateDigits]);

  // Initialize first round
  useEffect(() => {
    startNewRound();
  }, []);

  // Process digits based on recall mode
  const getDisplayDigits = () => {
    if (recallMode === 'reverse') {
      return [...digits].reverse();
    } else if (recallMode === 'ascending') {
      return [...digits].sort((a, b) => a - b);
    }
    return digits;
  };

  // Handle input submission
  const handleSubmit = () => {
    if (gameStatus !== 'input' || !playerInput) return;

    setGameStatus('checking');
    
    const expected = getDisplayDigits();
    const inputArray = playerInput.split('').map(Number);
    
    const isCorrect = expected.length === inputArray.length && 
      expected.every((val, idx) => val === inputArray[idx]);

    if (isCorrect) {
      // Success!
      const roundScore = 50 + (digits.length * 10);
      setScore(score + roundScore);
      setCurrentRound(currentRound + 1);

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
  };

  // Handle number button click
  const handleNumberClick = (num: number) => {
    if (gameStatus !== 'input') return;
    setPlayerInput(prev => prev + num.toString());
  };

  // Handle backspace
  const handleBackspace = () => {
    if (gameStatus !== 'input') return;
    setPlayerInput(prev => prev.slice(0, -1));
  };

  // Handle clear
  const handleClear = () => {
    if (gameStatus !== 'input') return;
    setPlayerInput('');
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
              {digits.length}
            </div>
            <div className="text-caption text-white/40">Digits</div>
          </div>
        </div>

        {/* Mode Badge */}
        <div className="text-center mb-apple-4">
          <span className="px-3 py-1 bg-alithea-primary/20 text-alithea-primary text-caption rounded-apple-full capitalize">
            {recallMode} Mode
          </span>
        </div>

        {/* Status */}
        <div className="text-center mb-apple-4">
          {gameStatus === 'showing' && (
            <div className="combo-badge animate-pulse">
              <span className="inline-flex items-center gap-2"><Eye className="w-5 h-5 text-cyan-300" /> Memorize: {showTimer}s</span>
            </div>
          )}
          {gameStatus === 'input' && (
            <div className="combo-badge">
              <span className="inline-flex items-center gap-2"><Hand className="w-5 h-5 text-white/80" /> Type the numbers!</span>
            </div>
          )}
          {gameStatus === 'checking' && (
            <div className="combo-badge">
              <span className="inline-flex items-center gap-2"><Hourglass className="w-5 h-5 text-amber-300" /> Checking...</span>
            </div>
          )}
          {gameStatus === 'failed' && (
            <div className="px-4 py-2 bg-alithea-danger/20 text-alithea-danger rounded-apple-full">
              <span className="inline-flex items-center gap-2"><XCircle className="w-5 h-5 text-red-400" /> Wrong sequence!</span>
            </div>
          )}
        </div>
      </div>

      {/* Number Display / Input */}
      <div className="w-full max-w-lg card-apple p-apple-6">
        {gameStatus === 'showing' ? (
          // Show the numbers
          <div className="text-center">
            <div className="flex justify-center gap-3 flex-wrap">
              {getDisplayDigits().map((digit, idx) => (
                <div
                  key={idx}
                  className="w-14 h-14 flex items-center justify-center bg-alithea-primary/20 border border-alithea-primary/50 rounded-apple-md"
                >
                  <span className="font-sf-display text-heading-lg font-bold text-alithea-primary">
                    {digit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Input area
          <div>
            {/* Current Input */}
            <div className="text-center mb-apple-4">
              <div className="min-h-[60px] flex items-center justify-center">
                {playerInput ? (
                  <div className="flex gap-2">
                    {playerInput.split('').map((digit, idx) => (
                      <div
                        key={idx}
                        className="w-12 h-12 flex items-center justify-center bg-alithea-card border border-white/20 rounded-apple-md"
                      >
                        <span className="font-sf-display text-heading-sm font-bold text-white">
                          {digit}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-white/30 text-body-sm">Tap numbers below...</span>
                )}
              </div>
            </div>

            {/* Number Pad */}
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                <button
                  key={num}
                  onClick={() => handleNumberClick(num)}
                  className="h-12 rounded-apple-md bg-alithea-card border border-white/10 hover:bg-alithea-primary/20 hover:border-alithea-primary/50 transition-all duration-200 active:scale-95"
                >
                  <span className="font-sf-display text-heading-sm font-bold text-white">
                    {num}
                  </span>
                </button>
              ))}
              <button
                onClick={handleBackspace}
                className="h-12 rounded-apple-md bg-alithea-danger/20 border border-alithea-danger/30 hover:bg-alithea-danger/30 transition-all duration-200 active:scale-95"
              >
                <Delete className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={handleClear}
                className="h-12 rounded-apple-md bg-alithea-warning/20 border border-alithea-warning/30 hover:bg-alithea-warning/30 transition-all duration-200 active:scale-95 col-span-2"
              >
                <span className="text-white text-caption">Clear</span>
              </button>
              <button
                onClick={handleSubmit}
                disabled={!playerInput}
                className="h-12 rounded-apple-md bg-alithea-success border border-alithea-success hover:bg-alithea-success/90 transition-all duration-200 active:scale-95 col-span-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-white text-caption font-semibold">Enter</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Progress dots */}
      <div className="flex gap-1">
        {getDisplayDigits().map((_, idx) => (
          <div
            key={idx}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              idx < playerInput.length
                ? 'bg-alithea-primary'
                : 'bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
