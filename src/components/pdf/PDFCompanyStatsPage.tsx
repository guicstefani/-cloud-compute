
import React from 'react';

export const PDFCompanyStatsPage: React.FC = () => {
  return (
    <div className="w-[210mm] h-[297mm] bg-white p-16" style={{ pageBreakBefore: 'always' }}>
      <h2 className="text-3xl font-bold mb-8">Optidata em números.</h2>
      
      <div className="grid grid-cols-3 gap-8 mb-16">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <p className="text-3xl font-bold">4</p>
          <p className="text-sm text-gray-600">Data Centers<br/>Certificados</p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <p className="text-3xl font-bold">+15PB</p>
          <p className="text-sm text-gray-600">Dados<br/>Processados</p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <p className="text-3xl font-bold">+5MM</p>
          <p className="text-sm text-gray-600">Acessos<br/>Simultâneos</p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <p className="text-3xl font-bold">+7.000</p>
          <p className="text-sm text-gray-600">Clientes<br/>Corporativos</p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <p className="text-3xl font-bold">+25.000</p>
          <p className="text-sm text-gray-600">Servidores<br/>Gerenciados</p>
        </div>
      </div>
      
      <h3 className="text-2xl font-bold mb-8">Certificações internacionais.</h3>
      
      <div className="flex justify-center gap-8">
        {['TIER III\nDESIGN', 'TIER III\nFACILITY', 'PCI DSS', 'ISO 27001', 'ISO 27701'].map((cert, i) => (
          <div key={i} className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-2"></div>
            <p className="text-xs whitespace-pre-line">{cert}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
