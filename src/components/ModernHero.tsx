
import React from 'react';
import { Shield, Award, Zap, Check } from 'lucide-react';

const ModernHero = () => {
  return (
    <div className="hero-animated-bg relative overflow-hidden text-white min-h-[600px] flex items-center">
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/95 to-black/90 backdrop-blur-sm"></div>
      
      <div className="relative z-10 layout-premium-container py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Premium badge */}
          <div className="inline-flex items-center gap-2 mb-8">
            <div className="badge-premium-active">
              <Shield className="w-4 h-4" />
              Enterprise Cloud Solutions
            </div>
          </div>
          
          <h1 className="text-premium-title mb-6" style={{ fontSize: '3.5rem' }}>
            Cloud Computing
            <span className="block mt-2 bg-gradient-to-r from-white via-[#f5a623] to-white bg-clip-text text-transparent">
              Premium
            </span>
          </h1>
          
          <p className="text-premium-subtitle mb-12 max-w-2xl mx-auto">
            Infraestrutura Enterprise de Alta Performance com Transparência Total de Custos
          </p>
          
          {/* Premium metrics grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="premium-glass-card p-6 text-center breathe-animation">
              <div className="text-3xl font-light text-white mb-2">99.99%</div>
              <div className="text-premium-caption uppercase tracking-wider">Uptime SLA</div>
              <div className="w-2 h-2 bg-[#00d4aa] rounded-full mx-auto mt-3 animate-pulse"></div>
            </div>
            
            <div className="premium-glass-card p-6 text-center breathe-animation" style={{ animationDelay: '0.5s' }}>
              <div className="text-3xl font-light text-white mb-2">5min</div>
              <div className="text-premium-caption uppercase tracking-wider">Deploy Time</div>
              <Zap className="w-4 h-4 text-[#f5a623] mx-auto mt-3" />
            </div>
            
            <div className="premium-glass-card p-6 text-center breathe-animation" style={{ animationDelay: '1s' }}>
              <div className="text-3xl font-light text-white mb-2">24/7</div>
              <div className="text-premium-caption uppercase tracking-wider">Suporte Premium</div>
              <div className="w-2 h-2 bg-[#00a8ff] rounded-full mx-auto mt-3 animate-pulse"></div>
            </div>
          </div>
          
          {/* Trust badges with smart hierarchy */}
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="badge-premium-info">
              <Shield className="w-4 h-4" />
              ISO 27001
            </div>
            <div className="badge-premium-success">
              <Award className="w-4 h-4" />
              Tier III Certified
            </div>
            <div className="badge-premium-info">
              <Check className="w-4 h-4" />
              Enterprise Ready
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernHero;
