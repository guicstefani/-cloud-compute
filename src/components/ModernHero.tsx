
import React from 'react';
import { Shield, Award, Zap } from 'lucide-react';

const ModernHero = () => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900">
            Calculadora Cloud Privada
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Infraestrutura Enterprise de Alta Performance com Transparência Total de Custos
          </p>
          <p className="text-lg text-gray-500 mb-8">
            Optidata - Soluções em Nuvem
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap gap-6 justify-center">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">99.99% Uptime</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">ISO 27001</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Award className="w-4 h-4" />
              <span className="text-sm font-medium">Tier III</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
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
