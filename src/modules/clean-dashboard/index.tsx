
/**
 * CleanDashboard - Primeiro módulo completamente novo e limpo
 * Use como exemplo para outros módulos
 */

import React from 'react';
import { CleanCard } from '@/shared/ui/components/CleanCard';
import { CleanButton } from '@/shared/ui/components/CleanButton';
import { Calculator, TrendingUp, Users, FileText } from 'lucide-react';
import { LegacyBridge } from '@/shared/services/LegacyBridge';

interface DashboardMetrics {
  totalVMs: number;
  totalValue: number;
  totalProposals: number;
  conversionRate: number;
}

export function CleanDashboard() {
  const [metrics, setMetrics] = React.useState<DashboardMetrics>({
    totalVMs: 0,
    totalValue: 0,
    totalProposals: 0,
    conversionRate: 0,
  });
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    loadDashboardData();
  }, []);
  
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Acessa dados do código legado de forma segura
      const bridge = LegacyBridge.getInstance();
      const legacyStore = bridge.getLegacyStore();
      
      if (legacyStore) {
        const vms = legacyStore.vms || [];
        const proposals = JSON.parse(localStorage.getItem('propostas') || '[]');
        
        setMetrics({
          totalVMs: vms.length,
          totalValue: vms.reduce((sum: number, vm: any) => {
            const calculation = bridge.calculateVM(vm);
            return sum + (calculation?.total || 0);
          }, 0),
          totalProposals: proposals.length,
          conversionRate: proposals.length > 0 ? (proposals.filter((p: any) => p.status === 'approved').length / proposals.length) * 100 : 0,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      // Dados padrão se falhar
      setMetrics({
        totalVMs: 0,
        totalValue: 0,
        totalProposals: 0,
        conversionRate: 0,
      });
    } finally {
      setLoading(false);
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#f5a623] border-t-transparent" />
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Executivo</h1>
          <p className="text-[#a0a0a0] mt-1">Visão geral da Calculadora Optidata</p>
        </div>
        <CleanButton 
          variant="primary" 
          icon={<Calculator className="w-4 h-4" />}
          onClick={() => window.location.href = '/'}
        >
          Abrir Calculadora
        </CleanButton>
      </div>
      
      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CleanCard variant="elevated" padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#a0a0a0] text-sm font-medium">VMs Configuradas</p>
              <p className="text-2xl font-bold text-white mt-1">{metrics.totalVMs}</p>
            </div>
            <div className="p-3 bg-[#f5a623] bg-opacity-10 rounded-lg">
              <Calculator className="w-6 h-6 text-[#f5a623]" />
            </div>
          </div>
        </CleanCard>
        
        <CleanCard variant="elevated" padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#a0a0a0] text-sm font-medium">Valor Total Mensal</p>
              <p className="text-2xl font-bold text-white mt-1">{formatCurrency(metrics.totalValue)}</p>
            </div>
            <div className="p-3 bg-green-500 bg-opacity-10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </CleanCard>
        
        <CleanCard variant="elevated" padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#a0a0a0] text-sm font-medium">Propostas Criadas</p>
              <p className="text-2xl font-bold text-white mt-1">{metrics.totalProposals}</p>
            </div>
            <div className="p-3 bg-blue-500 bg-opacity-10 rounded-lg">
              <FileText className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </CleanCard>
        
        <CleanCard variant="elevated" padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#a0a0a0] text-sm font-medium">Taxa de Conversão</p>
              <p className="text-2xl font-bold text-white mt-1">{metrics.conversionRate.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-purple-500 bg-opacity-10 rounded-lg">
              <Users className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </CleanCard>
      </div>
      
      {/* Ações Rápidas */}
      <CleanCard variant="default" padding="lg">
        <h2 className="text-xl font-semibold text-white mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CleanButton 
            variant="outline" 
            fullWidth
            icon={<Calculator className="w-4 h-4" />}
            onClick={() => window.location.href = '/'}
          >
            Nova Calculadora
          </CleanButton>
          
          <CleanButton 
            variant="outline" 
            fullWidth
            icon={<FileText className="w-4 h-4" />}
            onClick={() => window.location.href = '/#propostas'}
          >
            Ver Propostas
          </CleanButton>
          
          <CleanButton 
            variant="outline" 
            fullWidth
            icon={<TrendingUp className="w-4 h-4" />}
            onClick={() => alert('Relatórios em desenvolvimento')}
          >
            Relatórios
          </CleanButton>
        </div>
      </CleanCard>
      
      {/* Aviso sobre dados legados */}
      <CleanCard variant="default" padding="md">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-[#f5a623] rounded-full mt-2 flex-shrink-0" />
          <div>
            <p className="text-white font-medium">Dados Híbridos</p>
            <p className="text-[#a0a0a0] text-sm mt-1">
              Este dashboard utiliza dados do sistema legado de forma segura. 
              Conforme migrarmos para Supabase, os dados ficarão ainda mais precisos.
            </p>
          </div>
        </div>
      </CleanCard>
    </div>
  );
}
