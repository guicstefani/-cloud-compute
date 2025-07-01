
import React, { useState, useEffect } from 'react';
import { Server, Database, TrendingUp, FileText, Menu, X, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import UserMenu from './UserMenu';
import EpicBackground from './ui/EpicBackground';
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
    <div className="min-h-screen bg-black text-white flex">
      <EpicBackground />
      
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white/[0.03] backdrop-blur-xl border-r border-white/[0.08] transition-all duration-300 flex-shrink-0 relative z-20`}>
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold-dark rounded-xl flex items-center justify-center">
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
            {sidebarOpen ? <X className="w-4 h-4 text-white/60" /> : <Menu className="w-4 h-4 text-white/60" />}
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
                className={`group w-full flex items-center gap-3 p-4 rounded-xl mb-3 transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-gold/20 to-gold/10 text-gold border border-gold/30 shadow-lg shadow-gold/20' 
                    : 'hover:bg-white/5 text-white/70 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-gold' : 'group-hover:text-gold'} transition-colors`} />
                {sidebarOpen && (
                  <span className="text-left font-medium">{tab.label}</span>
                )}
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
      <main className="flex-1 overflow-auto relative z-10">
        {children}
      </main>
    </div>
  );
}
