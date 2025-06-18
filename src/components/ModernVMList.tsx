
import React, { useState } from 'react';
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud } from '@/utils/calculadora';
import { Plus, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ModernVMCard from './ModernVMCard';
import ImportadorExcelModal from './ImportadorExcelModal';

const ModernVMList = () => {
  const { vms, addVM, precos } = useCalculadoraStore();
  const [importModalOpen, setImportModalOpen] = useState(false);
  const calculadora = new CalculadoraCloud(precos);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Suas VMs</h2>
        <div className="flex gap-2">
          <Button 
            onClick={() => setImportModalOpen(true)}
            variant="outline"
            size="sm"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Importar Excel
          </Button>
          <Button onClick={() => addVM()} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Nova VM
          </Button>
        </div>
      </div>

      {/* VM Cards */}
      {vms.length > 0 ? (
        <div className="space-y-4">
          {vms.map(vm => (
            <ModernVMCard
              key={vm.id}
              vm={vm}
              calculadora={calculadora}
              isSelected={false}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">💻</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Nenhuma VM configurada
          </h3>
          <p className="text-gray-600 mb-6">
            Comece criando sua primeira VM ou importe de uma planilha Excel
          </p>
          <div className="flex justify-center gap-3">
            <Button onClick={() => addVM()}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Nova VM
            </Button>
            <Button 
              onClick={() => setImportModalOpen(true)}
              variant="outline"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Importar do Excel
            </Button>
          </div>
        </div>
      )}

      {/* Import Modal */}
      <ImportadorExcelModal 
        open={importModalOpen}
        onOpenChange={setImportModalOpen}
      />
    </div>
  );
};

export default ModernVMList;
