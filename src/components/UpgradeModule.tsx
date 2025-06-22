
import React from 'react';
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud, formatCurrency } from '@/utils/calculadora';
import { Target, TrendingUp, Zap, Trophy, Flame, DollarSign, ArrowUp, Cpu, HardDrive, Database } from 'lucide-react';

const UpgradeModule = () => {
  const { vms, descontos, precos } = useCalculadoraStore();
  const calculadora = new CalculadoraCloud(precos);

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

  // Oportunidades de upgrade baseadas nas VMs existentes
  const getUpgradeOpportunities = () => {
    if (vms.length === 0) {
      return [
        {
          title: "Primeiro Projeto Cloud",
          description: "Configure sua primeira VM e comece a vender!",
          potential: 12000,
          icon: <Zap className="w-6 h-6" />,
          urgency: "high",
          action: "Criar VM"
        }
      ];
    }

    const opportunities = [];
    
    vms.forEach(vm => {
      // Oportunidade de CPU
      if (vm.cpu < 8) {
        opportunities.push({
          title: `Upgrade CPU - ${vm.nome}`,
          description: `De ${vm.cpu} para ${vm.cpu * 2} vCPUs`,
          potential: (vm.cpu * 2 - vm.cpu) * 120 * 12,
          icon: <Cpu className="w-6 h-6" />,
          urgency: "medium",
          action: "Upgrade CPU"
        });
      }
      
      // Oportunidade de RAM
      if (vm.ram < 16) {
        opportunities.push({
          title: `Upgrade RAM - ${vm.nome}`,
          description: `De ${vm.ram}GB para ${vm.ram * 2}GB`,
          potential: (vm.ram * 2 - vm.ram) * 15 * 12,
          icon: <Database className="w-6 h-6" />,
          urgency: "high",
          action: "Upgrade RAM"
        });
      }
      
      // Oportunidade de Storage
      if (vm.storage < 500) {
        opportunities.push({
          title: `Upgrade Storage - ${vm.nome}`,
          description: `De ${vm.storage}GB para ${vm.storage + 500}GB`,
          potential: 500 * 0.5 * 12,
          icon: <HardDrive className="w-6 h-6" />,
          urgency: "low",
          action: "Upgrade Storage"
        });
      }
    });

    // Adiciona uma VM extra como oportunidade
    opportunities.push({
      title: "VM Adicional",
      description: "Expandir infraestrutura com nova instância",
      potential: 8400,
      icon: <Zap className="w-6 h-6" />,
      urgency: "medium",
      action: "Nova VM"
    });

    return opportunities.slice(0, 4); // Máximo 4 oportunidades
  };

  const opportunities = getUpgradeOpportunities();
  const totalPotential = opportunities.reduce((sum, opp) => sum + opp.potential, 0);

  const getUrgencyColor = (urgency: string) => {
    switch(urgency) {
      case 'high': return 'from-red-500 to-orange-500';
      case 'medium': return 'from-yellow-500 to-orange-500';
      case 'low': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Performance Dashboard */}
      <div 
        className="rounded-xl p-6 border relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          borderColor: '#333333'
        }}
      >
        <div className="absolute inset-0 opacity-10"
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
                <h3 className="text-xl font-bold text-white">Falta {(100 - percentualMeta).toFixed(0)}% da Meta</h3>
                <p className="text-sm text-gray-400">Dezembro 2024 - {diasRestantes} dias restantes</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-white">
                {Math.round(percentualMeta)}%
              </div>
              <div className="text-sm text-gray-400">completo</div>
            </div>
          </div>

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

      {/* Oportunidades de Upgrade */}
      <div 
        className="rounded-xl p-6 border"
        style={{
          background: 'linear-gradient(135deg, #0f1419 0%, #1a1a1a 100%)',
          borderColor: '#333333'
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Oportunidades de Upgrade</h4>
              <p className="text-sm text-gray-400">Potencial anual: {formatCurrency(totalPotential)}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-400">
              +{((totalPotential / metaTrimestral) * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-gray-400">da meta</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {opportunities.map((opportunity, index) => (
            <div 
              key={index}
              className="bg-gray-800/30 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-all group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${getUrgencyColor(opportunity.urgency)} flex items-center justify-center`}>
                    {opportunity.icon}
                  </div>
                  <div>
                    <h5 className="font-semibold text-white text-sm">{opportunity.title}</h5>
                    <p className="text-xs text-gray-400">{opportunity.description}</p>
                  </div>
                </div>
                <ArrowUp className="w-4 h-4 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-green-400">{formatCurrency(opportunity.potential)}</div>
                  <div className="text-xs text-gray-500">potencial anual</div>
                </div>
                <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors">
                  {opportunity.action}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ações Rápidas */}
      <div 
        className="rounded-xl p-4 border"
        style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #0f1419 100%)',
          borderColor: '#333333'
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <span className="text-white font-semibold">Fechar Negócio Agora</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
            💰 Propor Upgrade
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
            📞 Call Urgente
          </button>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors">
            📊 Mostrar ROI
          </button>
          <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors">
            🚀 Enviar Oferta
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModule;
