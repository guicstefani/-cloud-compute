import React from 'react';
import { VM } from '@/types';
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud, formatCurrency } from '@/utils/calculadora';
import { Server, Trash2, Copy, CheckCircle } from 'lucide-react';
import { todosSistemasOperacionais, todosBancosDados } from '@/data/sistemasOperacionais';
import ProfessionalIcon from './ProfessionalIcon';
import { GlassCard } from './glass/GlassCard';

interface ModernVMCardProps {
  vm: VM;
  calculadora: CalculadoraCloud;
  isSelected: boolean;
}

const ModernVMCard = ({ vm, calculadora, isSelected }: ModernVMCardProps) => {
  const { selectVM, duplicateVM, removeVM } = useCalculadoraStore();
  const custo = calculadora.calcularVM(vm);

  const getOSIcon = () => {
    const so = todosSistemasOperacionais.find(s => s.id === vm.sistemaOperacional);
    return so?.icon || 'monitor';
  };

  const getSistemaOperacionalNome = () => {
    const so = todosSistemasOperacionais.find(s => s.id === vm.sistemaOperacional);
    return so?.nome || '';
  };

  const getBancoDadosNome = () => {
    const bd = todosBancosDados.find(b => b.id === vm.bancoDados);
    return bd?.nome || '';
  };

  return (
    <GlassCard
      variant={isSelected ? 'selected' : 'interactive'}
      glow={isSelected}
      onClick={() => selectVM(vm.id)}
      className="group cursor-pointer"
    >
      <div className="p-6">
        {/* Header with enhanced glassmorphism */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isSelected 
                ? 'bg-gradient-to-br from-[#f5a623] to-[#d68910] shadow-lg shadow-[#f5a623]/30' 
                : 'glass-card'
            }`}>
              <ProfessionalIcon 
                type={getOSIcon()} 
                size={24} 
                className={isSelected ? 'text-black' : 'text-[#f5a623]'} 
              />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">{vm.nome}</h3>
              <p className="text-sm text-gray-400">ID: {vm.id.slice(0, 8)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isSelected && (
              <div className="glass-card px-3 py-1 text-[#f5a623] rounded-full text-xs font-medium border border-[#f5a623]/30 glow-gold">
                <CheckCircle className="w-3 h-3 inline mr-1" />
                Ativo
              </div>
            )}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateVM(vm.id);
                }}
                className="p-2 glass-button rounded-lg transition-all duration-300"
              >
                <Copy className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeVM(vm.id);
                }}
                className="p-2 glass-button rounded-lg transition-all duration-300 hover:border-red-500/30"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Specs Grid with Glass Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center glass-card p-3 rounded-lg">
            <ProfessionalIcon type="cpu" size={20} className="text-[#f5a623] mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{vm.vcpu}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">vCPU</div>
          </div>
          <div className="text-center glass-card p-3 rounded-lg">
            <ProfessionalIcon type="ram" size={20} className="text-[#f5a623] mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{vm.ram}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">GB RAM</div>
          </div>
          <div className="text-center glass-card p-3 rounded-lg">
            <ProfessionalIcon type="storage" size={20} className="text-[#f5a623] mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{vm.discoFCM + vm.discoSSD}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">GB Storage</div>
          </div>
        </div>

        {/* Active Licenses */}
        {(vm.sistemaOperacional || vm.bancoDados) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {vm.sistemaOperacional && (
              <span className="px-3 py-1 bg-blue-900/50 text-blue-300 text-xs font-medium rounded-full flex items-center gap-1 border border-blue-800/50">
                <ProfessionalIcon type={getOSIcon()} size={12} />
                {getSistemaOperacionalNome()}
              </span>
            )}
            {vm.bancoDados && (
              <span className="px-3 py-1 bg-orange-900/50 text-orange-300 text-xs font-medium rounded-full flex items-center gap-1 border border-orange-800/50">
                <ProfessionalIcon type="database" size={12} />
                {getBancoDadosNome()}
              </span>
            )}
          </div>
        )}

        {/* Enhanced Price Section */}
        <div className="pt-4 border-t border-[#f5a623]/20">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Custo Mensal</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-[#f5a623] to-[#d68910] bg-clip-text text-transparent">
                {formatCurrency(custo.total)}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              isSelected 
                ? 'bg-gradient-to-r from-[#f5a623] to-[#d68910] text-black shadow-lg shadow-[#f5a623]/30' 
                : 'glass-button text-gray-300 group-hover:text-white'
            }`}>
              {isSelected ? 'Configurando' : 'Configurar'}
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default ModernVMCard;
