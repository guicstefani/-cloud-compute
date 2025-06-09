
import React from 'react';
import { ProposalData } from '../ProposalModal';

interface PDFCoverPageProps {
  clientName: string;
}

export const PDFCoverPage: React.FC<PDFCoverPageProps> = ({ clientName }) => {
  return (
    <div className="w-[210mm] h-[297mm] bg-black text-white p-16 relative overflow-hidden">
      {/* Padrão decorativo */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#C7D82B] opacity-10"></div>
      
      {/* Elementos gráficos decorativos */}
      <div className="absolute top-20 right-16 w-80 h-80">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className={`absolute w-12 h-12 ${i % 2 === 0 ? 'bg-[#C7D82B]' : 'bg-purple-500'} opacity-80`}
            style={{
              top: `${i * 60}px`,
              right: `${i * 30}px`
            }}
          />
        ))}
      </div>
      
      {/* Conteúdo da capa */}
      <div className="relative z-10 mt-32">
        <p className="text-[#C7D82B] text-sm font-medium mb-2">PROJETO</p>
        <h1 className="text-5xl font-bold mb-8">{clientName.toUpperCase()}</h1>
      </div>
      
      {/* Logo Optidata */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center gap-1">
          <h2 className="text-4xl font-bold">Optidata</h2>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-[#C7D82B] rounded-full"></div>
            <div className="w-2 h-2 bg-[#C7D82B] rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
