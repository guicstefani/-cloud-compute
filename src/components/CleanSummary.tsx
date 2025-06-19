
import React from 'react';
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud, formatCurrency } from '@/utils/calculadora';
import { Server, Cpu, HardDrive, DollarSign } from 'lucide-react';

export function CleanSummary() {
  const { vms, precos } = useCalculadoraStore();
  const calculadora = new CalculadoraCloud(precos);
  
  const totalCusto = vms.reduce((acc, vm) => acc + calculadora.calcularVM(vm).total, 0);
  const totalVcpus = vms.reduce((acc, vm) => acc + vm.vcpu, 0);
  const totalRam = vms.reduce((acc, vm) => acc + vm.ram, 0);
  const totalStorage = vms.reduce((acc, vm) => acc + vm.discoFCM + vm.discoSSD, 0);

  const stats = [
    {
      label: 'Custo Mensal',
      value: formatCurrency(totalCusto),
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      label: 'VMs Configuradas',
      value: vms.length.toString(),
      icon: Server,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      label: 'Total vCPUs',
      value: totalVcpus.toString(),
      icon: Cpu,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      label: 'RAM Total',
      value: `${totalRam}GB`,
      icon: HardDrive,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Projeto</h3>
      
      <div className="space-y-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-sm text-gray-600">{stat.label}</span>
              </div>
              <span className={`font-semibold ${stat.color}`}>{stat.value}</span>
            </div>
          );
        })}
      </div>

      {totalCusto > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Investimento Anual</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(totalCusto * 12)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
