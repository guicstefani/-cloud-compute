
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PremiumHero from '@/components/PremiumHero';
import PremiumVMList from '@/components/PremiumVMList';
import ModernSummaryCard from '@/components/ModernSummaryCard';
import VMConfigurator from '@/components/VMConfigurator';
import PoolDeRecursos from '@/components/PoolDeRecursos';
import UpgradeModule from '@/components/UpgradeModule';
import ListaPropostas from '@/components/ListaPropostas';
import AnimatedBackground from '@/components/AnimatedBackground';
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud } from '@/utils/calculadora';
import { Server, Database, TrendingUp, FileText, Sparkles } from 'lucide-react';

const Index = () => {
  const { vms, selectedVMId, precos } = useCalculadoraStore();
  const calculadora = new CalculadoraCloud(precos);
  const selectedVM = vms.find(vm => vm.id === selectedVMId);
  const [modoCalculo, setModoCalculo] = useState<'vm' | 'pool' | 'upgrades' | 'propostas'>('vm');

  const modes = [
    {
      key: 'vm' as const,
      icon: <Server className="w-5 h-5" />,
      title: 'Cotação por VM',
      description: 'Configure cada máquina virtual individualmente'
    },
    {
      key: 'pool' as const,
      icon: <Database className="w-5 h-5" />,
      title: 'Pool de Recursos',
      description: 'Cote recursos totais para múltiplas VMs de uma vez'
    },
    {
      key: 'upgrades' as const,
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'Upgrades',
      description: 'Calcule itens e serviços avulsos'
    },
    {
      key: 'propostas' as const,
      icon: <FileText className="w-5 h-5" />,
      title: 'Propostas',
      description: 'Gerencie suas propostas salvas'
    }
  ];

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      {/* Hero Section */}
      <PremiumHero />
      
      {/* Mode Selector */}
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 mb-8 border border-amber-200/50"
        >
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              className="p-2 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-lg shadow-lg"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Escolha seu Modo de Trabalho</h3>
              <p className="text-sm text-amber-600">Selecione a abordagem ideal para sua cotação</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {modes.map((mode, index) => (
              <motion.button
                key={mode.key}
                onClick={() => setModoCalculo(mode.key)}
                className={`
                  relative p-4 rounded-xl transition-all duration-300 text-left group
                  ${modoCalculo === mode.key
                    ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-lg shadow-amber-500/30'
                    : 'bg-white hover:bg-amber-50 text-gray-700 border-2 border-gray-200 hover:border-amber-200'
                  }
                `}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Glow effect when selected */}
                {modoCalculo === mode.key && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-xl blur opacity-50"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.5 }}
                    transition={{ duration: 0.3 }}
                  />
                )}

                <div className="relative">
                  <div className="flex items-center gap-3 mb-2">
                    <motion.div
                      className={`p-2 rounded-lg ${
                        modoCalculo === mode.key
                          ? 'bg-white/20'
                          : 'bg-amber-100 group-hover:bg-amber-200'
                      }`}
                      whileHover={{ rotate: 5 }}
                    >
                      <div className={modoCalculo === mode.key ? 'text-white' : 'text-amber-600'}>
                        {mode.icon}
                      </div>
                    </motion.div>
                    <h4 className="font-bold text-base">{mode.title}</h4>
                  </div>
                  <p className={`text-sm ${
                    modoCalculo === mode.key ? 'text-white/90' : 'text-gray-600'
                  }`}>
                    {mode.description}
                  </p>
                </div>

                {/* Selection indicator */}
                {modoCalculo === mode.key && (
                  <motion.div
                    className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={modoCalculo}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {modoCalculo === 'vm' ? (
              // Modo VM por VM com layout premium
              <div className="grid lg:grid-cols-12 gap-8">
                {/* VM List - Left Column */}
                <div className="lg:col-span-4">
                  <PremiumVMList />
                </div>
                
                {/* VM Configurator - Center Column */}
                <div className="lg:col-span-5">
                  {selectedVM ? (
                    <motion.div
                      className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-amber-200/50 p-8"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <VMConfigurator vm={selectedVM} calculadora={calculadora} />
                    </motion.div>
                  ) : (
                    <motion.div
                      className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 p-12 text-center"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <motion.div
                        className="w-20 h-20 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6"
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.8 }}
                      >
                        <span className="text-3xl">⚙️</span>
                      </motion.div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        Selecione uma VM
                      </h3>
                      <p className="text-gray-500 text-lg">
                        Escolha uma VM da lista para configurar seus recursos com precisão épica
                      </p>
                    </motion.div>
                  )}
                </div>
                
                {/* Summary - Right Column */}
                <div className="lg:col-span-3">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <ModernSummaryCard />
                  </motion.div>
                </div>
              </div>
            ) : modoCalculo === 'pool' ? (
              <PoolDeRecursos />
            ) : modoCalculo === 'upgrades' ? (
              <UpgradeModule />
            ) : (
              <ListaPropostas />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
