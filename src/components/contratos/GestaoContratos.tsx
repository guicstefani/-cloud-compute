
import React, { useState } from 'react';
import DashboardMRR from './DashboardMRR';
import ListaContratos from './ListaContratos';
import { BarChart3, FileText, TrendingUp, Users } from 'lucide-react';

const GestaoContratos = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'contratos' | 'clientes' | 'relatorios'>('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard MRR', icon: BarChart3 },
    { id: 'contratos', label: 'Contratos', icon: FileText },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'relatorios', label: 'Relatórios', icon: TrendingUp }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardMRR />;
      case 'contratos':
        return <ListaContratos />;
      case 'clientes':
        return (
          <div className="premium-card p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Gestão de Clientes
            </h3>
            <p className="text-gray-400">
              Módulo em desenvolvimento - Em breve você poderá gerenciar seus clientes aqui.
            </p>
          </div>
        );
      case 'relatorios':
        return (
          <div className="premium-card p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Relatórios Avançados
            </h3>
            <p className="text-gray-400">
              Módulo em desenvolvimento - Relatórios de MRR, análises de crescimento e previsões estarão disponíveis em breve.
            </p>
          </div>
        );
      default:
        return <DashboardMRR />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-800 mb-6">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    isActive 
                      ? 'border-gold text-gold' 
                      : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pb-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default GestaoContratos;
