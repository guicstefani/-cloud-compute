
import React, { useState } from 'react';
import ModernHero from '@/components/ModernHero';
import ModernVMList from '@/components/ModernVMList';
import ModernSummaryCard from '@/components/ModernSummaryCard';
import VMConfigurator from '@/components/VMConfigurator';
import PoolDeRecursos from '@/components/PoolDeRecursos';
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud } from '@/utils/calculadora';
import { Server, Database } from 'lucide-react';

const Index = () => {
  const { vms, selectedVMId, precos } = useCalculadoraStore();
  const calculadora = new CalculadoraCloud(precos);
  const selectedVM = vms.find(vm => vm.id === selectedVMId);
  const [modoCalculo, setModoCalculo] = useState<'vm' | 'pool'>('vm');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <ModernHero />
      
      {/* Toggle para escolher o modo */}
      <div className="container mx-auto px-6 py-4">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-center space-x-8">
            <button
              onClick={() => setModoCalculo('vm')}
              className={`
                flex items-center px-6 py-3 rounded-lg font-medium transition-all
                ${modoCalculo === 'vm' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              <Server className="w-5 h-5 mr-2" />
              Cotação por VM
            </button>
            
            <button
              onClick={() => setModoCalculo('pool')}
              className={`
                flex items-center px-6 py-3 rounded-lg font-medium transition-all
                ${modoCalculo === 'pool' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              <Database className="w-5 h-5 mr-2" />
              Pool de Recursos
            </button>
          </div>
          
          <p className="text-center text-sm text-gray-600 mt-3">
            {modoCalculo === 'vm' 
              ? 'Configure cada máquina virtual individualmente'
              : 'Cote recursos totais para múltiplas VMs de uma vez'
            }
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {modoCalculo === 'vm' ? (
          // Modo VM por VM (existente)
          <div className="grid lg:grid-cols-12 gap-8">
            {/* VM List - Left Column */}
            <div className="lg:col-span-4">
              <ModernVMList />
            </div>
            
            {/* VM Configurator - Center Column */}
            <div className="lg:col-span-5">
              {selectedVM ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <VMConfigurator vm={selectedVM} calculadora={calculadora} />
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⚙️</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Selecione uma VM
                  </h3>
                  <p className="text-gray-500">
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
        ) : (
          // Novo modo Pool
          <PoolDeRecursos />
        )}
      </div>
    </div>
  );
};

export default Index;
