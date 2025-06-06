
import React from 'react';
import { Cloud, Plus, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PremiumEmptyStateProps {
  onAddVM: () => void;
}

const PremiumEmptyState = ({ onAddVM }: PremiumEmptyStateProps) => {
  return (
    <div className="text-center py-16 animate-fade-in">
      {/* Elegant icon container - Optidata Style */}
      <div className="relative inline-block mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-[#ECF0F1] to-[#E0E0E0] rounded-full flex items-center justify-center mx-auto shadow-lg">
          <Server className="w-10 h-10 text-[#7F8C8D]" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-[#0066CC] to-[#003D7A] rounded-full shadow-lg flex items-center justify-center">
          <Plus className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Refined content - Optidata Typography */}
      <h3 className="text-2xl font-light text-[#2C3E50] mb-3">
        Comece sua jornada
        <span className="block font-semibold">para o próximo nível</span>
      </h3>
      
      <p className="text-[#7F8C8D] mb-8 max-w-md mx-auto leading-relaxed">
        Configure seu primeiro servidor e descubra o poder da nuvem privada empresarial
      </p>

      {/* Enhanced CTA button - Optidata Style */}
      <Button
        onClick={onAddVM}
        className="btn-optidata px-8 py-4 text-base font-medium shadow-lg hover:shadow-xl"
      >
        <Server className="w-5 h-5 mr-3" />
        Adicionar Servidor Premium
      </Button>

      {/* Subtle feature highlights - Optidata Colors */}
      <div className="mt-12 flex justify-center gap-8 text-sm text-[#7F8C8D] flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#00A651] rounded-full"></div>
          <span>99.99% Uptime</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#0066CC] rounded-full"></div>
          <span>Suporte 24/7</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#F39C12] rounded-full"></div>
          <span>Tier III</span>
        </div>
      </div>
    </div>
  );
};

export default PremiumEmptyState;
