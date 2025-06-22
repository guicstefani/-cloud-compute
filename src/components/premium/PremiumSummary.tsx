
import React from 'react';
import { TrendingUp, DollarSign, Zap } from 'lucide-react';
import { ObsidianCard } from './ObsidianCard';
import { MonumentText } from './MonumentText';
import { formatCurrency } from '@/utils/calculadora';

interface PremiumSummaryProps {
  total: number;
  economia?: number;
  eficiencia?: number;
}

export const PremiumSummary: React.FC<PremiumSummaryProps> = ({
  total,
  economia = 0,
  eficiencia = 95
}) => {
  return (
    <ObsidianCard variant="hero" breathing shimmer>
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-gold-pure to-gold-rich rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <DollarSign className="w-10 h-10 text-obsidian-deep" />
        </div>
        
        <h2 className="hero-text mb-2">Resumo de Investimento</h2>
        <p className="body-text opacity-70">Infraestrutura premium otimizada</p>
      </div>

      <div className="text-center mb-12">
        <p className="label-text mb-4">TOTAL MENSAL</p>
        <MonumentText value={formatCurrency(total)} />
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-3">
            <TrendingUp className="w-6 h-6 text-green-400 mr-2" />
            <span className="label-text text-green-400">ECONOMIA</span>
          </div>
          <div className="text-2xl font-semibold text-green-400 mb-1">
            {formatCurrency(economia)}
          </div>
          <div className="label-text opacity-60">vs concorrência</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-3">
            <Zap className="w-6 h-6 text-gold-pure mr-2" />
            <span className="label-text text-gold-pure">EFICIÊNCIA</span>
          </div>
          <div className="text-2xl font-semibold text-gold-pure mb-1">
            {eficiencia}%
          </div>
          <div className="label-text opacity-60">otimização</div>
        </div>
      </div>
    </ObsidianCard>
  );
};
