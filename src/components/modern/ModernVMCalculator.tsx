
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FuturisticCard } from "@/components/ui/FuturisticCard";
import { MoneyDisplay } from "@/components/ui/MoneyDisplay";
import { NeonButton } from "@/components/ui/NeonButton";
import { FuturisticInput } from "@/components/ui/FuturisticInput";
import { PageTransition } from "@/components/ui/PageTransition";
import { useCalculadoraStore } from "@/store/calculadora";
import { CalculadoraCloud } from "@/utils/calculadora";
import { Precos } from "@/types";
import { ModernVMLoader } from "./ModernVMLoader";

// Preços padrão para usar como fallback
const PRECOS_FALLBACK: Precos = {
  vcpuHora: 0.0347,
  ramHora: 0.0278,
  horasMes: 720,
  fcmGB: 0.75,
  ssdGB: 0.55,
  backupPadrao: 0.30,
  backupDuplo: 0.25,
  backupTriplo: 0.20,
  monitoramento: 100,
  antivirus: 55,
  tsplus: {
    3: 140,
    5: 180,
    10: 310,
    15: 390,
    25: 550,
    35: 730,
    49: 990,
    ilimitado: 1190
  },
  tsplusAdvSec: 140,
  tsplus2FA: 165,
  thinprint: 850,
  ipAdicional: 70,
  waf: {
    pro: 200,
    business: 1600,
    enterprise: 15600
  }
};

export const ModernVMCalculator = () => {
  console.log('ModernVMCalculator: Iniciando componente...');
  
  // Estado de carregamento
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Carregar store com tratamento de erro
  const storeData = useCalculadoraStore();
  
  // Extrair dados do store com fallbacks seguros
  const { 
    vms = [], 
    selectedVMId = null, 
    selectVM, 
    updateVM, 
    addVM, 
    precos 
  } = storeData || {};
  
  // Usar preços do store ou fallback
  const precosValidos = useMemo(() => {
    return precos && Object.keys(precos).length > 0 ? precos : PRECOS_FALLBACK;
  }, [precos]);
  
  // Criar calculadora com memoização
  const calculadora = useMemo(() => {
    try {
      return new CalculadoraCloud(precosValidos);
    } catch (error) {
      console.error('Erro ao criar calculadora:', error);
      return null;
    }
  }, [precosValidos]);
  
  // Verificar se está carregando
  React.useEffect(() => {
    if (calculadora && precosValidos) {
      setIsInitializing(false);
    }
  }, [calculadora, precosValidos]);
  
  const selectedVM = vms?.find(vm => vm?.id === selectedVMId) || null;
  const [newVMName, setNewVMName] = useState("");

  const addNewVM = () => {
    if (newVMName?.trim() && addVM) {
      addVM({
        nome: newVMName,
        vcpu: 1,
        ram: 1,
        sistemaOperacional: 'Ubuntu 22.04 LTS',
        discoSSD: 20,
        discoFCM: 0,
        backupTipo: 'padrao',
        bancoDados: '',
        antivirus: false,
        tsplus: {
          enabled: false,
          usuarios: 5,
          advancedSecurity: false,
          twoFactor: false
        },
        thinprint: false,
        ipsAdicionais: 0,
        waf: 'none',
        descontoIndividual: 0,
        status: 'rascunho'
      });
      setNewVMName("");
    }
  };

  // Calcular total com segurança e memoização
  const totalCusto = useMemo(() => {
    if (!calculadora || !Array.isArray(vms)) return 0;
    
    return vms.reduce((total, vm) => {
      try {
        if (!vm) return total;
        const vmCost = calculadora.calcularVM(vm);
        const cost = typeof vmCost === 'number' ? vmCost : (vmCost?.total || 0);
        return total + cost;
      } catch (error) {
        console.error('Erro ao calcular VM:', vm?.nome, error);
        return total;
      }
    }, 0);
  }, [calculadora, vms]);

  // Mostrar loader enquanto inicializa
  if (isInitializing || !calculadora) {
    return <ModernVMLoader />;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 relative">
        {/* Background effects */}
        <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
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

        {/* Main Content */}
        <div className="relative z-10 px-8 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* VMs List Column */}
              <div className="space-y-6">
                <FuturisticCard>
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    Máquinas Virtuais ({vms?.length || 0})
                  </h2>
                  
                  {/* Add new VM */}
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

                  {/* VMs List */}
                  <div className="space-y-3">
                    {Array.isArray(vms) && vms.length > 0 ? (
                      vms.map((vm, index) => {
                        if (!vm) return null;
                        
                        let cost = 0;
                        try {
                          const vmCost = calculadora.calcularVM(vm);
                          cost = typeof vmCost === 'number' ? vmCost : (vmCost?.total || 0);
                        } catch (error) {
                          console.error('Erro ao calcular custo da VM:', vm.nome, error);
                        }
                        
                        return (
                          <motion.div
                            key={vm.id || index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => selectVM && selectVM(vm.id)}
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
                                <h3 className="text-white font-semibold">{vm.nome || 'VM sem nome'}</h3>
                                <p className="text-gray-400 text-sm">
                                  {vm.vcpu || 0} vCPU • {vm.ram || 0}GB RAM
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
                      })
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-400">Nenhuma VM criada ainda</p>
                        <p className="text-gray-500 text-sm mt-2">Adicione uma VM para começar</p>
                      </div>
                    )}
                  </div>
                </FuturisticCard>
              </div>

              {/* Configuration Column */}
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
                          value={selectedVM.vcpu || 1}
                          onChange={(value) => updateVM && updateVM(selectedVM.id, { vcpu: Number(value) || 1 })}
                        />
                        <FuturisticInput
                          label="RAM (GB)"
                          type="number"
                          value={selectedVM.ram || 1}
                          onChange={(value) => updateVM && updateVM(selectedVM.id, { ram: Number(value) || 1 })}
                        />
                      </div>
                      
                      <FuturisticInput
                        label="Storage SSD (GB)"
                        type="number"
                        value={selectedVM.discoSSD || 20}
                        onChange={(value) => updateVM && updateVM(selectedVM.id, { discoSSD: Number(value) || 20 })}
                      />
                      
                      <FuturisticInput
                        label="Storage FCM (GB)"
                        type="number"
                        value={selectedVM.discoFCM || 0}
                        onChange={(value) => updateVM && updateVM(selectedVM.id, { discoFCM: Number(value) || 0 })}
                      />

                      <div className="space-y-4">
                        <h3 className="text-white font-semibold">Recursos Adicionais</h3>
                        {[
                          { key: 'antivirus', label: 'Antivírus' },
                          { key: 'thinprint', label: 'ThinPrint' }
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
                            onClick={() => updateVM && updateVM(selectedVM.id, { 
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

              {/* Summary Column */}
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
                        <span className="text-white">{selectedVM.sistemaOperacional || 'Não definido'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">vCPU:</span>
                        <span className="text-cyan-400">{selectedVM.vcpu || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">RAM:</span>
                        <span className="text-cyan-400">{selectedVM.ram || 0}GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">SSD Storage:</span>
                        <span className="text-cyan-400">{selectedVM.discoSSD || 0}GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">FCM Storage:</span>
                        <span className="text-cyan-400">{selectedVM.discoFCM || 0}GB</span>
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
