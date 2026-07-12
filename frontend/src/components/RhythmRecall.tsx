'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface RhythmRecallProps {
  difficulty: 'easy' | 'medium' | 'hard';
  onComplete: (score: number, rounds: number, time: number) => void;
}

const PAD_COLORS = [
  { name: 'red', bg: '#ef4444', glow: 'rgba(239, 68, 68, 0.6)' },
  { name: 'blue', bg: '#3b82f6', glow: 'rgba(59, 130, 246, 0.6)' },
  { name: 'green', bg: '#22c55e', glow: 'rgba(34, 197, 94, 0.6)' },
  { name: 'yellow', bg: '#eab308', glow: 'rgba(234, 179, 8, 0.6)' },
  { name: 'purple', bg: '#a855f7', glow: 'rgba(168, 85, 247, 0.6)' },
  { name: 'pink', bg: '#ec4899', glow: 'rgba(236, 72, 153, 0.6)' },
  { name: 'cyan', bg: '#06b6d4', glow: 'rgba(6, 182, 212, 0.6)' },
  { name: 'orange', bg: '#f97316', glow: 'rgba(249, 115, 22, 0.6)' },
];

const DIFFICULTY_CONFIG = {
  easy: { padCount: 4, startSpeed: 600, speedIncrease: 25 },
  medium: { padCount: 6, startSpeed: 500, speedIncrease: 20 },
  hard: { padCount: 8, startSpeed: 400, speedIncrease: 15 },
};

export function RhythmRecall({ difficulty, onComplete }: RhythmRecallProps) {
  const config = DIFFICULTY_CONFIG[difficulty];
  const activePads = PAD_COLORS.slice(0, config.padCount);

  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<'watching' | 'input' | 'checking' | 'complete' | 'failed'>('watching');
  const [highlightedPad, setHighlightedPad] = useState<number | null>(null);
  const [startTime] = useState(Date.now());
  const [speed, setSpeed] = useState(config.startSpeed);
  const [lastClickedPad, setLastClickedPad] = useState<number | null>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  // Generate random pad
  const getRandomPad = useCallback(() => {
    return Math.floor(Math.random() * config.padCount);
  }, [config.padCount]);

  // Play a single beat sound using Web Audio API
  const playTone = useCallback((padIndex: number) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      // Map pad index to frequency (musical scale)
      const frequencies = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
      oscillator.frequency.value = frequencies[padIndex % frequencies.length];
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.3);
    } catch {
      // Audio not available, silent fallback
    }
  }, []);

  // Start new round
  const startNewRound = useCallback(() => {
    // Clear any pending timeouts
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    const newPad = getRandomPad();
    const newSequence = [...sequence, newPad];
    setSequence(newSequence);
    setPlayerInput([]);
    setGameStatus('watching');

    // Play sequence with audio + visual
    let i = 0;
    const playSequence = () => {
      if (i < newSequence.length) {
        const padIdx = newSequence[i];
        setHighlightedPad(padIdx);
        playTone(padIdx);

        const t1 = setTimeout(() => {
          setHighlightedPad(null);
        }, speed * 0.7);

        const t2 = setTimeout(() => {
          i++;
          playSequence();
        }, speed);

        timeoutsRef.current.push(t1, t2);
      } else {
        const t3 = setTimeout(() => {
          setGameStatus('input');
        }, 300);
        timeoutsRef.current.push(t3);
      }
    };

    const t0 = setTimeout(playSequence, 500);
    timeoutsRef.current.push(t0);
  }, [sequence, speed, getRandomPad, playTone]);

  // Initialize first round
  useEffect(() => {
    startNewRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle pad click
  const handlePadClick = (padIndex: number) => {
    if (gameStatus !== 'input') return;

    // Play sound on click
    playTone(padIndex);

    setLastClickedPad(padIndex);
    setTimeout(() => setLastClickedPad(null), 200);

    const newInput = [...playerInput, padIndex];
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
            <div className="text-caption text-white/40">Beats</div>
          </div>
        </div>

        {/* Difficulty Badge */}
        <div className="text-center mb-apple-4">
          <span className="px-3 py-1 bg-alithea-warning/20 text-alithea-warning text-caption rounded-apple-full capitalize">
            {difficulty} • {config.padCount} pads
          </span>
        </div>

        {/* Status */}
        <div className="text-center mb-apple-4">
          {gameStatus === 'watching' && (
            <div className="combo-badge animate-pulse">
              🎵 Listen and watch...
            </div>
          )}
          {gameStatus === 'input' && (
            <div className="combo-badge">
              🥁 Repeat the rhythm!
            </div>
          )}
          {gameStatus === 'checking' && (
            <div className="combo-badge">
              ⏳ Checking...
            </div>
          )}
          {gameStatus === 'failed' && (
            <div className="px-4 py-2 bg-alithea-danger/20 text-alithea-danger rounded-apple-full">
              ❌ Wrong beat!
            </div>
          )}
        </div>
      </div>

      {/* Drum Pads */}
      <div className="w-full max-w-lg card-apple p-apple-6">
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: `repeat(${Math.min(config.padCount, 4)}, 1fr)`,
          }}
        >
          {activePads.map((pad, index) => {
            const isHighlighted = highlightedPad === index || lastClickedPad === index;
            return (
              <button
                key={pad.name}
                onClick={() => handlePadClick(index)}
                disabled={gameStatus !== 'input'}
                className={`
                  aspect-square rounded-apple-lg transition-all duration-150 border-2
                  ${gameStatus !== 'input' ? 'cursor-default opacity-70' : 'cursor-pointer active:scale-95'}
                `}
                style={{
                  backgroundColor: isHighlighted ? pad.bg : `${pad.bg}33`,
                  borderColor: isHighlighted ? pad.bg : 'transparent',
                  boxShadow: isHighlighted ? `0 0 30px ${pad.glow}, inset 0 0 20px ${pad.glow}` : 'none',
                  transform: isHighlighted ? 'scale(0.95)' : undefined,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Sequence Preview */}
      <div className="flex gap-2">
        {sequence.map((padIdx, idx) => (
          <div
            key={idx}
            className="w-3 h-3 rounded-full transition-all duration-200"
            style={{
              backgroundColor: idx < playerInput.length
                ? playerInput[idx] === sequence[idx]
                  ? '#10B981'
                  : '#EF4444'
                : PAD_COLORS[padIdx].bg + '40',
            }}
          />
        ))}
      </div>
    </div>
  );
}
