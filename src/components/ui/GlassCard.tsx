
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

const GlassCard = ({ children, className = "" }: GlassCardProps) => (
  <div className={cn(
    "bg-white/[0.03] backdrop-blur-xl border border-white/[0.08]",
    "rounded-2xl p-6 transition-all duration-300",
    "hover:bg-white/[0.05] hover:border-gold/30",
    "hover:shadow-2xl hover:shadow-gold/10",
    className
  )}>
    {children}
  </div>
);

export default GlassCard;
