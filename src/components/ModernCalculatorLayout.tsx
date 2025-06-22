
import React from 'react';
import { useCalculadoraStore } from '@/store/calculadora';
import { AnimatedValueCard } from './AnimatedValueCard';
import { FluidVMCard } from './FluidVMCard';
import { DiagnosticCSS } from './DiagnosticCSS';
import { useOptimizedCalculation } from '@/hooks/useOptimizedCalculation';
import { Button } from '@/components/ui/button';
import { Plus, Sparkles } from 'lucide-react';

export const ModernCalculatorLayout = () => {
  console.log('🚀 ModernCalculatorLayout iniciando...');
  
  const { vms, selectedVMId, precos, selectVM, addVM } = useCalculadoraStore();
  const { calculadora } = useOptimizedCalculation(vms, precos, []);
  
  console.log('📊 Estado atual:', { 
    vmsCount: vms.length, 
    selectedVMId, 
    precosLoaded: !!precos,
    calculadoraLoaded: !!calculadora 
  });
  
  const totalGeral = calculadora.calcularTotalGeral(vms, []).totalComDesconto;
  const totalInfraestrutura = vms.reduce((sum, vm) => sum + calculadora.calcularVM(vm).subtotalInfra, 0);

  console.log('💰 Valores calculados:', { totalGeral, totalInfraestrutura });

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Diagnostic component - debug ativo */}
      <DiagnosticCSS />
      
      {/* Fundo com gradiente premium dourado */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(220,174,29,0.1)_0%,_transparent_50%)] animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(244,196,48,0.05)_0%,_transparent_50%)] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Layout principal */}
      <div className="relative z-10 flex h-screen">
        {/* Coluna principal - Lista de VMs */}
        <div className="flex-1 p-8 overflow-y-auto">
          {/* Header com cores premium */}
          <div className="mb-8">
            <h1 className="text-4xl font-black bg-gradient-to-r from-white via-[#DCAE1D] to-[#F4C430] bg-clip-text text-transparent mb-2">
              Calculadora Cloud Premium
            </h1>
            <p className="text-gray-300">
              Configure seus servidores virtuais com precisão profissional
            </p>
          </div>
          
          {/* Lista de VMs */}
          {vms.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-[#DCAE1D] to-[#F4C430] rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-[#DCAE1D]/30">
                <Sparkles className="w-10 h-10 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Crie seu primeiro servidor
              </h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Configure os recursos necessários para sua aplicação
              </p>
              <Button
                onClick={() => {
                  console.log('🔧 Adicionando nova VM...');
                  addVM();
                }}
                className="bg-gradient-to-r from-[#DCAE1D] to-[#F4C430] text-black font-bold px-8 py-4 text-lg hover:from-[#B8941A] hover:to-[#D4AC2D] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl shadow-[#DCAE1D]/30"
              >
                <Plus className="w-5 h-5 mr-2" />
                Criar Primeira VM
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Seus Servidores ({vms.length})
                </h2>
                <Button
                  onClick={() => {
                    console.log('➕ Adicionando VM adicional...');
                    addVM();
                  }}
                  className="bg-gradient-to-r from-[#DCAE1D] to-[#F4C430] text-black font-bold hover:from-[#B8941A] hover:to-[#D4AC2D] transition-all duration-300 hover:scale-105"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar VM
                </Button>
              </div>
              
              {vms.map(vm => {
                console.log(`🖥️ Renderizando VM: ${vm.nome} (${vm.id})`);
                return (
                  <FluidVMCard
                    key={vm.id}
                    vm={vm}
                    isSelected={vm.id === selectedVMId}
                    onSelect={() => {
                      console.log(`🎯 Selecionando VM: ${vm.id}`);
                      selectVM(vm.id);
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
        
        {/* Sidebar direita - Resumo com cores premium */}
        <div className="w-96 bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-xl border-l border-[#DCAE1D]/20 p-8 overflow-y-auto">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-[#DCAE1D] bg-clip-text text-transparent mb-8">
            Resumo Financeiro
          </h2>
          
          <div className="space-y-6">
            <AnimatedValueCard
              value={totalGeral}
              label="Total Geral"
              className="mb-6"
            />
            
            <AnimatedValueCard
              value={totalInfraestrutura}
              label="Infraestrutura"
            />
            
            {/* Breakdown detalhado com cores premium */}
            <div className="pt-6 border-t border-[#DCAE1D]/20">
              <h3 className="text-lg font-semibold text-white mb-4">Detalhamento</h3>
              <div className="space-y-3">
                {vms.map(vm => {
                  const custo = calculadora.calcularVM(vm);
                  return (
                    <div 
                      key={vm.id} 
                      className={`p-3 rounded-lg transition-all duration-200 hover:bg-[#DCAE1D]/10 cursor-pointer border ${
                        vm.id === selectedVMId 
                          ? 'bg-[#DCAE1D]/20 border-[#DCAE1D]/50 shadow-lg shadow-[#DCAE1D]/20' 
                          : 'bg-gray-800/30 border-gray-700/50 hover:border-[#DCAE1D]/30'
                      }`}
                      onClick={() => {
                        console.log(`🎯 Selecionando VM via resumo: ${vm.id}`);
                        selectVM(vm.id);
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">{vm.nome}</span>
                        <span className="text-sm font-semibold text-[#DCAE1D]">
                          {custo.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
