
/**
 * CleanCard - Componente de card limpo e consistente
 * Use este em vez dos cards antigos conflitantes
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface CleanCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive';
  padding?: 'sm' | 'md' | 'lg';
  selected?: boolean;
}

export const CleanCard = React.forwardRef<HTMLDivElement, CleanCardProps>(
  ({ 
    className, 
    variant = 'default', 
    padding = 'md',
    selected,
    children,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'bg-[#1a1a1a] border border-[#333333] rounded-lg transition-all duration-200',
          
          // Variants
          {
            // Default
            'shadow-sm': variant === 'default',
            
            // Elevated
            'shadow-lg border-[#404040]': variant === 'elevated',
            
            // Interactive
            'cursor-pointer hover:border-[#f5a623] hover:shadow-[0_0_20px_rgba(245,166,35,0.1)]': 
              variant === 'interactive',
          },
          
          // Padding
          {
            'p-3': padding === 'sm',
            'p-6': padding === 'md',
            'p-8': padding === 'lg',
          },
          
          // Selected state
          {
            'border-[#f5a623] bg-[rgba(245,166,35,0.05)] shadow-[0_0_20px_rgba(245,166,35,0.1)]': 
              selected,
          },
          
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CleanCard.displayName = 'CleanCard';
