
import React from 'react';
import { VM } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Server, 
  HardDrive, 
  Cpu, 
  MemoryStick, 
  Shield, 
  CheckCircle2, 
  Edit3,
  Copy,
  Trash2,
  Sparkles
} from 'lucide-react';
import { formatCurrency } from '@/utils/calculadora';

interface PremiumVMCardProps {
  vm: VM;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  totalCost: number;
}

const PremiumVMCard = ({ 
  vm, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDuplicate, 
  onDelete,
  totalCost 
}: PremiumVMCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        layout: { duration: 0.3 }
      }}
      className="group relative"
    >
      {/* Glow effect when selected */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 rounded-2xl blur-lg opacity-30"
          />
        )}
      </AnimatePresence>

      <div
        onClick={onSelect}
        className={`
          relative cursor-pointer rounded-2xl p-6 transition-all duration-300
          ${isSelected 
            ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 shadow-2xl shadow-amber-500/20' 
            : 'bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-amber-200 shadow-lg hover:shadow-xl'
          }
        `}
      >
        {/* Header com nome e status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className={`p-2 rounded-lg ${isSelected ? 'bg-amber-100' : 'bg-gray-100 group-hover:bg-amber-50'}`}
              >
                <Server className={`w-5 h-5 ${isSelected ? 'text-amber-600' : 'text-gray-600 group-hover:text-amber-500'}`} />
              </motion.div>
              <h3 className={`font-bold text-lg ${isSelected ? 'text-amber-900' : 'text-gray-900'}`}>
                {vm.nome}
              </h3>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1 px-2 py-1 bg-amber-100 rounded-full"
                >
                  <CheckCircle2 className="w-3 h-3 text-amber-600" />
                  <span className="text-xs font-semibold text-amber-700">Selecionada</span>
                </motion.div>
              )}
            </div>
            <div className={`text-sm ${isSelected ? 'text-amber-700' : 'text-gray-500'}`}>
              Status: {vm.status === 'rascunho' ? 'Em Configuração' : 'Finalizada'}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
              title="Editar"
            >
              <Edit3 className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Duplicar"
            >
              <Copy className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Excluir"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Cpu className={`w-4 h-4 ${isSelected ? 'text-amber-600' : 'text-gray-500'}`} />
            <div>
              <div className={`text-sm font-semibold ${isSelected ? 'text-amber-900' : 'text-gray-900'}`}>
                {vm.vcpu} vCPU
              </div>
              <div className={`text-xs ${isSelected ? 'text-amber-600' : 'text-gray-500'}`}>
                Processamento
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MemoryStick className={`w-4 h-4 ${isSelected ? 'text-amber-600' : 'text-gray-500'}`} />
            <div>
              <div className={`text-sm font-semibold ${isSelected ? 'text-amber-900' : 'text-gray-900'}`}>
                {vm.ram} GB
              </div>
              <div className={`text-xs ${isSelected ? 'text-amber-600' : 'text-gray-500'}`}>
                Memória RAM
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <HardDrive className={`w-4 h-4 ${isSelected ? 'text-amber-600' : 'text-gray-500'}`} />
            <div>
              <div className={`text-sm font-semibold ${isSelected ? 'text-amber-900' : 'text-gray-900'}`}>
                {vm.discoSSD + vm.discoFCM} GB
              </div>
              <div className={`text-xs ${isSelected ? 'text-amber-600' : 'text-gray-500'}`}>
                Armazenamento
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Shield className={`w-4 h-4 ${isSelected ? 'text-amber-600' : 'text-gray-500'}`} />
            <div>
              <div className={`text-sm font-semibold ${isSelected ? 'text-amber-900' : 'text-gray-900'}`}>
                {vm.backupTipo}
              </div>
              <div className={`text-xs ${isSelected ? 'text-amber-600' : 'text-gray-500'}`}>
                Backup
              </div>
            </div>
          </div>
        </div>

        {/* Licensing badges */}
        {(vm.sistemaOperacional || vm.bancoDados || vm.antivirus) && (
          <div className="flex flex-wrap gap-1 mb-4">
            {vm.sistemaOperacional && (
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                isSelected 
                  ? 'bg-amber-100 text-amber-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                SO
              </span>
            )}
            {vm.bancoDados && (
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                isSelected 
                  ? 'bg-amber-100 text-amber-700' 
                  : 'bg-green-100 text-green-700'
              }`}>
                BD
              </span>
            )}
            {vm.antivirus && (
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                isSelected 
                  ? 'bg-amber-100 text-amber-700' 
                  : 'bg-purple-100 text-purple-700'
              }`}>
                Antivírus
              </span>
            )}
          </div>
        )}

        {/* Preço com destaque */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${isSelected ? 'text-amber-700' : 'text-gray-600'}`}>
              Custo Mensal:
            </span>
            <div className="text-right">
              <motion.div 
                className={`text-xl font-bold ${
                  isSelected 
                    ? 'text-amber-600' 
                    : 'text-gray-900 group-hover:text-amber-600'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                {formatCurrency(totalCost)}
              </motion.div>
              {vm.descontoIndividual > 0 && (
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <Sparkles className="w-3 h-3" />
                  <span>-{vm.descontoIndividual}% desconto</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selection indicator */}
        {isSelected && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-b-2xl"
          />
        )}
      </div>
    </motion.div>
  );
};

export default PremiumVMCard;
