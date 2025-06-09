
import React from 'react';
import { Shield, Award, Zap, Check } from 'lucide-react';

const ModernHero = () => {
  return (
    <div className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-20"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-300">
            Cloud Computing
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Infraestrutura Enterprise de Alta Performance com Transparência Total de Custos
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

export default ModernHero;
