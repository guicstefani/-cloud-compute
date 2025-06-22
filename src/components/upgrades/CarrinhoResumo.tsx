
import React from 'react';
import { ShoppingCart, FileText } from 'lucide-react';
import { formatCurrency } from '@/utils/calculadora';
import { CarrinhoItem } from './types';
import { calcularDesconto } from './utils';

interface CarrinhoResumoProps {
  carrinho: CarrinhoItem[];
  onGerarPDF: () => void;
  isGeneratingPDF: boolean;
}

export const CarrinhoResumo: React.FC<CarrinhoResumoProps> = ({
  carrinho,
  onGerarPDF,
  isGeneratingPDF
}) => {
  const total = carrinho.reduce((total, item) => total + item.subtotal, 0);
  const desconto = calcularDesconto(total);
  const totalFinal = total * (1 - desconto);

  if (carrinho.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingCart className="w-6 h-6 text-yellow-400" />
        <h3 className="text-xl font-bold text-white">Resumo da Cotação</h3>
      </div>
      
      <div className="space-y-3 mb-6">
        {carrinho.map(item => (
          <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center text-black">
                {item.icon}
              </div>
              <div>
                <div className="text-white font-medium">{item.nome}</div>
                <div className="text-sm text-gray-400">{item.quantidade}x {formatCurrency(item.preco)}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-white">
                {formatCurrency(item.subtotal)}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t border-gray-600 pt-4 space-y-2">
        <div className="flex justify-between text-lg">
          <span className="text-gray-300">Subtotal:</span>
          <span className="text-white font-semibold">{formatCurrency(total)}</span>
        </div>
        
        {desconto > 0 && (
          <div className="flex justify-between text-green-400">
            <span>Desconto ({(desconto * 100).toFixed(0)}%):</span>
            <span>-{formatCurrency(total * desconto)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-2xl font-bold pt-2 border-t border-gray-600">
          <span className="text-white">Total Final:</span>
          <span className="text-yellow-400">{formatCurrency(totalFinal)}</span>
        </div>
      </div>
      
      <div className="mt-6 flex gap-3">
        <button 
          onClick={onGerarPDF}
          disabled={isGeneratingPDF}
          className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <FileText className="w-5 h-5" />
          {isGeneratingPDF ? 'Gerando PDF...' : 'Gerar Cotação PDF'}
        </button>
      </div>
    </div>
  );
};
