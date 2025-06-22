
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface GoldButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  tactile?: boolean;
}

export const GoldButton = React.forwardRef<HTMLButtonElement, GoldButtonProps>(
  ({ 
    className, 
    variant = 'primary',
    size = 'md',
    loading = false,
    tactile = true,
    children,
    onClick,
    ...props 
  }, ref) => {
    const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (tactile) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const newRipple = { id: Date.now(), x, y };
        
        setRipples(prev => [...prev, newRipple]);
        
        setTimeout(() => {
          setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
        }, 600);
      }

      if (onClick) onClick(e);
    };

    return (
      <button
        ref={ref}
        className={cn(
          'gold-button relative overflow-hidden',
          {
            'h-8 px-4 text-sm': size === 'sm',
            'h-12 px-6 text-base': size === 'md',
            'h-14 px-8 text-lg': size === 'lg',
            'opacity-50 cursor-not-allowed': loading,
            'bg-transparent border-2 border-gold-pure text-gold-pure hover:bg-gold-pure hover:text-obsidian-deep': variant === 'secondary',
            'bg-transparent text-gold-pure hover:bg-gold-whisper': variant === 'ghost',
          },
          className
        )}
        onClick={handleClick}
        disabled={loading}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="cosmic-loader w-5 h-5" />
          </div>
        )}
        
        <span className={cn('relative z-10', loading && 'opacity-0')}>
          {children}
        </span>

        {ripples.map(ripple => (
          <span
            key={ripple.id}
            className="absolute bg-white/30 rounded-full pointer-events-none animate-ping"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20,
            }}
          />
        ))}
      </button>
    );
  }
);

GoldButton.displayName = 'GoldButton';
