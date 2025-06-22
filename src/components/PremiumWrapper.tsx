
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
    <div className="min-h-screen flex w-full" style={{ background: 'var(--premium-black)' }}>
      {/* Premium Sidebar */}
      <aside 
        className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex-shrink-0 relative z-10 layout-premium-sidebar`}
        style={{ 
          background: 'var(--premium-dark)',
          borderRight: '1px solid var(--premium-border)'
        }}
      >
        <div className="p-6 border-b" style={{ borderColor: 'var(--premium-border)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                   style={{ 
                     background: 'linear-gradient(135deg, var(--premium-gold), var(--premium-gold-hover))',
                     color: 'var(--premium-black)'
                   }}>
                <span className="font-bold text-lg">O</span>
              </div>
              {sidebarOpen && (
                <div>
                  <div className="text-premium-title" style={{ fontSize: '18px' }}>Optidata</div>
                  <div className="text-premium-caption">Cloud Premium</div>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="btn-premium-ghost p-2"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
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
                    ? 'bg-[rgba(245,166,35,0.15)] border border-[rgba(245,166,35,0.3)]' 
                    : 'hover:bg-[var(--premium-elevated)]'
                }`}
                style={{
                  color: isActive ? 'var(--premium-gold)' : 'var(--premium-gray-light)',
                  ...(isActive && {
                    boxShadow: '0 4px 20px rgba(245, 166, 35, 0.2)',
                    transform: 'translateX(2px)'
                  })
                }}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-left font-medium">{tab.label}</span>}
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
      <main className="flex-1 overflow-auto" style={{ background: 'var(--premium-black)' }}>
        {children}
      </main>
    </div>
  );
}
