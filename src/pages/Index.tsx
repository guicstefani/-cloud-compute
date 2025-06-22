
import React, { useState } from 'react';
import ModernHero from '@/components/ModernHero';
import ModernVMList from '@/components/ModernVMList';
import ModernSummaryCard from '@/components/ModernSummaryCard';
import VMConfigurator from '@/components/VMConfigurator';
import PoolDeRecursos from '@/components/PoolDeRecursos';
import UpgradeModule from '@/components/UpgradeModule';
import ListaPropostas from '@/components/ListaPropostas';
import { PremiumWrapper } from '@/components/PremiumWrapper';
import { GlassCard } from '@/components/glass/GlassCard';
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud } from '@/utils/calculadora';

const Index = () => {
  const { vms, selectedVMId, precos } = useCalculadoraStore();
  const calculadora = new CalculadoraCloud(precos);
  const selectedVM = vms.find(vm => vm.id === selectedVMId);
  const [modoCalculo, setModoCalculo] = useState<'vm' | 'pool' | 'upgrades' | 'propostas'>('vm');

  return (
    <PremiumWrapper activeTab={modoCalculo} onTabChange={(tab) => setModoCalculo(tab as any)}>
      <div className="min-h-screen">
        {/* Hero Section with Enhanced Glassmorphism */}
        <ModernHero />
        
        {/* Main Content with Glass Background */}
        <div className="relative">
          {/* Background blur layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#f5a623]/5 to-transparent" />
          
          <div className="container mx-auto px-4 py-6 relative z-10">
            {modoCalculo === 'vm' ? (
              // Enhanced VM Mode with Glassmorphism
              <div className="grid lg:grid-cols-12 gap-8">
                {/* VM List - Left Column */}
                <div className="lg:col-span-4">
                  <ModernVMList />
                </div>
                
                {/* VM Configurator - Center Column */}
                <div className="lg:col-span-5">
                  {selectedVM ? (
                    <GlassCard variant="premium" className="p-8">
                      <VMConfigurator vm={selectedVM} calculadora={calculadora} />
                    </GlassCard>
                  ) : (
                    <GlassCard variant="default" className="p-12 text-center">
                      <div className="w-16 h-16 glass-card rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">⚙️</span>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Selecione uma VM
                      </h3>
                      <p className="text-gray-400">
                        Escolha uma VM da lista para configurar seus recursos
                      </p>
                    </GlassCard>
                  )}
                </div>
                
                {/* Summary - Right Column */}
                <div className="lg:col-span-3">
                  <ModernSummaryCard />
                </div>
              </div>
            ) : modoCalculo === 'pool' ? (
              // Pool Mode with Glass Background
              <div className="relative">
                <GlassCard variant="premium" className="p-6">
                  <PoolDeRecursos />
                </GlassCard>
              </div>
            ) : modoCalculo === 'upgrades' ? (
              // Upgrades Mode with Glass Background
              <div className="relative">
                <GlassCard variant="premium" className="p-6">
                  <UpgradeModule />
                </GlassCard>
              </div>
            ) : (
              // Propostas Mode with Glass Background
              <div className="relative">
                <GlassCard variant="premium" className="p-6">
                  <ListaPropostas />
                </GlassCard>
              </div>
            )}
          </div>
        </div>
      </div>
    </PremiumWrapper>
  );
};

export default Index;
