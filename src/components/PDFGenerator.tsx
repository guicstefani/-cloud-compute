
import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { VM } from '@/types';
import { CalculadoraCloud, formatCurrency } from '@/utils/calculadora';
import { ProposalData } from './ProposalModal';

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
      {/* PÁGINA 1 - CAPA */}
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
          <h1 className="text-5xl font-bold mb-8">{dadosCliente.clientName.toUpperCase()}</h1>
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
      
      {/* PÁGINA 2 - YOUR NEXT LEVEL */}
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
      
      {/* PÁGINA 3 - NÚMEROS DA OPTIDATA */}
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
      
      {/* PÁGINA 4 - DETALHAMENTO */}
      <div className="w-[210mm] h-[297mm] bg-white p-16" style={{ pageBreakBefore: 'always' }}>
        <h2 className="text-3xl font-bold mb-8">Configuração dos Servidores</h2>
        
        {/* Tabela de VMs */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="bg-purple-600 text-white p-4 rounded-t-lg">
            <h3 className="text-lg font-semibold">ESTRUTURA PARA COMPUTAÇÃO OPTICLOUD</h3>
          </div>
          
          {vms.map((vm, index) => {
            const custo = calculadora.calcularVM(vm);
            const licencas = [];
            if (vm.windowsServer) licencas.push('Windows Server');
            if (vm.rhel) licencas.push('RHEL');
            if (vm.suse) licencas.push('SUSE');
            if (vm.sqlServerSTD) licencas.push('SQL Server');
            
            return (
              <div key={vm.id} className="border-b border-gray-200 p-4">
                <h4 className="text-lg font-semibold mb-2">Servidor {index + 1} - {vm.nome}</h4>
                <p className="text-sm text-gray-600">
                  {vm.vcpu} vCPUs • {vm.ram}GB RAM • {vm.discoFCM + vm.discoSSD}GB Storage
                  {licencas.length > 0 && ` • ${licencas.join(', ')}`}
                </p>
              </div>
            );
          })}
        </div>
        
        {/* Resumo de Custos Detalhado */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-6">Resumo de Custos</h3>
          
          {vms.map((vm, index) => {
            const custo = calculadora.calcularVM(vm);
            return (
              <div key={vm.id} className="mb-6">
                <h4 className="text-base font-semibold mb-3">Servidor {index + 1} - {vm.nome}</h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Infraestrutura (vCPU + RAM)</span>
                    <span className="font-medium">{formatCurrency(custo.vcpu + custo.ram)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Armazenamento + Backup</span>
                    <span className="font-medium">{formatCurrency(custo.storage + custo.backup)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monitoramento</span>
                    <span className="font-medium">{formatCurrency(custo.monitoramento)}</span>
                  </div>
                  
                  {custo.subtotalLicencas > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Licenças</span>
                      <span className="font-medium">{formatCurrency(custo.subtotalLicencas)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between border-t pt-2 font-semibold">
                    <span>Subtotal</span>
                    <span>{formatCurrency(custo.total)}</span>
                  </div>
                </div>
              </div>
            );
          })}
          
          {economia > 0 && (
            <div className="flex justify-between text-green-600 mb-4">
              <span>Desconto Aplicado</span>
              <span className="font-medium">-{formatCurrency(economia)}</span>
            </div>
          )}
          
          <div className="border-t-2 border-[#C7D82B] pt-4">
            <div className="flex justify-between text-xl font-bold">
              <span>Total Mensal</span>
              <span>{formatCurrency(totalValue)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* PÁGINA 5 - CONDIÇÕES COMERCIAIS */}
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
      
      {/* PÁGINA FINAL - CONTATO */}
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
    </div>
  );
};

export const generatePDF = async (
  vms: VM[],
  calculadora: CalculadoraCloud,
  proposalData: ProposalData,
  totalValue: number,
  economia: number
) => {
  try {
    // Tornar o conteúdo visível temporariamente
    const element = document.getElementById('pdf-content');
    if (!element) {
      throw new Error('Elemento PDF não encontrado');
    }
    
    element.classList.remove('hidden');
    element.classList.add('fixed', 'top-0', 'left-0', 'z-[-1]');
    
    // Aguardar renderização
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Capturar cada página
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pages = element.children;
    
    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i] as HTMLElement, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: 794, // A4 width in pixels at 96 DPI
        height: 1123 // A4 height in pixels at 96 DPI
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
    }
    
    // Ocultar novamente
    element.classList.add('hidden');
    element.classList.remove('fixed', 'top-0', 'left-0', 'z-[-1]');
    
    // Salvar PDF
    pdf.save(`Proposta_Premium_${proposalData.clientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw error;
  }
};

export default PropostaPDFContent;
