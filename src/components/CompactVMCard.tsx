
import React from 'react';
import { VM } from '@/types';
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud, formatCurrency } from '@/utils/calculadora';
import { Copy, Trash2, CheckCircle } from 'lucide-react';
import { todosSistemasOperacionais, todosBancosDados } from '@/data/sistemasOperacionais';
import ProfessionalIcon from './ProfessionalIcon';

interface CompactVMCardProps {
  vm: VM;
  calculadora: CalculadoraCloud;
  isSelected: boolean;
  index: number;
}

const CompactVMCard = ({ vm, calculadora, isSelected, index }: CompactVMCardProps) => {
  const { selectVM, duplicateVM, removeVM } = useCalculadoraStore();
  const custo = calculadora.calcularVM(vm);

  const getOSIcon = () => {
    const so = todosSistemasOperacionais.find(s => s.id === vm.sistemaOperacional);
    return so?.icon || 'monitor';
  };

  const getSistemaOperacionalNome = () => {
    const so = todosSistemasOperacionais.find(s => s.id === vm.sistemaOperacional);
    return so?.nome || 'Sem SO';
  };

  const getBancoDadosNome = () => {
    const bd = todosBancosDados.find(b => b.id === vm.bancoDados);
    return bd?.nome || '';
  };

  return (
    <div
      onClick={() => selectVM(vm.id)}
      className={`group relative bg-white border transition-all duration-200 cursor-pointer ${
        isSelected 
          ? 'border-blue-600 bg-blue-50/30 shadow-sm' 
          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
      } rounded-lg`}
    >
      <div className="p-4">
        {/* Header Compacto */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded flex items-center justify-center ${
              isSelected ? 'bg-blue-600' : 'bg-slate-100'
            }`}>
              <ProfessionalIcon 
                type={getOSIcon()} 
                size={14} 
                className={isSelected ? 'text-white' : 'text-slate-600'} 
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-800">
                  VM-{String(index + 1).padStart(3, '0')}
                </span>
                {isSelected && (
                  <CheckCircle className="w-3 h-3 text-blue-600" />
                )}
              </div>
              <span className="text-xs text-slate-500">
                {getSistemaOperacionalNome()}
              </span>
            </div>
          </div>
          
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                duplicateVM(vm.id);
              }}
              className="p-1 hover:bg-slate-100 rounded transition-colors"
            >
              <Copy className="w-3 h-3 text-slate-500" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeVM(vm.id);
              }}
              className="p-1 hover:bg-red-50 rounded transition-colors"
            >
              <Trash2 className="w-3 h-3 text-red-500" />
            </button>
          </div>
        </div>

        {/* Specs Compactas */}
        <div className="grid grid-cols-3 gap-3 mb-3 text-center">
          <div>
            <div className="text-base font-semibold text-slate-800">{vm.vcpu}</div>
            <div className="text-xs text-slate-500">vCPU</div>
          </div>
          <div>
            <div className="text-base font-semibold text-slate-800">{vm.ram}GB</div>
            <div className="text-xs text-slate-500">RAM</div>
          </div>
          <div>
            <div className="text-base font-semibold text-slate-800">{vm.discoFCM + vm.discoSSD}GB</div>
            <div className="text-xs text-slate-500">Storage</div>
          </div>
        </div>

        {/* Licenças Ativas */}
        {(vm.sistemaOperacional || vm.bancoDados) && (
          <div className="flex flex-wrap gap-1 mb-3">
            {vm.sistemaOperacional && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                SO
              </span>
            )}
            {vm.bancoDados && (
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                DB
              </span>
            )}
          </div>
        )}

        {/* Preço */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-base font-bold text-slate-800">
                {formatCurrency(custo.total)}
              </div>
              <div className="text-xs text-slate-500">mensal</div>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              isSelected 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-100 text-slate-600'
            }`}>
              {isSelected ? 'Ativo' : 'Config'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompactVMCard;
