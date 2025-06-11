
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
      className={`group relative bg-white rounded-2xl border transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1 ${
        isSelected 
          ? 'border-blue-500 shadow-lg ring-4 ring-blue-100' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {/* Status Indicator */}
      <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${
        isSelected ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gray-100'
      }`}></div>
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              isSelected 
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg' 
                : 'bg-gray-100'
            }`}>
              <ProfessionalIcon 
                type={getOSIcon()} 
                size={24} 
                className={isSelected ? 'text-white' : 'text-gray-600'} 
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{vm.nome}</h3>
              <p className="text-sm text-gray-500">ID: {vm.id.slice(0, 8)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isSelected && (
              <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
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
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4 text-gray-500" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeVM(vm.id);
                }}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-2">
              <ProfessionalIcon type="cpu" size={20} className="text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{vm.vcpu}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">vCPU</div>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-2">
              <ProfessionalIcon type="ram" size={20} className="text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{vm.ram}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">GB RAM</div>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-2">
              <ProfessionalIcon type="storage" size={20} className="text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{vm.discoFCM + vm.discoSSD}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">GB Storage</div>
          </div>
        </div>

        {/* Active Licenses */}
        {(vm.sistemaOperacional || vm.bancoDados) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {vm.sistemaOperacional && (
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full flex items-center gap-1">
                <ProfessionalIcon type={getOSIcon()} size={12} />
                {getSistemaOperacionalNome()}
              </span>
            )}
            {vm.bancoDados && (
              <span className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-full flex items-center gap-1">
                <ProfessionalIcon type="database" size={12} />
                {getBancoDadosNome()}
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Custo Mensal</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(custo.total)}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isSelected 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 group-hover:bg-gray-200'
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
