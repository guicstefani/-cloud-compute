import React from 'react';
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud } from '@/utils/calculadora';
import { Button } from '@/components/ui/button';
import { Plus, Sparkles } from 'lucide-react';
import { VM_TEMPLATES } from '@/data/templates';
import ModernVMCard from './ModernVMCard';

const ModernVMList = () => {
  const { vms, selectedVMId, addVM, precos } = useCalculadoraStore();
  const calculadora = new CalculadoraCloud(precos);

  if (vms.length === 0) {
    return (
      <div className="space-y-8">
        {/* Empty State */}
        <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Plus className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">
            Configure seu primeiro servidor
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Comece selecionando os recursos necessários para sua aplicação
          </p>
          <Button
            onClick={() => addVM()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 text-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Criar Primeira VM
          </Button>
        </div>

        {/* Templates Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Templates Prontos</h3>
              <p className="text-sm text-gray-600">Configurações otimizadas para diferentes casos de uso</p>
            </div>
          </div>
          <div className="grid gap-4">
            {VM_TEMPLATES.map(template => (
              <button
                key={template.id}
                onClick={() => addVM(template.vm)}
                className="w-full p-6 text-left bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-xl text-blue-600 group-hover:bg-blue-100 transition-all">
                    {template.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{template.nome}</h4>
                    <p className="text-sm text-gray-600">{template.descricao}</p>
                  </div>
                  <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                    Usar Template →
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Seus Servidores</h2>
          <p className="text-gray-600">
            {vms.length} servidor{vms.length !== 1 ? 'es' : ''} configurado{vms.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button
          onClick={() => addVM()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar VM
        </Button>
      </div>

      {/* VM Cards */}
      <div className="space-y-4">
        {vms.map(vm => (
          <ModernVMCard
            key={vm.id}
            vm={vm}
            calculadora={calculadora}
            isSelected={vm.id === selectedVMId}
          />
        ))}
      </div>
    </div>
  );
};

export default ModernVMList;
