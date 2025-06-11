
import React from 'react';
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud } from '@/utils/calculadora';
import { Button } from '@/components/ui/button';
import { Plus, Grid, List } from 'lucide-react';
import { VM_TEMPLATES } from '@/data/templates';
import CompactVMCard from './CompactVMCard';

const ModernVMList = () => {
  const { vms, selectedVMId, precos, addVM } = useCalculadoraStore();
  const calculadora = new CalculadoraCloud(precos);

  if (vms.length === 0) {
    return (
      <div className="space-y-6">
        {/* Empty State Compacto */}
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Plus className="w-6 h-6 text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            Primeiro Servidor
          </h3>
          <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
            Configure os recursos necessários para sua aplicação
          </p>
          <Button
            onClick={() => addVM()}
            className="bg-slate-800 hover:bg-slate-900 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova VM
          </Button>
        </div>

        {/* Templates Compactos */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">
            Templates Rápidos
          </h3>
          <div className="grid gap-2">
            {VM_TEMPLATES.slice(0, 3).map(template => (
              <button
                key={template.id}
                onClick={() => addVM(template.vm)}
                className="w-full p-3 text-left bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:bg-slate-50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center text-sm group-hover:bg-slate-200 transition-colors">
                    {template.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-800">{template.nome}</div>
                    <div className="text-xs text-slate-500">{template.descricao}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Funcional */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Servidores</h2>
          <p className="text-sm text-slate-500">
            {vms.length} configurado{vms.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-600"
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => addVM()}
            size="sm"
            className="bg-slate-800 hover:bg-slate-900 text-white"
          >
            <Plus className="w-4 h-4 mr-1" />
            Adicionar
          </Button>
        </div>
      </div>

      {/* VM Cards Compactos */}
      <div className="grid gap-3">
        {vms.map((vm, index) => (
          <CompactVMCard
            key={vm.id}
            vm={vm}
            calculadora={calculadora}
            isSelected={vm.id === selectedVMId}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default ModernVMList;
