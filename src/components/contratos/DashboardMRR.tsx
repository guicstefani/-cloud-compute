
import React, { useState } from 'react';
import { useContratosStore } from '@/store/contratos';
import { formatCurrency } from '@/utils/calculadora';
import { TrendingUp, TrendingDown, Users, DollarSign, Calendar, AlertTriangle, Plus } from 'lucide-react';
import ModalNovoContrato from './ModalNovoContrato';
import EpicBackground from '@/components/ui/EpicBackground';
import GlassCard from '@/components/ui/GlassCard';
import GoldButton from '@/components/ui/GoldButton';
import MetricCard from '@/components/ui/MetricCard';

const DashboardMRR = () => {
  const { calcularMRR, contratos } = useContratosStore();
  const [showModal, setShowModal] = useState(false);
  const metricas = calcularMRR();
  
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;
  
  const getGrowthIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="w-5 h-5 text-green-400" />;
    if (value < 0) return <TrendingDown className="w-5 h-5 text-red-400" />;
    return <DollarSign className="w-5 h-5 text-gray-400" />;
  };
  
  const getGrowthColor = (value: number) => {
    if (value > 0) return 'text-green-400';
    if (value < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <EpicBackground />
      
      <div className="relative z-10 p-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="epic-title">Dashboard MRR</h1>
          <p className="epic-subtitle">Gestão Premium de Contratos</p>
          
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <Calendar className="w-4 h-4 text-gold" />
              <span className="text-sm text-white/80">
                {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </span>
            </div>
            <GoldButton onClick={() => setShowModal(true)}>
              <Plus className="w-5 h-5" />
              Novo Contrato
            </GoldButton>
          </div>
        </header>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <MetricCard
            number={formatCurrency(metricas.mrrAtual)}
            label="MRR Atual"
            value={`${metricas.netMRRGrowth >= 0 ? '+' : ''}${formatCurrency(metricas.netMRRGrowth)} vs mês anterior`}
            icon={<DollarSign className="w-6 h-6 text-black" />}
          />
          <MetricCard
            number={formatCurrency(metricas.mrrNovo)}
            label="MRR Novo"
            value={`${contratos.filter(c => {
              const inicioMes = new Date();
              inicioMes.setDate(1);
              return new Date(c.data_fechamento) >= inicioMes && c.status === 'ativo';
            }).length} novos contratos`}
            icon={<TrendingUp className="w-6 h-6 text-black" />}
          />
          <MetricCard
            number={formatCurrency(metricas.churn)}
            label="Churn"
            value={`${contratos.filter(c => {
              const inicioMes = new Date();
              inicioMes.setDate(1);
              return new Date(c.updated_at) >= inicioMes && c.status === 'cancelado';
            }).length} cancelamentos`}
            icon={<AlertTriangle className="w-6 h-6 text-black" />}
          />
          <MetricCard
            number={formatCurrency(metricas.ticketMedio)}
            label="Ticket Médio"
            value={`${metricas.contratosAtivos} contratos ativos`}
            icon={<Users className="w-6 h-6 text-black" />}
          />
        </div>

        {/* Análise Detalhada */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <GlassCard>
            <h3 className="section-title">Análise de Descontos</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Desconto Médio Total</span>
                <span className="text-gold font-semibold text-lg">{formatPercentage(metricas.descontoMedio)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Software</span>
                <span className="text-blue-400 font-semibold text-lg">{formatPercentage(metricas.descontoSoftware)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Infraestrutura</span>
                <span className="text-green-400 font-semibold text-lg">{formatPercentage(metricas.descontoInfra)}</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="section-title">Resumo Geral</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Total de Contratos</span>
                <span className="text-white font-semibold text-lg">{metricas.totalContratos}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Contratos Ativos</span>
                <span className="text-green-400 font-semibold text-lg">{metricas.contratosAtivos}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Taxa Ativação</span>
                <span className="text-gold font-semibold text-lg">
                  {metricas.totalContratos > 0 
                    ? formatPercentage((metricas.contratosAtivos / metricas.totalContratos) * 100)
                    : '0%'
                  }
                </span>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="section-title">Crescimento</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Net MRR Growth</span>
                <span className={`font-semibold text-lg ${getGrowthColor(metricas.netMRRGrowth)}`}>
                  {formatCurrency(metricas.netMRRGrowth)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Novos + Upgrades</span>
                <span className="text-green-400 font-semibold text-lg">{formatCurrency(metricas.mrrNovo)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Churn + Downgrades</span>
                <span className="text-red-400 font-semibold text-lg">{formatCurrency(metricas.churn)}</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Call to Action se não há contratos */}
        {metricas.totalContratos === 0 && (
          <GlassCard className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center mx-auto mb-6">
              <DollarSign className="w-10 h-10 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-gold mb-3">
              Comece a Acompanhar seu MRR
            </h3>
            <p className="text-white/70 mb-8 text-lg leading-relaxed max-w-md mx-auto">
              Cadastre seus primeiros contratos para começar a visualizar métricas de receita recorrente em tempo real.
            </p>
            <GoldButton onClick={() => setShowModal(true)} className="text-lg px-8 py-4">
              <DollarSign className="w-6 h-6" />
              Cadastrar Primeiro Contrato
            </GoldButton>
          </GlassCard>
        )}

        {/* Modal */}
        <ModalNovoContrato 
          open={showModal} 
          onClose={() => setShowModal(false)} 
        />
      </div>
    </div>
  );
};

export default DashboardMRR;
