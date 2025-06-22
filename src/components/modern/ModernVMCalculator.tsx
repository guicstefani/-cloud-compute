
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useCalculadoraStore } from "@/store/calculadora";
import { CalculadoraCloud } from "@/utils/calculadora";
import { Precos } from "@/types";
import { ModernVMLoader } from "./ModernVMLoader";
import { Server, Plus, Settings, Trash2 } from "lucide-react";

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
    removeVM,
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
    <div className="min-h-screen bg-dark p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gold mb-2">
          Calculadora de Máquinas Virtuais
        </h1>
        <p className="text-gray-400 text-lg">Configure e otimize sua infraestrutura cloud</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* VMs List Column */}
        <div className="space-y-4">
          <div className="premium-card">
            <div className="flex items-center gap-2 mb-6">
              <Server className="w-5 h-5 text-gold" />
              <h2 className="text-xl font-bold text-white">
                Máquinas Virtuais ({vms?.length || 0})
              </h2>
            </div>
            
            {/* Add new VM */}
            <div className="mb-6 space-y-4">
              <input
                type="text"
                className="premium-input w-full"
                value={newVMName}
                onChange={(e) => setNewVMName(e.target.value)}
                placeholder="Nome da nova VM"
              />
              <button 
                onClick={addNewVM}
                className="premium-btn w-full"
              >
                <Plus className="w-4 h-4" />
                Adicionar VM
              </button>
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
                        premium-card cursor-pointer transition-all duration-300
                        ${selectedVMId === vm.id 
                          ? 'border-gold bg-opacity-20' 
                          : 'hover:border-gold hover:border-opacity-30'
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
                          <p className="text-gold font-bold">
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
          </div>
        </div>

        {/* Configuration Column */}
        <div className="space-y-4">
          {selectedVM ? (
            <div className="premium-card">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-gold" />
                <h2 className="text-xl font-bold text-white">
                  Configurar {selectedVM.nome}
                </h2>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">vCPU</label>
                    <input
                      type="number"
                      className="premium-input w-full"
                      value={selectedVM.vcpu || 1}
                      onChange={(e) => updateVM && updateVM(selectedVM.id, { vcpu: Number(e.target.value) || 1 })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">RAM (GB)</label>
                    <input
                      type="number"
                      className="premium-input w-full"
                      value={selectedVM.ram || 1}
                      onChange={(e) => updateVM && updateVM(selectedVM.id, { ram: Number(e.target.value) || 1 })}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Storage SSD (GB)</label>
                  <input
                    type="number"
                    className="premium-input w-full"
                    value={selectedVM.discoSSD || 20}
                    onChange={(e) => updateVM && updateVM(selectedVM.id, { discoSSD: Number(e.target.value) || 20 })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Storage FCM (GB)</label>
                  <input
                    type="number"
                    className="premium-input w-full"
                    value={selectedVM.discoFCM || 0}
                    onChange={(e) => updateVM && updateVM(selectedVM.id, { discoFCM: Number(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-white font-semibold">Recursos Adicionais</h3>
                  {[
                    { key: 'antivirus', label: 'Antivírus' },
                    { key: 'thinprint', label: 'ThinPrint' }
                  ].map(({ key, label }) => (
                    <div
                      key={key}
                      className={`
                        premium-card cursor-pointer transition-all duration-300
                        ${selectedVM[key as keyof typeof selectedVM]
                          ? 'border-green-500 bg-green-500 bg-opacity-10'
                          : 'hover:border-gold hover:border-opacity-30'
                        }
                      `}
                      onClick={() => updateVM && updateVM(selectedVM.id, { 
                        [key]: !selectedVM[key as keyof typeof selectedVM] 
                      })}
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
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="premium-card">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Selecione uma VM
                </h3>
                <p className="text-gray-400">
                  Escolha uma VM da lista para configurar seus recursos
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Summary Column */}
        <div className="space-y-4">
          <div className="premium-card text-center">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Custo Total Mensal</h3>
            <div className="text-4xl font-bold text-gold mb-2">
              R$ {totalCusto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-gray-400 text-sm">por mês</p>
          </div>
          
          <div className="premium-card">
            <h3 className="text-xl font-bold text-white mb-4">Ações Rápidas</h3>
            <div className="space-y-3">
              <button className="premium-btn w-full">
                Gerar Proposta
              </button>
              <button className="premium-btn w-full">
                Exportar Config
              </button>
            </div>
          </div>

          {selectedVM && (
            <div className="premium-card">
              <h3 className="text-white font-semibold mb-4">Detalhes da VM</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Sistema:</span>
                  <span className="text-white">{selectedVM.sistemaOperacional || 'Não definido'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">vCPU:</span>
                  <span className="text-gold">{selectedVM.vcpu || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">RAM:</span>
                  <span className="text-gold">{selectedVM.ram || 0}GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">SSD Storage:</span>
                  <span className="text-gold">{selectedVM.discoSSD || 0}GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">FCM Storage:</span>
                  <span className="text-gold">{selectedVM.discoFCM || 0}GB</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
