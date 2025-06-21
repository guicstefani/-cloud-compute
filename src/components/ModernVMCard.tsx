
import React from 'react';
import { VM } from '@/types';
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud, formatCurrency } from '@/utils/calculadora';
import { Server, Trash2, Copy, CheckCircle } from 'lucide-react';
import { todosSistemasOperacionais, todosBancosDados } from '@/data/sistemasOperacionais';
import ProfessionalIcon from './ProfessionalIcon';

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
    <div
      onClick={() => selectVM(vm.id)}
      className={`group relative premium-card transition-all duration-300 cursor-pointer ${
        isSelected 
          ? 'border-[#DCAE1D] shadow-[0_0_30px_rgba(220,174,29,0.3)] ring-4 ring-[#DCAE1D]/20' 
          : 'hover:border-[#DCAE1D]/50'
      }`}
    >
      {/* Status Indicator */}
      <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${
        isSelected ? 'bg-gradient-to-r from-[#DCAE1D] to-[#F4C430]' : 'bg-gray-700'
      }`}></div>
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              isSelected 
                ? 'bg-gradient-to-br from-[#DCAE1D] to-[#F4C430] shadow-lg' 
                : 'bg-gray-800'
            }`}>
              <ProfessionalIcon 
                type={getOSIcon()} 
                size={24} 
                className={isSelected ? 'text-black' : 'text-gray-400'} 
              />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">{vm.nome}</h3>
              <p className="text-sm text-gray-400">ID: {vm.id.slice(0, 8)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isSelected && (
              <div className="flex items-center gap-1 px-3 py-1 bg-[#DCAE1D]/20 text-gold rounded-full text-xs font-medium border border-[#DCAE1D]/30">
                <CheckCircle className="w-3 h-3" />
                Ativo
              </div>
            )}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateVM(vm.id);
                }}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeVM(vm.id);
                }}
                className="p-2 hover:bg-red-900/50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-2">
              <ProfessionalIcon type="cpu" size={20} className="text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-white">{vm.vcpu}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">vCPU</div>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-2">
              <ProfessionalIcon type="ram" size={20} className="text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-white">{vm.ram}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">GB RAM</div>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-2">
              <ProfessionalIcon type="storage" size={20} className="text-gray-400" />
            </div>
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

        {/* Price */}
        <div className="pt-4 border-t border-gray-700">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Custo Mensal</p>
              <p className="text-3xl font-bold text-gold">
                {formatCurrency(custo.total)}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isSelected 
                ? 'bg-gradient-to-r from-[#DCAE1D] to-[#F4C430] text-black' 
                : 'bg-gray-800 text-gray-300 group-hover:bg-gray-700'
            }`}>
              {isSelected ? 'Configurando' : 'Configurar'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernVMCard;
