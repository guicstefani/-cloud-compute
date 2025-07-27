import React, { useState } from 'react';
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud, formatCurrency } from '@/utils/calculadora';
import { gerarPDFProposta } from '@/utils/pdfGenerator';
import { Calculator, TrendingUp, Download, Save, Zap, Shield, Headphones, FileText } from 'lucide-react';
import CriarPropostaModal from '@/components/CriarPropostaModal';

const ModernSummaryCard = () => {
  const { vms, descontos, precos } = useCalculadoraStore();
  const calculadora = new CalculadoraCloud(precos);
  const [modalPropostaAberto, setModalPropostaAberto] = useState(false);
  
  const handleGerarPDF = () => {
    gerarPDFProposta({
      tipo: 'vm',
      vms,
      calculadora,
      descontos
    });
  };

  if (vms.length === 0) {
    return (
      <div className="sticky top-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calculator className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Configure sua infraestrutura
            </h3>
            <p className="text-gray-500 mb-6">
              Comece criando sua primeira VM para ver os custos
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
      <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white rounded-2xl shadow-2xl p-8 overflow-hidden relative">
        {/* Background Effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full filter blur-2xl opacity-20"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-200 text-sm font-medium uppercase tracking-wide">Total Mensal</span>
            <Calculator className="w-5 h-5 text-blue-300" />
          </div>
          <div className="text-4xl font-bold mb-1">
            {formatCurrency(totalComDesconto)}
          </div>
          <div className="text-blue-200 text-sm">
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
          onClick={handleGerarPDF}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
        >
          <FileText className="w-5 h-5 inline mr-2" />
          Gerar PDF da Proposta
        </button>
        
        <button 
          onClick={() => setModalPropostaAberto(true)}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
        >
          <Save className="w-5 h-5 inline mr-2" />
          Criar Proposta
        </button>
        
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl">
          <Download className="w-5 h-5 inline mr-2" />
          Exportar Excel
        </button>
        <button className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-200 hover:shadow-md">
          <Save className="w-5 h-5 inline mr-2" />
          Salvar Configuração
        </button>
      </div>

      {/* Trust Indicators */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h4 className="font-semibold text-gray-900 mb-4 text-center">Por que Optidata?</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-xs text-gray-600 font-medium">Segurança</p>
            <p className="text-xs text-gray-500">Enterprise</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-xs text-gray-600 font-medium">Performance</p>
            <p className="text-xs text-gray-500">Otimizada</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Headphones className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-xs text-gray-600 font-medium">Suporte</p>
            <p className="text-xs text-gray-500">24/7</p>
          </div>
        </div>
      </div>

      {/* TCO Preview */}
      <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Projeção TCO</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">12 meses</span>
            <span className="font-semibold text-gray-900">{formatCurrency(totalComDesconto * 12)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">36 meses</span>
            <span className="font-semibold text-gray-900">{formatCurrency(totalComDesconto * 36)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-700">60 meses</span>
            <span className="font-bold text-blue-600">{formatCurrency(totalComDesconto * 60)}</span>
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
