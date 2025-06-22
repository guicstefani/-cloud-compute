
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ObsidianCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'hero';
  breathing?: boolean;
  shimmer?: boolean;
  constellation?: boolean;
}

export const ObsidianCard = React.forwardRef<HTMLDivElement, ObsidianCardProps>(
  ({ 
    className, 
    variant = 'default',
    breathing = false,
    shimmer = false,
    constellation = false,
    children, 
    ...props 
  }, ref) => {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (constellation && cardRef.current) {
        // Criar estrelas para estados vazios
        const stars = Array.from({ length: 12 }, (_, i) => {
          const star = document.createElement('div');
          star.className = 'constellation-star';
          star.style.setProperty('--duration', `${2 + Math.random() * 4}s`);
          star.style.setProperty('--delay', `${Math.random() * 2}s`);
          star.style.left = `${Math.random() * 100}%`;
          star.style.top = `${Math.random() * 100}%`;
          return star;
        });

        const starsContainer = document.createElement('div');
        starsContainer.className = 'constellation-stars';
        stars.forEach(star => starsContainer.appendChild(star));
        cardRef.current.appendChild(starsContainer);

        return () => {
          if (cardRef.current && starsContainer.parentNode) {
            cardRef.current.removeChild(starsContainer);
          }
        };
      }
    }, [constellation]);

    return (
      <div
        ref={ref || cardRef}
        className={cn(
          'obsidian-card hover-lift',
          {
            'breathing-element': breathing,
            'constellation-empty': constellation,
          },
          variant === 'hero' && 'p-12 border-2',
          variant === 'elevated' && 'shadow-2xl',
          className
        )}
        {...props}
      >
        {shimmer && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-whisper to-transparent opacity-0 animate-pulse" />
          </div>
        )}
        {children}
      </div>
    );
  }
);

ObsidianCard.displayName = 'ObsidianCard';
