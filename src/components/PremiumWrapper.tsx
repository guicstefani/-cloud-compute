
import React, { useState } from 'react';
import { Server, Database, TrendingUp, FileText, Menu, X } from 'lucide-react';

interface PremiumWrapperProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function PremiumWrapper({ children, activeTab, onTabChange }: PremiumWrapperProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const tabs = [
    { id: 'vm', label: 'Calculadora VM', icon: Server },
    { id: 'pool', label: 'Pool de Recursos', icon: Database },
    { id: 'upgrades', label: 'Upgrades', icon: TrendingUp },
    { id: 'propostas', label: 'Propostas', icon: FileText }
  ];

  return (
    <div className="premium-app flex h-screen">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-dark border-r border-gray-800 transition-all duration-300 flex-shrink-0`}>
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#DCAE1D] to-[#F4C430] rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">O</span>
            </div>
            {sidebarOpen && (
              <div>
                <div className="text-white font-bold text-lg">Optidata</div>
                <div className="text-gold text-xs">Cloud Premium</div>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-4 h-4 text-gray-400" /> : <Menu className="w-4 h-4 text-gray-400" />}
          </button>
        </div>
        
        <nav className="p-4">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 transition-all ${
                  isActive 
                    ? 'bg-[#DCAE1D]/20 text-gold border border-[#DCAE1D]/30' 
                    : 'hover:bg-white/5 text-gray-300 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-left">{tab.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer da Sidebar */}
        {sidebarOpen && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
            <div className="text-xs text-gray-500 text-center">
              Optidata Cloud Calculator
            </div>
            <div className="text-xs text-gold text-center font-medium">
              Premium Edition
            </div>
          </div>
        )}
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto bg-black">
        {children}
      </main>
    </div>
  );
}
