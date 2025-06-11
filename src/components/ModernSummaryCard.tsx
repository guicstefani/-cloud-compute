
import React from 'react';
import { useCalculadoraStore } from '@/store/calculadora';
import { useProjetoStore } from '@/store/projeto';
import { CalculadoraCloud, formatCurrency } from '@/utils/calculadora';
import { Card } from '@/components/ui/card';
import { Calculator, TrendingUp, Percent } from 'lucide-react';

const ModernSummaryCard = () => {
  const { vms, precos } = useCalculadoraStore();
  const { desconto } = useProjetoStore();
  const calculadora = new CalculadoraCloud(precos);

  // Usar desconto global se ativo
  const descontoGlobal = desconto.modo === 'global' ? desconto.percentualGlobal : undefined;

  // Calcular totais
  const totalSemDesconto = vms.reduce((total, vm) => {
    const custo = calculadora.calcularVM(vm);
    return total + custo.total;
  }, 0);

  const totalComDesconto = vms.reduce((total, vm) => {
    const custo = calculadora.calcularVM(vm, descontoGlobal);
    return total + custo.total;
  }, 0);

  const economia = totalSemDesconto - totalComDesconto;
  const percentualEconomia = totalSemDesconto > 0 ? (economia / totalSemDesconto) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Card Principal */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calculator className="w-5 h-5 mr-2 text-blue-600" />
            Resumo do Projeto
          </h3>
          <span className="text-sm text-blue-600 font-medium">
            {vms.length} VM{vms.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="space-y-4">
          {/* Total sem desconto */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Valor original:</span>
            <span className="text-lg font-semibold text-gray-900">
              {formatCurrency(totalSemDesconto)}
            </span>
          </div>

          {/* Desconto aplicado */}
          {economia > 0 && (
            <>
              <div className="flex justify-between items-center text-green-600">
                <span className="text-sm flex items-center">
                  <Percent className="w-4 h-4 mr-1" />
                  Desconto {desconto.modo === 'global' ? 'global' : 'individual'}:
                </span>
                <span className="font-medium">
                  -{formatCurrency(economia)} ({percentualEconomia.toFixed(1)}%)
                </span>
              </div>
              
              <hr className="border-blue-200" />
            </>
          )}

          {/* Total final */}
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total mensal:</span>
            <span className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalComDesconto)}
            </span>
          </div>

          {/* Total anual */}
          <div className="flex justify-between items-center text-gray-600">
            <span className="text-sm">Total anual:</span>
            <span className="font-medium">
              {formatCurrency(totalComDesconto * 12)}
            </span>
          </div>
        </div>
      </Card>

      {/* Card de Economia (se houver desconto) */}
      {economia > 0 && (
        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <div className="font-semibold text-green-800">Economia Total</div>
                <div className="text-xs text-green-600">
                  {desconto.modo === 'global' 
                    ? `Desconto global de ${desconto.percentualGlobal}%`
                    : 'Descontos individuais aplicados'
                  }
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-green-700">
                {formatCurrency(economia)}/mês
              </div>
              <div className="text-xs text-green-600">
                {formatCurrency(economia * 12)}/ano
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Informação sobre modo de desconto */}
      <Card className="p-3 bg-gray-50 border-gray-200">
        <div className="text-xs text-gray-600 flex items-center justify-between">
          <span>Modo de desconto:</span>
          <span className="font-medium capitalize">
            {desconto.modo === 'global' 
              ? `Global (${desconto.percentualGlobal}%)`
              : 'Individual por VM'
            }
          </span>
        </div>
      </Card>
    </div>
  );
};

export default ModernSummaryCard;
