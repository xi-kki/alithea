'use client';

import { BookOpen, Lightbulb, Rocket, X } from 'lucide-react';
import type { GameGuide } from '@/lib/guides';

interface GameGuideProps {
  guide: GameGuide | undefined;
  onClose: () => void;
}

export function GameGuide({ guide, onClose }: GameGuideProps) {
  if (!guide) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative card-apple w-full max-w-lg rounded-3xl p-8 max-h-[85vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          <h3 className="font-sf-display text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            {guide.title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close guide"
            className="text-white/40 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <section className="mb-6">
          <h4 className="font-sf-display text-sm text-cyan-300 uppercase tracking-wider mb-2">
            How to Play
          </h4>
          <ol className="space-y-1.5">
            {guide.howToPlay.map((step, i) => (
              <li key={i} className="text-sm text-white/60 flex gap-2">
                <span className="text-cyan-400 font-semibold flex-shrink-0">{i + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-6">
          <h4 className="font-sf-display text-sm text-yellow-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4" />
            Beginner Tips
          </h4>
          <ul className="space-y-1.5">
            {guide.beginnerTips.map((tip, i) => (
              <li key={i} className="text-sm text-white/60 flex gap-2">
                <span className="text-yellow-400/70 flex-shrink-0">-</span>
                {tip}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h4 className="font-sf-display text-sm text-purple-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Rocket className="w-4 h-4" />
            Pro Tips
          </h4>
          <ul className="space-y-1.5">
            {guide.proTips.map((tip, i) => (
              <li key={i} className="text-sm text-white/60 flex gap-2">
                <span className="text-purple-400/70 flex-shrink-0">-</span>
                {tip}
              </li>
            ))}
          </ul>
        </section>

        <p className="text-caption text-white/30 mt-6 text-right">
          Guide updated: {guide.updated}
        </p>
      </div>
    </div>
  );
}
