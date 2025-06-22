
import React, { useState } from 'react';
import { VM } from '@/types';
import { formatCurrency } from '@/utils/calculadora';
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud } from '@/utils/calculadora';
import { Server, Cpu, MemoryStick, HardDrive, Settings, Copy, Trash2 } from 'lucide-react';

interface FluidVMCardProps {
  vm: VM;
  isSelected: boolean;
  onSelect: () => void;
}

export const FluidVMCard: React.FC<FluidVMCardProps> = ({ vm, isSelected, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { precos, duplicateVM, removeVM } = useCalculadoraStore();
  const calculadora = new CalculadoraCloud(precos);
  const custo = calculadora.calcularVM(vm);

  return (
    <div 
      className="fluid-vm-card group cursor-pointer"
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`
        relative overflow-hidden rounded-2xl border-2 transition-all duration-500 ease-out
        ${isSelected 
          ? 'border-yellow-500 bg-gradient-to-br from-yellow-900/20 to-gray-900 shadow-2xl shadow-yellow-500/20 scale-105' 
          : 'border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 hover:border-yellow-400/50 hover:shadow-xl hover:shadow-yellow-400/10 hover:scale-102'
        }
      `}>
        
        {/* Barra superior de status */}
        <div className={`h-1 transition-all duration-500 ${
          isSelected 
            ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' 
            : 'bg-gradient-to-r from-gray-600 to-gray-700 group-hover:from-yellow-400/50 group-hover:to-yellow-500/50'
        }`} />
        
        {/* Header do card */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`
                w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300
                ${isSelected 
                  ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/30' 
                  : 'bg-gradient-to-br from-gray-700 to-gray-800 group-hover:from-yellow-400/20 group-hover:to-yellow-500/20'
                }
              `}>
                <Server className={`w-7 h-7 transition-colors duration-300 ${
                  isSelected ? 'text-black' : 'text-gray-300 group-hover:text-yellow-400'
                }`} />
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-white mb-1 transition-colors duration-300 group-hover:text-yellow-100">
                  {vm.nome}
                </h3>
                <p className="text-sm text-gray-400 font-mono">
                  ID: {vm.id.slice(0, 8)}
                </p>
              </div>
            </div>
            
            {/* Ações rápidas */}
            <div className={`flex items-center gap-2 transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
            }`}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateVM(vm.id);
                }}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all duration-200 hover:scale-110"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeVM(vm.id);
                }}
                className="p-2 rounded-lg bg-gray-800 hover:bg-red-600 text-gray-400 hover:text-white transition-all duration-200 hover:scale-110"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Specs em grid animado */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { icon: Cpu, value: vm.vcpu, label: 'vCPU', color: 'blue' },
              { icon: MemoryStick, value: vm.ram, label: 'GB RAM', color: 'green' },
              { icon: HardDrive, value: vm.discoFCM + vm.discoSSD, label: 'GB Storage', color: 'purple' }
            ].map((spec, index) => (
              <div 
                key={spec.label}
                className="text-center group/spec"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`
                  w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center transition-all duration-300
                  bg-gradient-to-br from-gray-800 to-gray-900
                  group-hover/spec:from-${spec.color}-500/20 group-hover/spec:to-${spec.color}-600/20
                  group-hover/spec:scale-110 group-hover/spec:shadow-lg
                `}>
                  <spec.icon className="w-5 h-5 text-gray-400 group-hover/spec:text-white transition-colors duration-300" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {spec.value}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">
                  {spec.label}
                </div>
              </div>
            ))}
          </div>
          
          {/* Valor com animação */}
          <div className="pt-6 border-t border-gray-700">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                  Custo Mensal
                </p>
                <div className="relative">
                  <h2 className="text-4xl font-black bg-gradient-to-r from-white via-yellow-200 to-yellow-500 bg-clip-text text-transparent">
                    {formatCurrency(custo.total)}
                  </h2>
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-transparent blur-lg scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
              
              <div className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                ${isSelected 
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-lg shadow-yellow-500/30' 
                  : 'bg-gray-800 text-gray-300 group-hover:bg-gray-700 group-hover:text-white'
                }
              `}>
                {isSelected ? '⚡ Ativo' : 'Configurar'}
              </div>
            </div>
          </div>
        </div>
        
        {/* Efeito de brilho no hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/5 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </div>
      </div>
    </div>
  );
};
