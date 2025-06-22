
import React, { useState } from 'react';
import { FuturisticTabs } from '@/components/ui/FuturisticTabs';
import { ModernVMCalculator } from '@/components/modern/ModernVMCalculator';
import PoolDeRecursos from '@/components/PoolDeRecursos';
import UpgradeModule from '@/components/UpgradeModule';
import ListaPropostas from '@/components/ListaPropostas';
import { Server, Database, TrendingUp, FileText } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('vm');

  const tabs = [
    { id: 'vm', label: 'Calculadora VM', icon: Server },
    { id: 'pool', label: 'Pool de Recursos', icon: Database },
    { id: 'upgrades', label: 'Upgrades', icon: TrendingUp },
    { id: 'propostas', label: 'Propostas', icon: FileText }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'vm':
        return <ModernVMCalculator />;
      case 'pool':
        return (
          <div className="p-8">
            <PoolDeRecursos />
          </div>
        );
      case 'upgrades':
        return (
          <div className="p-8">
            <UpgradeModule />
          </div>
        );
      case 'propostas':
        return (
          <div className="p-8">
            <ListaPropostas />
          </div>
        );
      default:
        return <ModernVMCalculator />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header com navegação */}
      <div className="sticky top-0 z-50 bg-black/20 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-black font-bold text-xl">O</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Optidata Cloud</h1>
                <p className="text-gray-400 text-sm">Calculadora Premium</p>
              </div>
            </div>
          </div>
          
          <FuturisticTabs 
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>
      </div>

      {/* Conteúdo */}
      {renderContent()}
    </div>
  );
};

export default Index;
