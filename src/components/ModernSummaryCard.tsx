
import React, { useState } from 'react';
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud, formatCurrency } from '@/utils/calculadora';
import { LegacyBridge } from '@/shared/services/LegacyBridge';
import { exportToExcel } from '@/utils/exportUtils';
import { Calculator, TrendingUp, Download, Save, Zap, Shield, Headphones, FileText } from 'lucide-react';
import CriarPropostaModal from '@/components/CriarPropostaModal';
import { CloudComparisonButton } from '@/components/CloudComparisonButton';
import { QuickComparisonCard } from '@/components/QuickComparisonCard';

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

  const handleSalvarConfiguracao = () => {
    if (vms.length === 0) {
      alert('Não há configurações para salvar');
      return;
    }

    try {
      const configuracao = {
        vms,
        descontos,
        timestamp: new Date().toISOString(),
        totalVMs: vms.length
      };
      
      localStorage.setItem('optidata_configuracao', JSON.stringify(configuracao));
      alert('Configuração salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      alert('Erro ao salvar configuração. Tente novamente.');
    }
  };

  if (vms.length === 0) {
    return (
      <div className="sticky top-6">
        <div className="premium-glass-card p-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                 style={{ background: 'var(--premium-elevated)' }}>
              <Calculator className="w-8 h-8" style={{ color: 'var(--premium-gray-medium)' }} />
            </div>
            <h3 className="text-premium-title mb-2" style={{ fontSize: '20px' }}>
              Configure sua infraestrutura
            </h3>
            <p className="text-premium-subtitle mb-6">
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
      {/* Main Total Card - Premium Glass */}
      <div className="premium-glass-card p-8 relative overflow-hidden">
        {/* Glow effect for price */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full filter blur-2xl opacity-10"
             style={{ background: 'var(--premium-gold)' }}></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-premium-caption uppercase tracking-wide">Total Mensal</span>
            <Calculator className="w-5 h-5" style={{ color: 'var(--premium-gold)' }} />
          </div>
          <div className="text-premium-price mb-2" style={{ fontSize: '2.5rem' }}>
            {formatCurrency(totalComDesconto)}
          </div>
          <div className="text-premium-subtitle">
            {vms.length} VM{vms.length !== 1 ? 's' : ''} configurada{vms.length !== 1 ? 's' : ''}
          </div>

          {/* Economy Badge */}
          {economia > 0 && (
            <div className="mt-6 premium-glass-card p-4" 
                 style={{ 
                   background: 'rgba(0, 212, 170, 0.1)',
                   borderColor: 'rgba(0, 212, 170, 0.3)'
                 }}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-premium-success" />
                <span className="text-premium-success font-medium text-sm">Economia Aplicada</span>
              </div>
              <div className="text-2xl font-bold text-premium-success">
                {formatCurrency(economia)}
              </div>
              <div className="text-xs text-premium-success opacity-80">
                {((economia / (totalComDesconto + economia)) * 100).toFixed(1)}% de desconto
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Market Intelligence Section */}
      <div className="space-y-4">
        <h3 className="text-premium-body font-semibold flex items-center gap-2">
          📊 Market Intelligence
        </h3>
        
        {/* Quick comparison preview */}
        <QuickComparisonCard 
          optidataCost={totalComDesconto}
          vms={vms}
        />
        
        {/* Cloud comparison button */}
        <CloudComparisonButton 
          optidataCost={totalComDesconto}
          vms={vms}
          size="lg"
          variant="outline"
          className="w-full"
        />
      </div>

      {/* Action Buttons - Premium Style */}
      <div className="space-y-3">
        <button 
          onClick={handleGerarPDF}
          className="btn-premium-primary w-full flex items-center justify-center gap-2"
        >
          <FileText className="w-5 h-5" />
          Gerar PDF da Proposta
        </button>
        
        <button 
          onClick={() => setModalPropostaAberto(true)}
          className="btn-premium-primary w-full flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          Criar Proposta
        </button>
        
        <button 
          onClick={handleExportarExcel}
          className="btn-premium-secondary w-full flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          Exportar Excel
        </button>
        
        <button 
          onClick={handleSalvarConfiguracao}
          className="btn-premium-ghost w-full flex items-center justify-center gap-2 py-3"
          style={{ border: '1px solid var(--premium-border)' }}
        >
          <Save className="w-5 h-5" />
          Salvar Configuração
        </button>
      </div>

      {/* Trust Indicators - Premium Glass */}
      <div className="premium-glass-card p-6">
        <h4 className="text-premium-body font-semibold mb-4 text-center">Por que Optidata?</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2"
                 style={{ background: 'rgba(0, 212, 170, 0.2)' }}>
              <Shield className="w-5 h-5 text-premium-success" />
            </div>
            <p className="text-premium-caption font-medium">Segurança</p>
            <p className="text-premium-caption opacity-60">Enterprise</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2"
                 style={{ background: 'rgba(0, 168, 255, 0.2)' }}>
              <Zap className="w-5 h-5 text-premium-info" />
            </div>
            <p className="text-premium-caption font-medium">Performance</p>
            <p className="text-premium-caption opacity-60">Otimizada</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2"
                 style={{ background: 'rgba(245, 166, 35, 0.2)' }}>
              <Headphones className="w-5 h-5" style={{ color: 'var(--premium-gold)' }} />
            </div>
            <p className="text-premium-caption font-medium">Suporte</p>
            <p className="text-premium-caption opacity-60">24/7</p>
          </div>
        </div>
      </div>

      {/* TCO Preview - Premium Glass */}
      <div className="premium-glass-card p-6">
        <h4 className="text-premium-body font-semibold mb-4">Projeção TCO</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-premium-caption">12 meses</span>
            <span className="text-premium-body font-medium">{formatCurrency(totalComDesconto * 12)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-premium-caption">36 meses</span>
            <span className="text-premium-body font-medium">{formatCurrency(totalComDesconto * 36)}</span>
          </div>
          <div className="flex justify-between pt-2" style={{ borderTop: '1px solid var(--premium-border)' }}>
            <span className="text-premium-caption font-medium">60 meses</span>
            <span className="text-premium-price" style={{ fontSize: '16px' }}>{formatCurrency(totalComDesconto * 60)}</span>
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
