
import React, { useState } from 'react';
import ModernHero from '@/components/ModernHero';
import ModernVMList from '@/components/ModernVMList';
import ModernSummaryCard from '@/components/ModernSummaryCard';
import VMConfigurator from '@/components/VMConfigurator';
import PoolDeRecursos from '@/components/PoolDeRecursos';
import UpgradeModule from '@/components/UpgradeModule';
import ListaPropostas from '@/components/ListaPropostas';
import { PremiumWrapper } from '@/components/PremiumWrapper';
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud } from '@/utils/calculadora';

const Index = () => {
  const { vms, selectedVMId, precos } = useCalculadoraStore();
  const calculadora = new CalculadoraCloud(precos);
  const selectedVM = vms.find(vm => vm.id === selectedVMId);
  const [modoCalculo, setModoCalculo] = useState<'vm' | 'pool' | 'upgrades' | 'propostas'>('vm');

  return (
    <PremiumWrapper activeTab={modoCalculo} onTabChange={(tab) => setModoCalculo(tab as any)}>
      <div 
        className="min-h-screen bg-black"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(255,179,0,0.05) 0%, transparent 50%), black'
        }}
      >
        {modoCalculo === 'vm' ? (
          // Modo VM existente
          <>
            <ModernHero />
            <div className="container mx-auto px-4 py-6">
              <div className="grid lg:grid-cols-12 gap-8">
                {/* VM List - Left Column */}
                <div className="lg:col-span-4">
                  <ModernVMList />
                </div>
                
                {/* VM Configurator - Center Column */}
                <div className="lg:col-span-5">
                  {selectedVM ? (
                    <div className="premium-card p-8">
                      <VMConfigurator vm={selectedVM} calculadora={calculadora} />
                    </div>
                  ) : (
                    <div className="premium-card p-12 text-center">
                      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">⚙️</span>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Selecione uma VM
                      </h3>
                      <p className="text-gray-400">
                        Escolha uma VM da lista para configurar seus recursos
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Summary - Right Column */}
                <div className="lg:col-span-3">
                  <ModernSummaryCard />
                </div>
              </div>
            </div>
          </>
        ) : modoCalculo === 'pool' ? (
          <PoolDeRecursos />
        ) : modoCalculo === 'upgrades' ? (
          <UpgradeModule />
        ) : (
          <ListaPropostas />
        )}
      </div>
    </PremiumWrapper>
  );
};

export default Index;
