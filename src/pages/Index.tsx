
import React, { useState } from 'react';
import { CleanHeader } from '@/components/CleanHeader';
import { CleanTabs } from '@/components/CleanTabs';
import { CleanVMList } from '@/components/CleanVMList';
import { CleanSummary } from '@/components/CleanSummary';
import VMConfigurator from '@/components/VMConfigurator';
import PoolDeRecursos from '@/components/PoolDeRecursos';
import UpgradeModule from '@/components/UpgradeModule';
import ListaPropostas from '@/components/ListaPropostas';
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud } from '@/utils/calculadora';

const Index = () => {
  const { vms, selectedVMId, precos } = useCalculadoraStore();
  const calculadora = new CalculadoraCloud(precos);
  const selectedVM = vms.find(vm => vm.id === selectedVMId);
  const [activeTab, setActiveTab] = useState<'vm' | 'pool' | 'upgrades' | 'propostas'>('vm');

  return (
    <div className="min-h-screen bg-gray-50">
      <CleanHeader />
      <CleanTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'vm' ? (
          <div className="grid lg:grid-cols-12 gap-8">
            {/* VM List - Left Column */}
            <div className="lg:col-span-5">
              <CleanVMList />
            </div>
            
            {/* VM Configurator - Center Column */}
            <div className="lg:col-span-4">
              {selectedVM ? (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Configuração: {selectedVM.nome}
                  </h3>
                  <VMConfigurator vm={selectedVM} calculadora={calculadora} />
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⚙️</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Selecione uma VM
                  </h3>
                  <p className="text-gray-500">
                    Escolha uma VM para configurar seus recursos
                  </p>
                </div>
              )}
            </div>
            
            {/* Summary - Right Column */}
            <div className="lg:col-span-3">
              <CleanSummary />
            </div>
          </div>
        ) : activeTab === 'pool' ? (
          <PoolDeRecursos />
        ) : activeTab === 'upgrades' ? (
          <UpgradeModule />
        ) : (
          <ListaPropostas />
        )}
      </div>
    </div>
  );
};

export default Index;
