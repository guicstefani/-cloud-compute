
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

// Import do design system premium
import '@/styles/optidata-theme.css';

const Index = () => {
  const { vms, selectedVMId, precos } = useCalculadoraStore();
  const calculadora = new CalculadoraCloud(precos);
  const selectedVM = vms.find(vm => vm.id === selectedVMId);
  const [modoCalculo, setModoCalculo] = useState<'vm' | 'pool' | 'upgrades' | 'propostas'>('vm');

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section Premium */}
      <div className="relative bg-gradient-to-br from-gray-900 via-[#0a0a0a] to-gray-900 text-white overflow-hidden">
        {/* Background Effects Premium */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,174,29,0.1),transparent_50%)]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#DCAE1D] rounded-full filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F4C430] rounded-full filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '3s' }}></div>
        
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="text-center">
            {/* Logo Premium */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#DCAE1D] to-[#F4C430] rounded-2xl flex items-center justify-center shadow-2xl animate-glow">
                <span className="text-2xl font-bold text-black">O</span>
              </div>
              <div className="text-left">
                <h1 className="premium-title">
                  Cloud Computing
                </h1>
                <p className="text-sm text-[#DCAE1D] font-medium">Infraestrutura Enterprise Premium</p>
              </div>
            </div>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-light">
              Infraestrutura Enterprise de Alta Performance com Transparência Total de Custos
            </p>
            
            {/* Trust Badges Premium */}
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <div className="premium-card px-6 py-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">99.99% Uptime</span>
              </div>
              <div className="premium-card px-6 py-3 flex items-center gap-2">
                <span className="text-[#DCAE1D] text-xl">🛡️</span>
                <span className="text-sm font-medium">ISO 27001</span>
              </div>
              <div className="premium-card px-6 py-3 flex items-center gap-2">
                <span className="text-[#DCAE1D] text-xl">🏆</span>
                <span className="text-sm font-medium">Tier III</span>
              </div>
              <div className="premium-card px-6 py-3 flex items-center gap-2">
                <span className="text-[#DCAE1D] text-xl">⚡</span>
                <span className="text-sm font-medium">Deploy em 5min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation Premium */}
      <div className="container mx-auto px-6 py-6">
        <div className="premium-card p-6 mb-8">
          <div className="flex items-center justify-center space-x-4 flex-wrap gap-2">
            <button
              onClick={() => setModoCalculo('vm')}
              className={`
                flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300
                ${modoCalculo === 'vm' 
                  ? 'bg-gradient-to-r from-[#DCAE1D] to-[#F4C430] text-black shadow-lg' 
                  : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a] hover:text-white border border-gray-700'
                }
              `}
            >
              <Server className="w-5 h-5 mr-2" />
              Cotação por VM
            </button>
            
            <button
              onClick={() => setModoCalculo('pool')}
              className={`
                flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300
                ${modoCalculo === 'pool' 
                  ? 'bg-gradient-to-r from-[#DCAE1D] to-[#F4C430] text-black shadow-lg' 
                  : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a] hover:text-white border border-gray-700'
                }
              `}
            >
              <Database className="w-5 h-5 mr-2" />
              Pool de Recursos
            </button>

            <button
              onClick={() => setModoCalculo('upgrades')}
              className={`
                flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300
                ${modoCalculo === 'upgrades' 
                  ? 'bg-gradient-to-r from-[#DCAE1D] to-[#F4C430] text-black shadow-lg' 
                  : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a] hover:text-white border border-gray-700'
                }
              `}
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Upgrades
            </button>

            <button
              onClick={() => setModoCalculo('propostas')}
              className={`
                flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300
                ${modoCalculo === 'propostas' 
                  ? 'bg-gradient-to-r from-[#DCAE1D] to-[#F4C430] text-black shadow-lg' 
                  : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a] hover:text-white border border-gray-700'
                }
              `}
            >
              <FileText className="w-5 h-5 mr-2" />
              Propostas
            </button>
          </div>
          
          <p className="text-center text-sm text-gray-400 mt-4">
            {modoCalculo === 'vm' 
              ? 'Configure cada máquina virtual individualmente com precisão'
              : modoCalculo === 'pool'
              ? 'Dimensione recursos totais para múltiplas VMs de uma vez'
              : modoCalculo === 'upgrades'
              ? 'Adicione itens e serviços complementares'
              : 'Gerencie e visualize suas propostas comerciais'
            }
          </p>
        </div>
      </div>
      
      {/* Main Content Premium */}
      <div className="container mx-auto px-4 py-6">
        {modoCalculo === 'vm' ? (
          // Modo VM por VM Premium
          <div className="grid lg:grid-cols-12 gap-8">
            {/* VM List - Left Column Premium */}
            <div className="lg:col-span-4">
              <div className="premium-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Suas Máquinas Virtuais</h2>
                  <div className="w-8 h-1 bg-gradient-to-r from-[#DCAE1D] to-[#F4C430] rounded-full"></div>
                </div>
                <ModernVMList />
              </div>
            </div>
            
            {/* VM Configurator - Center Column Premium */}
            <div className="lg:col-span-5">
              {selectedVM ? (
                <div className="premium-card p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#DCAE1D] to-[#F4C430] rounded-xl flex items-center justify-center">
                      <Server className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Configuração Premium</h2>
                      <p className="text-sm text-gray-400">Customize sua infraestrutura</p>
                    </div>
                  </div>
                  <VMConfigurator vm={selectedVM} calculadora={calculadora} />
                </div>
              ) : (
                <div className="premium-card p-12 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#DCAE1D]/20 to-[#F4C430]/20 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse-gold">
                    <Server className="w-10 h-10 text-[#DCAE1D]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Selecione uma VM
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Escolha uma máquina virtual da lista para configurar seus recursos
                  </p>
                  <div className="w-32 h-1 bg-gradient-to-r from-[#DCAE1D] to-[#F4C430] rounded-full mx-auto"></div>
                </div>
              )}
            </div>
            
            {/* Summary - Right Column Premium */}
            <div className="lg:col-span-3">
              <ModernSummaryCard />
            </div>
          </div>
        ) : modoCalculo === 'pool' ? (
          // Modo Pool Premium
          <div className="premium-card p-8">
            <PoolDeRecursos />
          </div>
        ) : modoCalculo === 'upgrades' ? (
          // Modo Upgrades Premium
          <div className="premium-card p-8">
            <UpgradeModule />
          </div>
        ) : (
          // Nova aba Propostas Premium
          <div className="premium-card p-8">
            <ListaPropostas />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
