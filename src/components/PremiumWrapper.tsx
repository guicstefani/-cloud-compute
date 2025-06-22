
import React from 'react';
import Header from './Header';
import UserMenu from './UserMenu';
import { CosmicBackground } from './premium/CosmicBackground';

interface PremiumWrapperProps {
  children: React.ReactNode;
}

const PremiumWrapper: React.FC<PremiumWrapperProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-obsidian-deep text-gold-warm relative">
      <CosmicBackground />
      
      {/* Header Premium */}
      <div className="relative z-10 border-b border-gold-whisper/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gold-pure to-gold-rich rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-obsidian-deep font-bold text-xl">C</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gold-warm">Calculadora Cloud</h1>
                <p className="text-sm text-white/60">Sistema Premium de Cotação</p>
              </div>
            </div>
            
            <UserMenu />
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default PremiumWrapper;
