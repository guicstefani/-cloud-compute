
import React from 'react';
import { Cloud, Plus, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PremiumEmptyStateProps {
  onAddVM: () => void;
}

const PremiumEmptyState = ({ onAddVM }: PremiumEmptyStateProps) => {
  return (
    <div className="text-center py-16 animate-fade-in">
      {/* Elegant icon container */}
      <div className="relative inline-block mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-[#F8FAFC] to-[#E5E7EB] rounded-full flex items-center justify-center mx-auto shadow-lg">
          <Server className="w-10 h-10 text-[#6B7280]" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] rounded-full shadow-lg flex items-center justify-center">
          <Plus className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Refined content */}
      <h3 className="text-2xl font-light text-[#1F2937] mb-3">
        Comece sua jornada
        <span className="block font-semibold">para o próximo nível</span>
      </h3>
      
      <p className="text-[#6B7280] mb-8 max-w-md mx-auto leading-relaxed">
        Configure seu primeiro servidor e descubra o poder da nuvem privada empresarial
      </p>

      {/* Enhanced CTA button */}
      <Button
        onClick={onAddVM}
        className="btn-optidata px-8 py-4 text-base font-medium shadow-lg hover:shadow-xl"
      >
        <Server className="w-5 h-5 mr-3" />
        Adicionar Servidor Premium
      </Button>

      {/* Subtle feature highlights */}
      <div className="mt-12 flex justify-center gap-8 text-sm text-[#6B7280]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
          <span>99.99% Uptime</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#2563EB] rounded-full"></div>
          <span>Suporte 24/7</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#F59E0B] rounded-full"></div>
          <span>Tier III</span>
        </div>
      </div>
    </div>
  );
};

export default PremiumEmptyState;
