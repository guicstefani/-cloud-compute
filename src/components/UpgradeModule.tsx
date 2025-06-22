
import React from 'react';
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud, formatCurrency } from '@/utils/calculadora';
import { Download, Save, Share2, Settings } from 'lucide-react';

const UpgradeModule = () => {
  const { vms, descontos, precos } = useCalculadoraStore();
  const calculadora = new CalculadoraCloud(precos);

  // Funções simples que só mostram alertas - SEM COMPLEXIDADE
  const handleExportarExcel = () => {
    if (vms.length === 0) {
      alert('Adicione pelo menos uma VM antes de exportar');
      return;
    }
    alert('Funcionalidade de exportar Excel será implementada em breve');
  };

  const handleSalvarConfiguracao = () => {
    if (vms.length === 0) {
      alert('Não há configurações para salvar');
      return;
    }
    alert('Funcionalidade de salvar configuração será implementada em breve');
  };

  const handleSolicitarProposta = () => {
    if (vms.length === 0) {
      alert('Adicione pelo menos uma VM antes de solicitar proposta');
      return;
    }
    alert('Funcionalidade de solicitar proposta será implementada em breve');
  };

  const handleCompartilhar = () => {
    if (vms.length === 0) {
      alert('Não há dados para compartilhar');
      return;
    }
    alert('Funcionalidade de compartilhar será implementada em breve');
  };

  if (vms.length === 0) {
    return null;
  }

  const resultado = calculadora.calcularTotalGeral(vms, descontos);

  return (
    <div className="premium-card p-6 space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">Ações Rápidas</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={handleExportarExcel}
          className="premium-btn text-sm"
        >
          <Download className="w-4 h-4" />
          Exportar Excel
        </button>
        
        <button 
          onClick={handleSalvarConfiguracao}
          className="premium-btn text-sm"
        >
          <Save className="w-4 h-4" />
          Salvar Config
        </button>
        
        <button 
          onClick={handleSolicitarProposta}
          className="premium-btn text-sm"
        >
          <Settings className="w-4 h-4" />
          Solicitar Proposta
        </button>
        
        <button 
          onClick={handleCompartilhar}
          className="premium-btn text-sm"
        >
          <Share2 className="w-4 h-4" />
          Compartilhar
        </button>
      </div>

      <div className="pt-4 border-t border-gray-700">
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-1">Total do Projeto</p>
          <p className="text-xl font-bold text-gold">
            {formatCurrency(resultado.totalComDesconto)}
          </p>
          <p className="text-xs text-gray-500">
            {vms.length} VM{vms.length !== 1 ? 's' : ''} configurada{vms.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModule;
