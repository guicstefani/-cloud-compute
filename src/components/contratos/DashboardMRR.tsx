
import React, { useState } from 'react';
import { useContratosStore } from '@/store/contratos';
import { formatCurrency } from '@/utils/calculadora';
import { TrendingUp, TrendingDown, Users, DollarSign, Calendar, AlertTriangle, Plus } from 'lucide-react';
import ModalNovoContrato from './ModalNovoContrato';

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard MRR</h1>
          <p className="text-gray-400 mt-1">Gestão de Contratos e Receita Recorrente</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">
              {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="premium-btn"
          >
            <Plus className="w-5 h-5" />
            Novo Contrato
          </button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* MRR Atual */}
        <div className="premium-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-gray-400 uppercase tracking-wider">MRR Atual</span>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {formatCurrency(metricas.mrrAtual)}
          </div>
          <div className="flex items-center gap-2">
            {getGrowthIcon(metricas.netMRRGrowth)}
            <span className={`text-sm font-medium ${getGrowthColor(metricas.netMRRGrowth)}`}>
              {metricas.netMRRGrowth >= 0 ? '+' : ''}{formatCurrency(metricas.netMRRGrowth)}
            </span>
            <span className="text-xs text-gray-500">vs mês anterior</span>
          </div>
        </div>

        {/* MRR Novo */}
        <div className="premium-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-gray-400 uppercase tracking-wider">MRR Novo</span>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {formatCurrency(metricas.mrrNovo)}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">
              {contratos.filter(c => {
                const inicioMes = new Date();
                inicioMes.setDate(1);
                return new Date(c.data_fechamento) >= inicioMes && c.status === 'ativo';
              }).length} novos contratos
            </span>
          </div>
        </div>

        {/* Churn */}
        <div className="premium-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-gray-400 uppercase tracking-wider">Churn</span>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {formatCurrency(metricas.churn)}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">
              {contratos.filter(c => {
                const inicioMes = new Date();
                inicioMes.setDate(1);
                return new Date(c.updated_at) >= inicioMes && c.status === 'cancelado';
              }).length} cancelamentos
            </span>
          </div>
        </div>

        {/* Ticket Médio */}
        <div className="premium-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-gray-400 uppercase tracking-wider">Ticket Médio</span>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {formatCurrency(metricas.ticketMedio)}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">
              {metricas.contratosAtivos} contratos ativos
            </span>
          </div>
        </div>
      </div>

      {/* Análise de Descontos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="premium-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Análise de Descontos</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Desconto Médio Total</span>
              <span className="text-white font-semibold">{formatPercentage(metricas.descontoMedio)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Software</span>
              <span className="text-blue-400 font-semibold">{formatPercentage(metricas.descontoSoftware)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Infraestrutura</span>
              <span className="text-green-400 font-semibold">{formatPercentage(metricas.descontoInfra)}</span>
            </div>
          </div>
        </div>

        <div className="premium-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Resumo Geral</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total de Contratos</span>
              <span className="text-white font-semibold">{metricas.totalContratos}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Contratos Ativos</span>
              <span className="text-green-400 font-semibold">{metricas.contratosAtivos}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Taxa Ativação</span>
              <span className="text-white font-semibold">
                {metricas.totalContratos > 0 
                  ? formatPercentage((metricas.contratosAtivos / metricas.totalContratos) * 100)
                  : '0%'
                }
              </span>
            </div>
          </div>
        </div>

        <div className="premium-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Crescimento</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Net MRR Growth</span>
              <span className={`font-semibold ${getGrowthColor(metricas.netMRRGrowth)}`}>
                {formatCurrency(metricas.netMRRGrowth)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Novos + Upgrades</span>
              <span className="text-green-400 font-semibold">{formatCurrency(metricas.mrrNovo)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Churn + Downgrades</span>
              <span className="text-red-400 font-semibold">{formatCurrency(metricas.churn)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action se não há contratos */}
      {metricas.totalContratos === 0 && (
        <div className="premium-card p-12 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-gold to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-black" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Comece a Acompanhar seu MRR
          </h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Cadastre seus primeiros contratos para começar a visualizar métricas de receita recorrente em tempo real.
          </p>
          <button 
            onClick={() => setShowModal(true)}
            className="premium-btn"
          >
            <DollarSign className="w-5 h-5" />
            Cadastrar Primeiro Contrato
          </button>
        </div>
      )}

      {/* Modal */}
      <ModalNovoContrato 
        open={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </div>
  );
};

export default DashboardMRR;
