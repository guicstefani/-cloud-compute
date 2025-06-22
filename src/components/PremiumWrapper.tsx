import React, { useState, useEffect } from 'react';
import { Server, Database, TrendingUp, FileText, Menu, X } from 'lucide-react';
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
    { id: 'propostas', label: 'Propostas', icon: FileText }
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
    <div className="premium-app flex h-screen relative overflow-hidden">
      {/* Background blur layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
      <div className="blur-layer-hero" />
      
      {/* Glassmorphism Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} glass-sidebar transition-all duration-300 flex-shrink-0 relative z-20`}>
        <div className="p-4 border-b border-[#f5a623]/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#f5a623] to-[#d68910] rounded-xl flex items-center justify-center shadow-lg shadow-[#f5a623]/30">
              <span className="text-black font-bold text-lg">O</span>
            </div>
            {sidebarOpen && (
              <div>
                <div className="text-white font-bold text-lg">Optidata</div>
                <div className="text-[#f5a623] text-xs">Cloud Premium</div>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 glass-button rounded-lg transition-all duration-300"
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
                className={`w-full flex items-center gap-3 p-3 rounded-xl mb-2 transition-all duration-300 group ${
                  isActive 
                    ? 'glass-card-premium text-[#f5a623] glow-gold' 
                    : 'glass-button text-gray-300 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-left">{tab.label}</span>}
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#f5a623] to-[#d68910] rounded-r-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Menu with Glassmorphism */}
        {sidebarOpen && (
          <div className="absolute bottom-4 left-0 right-0 p-4">
            <div className="glass-card p-3 rounded-xl">
              <UserMenu />
            </div>
          </div>
        )}
      </aside>

      {/* Main Content with Glass Background */}
      <main className="flex-1 overflow-auto relative">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#f5a623]/5 to-transparent" />
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
