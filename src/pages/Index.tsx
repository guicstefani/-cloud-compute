
import { useState } from 'react';
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud, formatCurrency } from '@/utils/calculadora';
import VMList from '@/components/VMList';
import VMConfigurator from '@/components/VMConfigurator';
import PricingSummary from '@/components/PricingSummary';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Plus, Share } from 'lucide-react';
import { useIsMobile } from '@/hooks/useMobile';

const Index = () => {
  const { vms, selectedVMId, precos, addVM, descontos } = useCalculadoraStore();
  const [activeTab, setActiveTab] = useState<'configurar' | 'resumo'>('configurar');
  const isMobile = useIsMobile();
  
  const calculadora = new CalculadoraCloud(precos);
  const selectedVM = vms.find(vm => vm.id === selectedVMId);
  
  // Calculate total for mobile bottom bar
  const total = vms.length > 0 
    ? calculadora.calcularTotalGeral(vms, descontos).totalComDesconto 
    : 0;

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header />
      
      <main className="container mx-auto px-4 lg:px-6 py-4 lg:py-6 pb-20 lg:pb-6">
        <div className="responsive-grid">
          {/* VM List - Left sidebar on desktop, full width on mobile */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="optidata-card p-4 lg:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-optidata-gray-900">
                  Máquinas Virtuais
                </h2>
                <Button
                  onClick={() => addVM()}
                  size="sm"
                  className="btn-optidata"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Adicionar</span>
                </Button>
              </div>
              <VMList />
            </div>
          </div>

          {/* Main Content - Right side on desktop, full width on mobile */}
          <div className="lg:col-span-2 order-1 lg:order-2 space-y-4 lg:space-y-6">
            {/* Tabs - Desktop only */}
            <div className="optidata-card mobile-hide">
              <div className="flex border-b border-optidata-gray-200">
                <button
                  onClick={() => setActiveTab('configurar')}
                  className={`px-6 py-4 font-medium text-sm transition-all ${
                    activeTab === 'configurar'
                      ? 'border-b-2 border-optidata-blue text-optidata-blue bg-blue-50'
                      : 'text-optidata-gray-600 hover:text-optidata-gray-900'
                  }`}
                >
                  Configurar VM
                </button>
                <button
                  onClick={() => setActiveTab('resumo')}
                  className={`px-6 py-4 font-medium text-sm transition-all ${
                    activeTab === 'resumo'
                      ? 'border-b-2 border-optidata-blue text-optidata-blue bg-blue-50'
                      : 'text-optidata-gray-600 hover:text-optidata-gray-900'
                  }`}
                >
                  Resumo e Orçamento
                </button>
              </div>

              <div className="p-6">
                {activeTab === 'configurar' ? (
                  <>
                    {selectedVM ? (
                      <VMConfigurator vm={selectedVM} calculadora={calculadora} />
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 optidata-gradient-light rounded-full flex items-center justify-center">
                          <Plus className="w-8 h-8 text-optidata-blue" />
                        </div>
                        <h3 className="text-lg font-medium text-optidata-gray-900 mb-2">
                          Nenhuma VM selecionada
                        </h3>
                        <p className="text-optidata-gray-600 mb-4">
                          Selecione uma VM da lista ou crie uma nova para começar.
                        </p>
                        <Button
                          onClick={() => addVM()}
                          className="btn-optidata"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Criar Nova VM
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <PricingSummary calculadora={calculadora} />
                )}
              </div>
            </div>

            {/* Mobile: VM Configurator */}
            <div className="mobile-show">
              {selectedVM ? (
                <VMConfigurator vm={selectedVM} calculadora={calculadora} />
              ) : (
                <div className="optidata-card p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 optidata-gradient-light rounded-full flex items-center justify-center">
                    <Plus className="w-8 h-8 text-optidata-blue" />
                  </div>
                  <h3 className="text-lg font-medium text-optidata-gray-900 mb-2">
                    Nenhuma VM selecionada
                  </h3>
                  <p className="text-optidata-gray-600 mb-4">
                    Selecione uma VM da lista para começar a configurar.
                  </p>
                  <Button
                    onClick={() => addVM()}
                    className="btn-optidata"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Nova VM
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile: Summary Card */}
            <div className="mobile-show">
              <div className="optidata-card overflow-hidden">
                <div className="optidata-gradient p-4 text-white">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm opacity-90">Total Mensal</p>
                      <p className="text-3xl font-bold">{formatCurrency(total)}</p>
                      <p className="text-xs opacity-75">{vms.length} VM{vms.length !== 1 ? 's' : ''} configurada{vms.length !== 1 ? 's' : ''}</p>
                    </div>
                    <Button 
                      variant="secondary" 
                      size="icon"
                      className="bg-white/20 border-white/20 text-white hover:bg-white/30"
                    >
                      <Share className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <PricingSummary calculadora={calculadora} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Bar */}
      {isMobile && vms.length > 0 && (
        <div className="mobile-bottom-bar safe-bottom">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-optidata-gray-600">Total Mensal</p>
              <p className="text-2xl font-bold text-optidata-blue">
                {formatCurrency(total)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-optidata-gray-200">
                Salvar
              </Button>
              <Button size="sm" className="btn-optidata">
                Exportar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
