
import React from 'react';
import { Shield, Award, Zap, Check } from 'lucide-react';

const ModernHero = () => {
  return (
    <div className="relative min-h-[60vh] bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="blur-layer-hero" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(245,166,35,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(220,174,29,0.1),transparent_60%)]" />
      
      {/* Floating Glass Orbs */}
      <div className="absolute top-20 right-20 w-32 h-32 rounded-full glass-card opacity-20 animate-float" />
      <div className="absolute bottom-20 left-20 w-24 h-24 rounded-full glass-card opacity-30 animate-float" style={{animationDelay: '2s'}} />
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-[#f5a623] to-white animate-shimmer">
            Cloud Computing
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Infraestrutura Enterprise de Alta Performance com Transparência Total de Custos
          </p>
          
          {/* Enhanced Trust Badges with Glassmorphism */}
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="glass-card px-6 py-3 flex items-center gap-2 rounded-full glow-hover">
              <div className="w-2 h-2 bg-[#f5a623] rounded-full animate-pulse shadow-lg shadow-[#f5a623]/50" />
              <span className="text-sm font-medium text-[#f5a623]">99.99% Uptime</span>
            </div>
            <div className="glass-card px-6 py-3 flex items-center gap-2 rounded-full glow-hover">
              <Shield className="w-4 h-4 text-[#f5a623]" />
              <span className="text-sm font-medium">ISO 27001</span>
            </div>
            <div className="glass-card px-6 py-3 flex items-center gap-2 rounded-full glow-hover">
              <Award className="w-4 h-4 text-[#f5a623]" />
              <span className="text-sm font-medium">Tier III</span>
            </div>
            <div className="glass-card px-6 py-3 flex items-center gap-2 rounded-full glow-hover">
              <Zap className="w-4 h-4 text-[#f5a623]" />
              <span className="text-sm font-medium">Deploy em 5min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernHero;
