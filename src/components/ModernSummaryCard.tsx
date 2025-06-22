
import React, { useState } from 'react';
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud, formatCurrency } from '@/utils/calculadora';
import { LegacyBridge } from '@/shared/services/LegacyBridge';
import { exportToExcel } from '@/utils/exportUtils';
import { Calculator, TrendingUp, Download, Save, FileText } from 'lucide-react';
import CriarPropostaModal from '@/components/CriarPropostaModal';

const ModernSummaryCard = () => {
  const { vms, descontos, precos } = useCalculadoraStore();
  const calculadora = new CalculadoraCloud(precos);
  const [modalPropostaAberto, setModalPropostaAberto] = useState(false);
  const legacyBridge = LegacyBridge.getInstance();
  
  const handleGerarPDF = async () => {
    if (vms.length === 0) {
      alert('Adicione pelo menos uma VM antes de gerar o PDF');
      return;
    }

    try {
      await legacyBridge.generatePDF({
        tipo: 'vm',
        vms,
        calculadora,
        descontos
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    }
  };

  const handleExportarExcel = () => {
    if (vms.length === 0) {
      alert('Adicione pelo menos uma VM antes de exportar');
      return;
    }

    try {
      const resultado = calculadora.calcularTotalGeral(vms, descontos);
      const exportData = {
        vms: resultado.vms,
        totalGeral: resultado.totalComDesconto,
        economia: resultado.economia,
        calculadora
      };
      
      exportToExcel(exportData);
    } catch (error) {
      console.error('Erro ao exportar Excel:', error);
      alert('Erro ao exportar Excel. Tente novamente.');
    }
  };

  if (vms.length === 0) {
    return (
      <div className="sticky top-6">
        <div className="premium-card p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calculator className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Total do Investimento
            </h3>
            <p className="text-gray-400 mb-6">
              Configure suas VMs para ver os custos
            </p>
          </div>
        </div>
      </div>
    );
  }

  const resultado = calculadora.calcularTotalGeral(vms, descontos);
  const { totalComDesconto, economia } = resultado;

  return (
    <div className="sticky top-6 space-y-6">
      {/* Main Total Card */}
      <div className="bg-gradient-to-br from-gray-900 via-[#1a1a1a] to-black text-white rounded-2xl shadow-2xl p-8 overflow-hidden relative border border-[#DCAE1D]/20">
        {/* Background Effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#DCAE1D] to-[#F4C430] rounded-full filter blur-2xl opacity-20"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 text-sm font-medium uppercase tracking-wide">Total Mensal</span>
            <Calculator className="w-5 h-5 text-gold" />
          </div>
          <div className="text-4xl font-bold mb-1 text-gold">
            {formatCurrency(totalComDesconto)}
          </div>
          <div className="text-gray-300 text-sm">
            {vms.length} VM{vms.length !== 1 ? 's' : ''} configurada{vms.length !== 1 ? 's' : ''}
          </div>

          {/* Economy Badge */}
          {economia > 0 && (
            <div className="mt-6 bg-green-500/20 backdrop-blur rounded-xl p-4 border border-green-400/30">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-300" />
                <span className="text-sm text-green-300 font-medium">Economia Aplicada</span>
              </div>
              <div className="text-2xl font-bold text-green-300">
                {formatCurrency(economia)}
              </div>
              <div className="text-xs text-green-400">
                {((economia / (totalComDesconto + economia)) * 100).toFixed(1)}% de desconto
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button 
          onClick={() => setModalPropostaAberto(true)}
          className="w-full bg-gradient-to-r from-[#DCAE1D] to-[#F4C430] text-black font-bold py-4 px-6 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          <FileText className="w-5 h-5" />
          Gerar Proposta
        </button>
        
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={handleGerarPDF}
            className="bg-transparent border-2 border-gray-600 hover:border-gold text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" />
            PDF
          </button>
          
          <button 
            onClick={handleExportarExcel}
            className="bg-transparent border-2 border-gray-600 hover:border-gold text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Excel
          </button>
        </div>
      </div>

      {/* TCO Preview */}
      <div className="premium-card p-6">
        <h4 className="font-semibold text-white mb-4">Projeção TCO</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">12 meses</span>
            <span className="font-semibold text-white">{formatCurrency(totalComDesconto * 12)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">36 meses</span>
            <span className="font-semibold text-white">{formatCurrency(totalComDesconto * 36)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-700">
            <span className="text-sm font-medium text-gray-300">60 meses</span>
            <span className="font-bold text-gold">{formatCurrency(totalComDesconto * 60)}</span>
          </div>
        </div>
      </div>

      {/* Modal para criar proposta */}
      <CriarPropostaModal 
        open={modalPropostaAberto}
        onOpenChange={setModalPropostaAberto}
        calculadora={calculadora}
      />
    </div>
  );
};

export default ModernSummaryCard;
