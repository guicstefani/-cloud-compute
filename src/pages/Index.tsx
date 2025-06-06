
import { useState } from 'react';
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud } from '@/utils/calculadora';
import VMList from '@/components/VMList';
import VMConfigurator from '@/components/VMConfigurator';
import PricingSummary from '@/components/PricingSummary';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Index = () => {
  const { vms, selectedVMId, precos, addVM } = useCalculadoraStore();
  const [activeTab, setActiveTab] = useState<'configurar' | 'resumo'>('configurar');
  
  const calculadora = new CalculadoraCloud(precos);
  const selectedVM = vms.find(vm => vm.id === selectedVMId);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-optidata-gray-50 to-optidata-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Lista de VMs */}
          <div className="lg:w-80">
            <div className="bg-white rounded-lg shadow-sm border border-optidata-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-optidata-gray-900">
                  Máquinas Virtuais
                </h2>
                <Button
                  onClick={() => addVM()}
                  size="sm"
                  className="bg-optidata-blue hover:bg-optidata-blue/90"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar
                </Button>
              </div>
              <VMList />
            </div>
          </div>

          {/* Área Principal */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-optidata-gray-200 mb-6">
              <div className="flex border-b border-optidata-gray-200">
                <button
                  onClick={() => setActiveTab('configurar')}
                  className={`px-6 py-3 font-medium text-sm transition-colors ${
                    activeTab === 'configurar'
                      ? 'border-b-2 border-optidata-blue text-optidata-blue bg-optidata-blue/5'
                      : 'text-optidata-gray-600 hover:text-optidata-gray-900'
                  }`}
                >
                  Configurar VM
                </button>
                <button
                  onClick={() => setActiveTab('resumo')}
                  className={`px-6 py-3 font-medium text-sm transition-colors ${
                    activeTab === 'resumo'
                      ? 'border-b-2 border-optidata-blue text-optidata-blue bg-optidata-blue/5'
                      : 'text-optidata-gray-600 hover:text-optidata-gray-900'
                  }`}
                >
                  Resumo e Orçamento
                </button>
              </div>

              <div className="p-6">
                {activeTab === 'configurar' && (
                  <>
                    {selectedVM ? (
                      <VMConfigurator vm={selectedVM} calculadora={calculadora} />
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 bg-optidata-gray-100 rounded-full flex items-center justify-center">
                          <Plus className="w-8 h-8 text-optidata-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-optidata-gray-900 mb-2">
                          Nenhuma VM selecionada
                        </h3>
                        <p className="text-optidata-gray-600 mb-4">
                          Selecione uma VM da lista ou crie uma nova para começar.
                        </p>
                        <Button
                          onClick={() => addVM()}
                          className="bg-optidata-blue hover:bg-optidata-blue/90"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Criar Nova VM
                        </Button>
                      </div>
                    )}
                  </>
                )}
                
                {activeTab === 'resumo' && (
                  <PricingSummary calculadora={calculadora} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
