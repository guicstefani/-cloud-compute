
import React from 'react';
import { formatCurrency } from '@/utils/calculadora';
import { Calculator, TrendingUp, Percent } from 'lucide-react';

interface PreviewCardProps {
  valorBase: number;
  descontoTotal: number;
  descontoSoftware: number;
  descontoInfra: number;
  tipoDesconto: 'antigo' | 'novo';
  valorFinal: number;
}

const PreviewCard = ({ 
  valorBase, 
  descontoTotal, 
  descontoSoftware, 
  descontoInfra, 
  tipoDesconto, 
  valorFinal 
}: PreviewCardProps) => {
  const descontoEfetivo = tipoDesconto === 'antigo' 
    ? descontoTotal 
    : ((descontoSoftware * 0.3) + (descontoInfra * 0.7));

  return (
    <div className="bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/30 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center">
          <Calculator className="w-5 h-5 text-gold" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Preview do Contrato</h3>
          <p className="text-sm text-gray-400">Valores calculados em tempo real</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Valor Base Mensal</span>
          <span className="text-white font-medium">{formatCurrency(valorBase)}</span>
        </div>

        {valorBase > 0 && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 flex items-center gap-2">
                <Percent className="w-4 h-4" />
                Desconto Efetivo
              </span>
              <span className="text-orange-400 font-medium">{descontoEfetivo.toFixed(1)}%</span>
            </div>

            {tipoDesconto === 'novo' && (descontoSoftware > 0 || descontoInfra > 0) && (
              <div className="pl-4 border-l-2 border-gray-700 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Software (30%)</span>
                  <span className="text-blue-400">{descontoSoftware.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Infraestrutura (70%)</span>
                  <span className="text-green-400">{descontoInfra.toFixed(1)}%</span>
                </div>
              </div>
            )}

            <div className="border-t border-gray-700 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Valor Final Mensal
                </span>
                <span className="text-2xl font-bold text-gold">{formatCurrency(valorFinal)}</span>
              </div>
              <div className="text-right text-sm text-gray-500 mt-1">
                MRR: {formatCurrency(valorFinal * 12)} anuais
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PreviewCard;
