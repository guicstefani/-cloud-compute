
import React, { useState } from 'react';
import { Plus, Settings, Calculator, Trash2, Copy } from 'lucide-react';
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud, formatCurrency } from '@/utils/calculadora';
import PremiumVMModal from './PremiumVMModal';

const PremiumCalculator = () => {
  const { vms, selectedVMId, precos, addVM, selectVM, duplicateVM, removeVM } = useCalculadoraStore();
  const [modalOpen, setModalOpen] = useState(false);
  const calculadora = new CalculadoraCloud(precos);

  const calcularTotal = () => {
    return vms.reduce((total, vm) => {
      const custo = calculadora.calcularVM(vm);
      return total + custo.total;
    }, 0);
  };

  const selectedVM = vms.find(vm => vm.id === selectedVMId);

  return (
    <div className="min-h-screen bg-optidata-dark text-white">
      {/* Header Premium */}
      <div className="bg-optidata-dark-medium border-b border-optidata-dark-light p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient-optidata">
              Optidata Cloud Calculator
            </h1>
            <p className="text-gray-400 mt-1">Calculadora Premium de Custos</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Total Mensal</p>
              <p className="text-2xl font-bold text-optidata-gold">
                {formatCurrency(calcularTotal())}
              </p>
            </div>
            <button
              onClick={() => addVM()}
              className="btn-optidata flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nova VM
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Lista de VMs - Coluna Esquerda */}
          <div className="lg:col-span-8">
            <div className="space-y-4">
              {vms.length === 0 ? (
                <div className="premium-card p-12 text-center">
                  <div className="w-16 h-16 bg-optidata-dark-light rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calculator className="w-8 h-8 text-optidata-gold" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Nenhuma VM configurada</h3>
                  <p className="text-gray-400 mb-6">
                    Comece criando sua primeira máquina virtual
                  </p>
                  <button
                    onClick={() => addVM()}
                    className="btn-optidata"
                  >
                    <Plus className="w-5 h-5 inline mr-2" />
                    Criar primeira VM
                  </button>
                </div>
              ) : (
                vms.map(vm => {
                  const custo = calculadora.calcularVM(vm);
                  const isSelected = vm.id === selectedVMId;
                  
                  return (
                    <div
                      key={vm.id}
                      className={`premium-card p-6 cursor-pointer transition-all duration-300 ${
                        isSelected ? 'ring-2 ring-optidata-gold border-optidata-gold' : ''
                      }`}
                      onClick={() => selectVM(vm.id)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-optidata-gold to-optidata-gold-light rounded-lg flex items-center justify-center">
                            <Calculator className="w-6 h-6 text-optidata-dark" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">{vm.nome}</h3>
                            <p className="text-sm text-gray-400">
                              {vm.vcpu} vCPU • {vm.ram} GB RAM • {vm.discoFCM + vm.discoSSD} GB Storage
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-optidata-gold">
                            {formatCurrency(custo.total)}
                          </span>
                          <div className="flex gap-1 ml-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setModalOpen(true);
                                selectVM(vm.id);
                              }}
                              className="p-2 text-gray-400 hover:text-optidata-gold hover:bg-optidata-dark-light rounded-lg transition-colors"
                            >
                              <Settings className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                duplicateVM(vm.id);
                              }}
                              className="p-2 text-gray-400 hover:text-optidata-gold hover:bg-optidata-dark-light rounded-lg transition-colors"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('Remover esta VM?')) {
                                  removeVM(vm.id);
                                }
                              }}
                              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Specs compactas */}
                      <div className="grid grid-cols-4 gap-4 pt-4 border-t border-optidata-dark-light">
                        <div className="text-center">
                          <div className="text-lg font-semibold">{vm.vcpu}</div>
                          <div className="text-xs text-gray-400 uppercase">vCPU</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold">{vm.ram}</div>
                          <div className="text-xs text-gray-400 uppercase">GB RAM</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold">{vm.discoFCM + vm.discoSSD}</div>
                          <div className="text-xs text-gray-400 uppercase">GB Storage</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-optidata-gold">
                            {formatCurrency(custo.total)}
                          </div>
                          <div className="text-xs text-gray-400 uppercase">Mensal</div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Resumo Premium - Sidebar Direita */}
          <div className="lg:col-span-4">
            <div className="sticky top-6">
              <div className="premium-card p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-optidata-gold" />
                  Resumo do Investimento
                </h3>

                <div className="space-y-4">
                  {vms.map(vm => {
                    const custo = calculadora.calcularVM(vm);
                    return (
                      <div key={vm.id} className="flex justify-between items-center py-2 border-b border-optidata-dark-light">
                        <span className="text-sm text-gray-300">{vm.nome}</span>
                        <span className="font-semibold">{formatCurrency(custo.total)}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-6 border-t border-optidata-gold/30">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Mensal:</span>
                    <span className="text-3xl font-bold text-optidata-gold">
                      {formatCurrency(calcularTotal())}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    {vms.length} VM{vms.length !== 1 ? 's' : ''} configurada{vms.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {vms.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <button className="w-full btn-optidata">
                      Gerar Proposta
                    </button>
                    <button className="w-full btn-optidata-secondary">
                      Exportar PDF
                    </button>
                  </div>
                )}
              </div>

              {/* TCO Preview */}
              {vms.length > 0 && (
                <div className="premium-card p-6 mt-6">
                  <h4 className="font-semibold mb-4">Projeção TCO</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">12 meses</span>
                      <span className="font-semibold">{formatCurrency(calcularTotal() * 12)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">24 meses</span>
                      <span className="font-semibold">{formatCurrency(calcularTotal() * 24)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-optidata-dark-light">
                      <span className="text-sm font-medium">36 meses</span>
                      <span className="font-bold text-optidata-gold">{formatCurrency(calcularTotal() * 36)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Configuração */}
      <PremiumVMModal 
        open={modalOpen}
        onOpenChange={setModalOpen}
        vm={selectedVM}
      />
    </div>
  );
};

export default PremiumCalculator;
