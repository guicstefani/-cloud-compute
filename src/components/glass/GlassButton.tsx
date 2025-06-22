
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'md', 
    loading, 
    icon, 
    children, 
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center gap-2 font-medium',
          'glass-button rounded-xl transition-all duration-300',
          'focus:outline-none focus:ring-2 focus:ring-[#f5a623]/50',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 text-sm': size === 'md',
            'h-12 px-6 text-base': size === 'lg',
          },
          {
            'text-white': variant === 'default',
            'bg-gradient-to-r from-[#f5a623] to-[#d68910] text-black border-[#f5a623]': 
              variant === 'primary',
            'bg-transparent border-transparent text-gray-300 hover:text-white': 
              variant === 'ghost',
          },
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
        )}
        {icon && !loading && icon}
        <span className="relative z-10">{children}</span>
        
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 rounded-xl shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>
    );
  }
);

GlassButton.displayName = 'GlassButton';
