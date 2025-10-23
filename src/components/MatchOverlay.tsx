import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { X } from 'lucide-react';

interface MatchOverlayProps {
  fighter: any;
  onClose: () => void;
  onMessage: () => void;
}

export function MatchOverlay({ fighter, onClose, onMessage }: MatchOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center px-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <X className="h-6 w-6 text-white" />
        </button>

        {/* Match Title */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-5xl text-red-600 mb-8 tracking-tight"
        >
          IT'S A MATCH!
        </motion.h1>

        {/* Fighter Photos */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-32 h-32 rounded-full overflow-hidden border-4 border-red-600 shadow-lg"
          >
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=200"
              alt="You"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center"
          >
            <span className="text-2xl">🥊</span>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-32 h-32 rounded-full overflow-hidden border-4 border-red-600 shadow-lg"
          >
            <ImageWithFallback
              src={fighter.photo}
              alt={fighter.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-zinc-300 mb-8"
        >
          You and <span className="text-white">{fighter.name.split('"')[0]}</span> are ready to train!
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="space-y-3"
        >
          <Button
            onClick={onMessage}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-6"
          >
            Send Message
          </Button>
          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full text-white hover:bg-white/10 py-6"
          >
            Keep Swiping
          </Button>
        </motion.div>
      </motion.div>

      {/* Confetti Effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -20, x: Math.random() * 375, opacity: 1 }}
            animate={{ 
              y: 812, 
              x: Math.random() * 375,
              rotate: Math.random() * 360,
              opacity: 0
            }}
            transition={{ 
              duration: 2 + Math.random() * 2,
              delay: Math.random() * 0.5
            }}
            className="absolute w-2 h-2 bg-red-600 rounded-full"
          />
        ))}
      </div>
    </motion.div>
  );
}
