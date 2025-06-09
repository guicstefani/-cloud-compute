
import React from 'react';

export const PDFNextLevelPage: React.FC = () => {
  return (
    <div className="w-[210mm] h-[297mm] bg-white p-16" style={{ pageBreakBefore: 'always' }}>
      <h1 className="text-4xl font-bold mb-8">
        YOUR <span className="text-[#C7D82B]">→</span> NEXT<br/>
        LEVEL
      </h1>
      
      <p className="text-lg text-gray-700 mb-12">
        Organizar, armazenar e processar,<br/>
        permitindo que você foque no seu<br/>
        negócio para gerar mais resultados.
      </p>
      
      {/* Imagens ilustrativas */}
      <div className="flex gap-4 mt-16 mb-16">
        {[1, 2, 3].map(i => (
          <div key={i} className="w-40 h-24 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
      
      {/* Cards de métricas */}
      <div className="grid grid-cols-3 gap-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#C7D82B] rounded-lg mx-auto mb-4 flex items-center justify-center">
            <span className="text-black font-bold">💰</span>
          </div>
          <p className="text-3xl font-bold">80%</p>
          <p className="text-sm text-gray-600">Redução de custos</p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-[#C7D82B] rounded-lg mx-auto mb-4 flex items-center justify-center">
            <span className="text-black font-bold">🛡️</span>
          </div>
          <p className="text-3xl font-bold">99.99%</p>
          <p className="text-sm text-gray-600">SLA Garantido</p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-[#C7D82B] rounded-lg mx-auto mb-4 flex items-center justify-center">
            <span className="text-black font-bold">⚡</span>
          </div>
          <p className="text-3xl font-bold">5min</p>
          <p className="text-sm text-gray-600">Deploy</p>
        </div>
      </div>
    </div>
  );
};
