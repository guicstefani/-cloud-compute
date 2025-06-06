
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud, formatCurrency } from '@/utils/calculadora';
import { Button } from '@/components/ui/button';
import { Copy, Trash2, Monitor, HardDrive } from 'lucide-react';
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
          <h3 className="text-sm font-medium text-optidata-gray-900 mb-3">
            Templates Enterprise
          </h3>
          <div className="space-y-2">
            {VM_TEMPLATES.map(template => (
              <button
                key={template.id}
                onClick={() => handleAddFromTemplate(template.id)}
                className="w-full p-3 text-left border border-optidata-gray-200 rounded-lg hover:border-optidata-blue hover:bg-optidata-blue/5 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#0066CC] to-[#00A1E4] rounded-lg flex items-center justify-center text-white shadow-md">
                    <span className="text-lg">{template.icon}</span>
                  </div>
                  <div>
                    <div className="font-medium text-sm text-optidata-gray-900">
                      {template.nome}
                    </div>
                    <div className="text-xs text-optidata-gray-600">
                      {template.descricao}
                    </div>
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
    <div className="space-y-3">
      {vms.map(vm => {
        const custo = calculadora.calcularVM(vm);
        const isSelected = vm.id === selectedVMId;
        
        return (
          <div
            key={vm.id}
            className={`premium-card cursor-pointer transition-all ${
              isSelected 
                ? 'border-2 border-optidata-blue bg-optidata-blue/5 shadow-lg' 
                : 'border border-optidata-gray-200 hover:border-optidata-blue/50'
            }`}
            onClick={() => selectVM(vm.id)}
          >
            {/* Gradient no topo */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
            
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="vm-card-icon">
                    <Monitor className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-optidata-gray-900 truncate">
                      {vm.nome}
                    </h3>
                    <p className="text-xs text-optidata-gray-500">Enterprise Grade</p>
                  </div>
                </div>
                <div className="flex space-x-1 ml-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateVM(vm.id);
                    }}
                    className="h-6 w-6 p-0 hover:bg-blue-50"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeVM(vm.id);
                    }}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Specs premium */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="flex items-center gap-1 text-gray-600 text-xs mb-1">
                    <Monitor className="w-3 h-3" />
                    <span>vCPU</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{vm.vcpu}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="flex items-center gap-1 text-gray-600 text-xs mb-1">
                    <HardDrive className="w-3 h-3" />
                    <span>RAM</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{vm.ram}GB</div>
                </div>
              </div>

              {vm.windowsServer && (
                <div className="mb-3">
                  <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                    Windows Server
                  </span>
                </div>
              )}

              <div className="border-t pt-3">
                <div className="flex items-end justify-between">
                  <span className="text-xs text-gray-500">Investimento mensal</span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                      {formatCurrency(custo.total)}
                    </div>
                    <div className="text-xs text-gray-500">+ impostos</div>
                  </div>
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
