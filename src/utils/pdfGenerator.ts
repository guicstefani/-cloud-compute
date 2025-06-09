
import { VM } from '@/types';
import { CalculadoraCloud, formatCurrency } from '@/utils/calculadora';
import { ProposalData } from '@/components/ProposalModal';

export const generatePDF = async (
  vms: VM[],
  calculadora: CalculadoraCloud,
  proposalData: ProposalData,
  totalValue: number,
  economia: number
) => {
  try {
    // Criar nova janela para impressão
    const novaJanela = window.open('', '_blank');
    
    if (!novaJanela) {
      throw new Error('Pop-up bloqueado. Permita pop-ups para gerar o PDF.');
    }
    
    // Calcular resumo de custos
    const resumoInfra = vms.reduce((total, vm) => {
      const custo = calculadora.calcularVM(vm);
      return total + custo.vcpu + custo.ram + custo.storage + custo.backup + custo.monitoramento;
    }, 0);
    
    const resumoLicencas = vms.reduce((total, vm) => {
      const custo = calculadora.calcularVM(vm);
      return total + custo.subtotalLicencas;
    }, 0);
    
    const currentDate = new Date().toLocaleDateString('pt-BR');
    
    const conteudoHTML = createPDFHTML(
      proposalData,
      vms,
      calculadora,
      totalValue,
      economia,
      resumoInfra,
      resumoLicencas,
      currentDate
    );
    
    novaJanela.document.write(conteudoHTML);
    novaJanela.document.close();
    
    // Aguardar carregamento e abrir diálogo de impressão
    setTimeout(() => {
      novaJanela.print();
    }, 1000);
    
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw error;
  }
};

