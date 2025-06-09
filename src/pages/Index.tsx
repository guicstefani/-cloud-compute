
import React from 'react';
import Header from '@/components/Header';
import ModernHero from '@/components/ModernHero';
import ModernVMList from '@/components/ModernVMList';
import ModernSummaryCard from '@/components/ModernSummaryCard';
import VMConfigurator from '@/components/VMConfigurator';
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud } from '@/utils/calculadora';

const Index = () => {
  const { vms, selectedVMId, precos } = useCalculadoraStore();
  const calculadora = new CalculadoraCloud(precos);
  const selectedVM = vms.find(vm => vm.id === selectedVMId);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <ModernHero />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* VM List - Left Column */}
          <div className="lg:col-span-4">
            <ModernVMList />
          </div>
          
          {/* VM Configurator - Center Column */}
          <div className="lg:col-span-5">
            {selectedVM ? (
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-8">
                <VMConfigurator vm={selectedVM} calculadora={calculadora} />
              </div>
            ) : (
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-12 text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
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
    </div>
  );
};

export default Index;
