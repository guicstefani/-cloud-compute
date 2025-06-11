
import React, { useState } from 'react';
import VMList from '@/components/VMList';
import ModernSummaryCard from '@/components/ModernSummaryCard';
import VMConfigurator from '@/components/VMConfigurator';
import PoolDeRecursos from '@/components/PoolDeRecursos';
import UpgradeModule from '@/components/UpgradeModule';
import ListaPropostas from '@/components/ListaPropostas';
import Header from '@/components/Header';
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud } from '@/utils/calculadora';
import { Server, Database, TrendingUp, FileText } from 'lucide-react';

const Index = () => {
  const { vms, selectedVMId, precos } = useCalculadoraStore();
  const calculadora = new CalculadoraCloud(precos);
  const selectedVM = vms.find(vm => vm.id === selectedVMId);
  const [modoCalculo, setModoCalculo] = useState<'vm' | 'pool' | 'upgrades' | 'propostas'>('vm');

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      {/* Navigation Compacta */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-center space-x-1">
            <button
              onClick={() => setModoCalculo('vm')}
              className={`
                flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${modoCalculo === 'vm' 
                  ? 'bg-slate-800 text-white' 
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                }
              `}
            >
              <Server className="w-4 h-4 mr-2" />
              VMs
            </button>
            
            <button
              onClick={() => setModoCalculo('pool')}
              className={`
                flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${modoCalculo === 'pool' 
                  ? 'bg-slate-800 text-white' 
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                }
              `}
            >
              <Database className="w-4 h-4 mr-2" />
              Pool
            </button>

            <button
              onClick={() => setModoCalculo('upgrades')}
              className={`
                flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${modoCalculo === 'upgrades' 
                  ? 'bg-slate-800 text-white' 
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                }
              `}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Upgrades
            </button>

            <button
              onClick={() => setModoCalculo('propostas')}
              className={`
                flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${modoCalculo === 'propostas' 
                  ? 'bg-slate-800 text-white' 
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                }
              `}
            >
              <FileText className="w-4 h-4 mr-2" />
              Propostas
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        {modoCalculo === 'vm' ? (
          <div className="grid grid-cols-12 gap-6 h-full">
            {/* Painel Esquerdo - Lista de VMs */}
            <div className="col-span-3">
              <VMList />
            </div>
            
            {/* Painel Central - Configuração */}
            <div className="col-span-6">
              {selectedVM ? (
                <div className="bg-white rounded-lg border border-slate-200 p-6 h-full">
                  <VMConfigurator vm={selectedVM} calculadora={calculadora} />
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-slate-200 p-12 text-center h-full flex flex-col justify-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Server className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    Selecione uma VM
                  </h3>
                  <p className="text-slate-500 text-sm">
                    Escolha um servidor da lista para configurar
                  </p>
                </div>
              )}
            </div>
            
            {/* Painel Direito - Resumo */}
            <div className="col-span-3">
              <ModernSummaryCard />
            </div>
          </div>
        ) : modoCalculo === 'pool' ? (
          <PoolDeRecursos />
        ) : modoCalculo === 'upgrades' ? (
          <UpgradeModule />
        ) : (
          <ListaPropostas />
        )}
      </div>
    </div>
  );
};

export default Index;
