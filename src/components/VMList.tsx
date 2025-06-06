
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud, formatCurrency } from '@/utils/calculadora';
import { Button } from '@/components/ui/button';
import { Copy, Trash2, Monitor, HardDrive } from 'lucide-react';
import { VM_TEMPLATES } from '@/data/templates';

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
      <div className="space-y-4">
        <div className="text-center py-6">
          <p className="text-sm text-optidata-gray-600 mb-4">
            Nenhuma VM criada ainda
          </p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-optidata-gray-900 mb-3">
            Templates Populares
          </h3>
          <div className="space-y-2">
            {VM_TEMPLATES.map(template => (
              <button
                key={template.id}
                onClick={() => handleAddFromTemplate(template.id)}
                className="w-full p-3 text-left border border-optidata-gray-200 rounded-lg hover:border-optidata-blue hover:bg-optidata-blue/5 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{template.icon}</span>
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
            className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
              isSelected 
                ? 'border-optidata-blue bg-optidata-blue/5 shadow-sm' 
                : 'border-optidata-gray-200 hover:border-optidata-blue/50'
            }`}
            onClick={() => selectVM(vm.id)}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-sm text-optidata-gray-900 truncate">
                {vm.nome}
              </h3>
              <div className="flex space-x-1 ml-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateVM(vm.id);
                  }}
                  className="h-6 w-6 p-0"
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
                  className="h-6 w-6 p-0 text-optidata-error hover:text-optidata-error"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="space-y-1 text-xs text-optidata-gray-600">
              <div className="flex items-center space-x-1">
                <Monitor className="w-3 h-3" />
                <span>{vm.vcpu} vCPU • {vm.ram}GB RAM</span>
              </div>
              
              {(vm.discoFCM > 0 || vm.discoSSD > 0) && (
                <div className="flex items-center space-x-1">
                  <HardDrive className="w-3 h-3" />
                  <span>
                    {vm.discoFCM > 0 && `${vm.discoFCM}GB FCM`}
                    {vm.discoFCM > 0 && vm.discoSSD > 0 && ' • '}
                    {vm.discoSSD > 0 && `${vm.discoSSD}GB SSD`}
                  </span>
                </div>
              )}

              {vm.windowsServer && (
                <div className="text-optidata-blue">
                  Windows Server
                </div>
              )}
            </div>

            <div className="mt-3 pt-2 border-t border-optidata-gray-100">
              <div className="text-right">
                <div className="text-lg font-semibold text-optidata-gray-900">
                  {formatCurrency(custo.total)}
                </div>
                <div className="text-xs text-optidata-gray-600">
                  por mês
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
