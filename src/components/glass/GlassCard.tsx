
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'premium' | 'selected' | 'interactive';
  glow?: boolean;
  children: React.ReactNode;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'default', glow = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-2xl transition-all duration-300',
          {
            'glass-card': variant === 'default',
            'glass-card-premium': variant === 'premium',
            'glass-card-premium glow-gold': variant === 'selected',
            'glass-card glow-hover cursor-pointer': variant === 'interactive',
          },
          glow && 'glow-gold',
          className
        )}
        {...props}
      >
        {/* Blur background layer */}
        <div className="blur-layer" />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
