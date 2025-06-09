
import React from 'react';
import { ProposalData } from '../ProposalModal';

interface PDFCommercialPageProps {
  dadosCliente: ProposalData;
  currentDate: string;
}

export const PDFCommercialPage: React.FC<PDFCommercialPageProps> = ({
  dadosCliente,
  currentDate
}) => {
  return (
    <div className="w-[210mm] h-[297mm] bg-white p-16" style={{ pageBreakBefore: 'always' }}>
      <h2 className="text-3xl font-bold mb-8">Condições Comerciais</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Prazo de Ativação</h3>
          <p className="text-gray-700">Até 10 (dez) dias úteis após assinatura do contrato</p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Validade da Proposta</h3>
          <p className="text-gray-700">{dadosCliente.validity} dias</p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Condições de Pagamento</h3>
          <p className="text-gray-700 leading-relaxed">
            • Contrato de 12 meses com renovação automática<br/>
            • Pagamento mensal via boleto ou transferência<br/>
            • Reajuste anual pelo IPCA<br/>
            • SLA de 99.99% de disponibilidade garantido
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Suporte Incluído</h3>
          <p className="text-gray-700 leading-relaxed">
            • Suporte técnico 24x7x365<br/>
            • Monitoramento proativo da infraestrutura<br/>
            • Backup automático diário incluído<br/>
            • Atualizações de segurança automáticas
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Informações do Cliente</h3>
          <div className="text-gray-700">
            <p className="font-medium">{dadosCliente.clientName}</p>
            {dadosCliente.email && <p>{dadosCliente.email}</p>}
            {dadosCliente.phone && <p>{dadosCliente.phone}</p>}
          </div>
        </div>
        
        {dadosCliente.observations && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Observações</h3>
            <p className="text-gray-700">{dadosCliente.observations}</p>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-16 left-16 right-16">
        <div className="border-t border-gray-300 pt-8">
          <p className="text-sm text-gray-600">
            Proposta gerada em: {currentDate}
          </p>
        </div>
      </div>
    </div>
  );
};
