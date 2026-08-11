'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Circle, CupSoda, Eye, Hand, Hourglass, PartyPopper, XCircle } from 'lucide-react';

interface SpinTheCupProps {
  difficulty: 'easy' | 'hard';
  onComplete: (score: number, rounds: number, time: number) => void;
}

const MAX_ROUNDS = 8;
const NUM_CUPS = 3;

export function SpinTheCup({ difficulty, onComplete }: SpinTheCupProps) {
  const [gameStatus, setGameStatus] = useState<'memorize' | 'shuffling' | 'pick' | 'reveal' | 'failed' | 'complete'>('memorize');
  const [slots, setSlots] = useState<number[]>([0, 1, 2]);
  const [pebbleSlot, setPebbleSlot] = useState(0);
  const [liftedSlot, setLiftedSlot] = useState<number | null>(null);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [roundCorrect, setRoundCorrect] = useState<boolean | null>(null);
  const [startTime] = useState(Date.now());
  const roundStartRef = useRef(Date.now());
  const timersRef = useRef<number[]>([]);

  const schedule = useCallback((fn: () => void, ms: number) => {
    timersRef.current.push(window.setTimeout(fn, ms));
  }, []);

  useEffect(() => {
    return () => timersRef.current.forEach((t) => window.clearTimeout(t));
  }, []);

  const finish = useCallback(
    (finalScore: number, finalRound: number, status: 'failed' | 'complete') => {
      setGameStatus(status);
      const timeMs = Date.now() - startTime;
      schedule(() => onComplete(finalScore, finalRound, timeMs), 1600);
    },
    [onComplete, schedule, startTime],
  );

  const shuffle = useCallback(() => {
    const swaps = difficulty === 'easy' ? 3 : 6;
    setGameStatus('shuffling');
    for (let i = 1; i <= swaps; i++) {
      schedule(() => {
        setSlots((prev) => {
          const next = [...prev];
          const a = Math.floor(Math.random() * NUM_CUPS);
          let b = Math.floor(Math.random() * NUM_CUPS);
          while (b === a) b = Math.floor(Math.random() * NUM_CUPS);
          [next[a], next[b]] = [next[b], next[a]];
          return next;
        });
      }, i * 350);
    }
    schedule(() => setGameStatus('pick'), swaps * 350 + 200);
  }, [difficulty, schedule]);

  const newRound = useCallback(() => {
    roundStartRef.current = Date.now();
    setLiftedSlot(null);
    setRoundCorrect(null);
    setSlots([0, 1, 2]);
    setPebbleSlot(Math.floor(Math.random() * NUM_CUPS));
    setGameStatus('memorize');
    schedule(() => shuffle(), 1600);
  }, [schedule, shuffle]);

  useEffect(() => {
    newRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pickCup = (slot: number) => {
    if (gameStatus !== 'pick') return;
    setLiftedSlot(slot);
    setGameStatus('reveal');
    const correct = slot === pebbleSlot;
    setRoundCorrect(correct);

    const elapsed = (Date.now() - roundStartRef.current) / 1000;
    const speedBonus = Math.max(0, Math.round(15 - elapsed)) * 10;
    const newScore = correct ? score + 100 + speedBonus : score;
    if (correct) setScore(newScore);

    schedule(() => {
      if (correct) {
        if (round >= MAX_ROUNDS) {
          finish(newScore, round, 'complete');
        } else {
          setRound(round + 1);
          newRound();
        }
      } else {
        finish(score, round - 1, 'failed');
      }
    }, 1600);
  };

  const swaps = difficulty === 'easy' ? 3 : 6;

  return (
    <div className="w-full max-w-lg mx-auto animate-fade-in">
      {/* Status */}
      <div className="flex items-center justify-center mb-6 min-h-[2.5rem]">
        {gameStatus === 'memorize' && (
          <div className="combo-badge animate-pulse">
            <span className="inline-flex items-center gap-2"><Eye className="w-5 h-5 text-cyan-300" /> Watch where the pebble goes!</span>
          </div>
        )}
        {gameStatus === 'shuffling' && (
          <div className="combo-badge">
            <span className="inline-flex items-center gap-2"><Hourglass className="w-5 h-5 text-amber-300" /> Shuffling...</span>
          </div>
        )}
        {gameStatus === 'pick' && (
          <div className="combo-badge animate-pulse">
            <span className="inline-flex items-center gap-2"><Hand className="w-5 h-5 text-white/80" /> Where is the pebble?</span>
          </div>
        )}
        {gameStatus === 'reveal' && roundCorrect === true && (
          <div className="combo-badge">
            <span className="inline-flex items-center gap-2"><PartyPopper className="w-5 h-5 text-purple-300" /> Found it!</span>
          </div>
        )}
        {gameStatus === 'reveal' && roundCorrect === false && (
          <div className="px-4 py-2 bg-alithea-danger/20 text-alithea-danger rounded-apple-full">
            <span className="inline-flex items-center gap-2"><XCircle className="w-5 h-5 text-red-400" /> Not there!</span>
          </div>
        )}
        {(gameStatus === 'failed' || gameStatus === 'complete') && (
          <div className="combo-badge">
            <span className="inline-flex items-center gap-2">
              <PartyPopper className="w-5 h-5 text-purple-300" />
              {gameStatus === 'complete' ? 'Cleared all rounds!' : 'Game over'}
            </span>
          </div>
        )}
      </div>

      {/* Score / Round / Swaps */}
      <div className="flex items-center justify-center gap-6 mb-8">
        <div className="text-center">
          <div className="score-value text-display-xxl">{score}</div>
          <div className="text-caption text-white/40">Score</div>
        </div>
        <div className="w-px h-10 bg-white/10" />
        <div className="text-center">
          <div className="font-sf-display text-display-xxl font-bold text-white">{round}</div>
          <div className="text-caption text-white/40">Round</div>
        </div>
        <div className="w-px h-10 bg-white/10" />
        <div className="text-center">
          <div className="font-sf-display text-display-xxl font-bold text-cyan-400">{swaps}</div>
          <div className="text-caption text-white/40">Swaps</div>
        </div>
      </div>

      {/* Cups */}
      <div className="card-apple p-8 rounded-3xl">
        <div className="relative h-40">
          {slots.map((cupId, slot) => (
            <button
              key={cupId}
              onClick={() => pickCup(slot)}
              disabled={gameStatus !== 'pick'}
              aria-label={`Cup ${slot + 1}`}
              className={`absolute bottom-0 w-1/3 flex flex-col items-center transition-all duration-300 ${
                liftedSlot === slot ? '-translate-y-10' : ''
              } ${gameStatus === 'pick' ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-default'}`}
              style={{ left: `${slot * 33.3333}%` }}
            >
              <CupSoda className="w-20 h-20 text-amber-300 drop-shadow-lg" strokeWidth={1.5} />
              {((gameStatus === 'memorize' && slot === pebbleSlot) ||
                (gameStatus === 'reveal' && slot === pebbleSlot)) && (
                <Circle className="w-4 h-4 text-orange-400 fill-orange-400 absolute -bottom-1" />
              )}
            </button>
          ))}
        </div>
        <p className="text-center text-caption text-white/40 mt-4">Three cups, one pebble. Keep your eyes on it.</p>
      </div>
    </div>
  );
}