const createPDFHTML = (
  proposalData: ProposalData,
  vms: VM[],
  calculadora: CalculadoraCloud,
  totalValue: number,
  economia: number,
  resumoInfra: number,
  resumoLicencas: number,
  currentDate: string
): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Proposta - ${proposalData.clientName}</title>
      <meta charset="UTF-8">
      <style>
        @page {
          size: A4;
          margin: 0;
        }
        body {
          margin: 0;
          font-family: Arial, sans-serif;
          color: #333;
          line-height: 1.4;
        }
        .page {
          width: 210mm;
          min-height: 297mm;
          padding: 20mm;
          page-break-after: always;
          position: relative;
          box-sizing: border-box;
        }
        .capa {
          background: #1a1a1a;
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 40mm;
        }
        .capa h1 {
          font-size: 48px;
          margin: 20px 0;
          font-weight: bold;
        }
        .capa .projeto {
          color: #C7D82B;
          font-size: 14px;
          margin-bottom: 10px;
          font-weight: 500;
        }
        .logo {
          position: absolute;
          bottom: 40mm;
          left: 50%;
          transform: translateX(-50%);
          font-size: 36px;
          font-weight: bold;
        }
        .section {
          margin-bottom: 30px;
        }
        .section h2 {
          color: #1a1a1a;
          border-bottom: 2px solid #C7D82B;
          padding-bottom: 10px;
          font-size: 24px;
          margin-bottom: 20px;
        }
        .vm-card {
          background: #f8f9fa;
          padding: 20px;
          margin: 15px 0;
          border-radius: 8px;
          border-left: 4px solid #C7D82B;
        }
        .vm-card h3 {
          margin: 0 0 10px 0;
          color: #1a1a1a;
          font-size: 18px;
        }
        .vm-card p {
          margin: 5px 0;
          color: #666;
        }
        .vm-card .vm-specs {
          font-weight: 500;
          color: #333;
        }
        .custo-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #eee;
        }
        .custo-row:last-child {
          border-bottom: none;
        }
        .custo-section {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .total {
          font-size: 24px;
          font-weight: bold;
          color: #1a1a1a;
          border-top: 3px solid #C7D82B;
          padding-top: 20px;
          margin-top: 20px;
        }
        .destaque {
          color: #C7D82B;
          font-weight: bold;
        }
        .desconto {
          color: #28a745;
          font-weight: 500;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin: 20px 0;
        }
        .info-item {
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        .info-item strong {
          color: #1a1a1a;
          display: block;
          margin-bottom: 5px;
        }
        .footer {
          position: absolute;
          bottom: 40px;
          left: 40px;
          right: 40px;
          text-align: center;
          color: #666;
          font-size: 12px;
          border-top: 1px solid #eee;
          padding-top: 20px;
        }
        @media print {
          .no-print {
            display: none;
          }
          .page {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <!-- PÁGINA 1: CAPA -->
      <div class="page capa">
        <div class="projeto">PROJETO</div>
        <h1>${proposalData.clientName.toUpperCase()}</h1>
        <div class="logo">Optidata</div>
      </div>
      
      <!-- PÁGINA 2: YOUR NEXT LEVEL -->
      <div class="page">
        <h1 style="font-size: 36px; margin-bottom: 20px;">
          YOUR <span class="destaque">→</span> NEXT<br/>LEVEL
        </h1>
        <p style="font-size: 18px; color: #666; margin-bottom: 40px;">
          Organizar, armazenar e processar,<br/>
          permitindo que você foque no seu<br/>
          negócio para gerar mais resultados.
        </p>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-top: 60px;">
          <div style="text-align: center;">
            <div style="width: 60px; height: 60px; background: #C7D82B; border-radius: 8px; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 24px;">💰</div>
            <p style="font-size: 28px; font-weight: bold; margin: 10px 0;">80%</p>
            <p style="color: #666; font-size: 14px;">Redução de custos</p>
          </div>
          <div style="text-align: center;">
            <div style="width: 60px; height: 60px; background: #C7D82B; border-radius: 8px; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 24px;">🛡️</div>
            <p style="font-size: 28px; font-weight: bold; margin: 10px 0;">99.99%</p>
            <p style="color: #666; font-size: 14px;">SLA Garantido</p>
          </div>
          <div style="text-align: center;">
            <div style="width: 60px; height: 60px; background: #C7D82B; border-radius: 8px; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 24px;">⚡</div>
            <p style="font-size: 28px; font-weight: bold; margin: 10px 0;">5min</p>
            <p style="color: #666; font-size: 14px;">Deploy</p>
          </div>
        </div>
      </div>
      
      <!-- PÁGINA 3: CONFIGURAÇÃO DOS SERVIDORES -->
      <div class="page">
        <div class="section">
          <h2>Configuração dos Servidores</h2>
          ${vms.map((vm, index) => {
            const custo = calculadora.calcularVM(vm);
            const licencas = [];
            if (vm.windowsServer) licencas.push('Windows Server');
            if (vm.rhel) licencas.push('RHEL');
            if (vm.suse) licencas.push('SUSE');
            if (vm.sqlServerSTD) licencas.push('SQL Server');
            
            return `
              <div class="vm-card">
                <h3>Servidor ${index + 1} - ${vm.nome}</h3>
                <p class="vm-specs">Recursos: ${vm.vcpu} vCPUs • ${vm.ram}GB RAM • ${vm.discoFCM + vm.discoSSD}GB Storage</p>
                ${licencas.length > 0 ? `<p><strong>Licenças:</strong> ${licencas.join(', ')}</p>` : ''}
                <p><strong>Custo Mensal:</strong> <span class="destaque">${formatCurrency(custo.total)}</span></p>
              </div>
            `;
          }).join('')}
        </div>
        
        <div class="section">
          <h2>Resumo de Custos</h2>
          <div class="custo-section">
            <div class="custo-row">
              <span>Infraestrutura (vCPU + RAM + Storage)</span>
              <span>${formatCurrency(resumoInfra)}</span>
            </div>
            <div class="custo-row">
              <span>Licenciamento</span>
              <span>${formatCurrency(resumoLicencas)}</span>
            </div>
            ${economia > 0 ? `
              <div class="custo-row">
                <span>Desconto Aplicado</span>
                <span class="desconto">-${formatCurrency(economia)}</span>
              </div>
            ` : ''}
            <div class="total">
              <div style="display: flex; justify-content: space-between;">
                <span>Total Mensal</span>
                <span class="destaque">${formatCurrency(totalValue)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- PÁGINA 4: CONDIÇÕES COMERCIAIS -->
      <div class="page">
        <div class="section">
          <h2>Condições Comerciais</h2>
          
          <div class="info-grid">
            <div class="info-item">
              <strong>Prazo de Ativação</strong>
              Até 10 (dez) dias úteis após assinatura do contrato
            </div>
            <div class="info-item">
              <strong>Validade da Proposta</strong>
              ${proposalData.validity} dias
            </div>
          </div>
          
          <div class="section">
            <h3 style="color: #1a1a1a; margin-bottom: 15px;">Condições de Pagamento</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li>Contrato de 12 meses com renovação automática</li>
              <li>Pagamento mensal via boleto ou transferência</li>
              <li>Reajuste anual pelo IPCA</li>
              <li>SLA de 99.99% de disponibilidade garantido</li>
            </ul>
          </div>
          
          <div class="section">
            <h3 style="color: #1a1a1a; margin-bottom: 15px;">Suporte Incluído</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li>Suporte técnico 24x7x365</li>
              <li>Monitoramento proativo da infraestrutura</li>
              <li>Backup automático diário incluído</li>
              <li>Atualizações de segurança automáticas</li>
            </ul>
          </div>
          
          <div class="section">
            <h3 style="color: #1a1a1a; margin-bottom: 15px;">Informações do Cliente</h3>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
              <p><strong>Cliente:</strong> ${proposalData.clientName}</p>
              ${proposalData.email ? `<p><strong>Email:</strong> ${proposalData.email}</p>` : ''}
              ${proposalData.phone ? `<p><strong>Telefone:</strong> ${proposalData.phone}</p>` : ''}
              ${proposalData.observations ? `<p><strong>Observações:</strong> ${proposalData.observations}</p>` : ''}
            </div>
          </div>
        </div>
        
        <div class="footer">
          Proposta gerada em ${currentDate}
        </div>
      </div>
      
      <!-- PÁGINA 5: CONTATO -->
      <div class="page" style="background: #1a1a1a; color: white; display: flex; flex-direction: column; justify-content: center;">
        <div>
          <h1 style="font-size: 36px; margin-bottom: 40px;">
            Vamos escalar seu negócio por meio da tecnologia<span class="destaque">?</span>
          </h1>
          
          <p style="font-size: 24px; margin-bottom: 60px; color: white;">optidata.cloud</p>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
            <div>
              <h3 style="color: #C7D82B; margin-bottom: 15px;">Optidata BR - Chapecó</h3>
              <p style="color: #ccc; line-height: 1.6;">
                Av. Nereu Ramos, 1866 E - 4º andar<br/>
                Passo dos Fortes - Chapecó/SC
              </p>
            </div>
            
            <div>
              <h3 style="color: #C7D82B; margin-bottom: 15px;">Optidata BR - São Paulo</h3>
              <p style="color: #ccc; line-height: 1.6;">
                Av. Dr. Chucri Zaidan, 1550<br/>
                Conjunto 507 - São Paulo/SP
              </p>
            </div>
          </div>
          
          <div style="margin-top: 40px;">
            <h3 style="color: #C7D82B; margin-bottom: 15px;">Contato Comercial</h3>
            <p style="color: #ccc; line-height: 1.6;">
              Email: comercial@optidata.com.br<br/>
              Telefone: (11) 3333-4444
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};
