'use client';

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, Circle, Footprints, Map, X, XCircle } from 'lucide-react';

interface PathfinderProps {
  gridSize: 4 | 5 | 6;
  onComplete: (score: number, rounds: number, time: number) => void;
}

interface Cell {
  isPath: boolean;
  isVisited: boolean;
  isStart: boolean;
  isEnd: boolean;
}

export function Pathfinder({ gridSize, onComplete }: PathfinderProps) {
  const totalCells = gridSize * gridSize;

  const [grid, setGrid] = useState<Cell[]>([]);
  const [path, setPath] = useState<number[]>([]);
  const [playerPath, setPlayerPath] = useState<number[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<'showing' | 'input' | 'checking' | 'complete' | 'failed'>('showing');
  const [showTimer, setShowTimer] = useState(4);
  const [startTime] = useState(Date.now());
  const [wrongCell, setWrongCell] = useState<number | null>(null);

  // Generate a random path (connected cells)
  const generatePath = useCallback((length: number) => {
    const pathCells: number[] = [];
    const visited = new Set<number>();

    // Start from a random cell
    let current = Math.floor(Math.random() * totalCells);
    pathCells.push(current);
    visited.add(current);

    while (pathCells.length < length) {
      const lastCell = pathCells[pathCells.length - 1];
      const row = Math.floor(lastCell / gridSize);
      const col = lastCell % gridSize;

      // Get valid neighbors (up, down, left, right)
      const neighbors: number[] = [];
      if (row > 0) neighbors.push(lastCell - gridSize); // up
      if (row < gridSize - 1) neighbors.push(lastCell + gridSize); // down
      if (col > 0) neighbors.push(lastCell - 1); // left
      if (col < gridSize - 1) neighbors.push(lastCell + 1); // right

      // Filter out visited
      const validNeighbors = neighbors.filter(n => !visited.has(n));

      if (validNeighbors.length === 0) break;

      const next = validNeighbors[Math.floor(Math.random() * validNeighbors.length)];
      pathCells.push(next);
      visited.add(next);
    }

    return pathCells;
  }, [gridSize, totalCells]);

  // Start new round
  const startNewRound = useCallback(() => {
    const pathLength = Math.min(3 + currentRound, Math.floor(totalCells * 0.5));
    const newPath = generatePath(pathLength);

    // Create grid with path marked
    const newGrid: Cell[] = Array.from({ length: totalCells }, (_, i) => ({
      isPath: newPath.includes(i),
      isVisited: false,
      isStart: i === newPath[0],
      isEnd: i === newPath[newPath.length - 1],
    }));

    setGrid(newGrid);
    setPath(newPath);
    setPlayerPath([]);
    setWrongCell(null);
    setGameStatus('showing');
    setShowTimer(4);

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
  }, [currentRound, totalCells, generatePath]);

  useEffect(() => {
    startNewRound();
  }, []);

  // Handle cell click
  const handleCellClick = (cellIndex: number) => {
    if (gameStatus !== 'input') return;
    if (playerPath.includes(cellIndex)) return;

    const expectedIndex = playerPath.length;
    
    if (cellIndex === path[expectedIndex]) {
      // Correct cell
      const newPath = [...playerPath, cellIndex];
      setPlayerPath(newPath);

      // Update grid
      setGrid(prev => prev.map((cell, i) => 
        i === cellIndex ? { ...cell, isVisited: true } : cell
      ));

      // Check if path complete
      if (newPath.length === path.length) {
        setGameStatus('checking');
        const roundScore = 100 + (currentRound * 25) + (path.length * 15);
        setScore(score + roundScore);
        setCurrentRound(currentRound + 1);

        setTimeout(() => {
          startNewRound();
        }, 1000);
      }
    } else {
      // Wrong cell
      setWrongCell(cellIndex);
      setGameStatus('failed');
      setTimeout(() => {
        const timeMs = Date.now() - startTime;
        onComplete(score, currentRound - 1, timeMs);
      }, 1500);
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
              {playerPath.length}/{path.length}
            </div>
            <div className="text-caption text-white/40">Steps</div>
          </div>
        </div>

        {/* Status */}
        <div className="text-center mb-apple-4">
          {gameStatus === 'showing' && (
            <div className="combo-badge animate-pulse">
              <span className="inline-flex items-center gap-2"><Map className="w-5 h-5 text-teal-300" /> Memorize the path! {showTimer}s</span>
            </div>
          )}
          {gameStatus === 'input' && (
            <div className="combo-badge">
              <span className="inline-flex items-center gap-2"><Footprints className="w-5 h-5 text-white/80" /> Trace the path from <Circle className="w-5 h-5 text-green-400 fill-green-400/30" /> to <Circle className="w-5 h-5 text-red-400 fill-red-400/30" /></span>
            </div>
          )}
          {gameStatus === 'checking' && (
            <div className="combo-badge">
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-400" /> Path complete!</span>
            </div>
          )}
          {gameStatus === 'failed' && (
            <div className="px-4 py-2 bg-alithea-danger/20 text-alithea-danger rounded-apple-full">
              <span className="inline-flex items-center gap-2"><XCircle className="w-5 h-5 text-red-400" /> Wrong step!</span>
            </div>
          )}
        </div>
      </div>

      {/* Game Grid */}
      <div
        className="grid gap-2 md:gap-3 w-full max-w-lg p-apple-4 card-apple"
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
      >
        {grid.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
            disabled={gameStatus !== 'input' || playerPath.includes(index)}
            className={`
              aspect-square rounded-apple-sm transition-all duration-200 border flex items-center justify-center
              ${cell.isStart && (gameStatus === 'showing' || playerPath.includes(index) || gameStatus === 'failed')
                ? 'bg-alithea-success/30 border-alithea-success'
                : cell.isEnd && gameStatus === 'showing'
                  ? 'bg-alithea-danger/30 border-alithea-danger'
                  : cell.isVisited
                    ? 'bg-alithea-primary/30 border-alithea-primary'
                    : gameStatus === 'showing' && cell.isPath
                      ? 'bg-alithea-warning/20 border-alithea-warning/50'
                      : wrongCell === index
                        ? 'bg-alithea-danger/30 border-alithea-danger'
                        : 'bg-alithea-card border-white/10 hover:border-white/20'
              }
              ${gameStatus === 'input' && !playerPath.includes(index) ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
            `}
          >
            {cell.isStart && (gameStatus === 'showing' || playerPath.includes(index)) && (
              <Circle className="w-5 h-5 text-green-400 fill-green-400/30" />
            )}
            {cell.isEnd && gameStatus === 'showing' && (
              <Circle className="w-5 h-5 text-red-400 fill-red-400/30" />
            )}
            {cell.isVisited && !cell.isStart && (
              <Footprints className="w-5 h-5 text-white/80" />
            )}
            {wrongCell === index && (
              <X className="w-5 h-5 text-red-400" />
            )}
          </button>
        ))}
      </div>

      {/* Path Progress */}
      <div className="flex gap-1">
        {path.map((_, idx) => (
          <div
            key={idx}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              idx < playerPath.length ? 'bg-alithea-primary' : 'bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
