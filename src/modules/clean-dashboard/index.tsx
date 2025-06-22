
/**
 * CleanDashboard - Novo dashboard modular e limpo
 * Este é um exemplo de como criar módulos novos sem tocar no código legado
 */

import React from 'react';
import { CleanCard } from '@/shared/ui/components/CleanCard';
import { LegacyBridge } from '@/shared/services/LegacyBridge';
import { safeSupabase } from '@/shared/services/SafeSupabase';

export function CleanDashboard() {
  const [metrics, setMetrics] = React.useState({
    totalProposals: 0,
    totalValue: 0,
    isLoading: true,
  });

  React.useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Busca dados usando o serviço seguro
        const result = await safeSupabase.fetch('proposals');
        
        if (result.data) {
          const proposals = result.data;
          setMetrics({
            totalProposals: proposals.length,
            totalValue: proposals.reduce((sum: number, p: any) => sum + (p.value || 0), 0),
            isLoading: false,
          });
        } else {
          // Dados mockados se não há dados reais
          setMetrics({
            totalProposals: 5,
            totalValue: 125000,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        // Fallback para dados mockados
        setMetrics({
          totalProposals: 5,
          totalValue: 125000,
          isLoading: false,
        });
      }
    };

    loadDashboardData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (metrics.isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Dashboard Executivo
        </h1>
        <p className="text-gray-400">
          Visão geral das propostas e métricas da Optidata Cloud
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CleanCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Propostas Ativas</p>
              <p className="text-2xl font-bold text-white">{metrics.totalProposals}</p>
            </div>
            <div className="w-12 h-12 bg-[#f5a623]/20 rounded-lg flex items-center justify-center">
              <span className="text-[#f5a623] text-xl">📊</span>
            </div>
          </div>
        </CleanCard>

        <CleanCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Valor Total</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(metrics.totalValue)}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <span className="text-green-400 text-xl">💰</span>
            </div>
          </div>
        </CleanCard>

        <CleanCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Taxa de Conversão</p>
              <p className="text-2xl font-bold text-white">73%</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <span className="text-blue-400 text-xl">📈</span>
            </div>
          </div>
        </CleanCard>
      </div>

      <CleanCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Arquitetura Modular em Ação
        </h3>
        <div className="space-y-3 text-sm text-gray-300">
          <p>✅ Este dashboard usa a nova arquitetura modular</p>
          <p>✅ Componentes isolados e reutilizáveis</p>
          <p>✅ Integração segura com Supabase via SafeSupabase</p>
          <p>✅ Não depende do código legado</p>
          <p>✅ Pode ser desenvolvido independentemente</p>
        </div>
      </CleanCard>
    </div>
  );
}
