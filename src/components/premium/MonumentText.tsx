
import React from 'react';
import { cn } from '@/lib/utils';

interface MonumentTextProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | number;
  prefix?: string;
  suffix?: string;
  shimmer?: boolean;
  breathing?: boolean;
}

export const MonumentText: React.FC<MonumentTextProps> = ({
  value,
  prefix = '',
  suffix = '',
  shimmer = true,
  breathing = true,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'monument-text',
        {
          'value-shimmer': shimmer,
          'breathing-element': breathing,
        },
        className
      )}
      {...props}
    >
      {prefix}{value}{suffix}
    </div>
  );
};
