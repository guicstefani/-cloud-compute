
import React from 'react';
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud } from '@/utils/calculadora';
import { Button } from '@/components/ui/button';
import { Plus, Sparkles } from 'lucide-react';
import { VM_TEMPLATES } from '@/data/templates';
import ModernVMCard from './ModernVMCard';

const ModernVMList = () => {
  const { vms, selectedVMId, precos, addVM } = useCalculadoraStore();
  const calculadora = new CalculadoraCloud(precos);

  if (vms.length === 0) {
    return (
      <div className="space-y-8">
        {/* Empty State */}
        <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="w-20 h-20 bg-[#C7D82B] rounded-lg flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Plus className="w-10 h-10 text-black" />
          </div>
          <h3 className="text-2xl font-semibold text-black mb-3">
            Configure seu primeiro servidor
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Comece selecionando os recursos necessários para sua aplicação
          </p>
          <button
            onClick={() => addVM()}
            className="bg-[#C7D82B] hover:bg-[#B5C525] text-black font-semibold px-8 py-3 text-lg rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5 mr-2 inline" />
            Criar Primeira VM
          </button>
        </div>

        {/* Templates Section */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-[#C7D82B] rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <h3 className="text-lg font-semibold text-black">Templates Prontos</h3>
          </div>
          <div className="grid gap-4">
            {VM_TEMPLATES.map(template => (
              <button
                key={template.id}
                onClick={() => addVM(template.vm)}
                className="w-full p-6 text-left bg-white border border-gray-200 rounded-lg hover:border-[#C7D82B] hover:shadow-lg transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#C7D82B] rounded-lg flex items-center justify-center text-xl text-black group-hover:shadow-lg transition-all">
                    {template.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-black mb-1">{template.nome}</h4>
                    <p className="text-sm text-gray-600">{template.descricao}</p>
                  </div>
                  <div className="text-[#C7D82B] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                    →
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
          <h2 className="text-2xl font-bold text-black">Seus Servidores</h2>
          <p className="text-gray-600">
            {vms.length} servidor{vms.length !== 1 ? 'es' : ''} configurado{vms.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => addVM()}
          className="bg-[#C7D82B] hover:bg-[#B5C525] text-black font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4 mr-2 inline" />
          Adicionar VM
        </button>
      </div>

      {/* VM Cards */}
      <div className="grid gap-6">
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
