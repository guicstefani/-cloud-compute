
import { useState } from 'react';
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud, formatCurrency } from '@/utils/calculadora';
import VMList from '@/components/VMList';
import VMConfigurator from '@/components/VMConfigurator';
import PricingSummary from '@/components/PricingSummary';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import PremiumFloatingElements from '@/components/PremiumFloatingElements';
import { Button } from '@/components/ui/button';
import { Plus, Share, Save, Download } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50 relative">
      <PremiumFloatingElements />
      
      <Header />
      <HeroSection />
      
      <main className="container mx-auto px-4 lg:px-6 py-8 lg:py-12 pb-24 lg:pb-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* VM List - Premium sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="premium-card">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Servidores Virtuais
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {vms.length} servidor{vms.length !== 1 ? 'es' : ''} configurado{vms.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <Button
                    onClick={() => addVM()}
                    size="sm"
                    className="bg-[#0066CC] hover:bg-[#0052A3] text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <VMList />
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 order-1 lg:order-2 space-y-6">
            {/* Enhanced Tabs - Desktop only */}
            <div className="premium-card mobile-hide">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('configurar')}
                  className={`px-8 py-4 font-medium text-sm transition-all relative ${
                    activeTab === 'configurar'
                      ? 'text-[#0066CC] bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Configurar VM
                  {activeTab === 'configurar' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0066CC]"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('resumo')}
                  className={`px-8 py-4 font-medium text-sm transition-all relative ${
                    activeTab === 'resumo'
                      ? 'text-[#0066CC] bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Resumo e Orçamento
                  {activeTab === 'resumo' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0066CC]"></div>
                  )}
                </button>
              </div>

              <div className="p-8">
                {activeTab === 'configurar' ? (
                  <>
                    {selectedVM ? (
                      <VMConfigurator vm={selectedVM} calculadora={calculadora} />
                    ) : (
                      <div className="text-center py-16">
                        <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                          <Plus className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          Nenhuma VM selecionada
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                          Selecione uma VM da lista ou crie uma nova para começar a configurar seus recursos.
                        </p>
                        <Button
                          onClick={() => addVM()}
                          className="bg-[#0066CC] hover:bg-[#0052A3] text-white"
                        >
                          <Plus className="w-5 h-5 mr-2" />
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
                <div className="premium-card p-6">
                  <VMConfigurator vm={selectedVM} calculadora={calculadora} />
                </div>
              ) : (
                <div className="premium-card p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Plus className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhuma VM selecionada
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Selecione uma VM da lista para começar a configurar.
                  </p>
                  <Button
                    onClick={() => addVM()}
                    className="bg-[#0066CC] hover:bg-[#0052A3] text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Nova VM
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile: Enhanced Summary Card */}
            <div className="mobile-show">
              <div className="premium-card overflow-hidden">
                <div className="bg-gradient-to-r from-[#0066CC] to-[#004499] p-6 text-white">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm opacity-90 mb-1">Total Mensal</p>
                      <p className="text-4xl font-light mb-2">{formatCurrency(total)}</p>
                      <p className="text-xs opacity-75">
                        {vms.length} VM{vms.length !== 1 ? 's' : ''} configurada{vms.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <Button 
                      variant="secondary" 
                      size="icon"
                      className="bg-white/20 border-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                    >
                      <Share className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                <div className="p-6">
                  <PricingSummary calculadora={calculadora} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced Mobile Bottom Bar */}
      {isMobile && vms.length > 0 && (
        <div className="mobile-bottom-bar">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Mensal</p>
              <p className="text-2xl font-semibold text-[#0066CC]">
                {formatCurrency(total)}
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-gray-300 hover:border-[#0066CC] hover:bg-blue-50"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
              <Button 
                size="sm" 
                className="bg-[#0066CC] hover:bg-[#0052A3] text-white"
              >
                <Download className="w-4 h-4 mr-2" />
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
