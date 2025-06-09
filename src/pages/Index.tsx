
import React from 'react';
import Header from '@/components/Header';
import ModernVMList from '@/components/ModernVMList';
import ModernSummaryCard from '@/components/ModernSummaryCard';
import { useCalculadoraStore } from '@/store/calculadora';

const Index = () => {
  const { vms } = useCalculadoraStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      
      {/* Hero Section - Clean and Professional */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Calculadora Cloud Enterprise
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Configure sua infraestrutura em nuvem com precisão. 
              Calcule custos, otimize recursos e gere propostas profissionais.
            </p>
          </div>
        </div>
      </div>
      
      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* VM Configuration Area - 2/3 */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Configuração de Servidores
                </h2>
                <p className="text-gray-600">
                  {vms.length === 0 
                    ? 'Comece criando sua primeira máquina virtual'
                    : `${vms.length} servidor${vms.length !== 1 ? 'es' : ''} configurado${vms.length !== 1 ? 's' : ''}`
                  }
                </p>
              </div>
              <ModernVMList />
            </div>
          </div>
          
          {/* Pricing Summary - 1/3 */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <ModernSummaryCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
