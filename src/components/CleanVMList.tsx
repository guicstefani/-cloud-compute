
import React from 'react';
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud } from '@/utils/calculadora';
import { Plus, FileSpreadsheet, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CleanVMCard } from './CleanVMCard';

export function CleanVMList() {
  const { vms, addVM, selectVM, selectedVMId, precos } = useCalculadoraStore();
  const calculadora = new CalculadoraCloud(precos);

  if (vms.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">💻</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Nenhuma VM configurada
        </h3>
        <p className="text-gray-600 mb-6 max-w-sm mx-auto">
          Comece criando sua primeira máquina virtual ou importe configurações existentes
        </p>
        <div className="flex justify-center space-x-3">
          <Button onClick={() => addVM()}>
            <Plus className="w-4 h-4 mr-2" />
            Nova VM
          </Button>
          <Button variant="outline">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Importar Excel
          </Button>
          <Button variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100">
            <Bot className="w-4 h-4 mr-2" />
            IA
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Máquinas Virtuais ({vms.length})
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Importar
          </Button>
          <Button size="sm" onClick={() => addVM()}>
            <Plus className="w-4 h-4 mr-2" />
            Nova VM
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {vms.map(vm => (
          <CleanVMCard
            key={vm.id}
            vm={vm}
            calculadora={calculadora}
            isSelected={vm.id === selectedVMId}
            onSelect={() => selectVM(vm.id)}
          />
        ))}
      </div>
    </div>
  );
}
