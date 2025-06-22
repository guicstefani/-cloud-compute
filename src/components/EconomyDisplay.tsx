
import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/utils/calculadora';

interface EconomyDisplayProps {
  originalValue: number;
  currentValue: number;
  label?: string;
  showPercentage?: boolean;
}

export const EconomyDisplay: React.FC<EconomyDisplayProps> = ({
  originalValue,
  currentValue,
  label = "Variação",
  showPercentage = true
}) => {
  const difference = originalValue - currentValue;
  const isEconomy = difference > 0;
  const isNeutral = difference === 0;
  const percentage = originalValue > 0 ? (difference / originalValue) * 100 : 0;

  if (isNeutral) {
    return (
      <div className="flex items-center gap-2 text-gray-600">
        <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
        </div>
        <span className="text-sm font-medium">Sem alteração</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${
      isEconomy ? 'text-green-600' : 'text-red-600'
    }`}>
      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
        isEconomy ? 'bg-green-100' : 'bg-red-100'
      }`}>
        {isEconomy ? (
          <TrendingDown className="w-3 h-3" />
        ) : (
          <TrendingUp className="w-3 h-3" />
        )}
      </div>
      
      <div className="flex flex-col">
        <span className="text-sm font-medium">
          {isEconomy ? 'Economia: ' : 'Custo adicional: '}
          {formatCurrency(Math.abs(difference))}
        </span>
        
        {showPercentage && percentage !== 0 && (
          <span className="text-xs opacity-75">
            {isEconomy ? '-' : '+'}{Math.abs(percentage).toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
};
