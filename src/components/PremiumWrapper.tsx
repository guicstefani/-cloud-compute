
import React, { useState, useEffect } from 'react';
import { Server, Database, TrendingUp, FileText, Menu, X, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import UserMenu from './UserMenu';
import type { User } from '@supabase/supabase-js';

interface PremiumWrapperProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function PremiumWrapper({ children, activeTab, onTabChange }: PremiumWrapperProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  
  const tabs = [
    { id: 'vm', label: 'Calculadora VM', icon: Server },
    { id: 'pool', label: 'Pool de Recursos', icon: Database },
    { id: 'upgrades', label: 'Upgrades', icon: TrendingUp },
    { id: 'propostas', label: 'Propostas', icon: FileText },
    { id: 'contratos', label: 'Gestão MRR', icon: DollarSign }
  ];

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          navigate('/login');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="premium-app flex h-screen">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-dark border-r border-gray-800 transition-all duration-300 flex-shrink-0 relative z-10`}
        style={{
          boxShadow: '4px 0 20px rgba(0, 0, 0, 0.5)'
        }}>
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
                className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 transition-all duration-300 ${
                  isActive 
                    ? 'bg-[#DCAE1D]/15 text-gold border border-[#DCAE1D]/30 transform translate-x-1' 
                    : 'hover:bg-white/5 text-gray-300 hover:text-white hover:transform hover:translate-x-1'
                }`}
                style={{
                  ...(isActive && {
                    boxShadow: 'inset 0 0 20px rgba(220, 174, 29, 0.2), 0 4px 30px rgba(220, 174, 29, 0.4)',
                    borderLeft: '3px solid #DCAE1D'
                  }),
                  ...(!isActive && {
                    transition: 'all 0.3s ease'
                  })
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(220, 174, 29, 0.1)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(220, 174, 29, 0.3)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = '';
                    e.currentTarget.style.boxShadow = '';
                    e.currentTarget.style.transform = '';
                  }
                }}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-left">{tab.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User Menu na Sidebar */}
        {sidebarOpen && (
          <div className="absolute bottom-4 left-0 right-0 p-4">
            <div className="w-full">
              <UserMenu />
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
