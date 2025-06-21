
import React from 'react';
import { motion } from 'framer-motion';

interface CinematicLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  variant?: 'spinner' | 'particles' | 'pulse';
}

const CinematicLoader: React.FC<CinematicLoaderProps> = ({
  size = 'md',
  text = 'Carregando...',
  variant = 'particles'
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-24 h-24'
  };

  if (variant === 'particles') {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          {/* Central golden orb */}
          <motion.div
            className="w-8 h-8 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Orbiting particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-amber-400 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transformOrigin: '0 0'
              }}
              animate={{
                rotate: [0, 360],
                x: [0, Math.cos((i * 60) * Math.PI / 180) * 30],
                y: [0, Math.sin((i * 60) * Math.PI / 180) * 30],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        
        {text && (
          <motion.p
            className="text-amber-600 font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <motion.div
            className={`${sizeClasses[size]} bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full`}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.3, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className={`absolute top-0 left-0 ${sizeClasses[size]} bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full`}
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.8, 0, 0.8]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0.3,
              ease: "easeInOut"
            }}
          />
        </div>
        {text && <p className="text-amber-600 font-medium animate-pulse">{text}</p>}
      </div>
    );
  }

  // Default spinner
  return (
    <div className="flex flex-col items-center space-y-4">
      <motion.div
        className={`${sizeClasses[size]} border-4 border-amber-200 border-t-amber-500 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      {text && <p className="text-amber-600 font-medium">{text}</p>}
    </div>
  );
};

export default CinematicLoader;
