import { useState } from 'react';
import { FighterCard } from './FighterCard';
import { FilterModal } from './FilterModal';
import { SlidersHorizontal } from 'lucide-react';
import { fighters } from './mock-data';

interface DeckScreenProps {
  onMatch: (fighter: any) => void;
}

export function DeckScreen({ onMatch }: DeckScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFilter, setShowFilter] = useState(false);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right' && Math.random() > 0.5) {
      // Simulate match (50% chance)
      onMatch(fighters[currentIndex]);
    }
    
    setCurrentIndex(prev => Math.min(prev + 1, fighters.length - 1));
  };

  const currentFighter = fighters[currentIndex];

  return (
    <div className="relative h-full bg-zinc-950">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
            <div className="flex gap-0.5">
              <div className="w-1.5 h-4 bg-white rounded-sm" />
              <div className="w-1.5 h-4 bg-white rounded-sm mt-1" />
            </div>
          </div>
          <span className="text-white tracking-wider">RUMBLER</span>
        </div>
        <button 
          onClick={() => setShowFilter(true)}
          className="w-10 h-10 bg-zinc-900/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-zinc-800 transition-colors"
        >
          <SlidersHorizontal className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Fighter Card */}
      <div className="h-full pt-20 pb-32 px-4">
        {currentIndex < fighters.length ? (
          <FighterCard fighter={currentFighter} onSwipe={handleSwipe} />
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-zinc-500 text-lg mb-4">No more fighters nearby</p>
              <p className="text-zinc-600 text-sm">Check back later or adjust your filters</p>
            </div>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {showFilter && <FilterModal onClose={() => setShowFilter(false)} />}
    </div>
  );
}
