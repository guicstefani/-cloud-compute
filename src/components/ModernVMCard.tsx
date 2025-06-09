
import React from 'react';
import { VM } from '@/types';
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud, formatCurrency } from '@/utils/calculadora';
import { Server, Cpu, MemoryStick, HardDrive, Trash2, Copy, CheckCircle } from 'lucide-react';

interface ModernVMCardProps {
  vm: VM;
  calculadora: CalculadoraCloud;
  isSelected: boolean;
}

const ModernVMCard = ({ vm, calculadora, isSelected }: ModernVMCardProps) => {
  const { selectVM, duplicateVM, removeVM } = useCalculadoraStore();
  const custo = calculadora.calcularVM(vm);

  const getOSIcon = () => {
    if (vm.windowsServer) return '🪟';
    if (vm.rhel) return '🎩';
    if (vm.suse) return '🦎';
    return '💻';
  };

  return (
    <div
      onClick={() => selectVM(vm.id)}
      className={`group relative bg-gray-900 rounded-lg border transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1 ${
        isSelected 
          ? 'border-green-500 shadow-lg ring-4 ring-green-500/20 bg-green-500/10' 
          : 'border-gray-800 hover:border-gray-700'
      }`}
    >
      {/* Status Indicator */}
      <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-lg ${
        isSelected ? 'bg-green-500' : 'bg-gray-800'
      }`}></div>
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl transition-all ${
              isSelected 
                ? 'bg-green-500 text-white shadow-lg' 
                : 'bg-gray-800 text-gray-400'
            }`}>
              {getOSIcon()}
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">{vm.nome}</h3>
              <p className="text-sm text-gray-400">ID: {vm.id.slice(0, 8)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isSelected && (
              <div className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-full text-xs font-medium">
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
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeVM(vm.id);
                }}
                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
              <Cpu className="w-5 h-5 text-[#C7D82B]" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">{vm.vcpu}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">vCPU</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
              <MemoryStick className="w-5 h-5 text-[#C7D82B]" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">{vm.ram}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">GB RAM</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
              <HardDrive className="w-5 h-5 text-[#C7D82B]" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">{vm.discoFCM + vm.discoSSD}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">GB Storage</div>
            </div>
          </div>
        </div>

        {/* Active Licenses */}
        {(vm.windowsServer || vm.rhel || vm.suse || vm.sqlServerSTD) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {vm.windowsServer && (
              <span className="px-3 py-1 bg-gray-800 text-gray-300 text-xs font-medium rounded-full">
                Windows Server
              </span>
            )}
            {vm.rhel && (
              <span className="px-3 py-1 bg-gray-800 text-gray-300 text-xs font-medium rounded-full">
                RHEL
              </span>
            )}
            {vm.suse && (
              <span className="px-3 py-1 bg-gray-800 text-gray-300 text-xs font-medium rounded-full">
                SUSE
              </span>
            )}
            {vm.sqlServerSTD && (
              <span className="px-3 py-1 bg-gray-800 text-gray-300 text-xs font-medium rounded-full">
                SQL Server
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="pt-4 border-t border-gray-800">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Custo Mensal</p>
              <p className="text-3xl font-bold text-white">
                {formatCurrency(custo.total)}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isSelected 
                ? 'bg-green-500 text-white' 
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
