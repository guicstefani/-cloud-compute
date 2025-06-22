
import React from 'react';
import { ShoppingCart } from 'lucide-react';

export const EstadoVazio: React.FC = () => {
  return (
    <div className="text-center py-12">
      <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-400 mb-2">
        Nenhum upgrade selecionado
      </h3>
      <p className="text-gray-500">
        Selecione os recursos que deseja adicionar à sua cotação
      </p>
      <div className="mt-4 text-sm text-gray-600">
        💡 Dica: Use Enter para adicionar +1, Shift+Enter para +10
      </div>
    </div>
  );
};
