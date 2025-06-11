
import React from 'react';
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud, formatCurrency } from '@/utils/calculadora';
import { Button } from '@/components/ui/button';
import { TrendingUp, Download, Settings, Calculator } from 'lucide-react';

const ModernSummaryCard = () => {
  const { vms, precos } = useCalculadoraStore();
  const calculadora = new CalculadoraCloud(precos);

  const custoTotal = vms.reduce((acc, vm) => {
    const custo = calculadora.calcularVM(vm);
    return acc + custo.total;
  }, 0);

  const totalVCPUs = vms.reduce((acc, vm) => acc + vm.vcpu, 0);
  const totalRAM = vms.reduce((acc, vm) => acc + vm.ram, 0);
  const totalStorage = vms.reduce((acc, vm) => acc + vm.discoFCM + vm.discoSSD, 0);

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      {/* Header com KPI Principal */}
      <div className="bg-slate-800 text-white p-6">
        <div className="flex items-center gap-2 mb-2">
          <Calculator className="w-5 h-5" />
          <span className="text-sm font-medium">Total Mensal</span>
        </div>
        <div className="text-3xl font-bold mb-1">
          {formatCurrency(custoTotal)}
        </div>
        <div className="text-slate-300 text-sm">
          {vms.length} servidor{vms.length !== 1 ? 'es' : ''} configurado{vms.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Resumo de Recursos */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">
            Recursos Totais
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">vCPUs</span>
              <span className="font-semibold text-slate-800">{totalVCPUs}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Memória RAM</span>
              <span className="font-semibold text-slate-800">{totalRAM} GB</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-slate-600">Storage Total</span>
              <span className="font-semibold text-slate-800">{totalStorage} GB</span>
            </div>
          </div>
        </div>

        {/* Breakdown por VM */}
        {vms.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">
              Breakdown
            </h3>
            <div className="space-y-2">
              {vms.map((vm, index) => {
                const custo = calculadora.calcularVM(vm);
                return (
                  <div key={vm.id} className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">VM-{String(index + 1).padStart(3, '0')}</span>
                    <span className="font-medium text-slate-800">
                      {formatCurrency(custo.total)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Ações */}
        <div className="pt-4 space-y-2">
          <Button 
            className="w-full bg-slate-800 hover:bg-slate-900 text-white"
            disabled={vms.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Gerar Proposta
          </Button>
          <Button 
            variant="ghost" 
            className="w-full text-slate-600 hover:text-slate-800"
            disabled={vms.length === 0}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Análise Detalhada
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModernSummaryCard;
