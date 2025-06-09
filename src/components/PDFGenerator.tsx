
import React from 'react';
import { VM } from '@/types';
import { CalculadoraCloud } from '@/utils/calculadora';
import { ProposalData } from './ProposalModal';
import { PDFCoverPage } from './pdf/PDFCoverPage';
import { PDFNextLevelPage } from './pdf/PDFNextLevelPage';
import { PDFCompanyStatsPage } from './pdf/PDFCompanyStatsPage';
import { PDFConfigurationPage } from './pdf/PDFConfigurationPage';
import { PDFCommercialPage } from './pdf/PDFCommercialPage';
import { PDFContactPage } from './pdf/PDFContactPage';

interface PropostaPDFContentProps {
  dadosCliente: ProposalData;
  vms: VM[];
  calculadora: CalculadoraCloud;
  totalValue: number;
  economia: number;
}

const PropostaPDFContent: React.FC<PropostaPDFContentProps> = ({ 
  dadosCliente, 
  vms, 
  calculadora, 
  totalValue, 
  economia 
}) => {
  const currentDate = new Date().toLocaleDateString('pt-BR');
  
  return (
    <div id="pdf-content" className="hidden">
      <PDFCoverPage clientName={dadosCliente.clientName} />
      <PDFNextLevelPage />
      <PDFCompanyStatsPage />
      <PDFConfigurationPage 
        vms={vms} 
        calculadora={calculadora} 
        totalValue={totalValue} 
        economia={economia} 
      />
      <PDFCommercialPage 
        dadosCliente={dadosCliente} 
        currentDate={currentDate} 
      />
      <PDFContactPage />
    </div>
  );
};

// Re-export the generatePDF function from utils
export { generatePDF } from '@/utils/pdfGenerator';

export default PropostaPDFContent;
