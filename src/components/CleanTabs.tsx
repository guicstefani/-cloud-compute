
import React from 'react';
import { Server, Database, TrendingUp, FileText } from 'lucide-react';

interface CleanTabsProps {
  activeTab: 'vm' | 'pool' | 'upgrades' | 'propostas';
  onTabChange: (tab: 'vm' | 'pool' | 'upgrades' | 'propostas') => void;
}

export function CleanTabs({ activeTab, onTabChange }: CleanTabsProps) {
  const tabs = [
    { id: 'vm', label: 'Máquinas Virtuais', icon: Server },
    { id: 'pool', label: 'Pool de Recursos', icon: Database },
    { id: 'upgrades', label: 'Upgrades', icon: TrendingUp },
    { id: 'propostas', label: 'Propostas', icon: FileText },
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id as any)}
                className={`
                  flex items-center py-4 px-1 border-b-2 text-sm font-medium transition-colors
                  ${isActive 
                    ? 'border-gray-900 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
