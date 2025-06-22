
import React from 'react';
import { Shield, Award, Zap, Check } from 'lucide-react';

const ModernHero = () => {
  return (
    <div className="hero-animated-bg relative bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,174,29,0.1),transparent_50%)]"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#DCAE1D] to-[#F4C430] rounded-full filter blur-3xl opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-[#DCAE1D] to-[#F4C430] rounded-full filter blur-3xl opacity-10"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#DCAE1D]">
            Cloud Computing
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Infraestrutura Enterprise de Alta Performance com Transparência Total de Custos
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="bg-white/10 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-2 border border-[#DCAE1D]/30">
              <div className="w-2 h-2 bg-[#DCAE1D] rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gold">99.99% Uptime</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-2 border border-[#DCAE1D]/30">
              <Shield className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium">ISO 27001</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-2 border border-[#DCAE1D]/30">
              <Award className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium">Tier III</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-2 border border-[#DCAE1D]/30">
              <Zap className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium">Deploy em 5min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernHero;
