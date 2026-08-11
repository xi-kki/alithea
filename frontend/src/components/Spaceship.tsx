'use client';

import { CircleDot, Eye, Footprints, Globe, Hand, PartyPopper, Rocket, XCircle } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';

interface SpaceshipProps {
  routeLength: 3 | 5 | 7;
  onComplete: (score: number, moves: number, time: number) => void;
}

const ROWS = 5;

export function Spaceship({ routeLength, onComplete }: SpaceshipProps) {
  const cols = routeLength + 2; // start column + route steps + planet column
  const totalCells = ROWS * cols;

  const [path, setPath] = useState<number[]>([]);
  const [planetCell, setPlanetCell] = useState(-1);
  const [asteroids, setAsteroids] = useState<Set<number>>(new Set());
  const [stepIndex, setStepIndex] = useState(0);
  const [shipCell, setShipCell] = useState(-1);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<'memorize' | 'input' | 'complete' | 'failed'>('memorize');
  const [startTime] = useState(Date.now());
  const timersRef = useRef<number[]>([]);

  const schedule = useCallback((fn: () => void, ms: number) => {
    timersRef.current.push(window.setTimeout(fn, ms));
  }, []);

  useEffect(() => {
    return () => timersRef.current.forEach((t) => window.clearTimeout(t));
  }, []);

  // Generate the level: a random safe route from the left edge to the planet.
  useEffect(() => {
    let row = Math.floor(Math.random() * ROWS);
    const rows: number[] = [];
    for (let c = 1; c <= routeLength; c++) {
      const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, +1
      row = Math.min(ROWS - 1, Math.max(0, row + delta));
      rows.push(row);
    }
    const pathCells = rows.map((r, i) => r * cols + (i + 1));
    const startCell = rows[0] * cols;
    const planCell = rows[rows.length - 1] * cols + (cols - 1);

    const rocks = new Set<number>();
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = r * cols + c;
        if (cell === startCell || cell === planCell || pathCells.includes(cell)) continue;
        if (Math.random() < 0.45) rocks.add(cell);
      }
    }

    setPath(pathCells);
    setPlanetCell(planCell);
    setAsteroids(rocks);
    setShipCell(rows[0] * cols); // start at the first row, column 0
    setStepIndex(0);
    setScore(0);
    setGameStatus('memorize');
    schedule(() => setGameStatus('input'), 1800 + routeLength * 450);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeLength]);

  const handleCellClick = (cell: number) => {
    if (gameStatus !== 'input') return;
    if (cell === path[stepIndex]) {
      const nextStep = stepIndex + 1;
      setStepIndex(nextStep);
      setShipCell(cell);
      if (nextStep >= path.length) {
        setShipCell(planetCell);
        setGameStatus('complete');
        const timeMs = Date.now() - startTime;
        const speedBonus = Math.max(0, Math.round(60 - timeMs / 1000)) * 5;
        const finalScore = 500 + path.length * 100 + speedBonus;
        setScore(finalScore);
        schedule(() => onComplete(finalScore, path.length, timeMs), 1200);
      }
    } else {
      setGameStatus('failed');
      const timeMs = Date.now() - startTime;
      schedule(() => onComplete(score, stepIndex, timeMs), 1500);
    }
  };

  const renderCell = (cell: number) => {
    const isStart = cell === shipCell && gameStatus !== 'complete';
    const isPlanet = cell === planetCell;
    const isAsteroid = asteroids.has(cell);
    const isPathCell = path.includes(cell);
    const showRoute = gameStatus === 'memorize';

    let content;
    if (isStart) {
      content = <Rocket className="w-6 h-6 text-white" />;
    } else if (isPlanet) {
      content = <Globe className="w-6 h-6 text-emerald-400" />;
    } else if (isAsteroid) {
      content = <CircleDot className="w-5 h-5 text-white/25" />;
    } else {
      content = null;
    }

    return (
      <button
        key={cell}
        onClick={() => handleCellClick(cell)}
        disabled={gameStatus !== 'input'}
        aria-label={`Grid cell ${cell}`}
        className={`aspect-square rounded-apple-md border transition-all duration-200 flex items-center justify-center ${
          isPlanet
            ? 'border-emerald-400/40 bg-emerald-500/10'
            : isAsteroid
              ? 'border-white/5 bg-white/[0.02]'
              : showRoute && isPathCell
                ? 'border-cyan-400/50 bg-cyan-500/20'
                : gameStatus === 'input' && isPathCell
                  ? 'border-white/15 bg-white/[0.06] hover:border-cyan-400/50 hover:bg-cyan-500/10 cursor-pointer'
                  : 'border-white/5 bg-white/[0.02]'
        }`}
      >
        {content}
      </button>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      {/* Status */}
      <div className="flex items-center justify-center mb-6 min-h-[2.5rem]">
        {gameStatus === 'memorize' && (
          <div className="combo-badge animate-pulse">
            <span className="inline-flex items-center gap-2"><Eye className="w-5 h-5 text-cyan-300" /> Memorize the safe route!</span>
          </div>
        )}
        {gameStatus === 'input' && (
          <div className="combo-badge animate-pulse">
            <span className="inline-flex items-center gap-2"><Footprints className="w-5 h-5 text-white/80" /> Fly the route you remember</span>
          </div>
        )}
        {gameStatus === 'complete' && (
          <div className="combo-badge">
            <span className="inline-flex items-center gap-2"><PartyPopper className="w-5 h-5 text-purple-300" /> Planet reached!</span>
          </div>
        )}
        {gameStatus === 'failed' && (
          <div className="px-4 py-2 bg-alithea-danger/20 text-alithea-danger rounded-apple-full">
            <span className="inline-flex items-center gap-2"><XCircle className="w-5 h-5 text-red-400" /> Asteroid hit!</span>
          </div>
        )}
      </div>

      {/* Score / Progress */}
      <div className="flex items-center justify-center gap-6 mb-8">
        <div className="text-center">
          <div className="score-value text-display-xxl">{score}</div>
          <div className="text-caption text-white/40">Score</div>
        </div>
        <div className="w-px h-10 bg-white/10" />
        <div className="text-center">
          <div className="font-sf-display text-display-xxl font-bold text-cyan-400">
            {stepIndex}/{routeLength}
          </div>
          <div className="text-caption text-white/40">Route</div>
        </div>
      </div>

      {/* Grid */}
      <div className="card-apple p-6 rounded-3xl">
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: totalCells }, (_, cell) => renderCell(cell))}
        </div>
        <div className="flex items-center justify-center gap-6 mt-6 text-caption text-white/40">
          <span className="inline-flex items-center gap-2"><Rocket className="w-4 h-4 text-white" /> Your ship</span>
          <span className="inline-flex items-center gap-2"><Globe className="w-4 h-4 text-emerald-400" /> Planet</span>
          <span className="inline-flex items-center gap-2"><CircleDot className="w-4 h-4 text-white/25" /> Asteroid</span>
        </div>
      </div>
    </div>
  );
}
