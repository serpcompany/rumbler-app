import { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';
import { MapPin, X, Heart, Info } from 'lucide-react';

interface FighterCardProps {
  fighter: any;
  onSwipe: (direction: 'left' | 'right') => void;
}

export function FighterCard({ fighter, onSwipe }: FighterCardProps) {
  const [showInfo, setShowInfo] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      onSwipe(info.offset.x > 0 ? 'right' : 'left');
    }
  };

  return (
    <motion.div
      className="relative h-full w-full cursor-grab active:cursor-grabbing"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: 'grabbing' }}
    >
      <div className="relative h-full w-full bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl">
        {/* Fighter Photo */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src={fighter.photo}
            alt={fighter.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />
        </div>

        {/* Info Button */}
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center z-10"
        >
          <Info className="h-5 w-5 text-white" />
        </button>

        {/* Fighter Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-3xl">{fighter.name.split('"')[0]}</h2>
            <span className="text-zinc-400 text-2xl">{fighter.age}</span>
          </div>

          {fighter.name.includes('"') && (
            <p className="text-red-500 text-xl mb-3">
              "{fighter.name.split('"')[1]}"
            </p>
          )}

          <div className="flex items-center gap-2 mb-3 text-zinc-300">
            <MapPin className="h-4 w-4" />
            <span>{fighter.distance} miles away</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {fighter.disciplines.map((discipline: string) => (
              <Badge
                key={discipline}
                className="bg-red-600/80 backdrop-blur-sm text-white border-0"
              >
                {discipline}
              </Badge>
            ))}
            <Badge className="bg-zinc-800/80 backdrop-blur-sm text-white border-0">
              {fighter.experience}
            </Badge>
          </div>

          {/* Expanded Info */}
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-black/70 backdrop-blur-md rounded-lg p-4 mb-4"
            >
              <div className="grid grid-cols-3 gap-4 mb-3 text-center">
                <div>
                  <p className="text-zinc-400 text-sm">Height</p>
                  <p className="text-white">{fighter.height}</p>
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Reach</p>
                  <p className="text-white">{fighter.reach}</p>
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Weight</p>
                  <p className="text-white text-sm">{fighter.weightClass}</p>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Amateur Record</span>
                  <span className="text-white">
                    {fighter.amateurRecord.wins}-{fighter.amateurRecord.losses}-{fighter.amateurRecord.draws}
                  </span>
                </div>
                {fighter.proRecord.wins > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Pro Record</span>
                    <span className="text-red-500">
                      {fighter.proRecord.wins}-{fighter.proRecord.losses}-{fighter.proRecord.draws}
                    </span>
                  </div>
                )}
              </div>

              <div className="text-sm text-zinc-400 mb-2">📍 {fighter.gym}</div>

              <p className="text-sm text-zinc-300">{fighter.bio}</p>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-6 mt-6">
            <button
              onClick={() => onSwipe('left')}
              className="w-16 h-16 bg-white/10 backdrop-blur-sm border-2 border-red-500/50 rounded-full flex items-center justify-center hover:bg-red-500/20 transition-colors"
            >
              <X className="h-8 w-8 text-red-500" />
            </button>
            <button
              onClick={() => onSwipe('right')}
              className="w-20 h-20 bg-red-600 border-4 border-white/20 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors shadow-lg"
            >
              <Heart className="h-10 w-10 text-white" fill="white" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
