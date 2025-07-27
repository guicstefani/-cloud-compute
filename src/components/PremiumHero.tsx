import React from 'react';
import { Calculator, Shield, Award, Zap } from 'lucide-react';

const PremiumHero = () => {
  return (
    <div className="relative bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-50"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full filter blur-3xl"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center">
          {/* Logo and Title */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gold-gradient rounded-2xl flex items-center justify-center shadow-2xl">
              <Calculator className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-gradient-gold uppercase tracking-wider">
              OptiCloud
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-white/80 mb-4 font-light">
            Portal OptiData Cloud
          </p>
          
          <p className="text-lg text-white/60 max-w-2xl mx-auto mb-12">
            Calculadora de Projetos - Configure e dimensione sua infraestrutura cloud
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="bg-white/10 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-2 border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">99.99% Uptime</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-2 border border-white/20">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">ISO 27001</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-2 border border-white/20">
              <Award className="w-4 h-4" />
              <span className="text-sm font-medium">Tier III</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-2 border border-white/20">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Deploy em 5min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumHero;