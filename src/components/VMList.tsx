
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
          <h3 className="text-sm font-semibold text-[#1F2937] mb-4 uppercase tracking-wider">
            Templates Enterprise
          </h3>
          <div className="space-y-3">
            {VM_TEMPLATES.map(template => (
              <button
                key={template.id}
                onClick={() => handleAddFromTemplate(template.id)}
                className="w-full p-4 text-left bg-white border border-[#E5E7EB] rounded-xl hover:border-[#2563EB] hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <span className="text-lg">{template.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-[#1F2937] mb-1">
                      {template.nome}
                    </div>
                    <div className="text-sm text-[#6B7280]">
                      {template.descricao}
                    </div>
                  </div>
                  <div className="text-[#2563EB] opacity-0 group-hover:opacity-100 transition-opacity">
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
            className={`premium-vm-card cursor-pointer transition-all duration-300 ${
              isSelected 
                ? 'border-2 border-[#2563EB] shadow-lg bg-[#EFF6FF]' 
                : 'border border-[#E5E7EB] hover:border-[#2563EB] hover:shadow-lg bg-white'
            }`}
            onClick={() => selectVM(vm.id)}
          >
            {/* Status bar premium */}
            <div className={`h-1 ${isSelected 
              ? 'bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]' 
              : 'bg-gradient-to-r from-[#E5E7EB] to-[#E5E7EB]'
            }`}></div>
            
            <div className="p-6">
              {/* Header refinado */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] rounded-xl flex items-center justify-center text-white shadow-lg">
                    <Monitor className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-[#1F2937] mb-1">
                      {vm.nome}
                    </h3>
                    <p className="text-sm text-[#6B7280]">ID: {vm.id.slice(0, 8)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {isSelected && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-[#10B981] text-white text-xs font-medium rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      Selecionado
                    </div>
                  )}
                  <span className="px-3 py-1 bg-[#F0FDF4] text-[#10B981] text-xs font-medium rounded-full">
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
                      className="h-8 w-8 p-0 hover:bg-[#EFF6FF] hover:text-[#2563EB]"
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
                      className="h-8 w-8 p-0 text-[#EF4444] hover:text-[#DC2626] hover:bg-[#FEF2F2]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Specs em grid elegante */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-light text-[#1F2937] mb-1">{vm.vcpu}</div>
                  <div className="text-xs text-[#6B7280] uppercase tracking-wider">vCPUs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-light text-[#1F2937] mb-1">{vm.ram}</div>
                  <div className="text-xs text-[#6B7280] uppercase tracking-wider">GB RAM</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-light text-[#1F2937] mb-1">{vm.discoFCM + vm.discoSSD}</div>
                  <div className="text-xs text-[#6B7280] uppercase tracking-wider">GB Storage</div>
                </div>
              </div>

              {/* Licenças ativas */}
              {(vm.windowsServer || vm.rhel || vm.suse) && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {vm.windowsServer && (
                    <span className="inline-flex items-center px-3 py-1 bg-[#EFF6FF] text-[#2563EB] text-xs font-medium rounded-full">
                      🪟 Windows Server
                    </span>
                  )}
                  {vm.rhel && (
                    <span className="inline-flex items-center px-3 py-1 bg-[#FEF2F2] text-[#EF4444] text-xs font-medium rounded-full">
                      🎩 RHEL
                    </span>
                  )}
                  {vm.suse && (
                    <span className="inline-flex items-center px-3 py-1 bg-[#F0FDF4] text-[#10B981] text-xs font-medium rounded-full">
                      🦎 SUSE
                    </span>
                  )}
                </div>
              )}

              {/* Preço destacado */}
              <div className="pt-6 border-t border-[#E5E7EB]">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-[#6B7280] uppercase tracking-wider mb-1">Investimento mensal</p>
                    <p className="text-3xl font-light text-[#1F2937]">
                      {formatCurrency(custo.total)}
                    </p>
                    <p className="text-xs text-[#6B7280] mt-1">+ impostos aplicáveis</p>
                  </div>
                  <button className="text-[#2563EB] hover:text-[#1D4ED8] text-sm font-medium transition-colors">
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
