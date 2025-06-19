
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Server, DollarSign, FileText } from 'lucide-react';
import { designSystem } from '@/styles/designSystem';
import ActionButton from './ActionButton';

interface BreakdownItem {
  label: string;
  value: number;
  icon?: React.ReactNode;
}

interface ResultCardProps {
  total: number;
  breakdown: BreakdownItem[];
  onExport?: () => void;
  onRecalculate?: () => void;
  efficiency?: number;
}

const ResultCard = ({ 
  total, 
  breakdown, 
  onExport, 
  onRecalculate,
  efficiency = 85 
}: ResultCardProps) => {
  const getEfficiencyFeedback = () => {
    if (efficiency > 90) {
      return {
        emoji: "🚀",
        message: "Configuração eficiente! Máximo desempenho com custo otimizado.",
        color: "text-green-400"
      };
    } else if (efficiency > 70) {
      return {
        emoji: "⚡",
        message: "Setup balanceado. Ótima relação custo-benefício.",
        color: "text-blue-400"
      };
    } else {
      return {
        emoji: "💡",
        message: "Há oportunidades de otimização. Quer ver sugestões?",
        color: "text-yellow-400"
      };
    }
  };

  const feedback = getEfficiencyFeedback();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
      className={`relative bg-gradient-to-br from-[${designSystem.colors.primary}]/20 to-transparent 
        border border-[${designSystem.colors.primary}]/30 rounded-2xl p-8 overflow-hidden`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <motion.div 
          className={`absolute -top-24 -right-24 w-48 h-48 bg-[${designSystem.colors.primary}] rounded-full blur-3xl`}
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className={`absolute -bottom-24 -left-24 w-48 h-48 bg-[${designSystem.colors.primary}] rounded-full blur-3xl`}
          animate={{ 
            scale: [1.1, 1, 1.1],
            opacity: [0.1, 0.05, 0.1]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm text-gray-400 uppercase tracking-wider mb-2">
              Investimento Mensal
            </h2>
            <div className="flex items-baseline gap-2">
              <motion.span 
                className="text-5xl font-black text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                R$ {Math.floor(total).toLocaleString('pt-BR')}
              </motion.span>
              <span className="text-2xl text-gray-400">
                ,{(total % 1).toFixed(2).split('.')[1]}
              </span>
            </div>
          </div>
          
          {/* Efficiency Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className={`px-4 py-2 bg-[${designSystem.colors.surface}] rounded-full border border-[${designSystem.colors.border}]`}
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm font-semibold text-white">
                {efficiency}% eficiente
              </span>
            </div>
          </motion.div>
        </div>
        
        {/* Feedback */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`flex items-center gap-3 mb-6 p-4 bg-[${designSystem.colors.surface}]/50 rounded-lg border border-[${designSystem.colors.border}]`}
        >
          <span className="text-2xl">{feedback.emoji}</span>
          <p className={`${feedback.color} font-medium`}>
            {feedback.message}
          </p>
        </motion.div>
        
        {/* Breakdown */}
        <div className="space-y-3 mb-8">
          {breakdown.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 + (index * 0.1) }}
              className="flex justify-between items-center py-2"
            >
              <div className="flex items-center gap-3">
                {item.icon && (
                  <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                    {item.icon}
                  </div>
                )}
                <span className="text-gray-300">{item.label}</span>
              </div>
              <span className="text-white font-semibold">
                R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </motion.div>
          ))}
        </div>
        
        {/* Action Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <ActionButton 
            onClick={onExport}
            variant="primary" 
            className="flex-1 flex items-center justify-center gap-2"
          >
            <FileText className="w-5 h-5" />
            Exportar Proposta
          </ActionButton>
          <ActionButton 
            onClick={onRecalculate}
            variant="secondary"
            className="flex-1"
          >
            Recalcular
          </ActionButton>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResultCard;
