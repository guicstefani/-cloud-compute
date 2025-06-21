
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Sparkles, Star } from 'lucide-react';

interface SuccessCelebrationProps {
  show: boolean;
  onComplete?: () => void;
  title?: string;
  subtitle?: string;
  confetti?: boolean;
}

const SuccessCelebration: React.FC<SuccessCelebrationProps> = ({
  show,
  onComplete,
  title = "Sucesso!",
  subtitle = "Operação realizada com sucesso",
  confetti = true
}) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    if (show && confetti) {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, confetti, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Confetti particles */}
          {confetti && particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-3 h-3"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
              initial={{ scale: 0, rotate: 0, y: -20 }}
              animate={{ 
                scale: [0, 1, 0],
                rotate: [0, 180, 360],
                y: [0, 50, 100],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                delay: particle.delay,
                ease: "easeOut"
              }}
            >
              {Math.random() > 0.5 ? (
                <Star className="w-3 h-3 text-amber-400 fill-current" />
              ) : (
                <Sparkles className="w-3 h-3 text-yellow-400" />
              )}
            </motion.div>
          ))}

          {/* Main celebration card */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-4 text-center"
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 50 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 20,
              delay: 0.2 
            }}
          >
            {/* Success icon with golden glow */}
            <motion.div
              className="relative mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
            >
              <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-30 animate-pulse" />
              <CheckCircle className="relative w-16 h-16 text-green-500 mx-auto" />
            </motion.div>

            {/* Title */}
            <motion.h2
              className="text-2xl font-bold text-gray-900 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {title}
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              className="text-gray-600 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {subtitle}
            </motion.p>

            {/* Golden shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/20 to-transparent rounded-2xl"
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ 
                duration: 1.5, 
                delay: 1,
                ease: "easeInOut" 
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessCelebration;
