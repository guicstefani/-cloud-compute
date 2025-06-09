
import React from 'react';

export const PDFContactPage: React.FC = () => {
  return (
    <div className="w-[210mm] h-[297mm] bg-black text-white p-16 flex flex-col justify-center" style={{ pageBreakBefore: 'always' }}>
      <div>
        <h1 className="text-4xl font-bold mb-2">Vamos escalar</h1>
        <h1 className="text-4xl font-bold mb-2">seu negócio por meio</h1>
        <h1 className="text-4xl font-bold mb-12">da tecnologia<span className="text-[#C7D82B]">?</span></h1>
        
        <p className="text-2xl font-semibold mb-12 text-white">optidata.cloud</p>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-[#C7D82B] mb-2">Optidata BR - Chapecó</h3>
            <p className="text-sm text-gray-300">
              Av. Nereu Ramos, 1866 E - 4º andar<br/>
              Passo dos Fortes - Chapecó/SC
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-[#C7D82B] mb-2">Optidata BR - São Paulo</h3>
            <p className="text-sm text-gray-300">
              Av. Dr. Chucri Zaidan, 1550<br/>
              Conjunto 507 - São Paulo/SP
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-[#C7D82B] mb-2">Contato Comercial</h3>
            <p className="text-sm text-gray-300">
              Email: comercial@optidata.com.br<br/>
              Telefone: (11) 3333-4444
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
