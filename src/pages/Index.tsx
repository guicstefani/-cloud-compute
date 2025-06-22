
import React, { useState } from 'react';
import { ModernCalculatorLayout } from '@/components/ModernCalculatorLayout';
import ImprovedVMConfigurator from '@/components/ImprovedVMConfigurator';
import { useCalculadoraStore } from '@/store/calculadora';
import { PremiumWrapper } from "@/components/PremiumWrapper";

const Index = () => {
  const { selectedVMId, vms } = useCalculadoraStore();
  const selectedVM = vms.find(vm => vm.id === selectedVMId);
  const [activeTab, setActiveTab] = useState('vm');

  return (
    <div className="w-full">
      <PremiumWrapper activeTab={activeTab} onTabChange={setActiveTab}>
        <div className="flex h-screen overflow-hidden">
          {/* Layout principal da calculadora */}
          <div className="flex-1">
            <ModernCalculatorLayout />
          </div>
          
          {/* Painel de configuração lateral */}
          {selectedVM && (
            <div className="w-1/3 bg-gray-900 border-l border-gray-800 overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  ⚙️ Configuração
                </h2>
                <ImprovedVMConfigurator vm={selectedVM} />
              </div>
            </div>
          )}
        </div>
      </PremiumWrapper>
    </div>
  );
};

export default Index;
