
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud } from '@/utils/calculadora';
import { Server, Database, TrendingUp, FileText } from 'lucide-react';
import { designSystem } from '@/styles/designSystem';

// Import new components
import ActionButton from './ui/ActionButton';
import CollapsibleCard from './ui/CollapsibleCard';
import CalculatorFlow from './ui/CalculatorFlow';
import ResultCard from './ui/ResultCard';

// Import existing components
import VMConfigurator from './VMConfigurator';
import PoolDeRecursos from './PoolDeRecursos';
import UpgradeModule from './UpgradeModule';
import ListaPropostas from './ListaPropostas';

const DarkCalculatorLayout = () => {
  const { vms, selectedVMId, precos, addVM } = useCalculadoraStore();
  const calculadora = new CalculadoraCloud(precos);
  const [modoCalculo, setModoCalculo] = useState<'vm' | 'pool' | 'upgrades' | 'propostas'>('vm');
  const [currentStep, setCurrentStep] = useState(1);
  const [showResults, setShowResults] = useState(false);

  const selectedVM = vms.find(vm => vm.id === selectedVMId);
  
  // Calculate totals
  const totalCost = vms.reduce((acc, vm) => {
    const custo = calculadora.calcularVM(vm);
    return acc + custo.total;
  }, 0);

  const breakdown = [
    { label: 'Infraestrutura', value: totalCost * 0.6, icon: <Server className="w-4 h-4" /> },
    { label: 'Licenças', value: totalCost * 0.3, icon: <Database className="w-4 h-4" /> },
    { label: 'Suporte', value: totalCost * 0.1, icon: <TrendingUp className="w-4 h-4" /> }
  ];

  const tabs = [
    { 
      id: 'vm', 
      name: 'VMs', 
      icon: <Server className="w-5 h-5" />,
      description: 'Configure cada máquina virtual'
    },
    { 
      id: 'pool', 
      name: 'Pool', 
      icon: <Database className="w-5 h-5" />,
      description: 'Recursos compartilhados'
    },
    { 
      id: 'upgrades', 
      name: 'Upgrades', 
      icon: <TrendingUp className="w-5 h-5" />,
      description: 'Serviços adicionais'
    },
    { 
      id: 'propostas', 
      name: 'Propostas', 
      icon: <FileText className="w-5 h-5" />,
      description: 'Documentos gerados'
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: designSystem.colors.background }}>
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg border-b" 
              style={{ 
                backgroundColor: `${designSystem.colors.background}CC`,
                borderColor: designSystem.colors.border 
              }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#FFD500] to-[#FFC700] rounded-xl flex items-center justify-center">
                <span className="text-black font-bold text-xl">O</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Calculadora Cloud
                </h1>
                <p className="text-sm text-gray-400">
                  Optidata - Soluções Enterprise
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ActionButton variant="primary" size="sm">
                Exportar Proposta
              </ActionButton>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 py-6">
        <motion.div 
          className="flex flex-wrap gap-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setModoCalculo(tab.id as any)}
              className={`
                flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-200
                ${modoCalculo === tab.id 
                  ? `bg-[${designSystem.colors.primary}] text-black shadow-lg` 
                  : `bg-[${designSystem.colors.surface}] text-white hover:bg-[${designSystem.colors.surfaceHover}] border border-[${designSystem.colors.border}]`
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {tab.icon}
              <div className="text-left hidden sm:block">
                <div className="font-semibold">{tab.name}</div>
                <div className="text-xs opacity-70">{tab.description}</div>
              </div>
              <span className="sm:hidden">{tab.name}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Progress Flow */}
        {modoCalculo === 'vm' && (
          <CalculatorFlow 
            currentStep={currentStep}
            onStepClick={setCurrentStep}
          />
        )}

        {/* Main Content */}
        <motion.div
          key={modoCalculo}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {modoCalculo === 'vm' ? (
            <div className="space-y-6">
              {/* VM Configuration */}
              {vms.length === 0 ? (
                <CollapsibleCard
                  title="Primeira VM"
                  subtitle="Configure seu primeiro servidor"
                  icon={<Server className="w-6 h-6" />}
                  defaultOpen={true}
                >
                  <div className="text-center py-8">
                    <div className="mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#FFD500] to-[#FFC700] rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                        <Server className="w-10 h-10 text-black" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Vamos começar!
                      </h3>
                      <p className="text-gray-400">
                        Configure os recursos da sua primeira máquina virtual
                      </p>
                    </div>
                    <ActionButton onClick={() => addVM()} variant="primary" size="lg">
                      Criar Primeira VM
                    </ActionButton>
                  </div>
                </CollapsibleCard>
              ) : (
                <>
                  {vms.map((vm, index) => (
                    <CollapsibleCard
                      key={vm.id}
                      title={vm.nome}
                      subtitle={`${vm.vcpu} vCPU • ${vm.ram}GB RAM • ${vm.discoFCM + vm.discoSSD}GB Storage`}
                      icon={<Server className="w-6 h-6" />}
                      badge={vm.id === selectedVMId ? 'Ativo' : undefined}
                      defaultOpen={index === 0}
                    >
                      <VMConfigurator vm={vm} calculadora={calculadora} />
                    </CollapsibleCard>
                  ))}
                  
                  {/* Add VM Button */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <ActionButton 
                      onClick={() => addVM()} 
                      variant="secondary" 
                      fullWidth
                      className="border-dashed border-2"
                    >
                      + Adicionar Nova VM
                    </ActionButton>
                  </motion.div>
                </>
              )}

              {/* Results */}
              {vms.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <ResultCard
                    total={totalCost}
                    breakdown={breakdown}
                    onExport={() => console.log('Export')}
                    onRecalculate={() => console.log('Recalculate')}
                    efficiency={Math.round(85 + Math.random() * 10)}
                  />
                </motion.div>
              )}
            </div>
          ) : modoCalculo === 'pool' ? (
            <PoolDeRecursos />
          ) : modoCalculo === 'upgrades' ? (
            <UpgradeModule />
          ) : (
            <ListaPropostas />
          )}
        </motion.div>
      </div>

      {/* Mobile Bottom Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 backdrop-blur-lg border-t"
           style={{ 
             backgroundColor: `${designSystem.colors.background}CC`,
             borderColor: designSystem.colors.border 
           }}>
        <ActionButton 
          onClick={() => setShowResults(true)}
          variant="primary"
          fullWidth
          size="lg"
        >
          Ver Resultado Final
        </ActionButton>
      </div>
    </div>
  );
};

export default DarkCalculatorLayout;
