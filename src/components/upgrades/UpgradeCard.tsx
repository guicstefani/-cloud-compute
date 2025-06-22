
import React from 'react';
import { Plus, Minus, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/utils/calculadora';
import { UpgradeItem, CarrinhoItem } from './types';

interface UpgradeCardProps {
  recurso: UpgradeItem;
  carrinho: CarrinhoItem[];
  onAdicionarItem: (recurso: UpgradeItem, quantidade?: number) => void;
  onRemoverItem: (recursoId: string) => void;
}

export const UpgradeCard: React.FC<UpgradeCardProps> = ({
  recurso,
  carrinho,
  onAdicionarItem,
  onRemoverItem
}) => {
  const itemNoCarrinho = carrinho.find(item => item.id === recurso.id);
  const quantidade = itemNoCarrinho?.quantidade || 0;
  const isNearLimit = quantidade >= (recurso.maximo || 999) * 0.9;

  return (
    <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center text-black">
            {recurso.icon}
          </div>
          <div>
            <h4 className="font-semibold text-white">{recurso.nome}</h4>
            <p className="text-sm text-gray-400">{recurso.descricao}</p>
          </div>
        </div>
        {isNearLimit && (
          <AlertCircle className="w-5 h-5 text-red-400" />
        )}
      </div>
      
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {formatCurrency(recurso.preco)}
          </div>
          <div className="text-xs text-gray-500">{recurso.unidade}</div>
          <div className="text-xs text-gray-600 mt-1">
            Limite: {recurso.maximo || 999} unidades
          </div>
        </div>
        
        {quantidade > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => onRemoverItem(recurso.id)}
                className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              
              <span className="text-xl font-bold text-white min-w-[3ch] text-center">
                {quantidade}
              </span>
              
              <button
                onClick={() => onAdicionarItem(recurso)}
                disabled={quantidade >= (recurso.maximo || 999)}
                className="w-8 h-8 rounded-full bg-green-600 hover:bg-green-700 flex items-center justify-center text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-400">Subtotal:</div>
              <div className="text-lg font-semibold text-green-400">
                {formatCurrency(quantidade * recurso.preco)}
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => onAdicionarItem(recurso)}
            className="w-full py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold rounded-lg transition-all transform hover:scale-105"
          >
            Adicionar
          </button>
        )}
      </div>
    </div>
  );
};
