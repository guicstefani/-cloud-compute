
import React from 'react';
import GlassCard from './GlassCard';

interface MetricCardProps {
  number: string;
  label: string;
  value: string;
  icon?: React.ReactNode;
}

const MetricCard = ({ number, label, value, icon }: MetricCardProps) => (
  <div className="relative group">
    {/* Glow effect on hover */}
    <div className="absolute inset-0 bg-gold/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    
    <GlassCard className="relative">
      {/* Ícone se fornecido */}
      {icon && (
        <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-dark rounded-xl flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      
      {/* Número grande dourado */}
      <div className="text-5xl font-black text-gold mb-2">{number}</div>
      
      {/* Label */}
      <div className="text-sm text-white/60 mb-1">{label}</div>
      
      {/* Valor */}
      <div className="text-lg font-semibold text-white">{value}</div>
    </GlassCard>
  </div>
);

export default MetricCard;
