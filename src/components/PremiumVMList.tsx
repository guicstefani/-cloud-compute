
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Sparkles, Zap, Target } from 'lucide-react';
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud } from '@/utils/calculadora';
import PremiumVMCard from './PremiumVMCard';
import PremiumButton from './PremiumButton';

const PremiumVMList = () => {
  const { 
    vms, 
    selectedVMId, 
    precos, 
    addVM, 
    selectVM, 
    duplicateVM, 
    removeVM 
  } = useCalculadoraStore();
  
  const calculadora = new CalculadoraCloud(precos);

  const handleAddVM = () => {
    addVM();
  };

  const handleDuplicateVM = (id: string) => {
    duplicateVM(id);
  };

  const handleDeleteVM = (id: string) => {
    if (vms.length > 1) {
      removeVM(id);
    }
  };

  const totalVMs = vms.length;
  const totalCost = vms.reduce((sum, vm) => {
    const custo = calculadora.calcularVM(vm);
    return sum + custo.total;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header com stats */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-amber-50 via-yellow-50 to-white rounded-2xl p-6 border-2 border-amber-200 shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="p-3 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl shadow-lg"
              whileHover={{ rotate: 5, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Suas Máquinas Virtuais</h2>
              <p className="text-amber-600 font-medium">Configure cada VM com precisão épica</p>
            </div>
          </div>
          
          <PremiumButton
            onClick={handleAddVM}
            icon={<Plus className="w-5 h-5" />}
            variant="primary"
            glow
            className="shadow-xl shadow-amber-500/30"
          >
            Nova VM
          </PremiumButton>
        </div>

        {/* Stats rápidas */}
        <div className="grid grid-cols-3 gap-4">
          <motion.div 
            className="text-center p-3 bg-white rounded-xl border border-amber-100"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-amber-600">{totalVMs}</div>
            <div className="text-sm text-gray-600">VMs Configuradas</div>
          </motion.div>
          
          <motion.div 
            className="text-center p-3 bg-white rounded-xl border border-amber-100"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-green-600">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                maximumFractionDigits: 0
              }).format(totalCost)}
            </div>
            <div className="text-sm text-gray-600">Custo Total/Mês</div>
          </motion.div>
          
          <motion.div 
            className="text-center p-3 bg-white rounded-xl border border-amber-100"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-center gap-1">
              <Target className="w-5 h-5 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">A+</div>
            </div>
            <div className="text-sm text-gray-600">Score de Otimização</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Lista de VMs */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {vms.map((vm, index) => {
            const custo = calculadora.calcularVM(vm);
            return (
              <motion.div
                key={vm.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 30,
                  delay: index * 0.05
                }}
              >
                <PremiumVMCard
                  vm={vm}
                  isSelected={vm.id === selectedVMId}
                  onSelect={() => selectVM(vm.id)}
                  onEdit={() => selectVM(vm.id)}
                  onDuplicate={() => handleDuplicateVM(vm.id)}
                  onDelete={() => handleDeleteVM(vm.id)}
                  totalCost={custo.total}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Empty state */}
        {vms.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 px-6 bg-white rounded-2xl border-2 border-dashed border-gray-200"
          >
            <motion.div
              className="w-16 h-16 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
            >
              <Zap className="w-8 h-8 text-amber-600" />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Pronto para começar?
            </h3>
            <p className="text-gray-500 mb-6">
              Crie sua primeira VM e experimente a magia da configuração premium
            </p>
            <PremiumButton
              onClick={handleAddVM}
              icon={<Plus className="w-5 h-5" />}
              variant="primary"
              size="lg"
              glow
            >
              Criar Primeira VM
            </PremiumButton>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PremiumVMList;
