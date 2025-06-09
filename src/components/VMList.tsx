
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud, formatCurrency } from '@/utils/calculadora';
import { Button } from '@/components/ui/button';
import { Copy, Trash2, Monitor, HardDrive, MoreVertical, CheckCircle } from 'lucide-react';
import { VM_TEMPLATES } from '@/data/templates';
import PremiumEmptyState from './PremiumEmptyState';

const VMList = () => {
  const { vms, selectedVMId, precos, selectVM, duplicateVM, removeVM, addVM } = useCalculadoraStore();
  const calculadora = new CalculadoraCloud(precos);

  const handleAddFromTemplate = (templateId: string) => {
    const template = VM_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      addVM(template.vm);
    }
  };

  if (vms.length === 0) {
    return (
      <div className="space-y-6">
        <PremiumEmptyState onAddVM={() => addVM()} />
        
        <div>
          <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
            Templates Enterprise
          </h3>
          <div className="space-y-3">
            {VM_TEMPLATES.map(template => (
              <button
                key={template.id}
                onClick={() => handleAddFromTemplate(template.id)}
                className="w-full p-4 text-left bg-gray-900 border border-gray-800 rounded-xl hover:border-gray-700 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <span className="text-lg">{template.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white mb-1">
                      {template.nome}
                    </div>
                    <div className="text-sm text-gray-400">
                      {template.descricao}
                    </div>
                  </div>
                  <div className="text-[#C7D82B] opacity-0 group-hover:opacity-100 transition-opacity">
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
    <div className="space-y-4">
      {vms.map(vm => {
        const custo = calculadora.calcularVM(vm);
        const isSelected = vm.id === selectedVMId;
        
        return (
          <div
            key={vm.id}
            className={`cursor-pointer transition-all duration-300 bg-gray-900 rounded-lg border ${
              isSelected 
                ? 'border-green-500 shadow-lg bg-green-500/10' 
                : 'border-gray-800 hover:border-gray-700 hover:shadow-lg'
            }`}
            onClick={() => selectVM(vm.id)}
          >
            {/* Status bar */}
            <div className={`h-1 ${isSelected 
              ? 'bg-green-500' 
              : 'bg-gray-800'
            }`}></div>
            
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <Monitor className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white mb-1">
                      {vm.nome}
                    </h3>
                    <p className="text-sm text-gray-400">ID: {vm.id.slice(0, 8)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {isSelected && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      Selecionado
                    </div>
                  )}
                  <span className="px-3 py-1 bg-gray-800 text-gray-300 text-xs font-medium rounded-full">
                    Ativo
                  </span>
                  <div className="flex space-x-1 ml-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateVM(vm.id);
                      }}
                      className="h-8 w-8 p-0 hover:bg-gray-800 hover:text-gray-300 text-gray-400"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeVM(vm.id);
                      }}
                      className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Specs em grid elegante */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-light text-white mb-1">{vm.vcpu}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">vCPUs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-light text-white mb-1">{vm.ram}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">GB RAM</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-light text-white mb-1">{vm.discoFCM + vm.discoSSD}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">GB Storage</div>
                </div>
              </div>

              {/* Licenças ativas */}
              {(vm.windowsServer || vm.rhel || vm.suse) && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {vm.windowsServer && (
                    <span className="inline-flex items-center px-3 py-1 bg-gray-800 text-gray-300 text-xs font-medium rounded-full">
                      🪟 Windows Server
                    </span>
                  )}
                  {vm.rhel && (
                    <span className="inline-flex items-center px-3 py-1 bg-gray-800 text-gray-300 text-xs font-medium rounded-full">
                      🎩 RHEL
                    </span>
                  )}
                  {vm.suse && (
                    <span className="inline-flex items-center px-3 py-1 bg-gray-800 text-gray-300 text-xs font-medium rounded-full">
                      🦎 SUSE
                    </span>
                  )}
                </div>
              )}

              {/* Preço destacado */}
              <div className="pt-6 border-t border-gray-800">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Investimento mensal</p>
                    <p className="text-3xl font-light text-white">
                      {formatCurrency(custo.total)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">+ impostos aplicáveis</p>
                  </div>
                  <button className="text-[#C7D82B] hover:text-[#B5C525] text-sm font-medium transition-colors">
                    Detalhes →
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VMList;
