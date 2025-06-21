
import React, { useState } from 'react';
import ModernHero from '@/components/ModernHero';
import ModernVMList from '@/components/ModernVMList';
import ModernSummaryCard from '@/components/ModernSummaryCard';
import VMConfigurator from '@/components/VMConfigurator';
import PoolDeRecursos from '@/components/PoolDeRecursos';
import UpgradeModule from '@/components/UpgradeModule';
import ListaPropostas from '@/components/ListaPropostas';
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud } from '@/utils/calculadora';
import { Server, Database, TrendingUp, FileText } from 'lucide-react';

const Index = () => {
  const { vms, selectedVMId, precos } = useCalculadoraStore();
  const calculadora = new CalculadoraCloud(precos);
  const selectedVM = vms.find(vm => vm.id === selectedVMId);
  const [modoCalculo, setModoCalculo] = useState<'vm' | 'pool' | 'upgrades' | 'propostas'>('vm');

  return (
    <div className="min-h-screen bg-optidata-dark">
      {/* Hero Section - Mantém gradiente azul mas com toque dourado */}
      <ModernHero />
      
      {/* Toggle para escolher o modo - VISUAL PREMIUM */}
      <div className="container mx-auto px-6 py-4">
        <div className="bg-optidata-dark-card rounded-lg shadow-sm p-4 mb-6 border border-optidata-dark-light">
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => setModoCalculo('vm')}
              className={`
                flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-300
                ${modoCalculo === 'vm' 
                  ? 'bg-optidata-gold text-optidata-dark shadow-lg' 
                  : 'bg-optidata-dark-light text-white hover:bg-optidata-dark-light/80 hover:border-optidata-gold/30 border border-transparent'
                }
              `}
            >
              <Server className="w-5 h-5 mr-2" />
              Cotação por VM
            </button>
            
            <button
              onClick={() => setModoCalculo('pool')}
              className={`
                flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-300
                ${modoCalculo === 'pool' 
                  ? 'bg-optidata-gold text-optidata-dark shadow-lg' 
                  : 'bg-optidata-dark-light text-white hover:bg-optidata-dark-light/80 hover:border-optidata-gold/30 border border-transparent'
                }
              `}
            >
              <Database className="w-5 h-5 mr-2" />
              Pool de Recursos
            </button>

            <button
              onClick={() => setModoCalculo('upgrades')}
              className={`
                flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-300
                ${modoCalculo === 'upgrades' 
                  ? 'bg-optidata-gold text-optidata-dark shadow-lg' 
                  : 'bg-optidata-dark-light text-white hover:bg-optidata-dark-light/80 hover:border-optidata-gold/30 border border-transparent'
                }
              `}
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Upgrades
            </button>

            <button
              onClick={() => setModoCalculo('propostas')}
              className={`
                flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-300
                ${modoCalculo === 'propostas' 
                  ? 'bg-optidata-gold text-optidata-dark shadow-lg' 
                  : 'bg-optidata-dark-light text-white hover:bg-optidata-dark-light/80 hover:border-optidata-gold/30 border border-transparent'
                }
              `}
            >
              <FileText className="w-5 h-5 mr-2" />
              Propostas
            </button>
          </div>
          
          <p className="text-center text-sm text-gray-400 mt-3">
            {modoCalculo === 'vm' 
              ? 'Configure cada máquina virtual individualmente'
              : modoCalculo === 'pool'
              ? 'Cote recursos totais para múltiplas VMs de uma vez'
              : modoCalculo === 'upgrades'
              ? 'Calcule itens e serviços avulsos'
              : 'Gerencie suas propostas salvas'
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
                <div className="bg-optidata-dark-card rounded-2xl shadow-lg border border-optidata-dark-light p-8">
                  <VMConfigurator vm={selectedVM} calculadora={calculadora} />
                </div>
              ) : (
                <div className="bg-optidata-dark-card rounded-2xl shadow-lg border border-optidata-dark-light p-12 text-center">
                  <div className="w-16 h-16 bg-optidata-dark-light rounded-full flex items-center justify-center mx-auto mb-4">
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
        ) : modoCalculo === 'pool' ? (
          // Modo Pool (existente)
          <PoolDeRecursos />
        ) : modoCalculo === 'upgrades' ? (
          // Modo Upgrades (existente)
          <UpgradeModule />
        ) : (
          // Nova aba Propostas
          <ListaPropostas />
        )}
      </div>
    </div>
  );
};

export default Index;
