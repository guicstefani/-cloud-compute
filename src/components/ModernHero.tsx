
import React from 'react';
import { Shield, Award, Zap } from 'lucide-react';

const ModernHero = () => {
  return (
    <div className="bg-[#C7D82B] py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-bold text-black">Opticloud</h1>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <div className="w-2 h-2 bg-black rounded-full"></div>
            </div>
          </div>
          <div className="hidden md:block text-black text-sm font-medium">
            Cloud computing: Infraestrutura em nuvem de alta performance
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-black">
            Calculadora Cloud Privada
          </h2>
          <p className="text-lg text-black/80 mb-8 max-w-3xl mx-auto">
            Infraestrutura Enterprise de Alta Performance com Transparência Total de Custos
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap gap-6 justify-center">
            <div className="flex items-center gap-2 text-black">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <span className="text-sm font-medium">99.99% Uptime</span>
            </div>
            <div className="flex items-center gap-2 text-black">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">ISO 27001</span>
            </div>
            <div className="flex items-center gap-2 text-black">
              <Award className="w-4 h-4" />
              <span className="text-sm font-medium">Tier III</span>
            </div>
            <div className="flex items-center gap-2 text-black">
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
