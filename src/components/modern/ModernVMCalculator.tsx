
import { motion } from "framer-motion";
import { FuturisticCard } from "@/components/ui/FuturisticCard";
import { MoneyDisplay } from "@/components/ui/MoneyDisplay";
import { NeonButton } from "@/components/ui/NeonButton";
import { FuturisticInput } from "@/components/ui/FuturisticInput";
import { PageTransition } from "@/components/ui/PageTransition";
import { useCalculadoraStore } from "@/store/calculadora";
import { CalculadoraCloud } from "@/utils/calculadora";
import { useState } from "react";

export const ModernVMCalculator = () => {
  const { vms, selectedVMId, selectVM, updateVM, addVM, precos } = useCalculadoraStore();
  const calculadora = new CalculadoraCloud(precos);
  const selectedVM = vms.find(vm => vm.id === selectedVMId);
  
  const [newVMName, setNewVMName] = useState("");

  const addNewVM = () => {
    if (newVMName.trim()) {
      addVM({
        nome: newVMName,
        vcpu: 1,
        ram: 1,
        sistemaOperacional: 'Ubuntu 22.04 LTS',
        storage: 20,
        backup: false,
        monitoramento: false,
        suporte: false,
        quantidade: 1
      });
      setNewVMName("");
    }
  };

  const totalCusto = vms.reduce((total, vm) => {
    const vmCost = calculadora.calcularVM(vm);
    return total + (typeof vmCost === 'number' ? vmCost : vmCost.total);
  }, 0);

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 relative">
        {/* Efeito de grid futurista no fundo */}
        <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        
        {/* Gradiente de luz ambiente */}
        <div className="fixed inset-0 bg-gradient-radial from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
        
        {/* Header */}
        <div className="relative z-10 p-8">
          <motion.div 
            className="max-w-7xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
              Calculadora de Máquinas Virtuais
            </h1>
            <p className="text-gray-400 text-lg">Configure e otimize sua infraestrutura cloud</p>
          </motion.div>
        </div>

        {/* Conteúdo Principal */}
        <div className="relative z-10 px-8 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Coluna de Lista de VMs */}
              <div className="space-y-6">
                <FuturisticCard>
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    Máquinas Virtuais
                  </h2>
                  
                  {/* Adicionar nova VM */}
                  <div className="mb-6 space-y-4">
                    <FuturisticInput
                      label="Nova VM"
                      value={newVMName}
                      onChange={setNewVMName}
                      placeholder="Nome da VM"
                    />
                    <NeonButton 
                      onClick={addNewVM}
                      variant="primary"
                      className="w-full"
                    >
                      Adicionar VM
                    </NeonButton>
                  </div>

                  {/* Lista de VMs */}
                  <div className="space-y-3">
                    {vms.map((vm, index) => {
                      const vmCost = calculadora.calcularVM(vm);
                      const cost = typeof vmCost === 'number' ? vmCost : vmCost.total;
                      
                      return (
                        <motion.div
                          key={vm.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => selectVM(vm.id)}
                          className={`
                            p-4 rounded-xl cursor-pointer transition-all duration-300
                            ${selectedVMId === vm.id 
                              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-400/50' 
                              : 'bg-gray-800/40 border-2 border-gray-700/50 hover:border-cyan-400/30'
                            }
                          `}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="text-white font-semibold">{vm.nome}</h3>
                              <p className="text-gray-400 text-sm">
                                {vm.vcpu} vCPU • {vm.ram}GB RAM
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-yellow-400 font-bold">
                                R$ {cost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </p>
                              <p className="text-gray-400 text-xs">/mês</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </FuturisticCard>
              </div>

              {/* Coluna de Configuração */}
              <div className="space-y-6">
                {selectedVM ? (
                  <FuturisticCard highlight>
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      Configurar {selectedVM.nome}
                    </h2>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <FuturisticInput
                          label="vCPU"
                          type="number"
                          value={selectedVM.vcpu}
                          onChange={(value) => updateVM(selectedVM.id, { vcpu: value })}
                        />
                        <FuturisticInput
                          label="RAM (GB)"
                          type="number"
                          value={selectedVM.ram}
                          onChange={(value) => updateVM(selectedVM.id, { ram: value })}
                        />
                      </div>
                      
                      <FuturisticInput
                        label="Storage (GB)"
                        type="number"
                        value={selectedVM.storage}
                        onChange={(value) => updateVM(selectedVM.id, { storage: value })}
                      />
                      
                      <FuturisticInput
                        label="Quantidade"
                        type="number"
                        value={selectedVM.quantidade || 1}
                        onChange={(value) => updateVM(selectedVM.id, { quantidade: value })}
                      />

                      {/* Toggles para recursos adicionais */}
                      <div className="space-y-4">
                        <h3 className="text-white font-semibold">Recursos Adicionais</h3>
                        {[
                          { key: 'backup', label: 'Backup Automático' },
                          { key: 'monitoramento', label: 'Monitoramento 24/7' },
                          { key: 'suporte', label: 'Suporte Premium' }
                        ].map(({ key, label }) => (
                          <motion.div
                            key={key}
                            className={`
                              p-4 rounded-lg border-2 cursor-pointer transition-all duration-300
                              ${selectedVM[key as keyof typeof selectedVM]
                                ? 'bg-green-500/20 border-green-400/50'
                                : 'bg-gray-800/40 border-gray-700/50 hover:border-cyan-400/30'
                              }
                            `}
                            onClick={() => updateVM(selectedVM.id, { 
                              [key]: !selectedVM[key as keyof typeof selectedVM] 
                            })}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-white font-medium">{label}</span>
                              <div className={`
                                w-6 h-6 rounded-full border-2 flex items-center justify-center
                                ${selectedVM[key as keyof typeof selectedVM]
                                  ? 'bg-green-500 border-green-400'
                                  : 'border-gray-400'
                                }
                              `}>
                                {selectedVM[key as keyof typeof selectedVM] && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-2 h-2 bg-white rounded-full"
                                  />
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </FuturisticCard>
                ) : (
                  <FuturisticCard>
                    <div className="text-center py-12">
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
                  </FuturisticCard>
                )}
              </div>

              {/* Coluna de Resumo */}
              <div className="space-y-6">
                <FuturisticCard highlight>
                  <MoneyDisplay 
                    value={totalCusto} 
                    label="Custo Total Mensal"
                    size="md"
                  />
                </FuturisticCard>
                
                <FuturisticCard>
                  <h3 className="text-xl font-bold text-white mb-4">Ações Rápidas</h3>
                  <div className="space-y-3">
                    <NeonButton 
                      variant="success" 
                      className="w-full"
                      onClick={() => console.log('Gerar proposta')}
                    >
                      Gerar Proposta
                    </NeonButton>
                    <NeonButton 
                      variant="secondary" 
                      className="w-full"
                      onClick={() => console.log('Exportar configuração')}
                    >
                      Exportar Config
                    </NeonButton>
                  </div>
                </FuturisticCard>

                {selectedVM && (
                  <FuturisticCard>
                    <h3 className="text-white font-semibold mb-4">Detalhes da VM</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Sistema:</span>
                        <span className="text-white">{selectedVM.sistemaOperacional}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">vCPU:</span>
                        <span className="text-cyan-400">{selectedVM.vcpu}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">RAM:</span>
                        <span className="text-cyan-400">{selectedVM.ram}GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Storage:</span>
                        <span className="text-cyan-400">{selectedVM.storage}GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Quantidade:</span>
                        <span className="text-yellow-400">{selectedVM.quantidade || 1}x</span>
                      </div>
                    </div>
                  </FuturisticCard>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
