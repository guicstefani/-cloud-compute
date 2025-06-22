
import React from 'react';
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud, formatCurrency } from '@/utils/calculadora';
import { Target, TrendingUp, Zap, Trophy, Fire, DollarSign } from 'lucide-react';

const UpgradeModule = () => {
  const { vms, descontos, precos } = useCalculadoraStore();
  const calculadora = new CalculadoraCloud(precos);

  if (vms.length === 0) {
    return null;
  }

  const resultado = calculadora.calcularTotalGeral(vms, descontos);
  
  // Simulação de dados de performance do vendedor
  const metaTrimestral = 85000; // R$ 85.000
  const vendidoMes = 23500; // R$ 23.500
  const vendidoTrimestre = 61200; // R$ 61.200
  const percentualMeta = (vendidoTrimestre / metaTrimestral) * 100;
  const faltaParaMeta = metaTrimestral - vendidoTrimestre;
  const diasRestantes = 23;
  
  const getMotivationalMessage = () => {
    if (percentualMeta >= 90) return "🔥 BEAST MODE! Você está dominando!";
    if (percentualMeta >= 75) return "⚡ QUASE LÁ! Continue assim, campeão!";
    if (percentualMeta >= 50) return "🎯 NO RITMO! Acelera que dá tempo!";
    return "🚀 VAMOS NESSA! É hora de mostrar seu valor!";
  };

  const getPerformanceColor = () => {
    if (percentualMeta >= 90) return "from-green-400 to-emerald-600";
    if (percentualMeta >= 75) return "from-blue-400 to-cyan-600";
    if (percentualMeta >= 50) return "from-yellow-400 to-orange-500";
    return "from-red-400 to-pink-600";
  };

  return (
    <div className="space-y-4">
      {/* Performance Dashboard */}
      <div 
        className="rounded-xl p-6 border relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          borderColor: '#333333'
        }}
      >
        {/* Background Effects */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            background: `linear-gradient(135deg, transparent 0%, #DCAE1D 50%, transparent 100%)`
          }}
        />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Meta Trimestral</h3>
                <p className="text-sm text-gray-400">Dezembro 2024</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-white">
                {Math.round(percentualMeta)}%
              </div>
              <div className="text-sm text-gray-400">completo</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${getPerformanceColor()} transition-all duration-1000 relative`}
                style={{ width: `${Math.min(percentualMeta, 100)}%` }}
              >
                <div className="absolute inset-0 bg-white opacity-20 animate-pulse" />
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>R$ 0</span>
              <span className="font-bold text-orange-400">{formatCurrency(vendidoTrimestre)}</span>
              <span>{formatCurrency(metaTrimestral)}</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-xs text-gray-400 uppercase tracking-wide">Falta</span>
              </div>
              <div className="text-lg font-bold text-white">{formatCurrency(faltaParaMeta)}</div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Fire className="w-4 h-4 text-orange-400" />
                <span className="text-xs text-gray-400 uppercase tracking-wide">Dias</span>
              </div>
              <div className="text-lg font-bold text-white">{diasRestantes} restantes</div>
            </div>
          </div>

          {/* Motivational Message */}
          <div className="text-center">
            <div className="text-lg font-bold text-orange-400 mb-2">
              {getMotivationalMessage()}
            </div>
            <div className="text-sm text-gray-300">
              Média necessária: {formatCurrency(faltaParaMeta / diasRestantes)}/dia
            </div>
          </div>
        </div>
      </div>

      {/* Current Proposal Impact */}
      <div 
        className="rounded-xl p-6 border"
        style={{
          background: 'linear-gradient(135deg, #0f1419 0%, #1a1a1a 100%)',
          borderColor: '#333333'
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white">Proposta Atual</h4>
            <p className="text-sm text-gray-400">{vms.length} VM{vms.length !== 1 ? 's' : ''} configurada{vms.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
            <span className="text-gray-300">Valor da Proposta</span>
            <span className="text-2xl font-bold text-blue-400">{formatCurrency(resultado.totalComDesconto)}</span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
            <span className="text-gray-300">Valor Anual</span>
            <span className="text-xl font-bold text-green-400">{formatCurrency(resultado.totalComDesconto * 12)}</span>
          </div>

          {/* Impact on Goal */}
          <div className="mt-4 p-4 bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-lg border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">Impacto na Meta</span>
            </div>
            <div className="text-white">
              <span className="text-2xl font-bold">+{((resultado.totalComDesconto * 12 / metaTrimestral) * 100).toFixed(1)}%</span>
              <span className="text-gray-300 ml-2">da meta anual</span>
            </div>
            <div className="text-sm text-gray-400 mt-1">
              Fechando esta proposta: {formatCurrency(vendidoTrimestre + (resultado.totalComDesconto * 12))} de {formatCurrency(metaTrimestral)}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div 
        className="rounded-xl p-4 border"
        style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #0f1419 100%)',
          borderColor: '#333333'
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <TrendingUp className="w-5 h-5 text-orange-400" />
          <span className="text-white font-semibold">Ações Rápidas</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
            📊 Gerar Proposta
          </button>
          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
            📞 Agendar Call
          </button>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors">
            💾 Salvar Config
          </button>
          <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors">
            🚀 Enviar WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModule;
