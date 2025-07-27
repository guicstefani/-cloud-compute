
import React from 'react';
import { Calculator } from 'lucide-react';

const ModernHero = () => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-optidata-blue rounded-lg flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Portal OptiData Cloud
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Calculadora de Projetos - Configure e dimensione sua infraestrutura cloud
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModernHero;
