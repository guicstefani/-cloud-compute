
import React, { useState } from 'react';
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud, formatCurrency } from '@/utils/calculadora';
import { Calculator, TrendingUp, Download, Save, Zap, Shield, Headphones, DollarSign } from 'lucide-react';
import ProposalModal, { ProposalData } from './ProposalModal';
import PropostaPDFContent, { generatePDF } from './PDFGenerator';

const ModernSummaryCard = () => {
  const { vms, descontos, precos } = useCalculadoraStore();
  const calculadora = new CalculadoraCloud(precos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentProposalData, setCurrentProposalData] = useState<ProposalData | null>(null);
  
  if (vms.length === 0) {
    return (
      <div className="sticky top-6">
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Calculator className="w-8 h-8 text-[#C7D82B]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Configure sua infraestrutura
            </h3>
            <p className="text-gray-400 mb-6">
              Comece criando sua primeira VM para ver os custos
            </p>
          </div>
        </div>
      </div>
    );
  }

  const resultado = calculadora.calcularTotalGeral(vms, descontos);
  const { totalComDesconto, economia } = resultado;

  const handleGeneratePDF = async (proposalData: ProposalData) => {
    setIsGenerating(true);
    setCurrentProposalData(proposalData);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      await generatePDF(vms, calculadora, proposalData, totalComDesconto, economia);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setIsGenerating(false);
      setCurrentProposalData(null);
    }
  };

  return (
    <>
      <div className="sticky top-6 space-y-6">
        {/* Métricas Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
            <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center mb-3">
              <DollarSign className="w-4 h-4 text-[#C7D82B]" />
            </div>
            <h4 className="text-xs text-gray-400 mb-1">Redução de custos</h4>
            <p className="text-lg font-bold text-white">80%</p>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
            <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center mb-3">
              <Shield className="w-4 h-4 text-[#C7D82B]" />
            </div>
            <h4 className="text-xs text-gray-400 mb-1">SLA</h4>
            <p className="text-lg font-bold text-white">99.99%</p>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
            <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center mb-3">
              <Zap className="w-4 h-4 text-[#C7D82B]" />
            </div>
            <h4 className="text-xs text-gray-400 mb-1">Deploy</h4>
            <p className="text-lg font-bold text-white">5min</p>
          </div>
        </div>

        {/* Resumo de Custos */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Resumo de Custos</h3>
          
          <div className="space-y-2">
            {vms.map((vm, index) => {
              const custo = calculadora.calcularVM(vm);
              return (
                <div key={vm.id} className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Servidor {index + 1} - {vm.nome}</span>
                  <span className="font-medium text-white">{formatCurrency(custo.total)}</span>
                </div>
              );
            })}
          </div>
          
          {economia > 0 && (
            <div className="flex justify-between py-2 border-b border-gray-800 text-green-500">
              <span>Desconto aplicado</span>
              <span className="font-medium">-{formatCurrency(economia)}</span>
            </div>
          )}
          
          <div className="flex justify-between pt-4 mt-4 border-t-2 border-[#C7D82B]">
            <span className="text-lg font-semibold text-white">Total Mensal</span>
            <span className="text-2xl font-bold text-[#C7D82B]">{formatCurrency(totalComDesconto)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            disabled={isGenerating}
            className="w-full bg-[#C7D82B] hover:bg-[#B5C525] text-black font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2" />
                Gerando PDF Premium...
              </>
            ) : (
              <>
                <Download className="w-5 h-5 inline mr-2" />
                Gerar Proposta Premium
              </>
            )}
          </button>
          <button className="w-full bg-gray-800 border-2 border-gray-700 hover:bg-gray-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 hover:shadow-md">
            <Save className="w-5 h-5 inline mr-2" />
            Salvar Configuração
          </button>
        </div>

        {/* Por que Optidata */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
          <h4 className="font-semibold text-white mb-4 text-center">Por que Opticloud?</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Shield className="w-5 h-5 text-[#C7D82B]" />
              </div>
              <p className="text-xs text-white font-medium">Segurança</p>
              <p className="text-xs text-gray-400">Enterprise</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Zap className="w-5 h-5 text-[#C7D82B]" />
              </div>
              <p className="text-xs text-white font-medium">Performance</p>
              <p className="text-xs text-gray-400">Otimizada</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Headphones className="w-5 h-5 text-[#C7D82B]" />
              </div>
              <p className="text-xs text-white font-medium">Suporte</p>
              <p className="text-xs text-gray-400">24/7</p>
            </div>
          </div>
        </div>

        {/* TCO Preview */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
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
            <div className="flex justify-between pt-2 border-t border-gray-800">
              <span className="text-sm font-medium text-gray-300">60 meses</span>
              <span className="font-bold text-[#C7D82B]">{formatCurrency(totalComDesconto * 60)}</span>
            </div>
          </div>
        </div>
      </div>

      <ProposalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGenerate={handleGeneratePDF}
        totalValue={totalComDesconto}
      />

      {/* Componente PDF oculto */}
      {currentProposalData && (
        <PropostaPDFContent
          dadosCliente={currentProposalData}
          vms={vms}
          calculadora={calculadora}
          totalValue={totalComDesconto}
          economia={economia}
        />
      )}
    </>
  );
};

export default ModernSummaryCard;
