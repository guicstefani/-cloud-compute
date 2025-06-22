
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface ObsidianInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  goldFocus?: boolean;
}

export const ObsidianInput = React.forwardRef<HTMLInputElement, ObsidianInputProps>(
  ({ 
    className,
    label,
    error,
    goldFocus = true,
    ...props 
  }, ref) => {
    const [focused, setFocused] = useState(false);

    return (
      <div className="relative">
        {label && (
          <label className="label-text block mb-2">
            {label}
          </label>
        )}
        
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              'obsidian-input w-full',
              error && 'border-red-500',
              className
            )}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          
          {goldFocus && (
            <div 
              className={cn(
                'absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-gold-pure to-gold-rich transition-all duration-400',
                focused ? 'w-full' : 'w-0'
              )}
            />
          )}
        </div>
        
        {error && (
          <div className="mt-2 text-red-400 text-sm animate-fade-in-up">
            {error}
          </div>
        )}
      </div>
    );
  }
);

ObsidianInput.displayName = 'ObsidianInput';
