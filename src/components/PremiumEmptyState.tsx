
import React from 'react';
import { Cloud, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PremiumEmptyStateProps {
  onAddVM: () => void;
}

const PremiumEmptyState = ({ onAddVM }: PremiumEmptyStateProps) => {
  return (
    <div className="text-center py-16">
      <div className="relative inline-block mb-6">
        <Cloud className="w-24 h-24 text-gray-300" />
        <div className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
          <Plus className="w-5 h-5 text-blue-600" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Comece sua jornada para o próximo nível
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Configure seu primeiro servidor e descubra o poder da nuvem privada empresarial
      </p>
      <Button
        onClick={onAddVM}
        className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-cyan-700"
      >
        Adicionar Servidor Premium
      </Button>
    </div>
  );
};

export default PremiumEmptyState;
