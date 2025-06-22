import jsPDF from 'jspdf';
import { CalculadoraCloud, formatCurrency } from './calculadora';
import { VM } from '@/types';

export interface PDFData {
  tipo: 'vm' | 'pool' | 'upgrades';
  vms?: VM[];
  pool?: any;
  upgrades?: any[];
  total?: number;
  calculadora?: CalculadoraCloud;
  descontos?: any[];
}

export const gerarPDFProposta = (data: PDFData) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  const margin = 20;
  let yPosition = 30;

  // Header da empresa
  pdf.setFontSize(20);
  pdf.setTextColor(0, 102, 204); // Azul Optidata
  pdf.text('OPTIDATA', margin, yPosition);
  
  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  pdf.text('Cloud Computing Solutions', margin, yPosition + 8);

  // Linha separadora
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, yPosition + 15, pageWidth - margin, yPosition + 15);

  yPosition += 30;

  // Título da proposta
  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 0);
  let titulo = '';
  if (data.tipo === 'vm') titulo = 'VMs INDIVIDUAIS';
  else if (data.tipo === 'pool') titulo = 'POOL DE RECURSOS';
  else if (data.tipo === 'upgrades') titulo = 'UPGRADES E SERVIÇOS AVULSOS';
  
  pdf.text(`PROPOSTA COMERCIAL - ${titulo}`, margin, yPosition);

  yPosition += 20;

  if (data.tipo === 'vm' && data.vms && data.calculadora) {
    gerarSecaoVMs(pdf, data.vms, data.calculadora, data.descontos || [], margin, yPosition);
  } else if (data.tipo === 'pool' && data.pool) {
    gerarSecaoPool(pdf, data.pool, margin, yPosition);
  } else if (data.tipo === 'upgrades' && data.upgrades) {
    gerarSecaoUpgrades(pdf, data.upgrades, data.total || 0, margin, yPosition);
  }

  // Rodapé
  const dataAtual = new Date().toLocaleDateString('pt-BR');
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Proposta gerada em ${dataAtual}`, margin, pdf.internal.pageSize.height - 20);
  pdf.text('Optidata Cloud Computing - www.optidata.com.br', pageWidth - margin - 80, pdf.internal.pageSize.height - 20);

  // Download do PDF
  let nomeArquivo = '';
  if (data.tipo === 'vm') nomeArquivo = 'Proposta_Optidata_VMs';
  else if (data.tipo === 'pool') nomeArquivo = 'Proposta_Optidata_Pool';
  else if (data.tipo === 'upgrades') nomeArquivo = 'Proposta_Optidata_Upgrades';
  
  nomeArquivo += `_${dataAtual.replace(/\//g, '-')}.pdf`;
  pdf.save(nomeArquivo);
};

// Função específica para upgrades melhorada
const gerarSecaoUpgrades = (pdf: jsPDF, upgrades: any[], total: number, margin: number, startY: number) => {
  let yPos = startY;
  const pageWidth = pdf.internal.pageSize.width;

  // Calcular desconto
  const calcularDesconto = (valor: number) => {
    if (valor > 10000) return 0.10;
    if (valor > 5000) return 0.05;
    if (valor > 2000) return 0.03;
    return 0;
  };

  const desconto = calcularDesconto(total);
  const valorDesconto = total * desconto;
  const totalFinal = total - valorDesconto;

  // Resumo geral
  pdf.setFontSize(14);
  pdf.setTextColor(0, 102, 204);
  pdf.text('RESUMO EXECUTIVO', margin, yPos);
  yPos += 15;

  // Box do total com melhor design
  pdf.setFillColor(240, 248, 255);
  pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, 35, 3, 3, 'F');
  
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Total de Itens: ${upgrades.length}`, margin + 10, yPos + 12);
  pdf.text(`Subtotal: ${formatCurrency(total)}`, margin + 10, yPos + 22);
  
  if (desconto > 0) {
    pdf.setTextColor(0, 150, 0);
    pdf.text(`Desconto (${(desconto * 100).toFixed(0)}%): -${formatCurrency(valorDesconto)}`, margin + 10, yPos + 32);
    pdf.setFontSize(14);
    pdf.setTextColor(220, 174, 29);
    pdf.text(`TOTAL FINAL: ${formatCurrency(totalFinal)}`, pageWidth - margin - 100, yPos + 25);
  } else {
    pdf.setFontSize(14);
    pdf.setTextColor(220, 174, 29);
    pdf.text(`TOTAL: ${formatCurrency(total)}`, pageWidth - margin - 80, yPos + 20);
  }

  yPos += 45;

  // Detalhamento por categoria
  const categoriaMap: Record<string, string> = {
    computacional: '💻 Recursos Computacionais',
    storage: '💾 Armazenamento',
    rede: '🌐 Rede & Conectividade',
    seguranca: '🛡️ Segurança',
    licenca: '🪟 Licenças'
  };

  const categorias = [...new Set(upgrades.map(item => item.categoria))];

  categorias.forEach(categoria => {
    const itensCategoria = upgrades.filter(item => item.categoria === categoria);
    
    if (itensCategoria.length > 0) {
      if (yPos > pdf.internal.pageSize.height - 80) {
        pdf.addPage();
        yPos = 30;
      }

      pdf.setFontSize(14);
      pdf.setTextColor(0, 102, 204);
      pdf.text(categoriaMap[categoria] || categoria.toUpperCase(), margin, yPos);
      yPos += 12;

      itensCategoria.forEach((item) => {
        if (yPos > pdf.internal.pageSize.height - 40) {
          pdf.addPage();
          yPos = 30;
        }

        // Nome do item
        pdf.setFontSize(11);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`• ${item.nome}`, margin + 5, yPos);
        yPos += 6;

        // Descrição
        pdf.setFontSize(9);
        pdf.setTextColor(80, 80, 80);
        const descricaoLines = pdf.splitTextToSize(`  ${item.descricao}`, pageWidth - margin * 2 - 10);
        pdf.text(descricaoLines, margin + 10, yPos);
        yPos += descricaoLines.length * 4;

        // Detalhes comerciais
        pdf.setFontSize(10);
        pdf.setTextColor(0, 102, 204);
        pdf.text(`  Quantidade: ${item.quantidade} | Preço unitário: ${formatCurrency(item.preco)}`, margin + 10, yPos);
        pdf.setTextColor(220, 174, 29);
        pdf.text(`Subtotal: ${formatCurrency(item.preco * item.quantidade)}`, pageWidth - margin - 80, yPos);
        
        yPos += 10;
      });

      yPos += 5;
    }
  });

  // Projeção de contrato
  yPos += 10;
  if (yPos > pdf.internal.pageSize.height - 80) {
    pdf.addPage();
    yPos = 30;
  }

  pdf.setFontSize(14);
  pdf.setTextColor(0, 102, 204);
  pdf.text('PROJEÇÃO DE INVESTIMENTO', margin, yPos);
  yPos += 15;

  const projecoes = [
    { periodo: '12 meses', valor: totalFinal * 12, economia: desconto > 0 ? valorDesconto * 12 : 0 },
    { periodo: '24 meses', valor: totalFinal * 24, economia: desconto > 0 ? valorDesconto * 24 : 0 },
    { periodo: '36 meses', valor: totalFinal * 36, economia: desconto > 0 ? valorDesconto * 36 : 0 }
  ];

  projecoes.forEach(projecao => {
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${projecao.periodo}: ${formatCurrency(projecao.valor)}`, margin + 10, yPos);
    
    if (projecao.economia > 0) {
      pdf.setTextColor(0, 150, 0);
      pdf.text(`(Economia: ${formatCurrency(projecao.economia)})`, margin + 100, yPos);
    }
    
    yPos += 8;
  });

  // Observações comerciais
  yPos += 15;
  if (yPos > pdf.internal.pageSize.height - 60) {
    pdf.addPage();
    yPos = 30;
  }

  pdf.setFontSize(12);
  pdf.setTextColor(0, 102, 204);
  pdf.text('OBSERVAÇÕES COMERCIAIS', margin, yPos);
  yPos += 12;

  const observacoes = [
    '• Valores expressos em reais (BRL), válidos por 15 dias',
    '• Implementação sem custo adicional para pedidos acima de R$ 2.000',
    '• Suporte técnico 24x7 incluso em todos os serviços',
    '• Desconto progressivo para contratos anuais',
    '• Migração assistida sem interrupção de serviços'
  ];

  pdf.setFontSize(10);
  pdf.setTextColor(60, 60, 60);
  observacoes.forEach(obs => {
    pdf.text(obs, margin + 5, yPos);
    yPos += 6;
  });
};

const gerarSecaoVMs = (pdf: jsPDF, vms: VM[], calculadora: CalculadoraCloud, descontos: any[], margin: number, startY: number) => {
  let yPos = startY;
  const pageWidth = pdf.internal.pageSize.width;

  // Resumo geral
  const resultado = calculadora.calcularTotalGeral(vms, descontos);
  
  pdf.setFontSize(14);
  pdf.setTextColor(0, 102, 204);
  pdf.text('RESUMO EXECUTIVO', margin, yPos);
  yPos += 15;

  // Box do total
  pdf.setFillColor(240, 248, 255);
  pdf.rect(margin, yPos, pageWidth - 2 * margin, 25, 'F');
  
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Total de VMs: ${vms.length}`, margin + 10, yPos + 10);
  pdf.text(`Valor Total Mensal: ${formatCurrency(resultado.totalComDesconto)}`, margin + 10, yPos + 20);
  
  if (resultado.economia > 0) {
    pdf.setTextColor(0, 150, 0);
    pdf.text(`Economia Aplicada: ${formatCurrency(resultado.economia)}`, pageWidth - margin - 80, yPos + 15);
  }

  yPos += 35;

  // Detalhamento por VM
  pdf.setFontSize(14);
  pdf.setTextColor(0, 102, 204);
  pdf.text('DETALHAMENTO POR VM', margin, yPos);
  yPos += 15;

  resultado.vms.forEach((vmResult, index) => {
    if (yPos > pdf.internal.pageSize.height - 60) {
      pdf.addPage();
      yPos = 30;
    }

    const vm = vmResult.vm;
    const custo = vmResult.custo;

    // Nome da VM
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${index + 1}. ${vm.nome}`, margin, yPos);
    yPos += 8;

    // Configuração
    pdf.setFontSize(10);
    pdf.setTextColor(80, 80, 80);
    pdf.text(`Configuração: ${vm.vcpu} vCPU | ${vm.ram}GB RAM | ${vm.discoFCM + vm.discoSSD}GB Storage`, margin + 10, yPos);
    yPos += 6;

    // Custo
    pdf.setTextColor(0, 102, 204);
    pdf.text(`Custo Mensal: ${formatCurrency(custo.total)}`, margin + 10, yPos);
    yPos += 6;

    // Breakdown de custos
    if (custo.vcpu + custo.ram > 0) {
      pdf.setTextColor(80, 80, 80);
      pdf.text(`• Computação: ${formatCurrency(custo.vcpu + custo.ram)}`, margin + 20, yPos);
      yPos += 5;
    }
    if (custo.storage > 0) {
      pdf.text(`• Storage: ${formatCurrency(custo.storage)}`, margin + 20, yPos);
      yPos += 5;
    }
    if (custo.subtotalLicencas > 0) {
      pdf.text(`• Licenças: ${formatCurrency(custo.subtotalLicencas)}`, margin + 20, yPos);
      yPos += 5;
    }

    yPos += 8;
  });

  // TCO
  yPos += 10;
  pdf.setFontSize(14);
  pdf.setTextColor(0, 102, 204);
  pdf.text('PROJEÇÃO TCO (Total Cost of Ownership)', margin, yPos);
  yPos += 15;

  const tcoData = [
    { periodo: '12 meses', valor: resultado.totalComDesconto * 12 },
    { periodo: '36 meses', valor: resultado.totalComDesconto * 36 },
    { periodo: '60 meses', valor: resultado.totalComDesconto * 60 }
  ];

  tcoData.forEach(item => {
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${item.periodo}: ${formatCurrency(item.valor)}`, margin + 10, yPos);
    yPos += 8;
  });
};

const gerarSecaoPool = (pdf: jsPDF, pool: any, margin: number, startY: number) => {
  let yPos = startY;
  const pageWidth = pdf.internal.pageSize.width;

  // Cálculo dos custos do pool
  const custos = calcularCustosPool(pool);

  // Resumo geral
  pdf.setFontSize(14);
  pdf.setTextColor(0, 102, 204);
  pdf.text('RESUMO DO POOL DE RECURSOS', margin, yPos);
  yPos += 15;

  // Box do total
  pdf.setFillColor(240, 248, 255);
  pdf.rect(margin, yPos, pageWidth - 2 * margin, 25, 'F');
  
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`VMs Monitoradas: ${pool.quantidadeMonitoramento}`, margin + 10, yPos + 10);
  pdf.text(`Valor Total Mensal: ${formatCurrency(custos.total)}`, margin + 10, yPos + 20);
  
  if (custos.desconto > 0) {
    pdf.setTextColor(0, 150, 0);
    pdf.text(`Economia: ${formatCurrency(custos.desconto)}`, pageWidth - margin - 60, yPos + 15);
  }

  yPos += 35;

  // Recursos totais
  pdf.setFontSize(14);
  pdf.setTextColor(0, 102, 204);
  pdf.text('RECURSOS TOTAIS', margin, yPos);
  yPos += 15;

  const recursos = [
    `vCPUs: ${pool.vcpu} cores`,
    `RAM: ${pool.ram} GB`,
    `Storage SSD: ${pool.storageSSD} GB`,
    `Storage FCM: ${pool.storageFCM} GB`,
    `Backup: ${pool.backupType}`,
    `IPs Adicionais: ${pool.ipsAdicionais}`
  ];

  recursos.forEach(recurso => {
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`• ${recurso}`, margin + 10, yPos);
    yPos += 7;
  });

  yPos += 10;

  // Breakdown de custos
  pdf.setFontSize(14);
  pdf.setTextColor(0, 102, 204);
  pdf.text('BREAKDOWN DE CUSTOS', margin, yPos);
  yPos += 15;

  const breakdown = [
    { item: 'Infraestrutura', valor: custos.infraestrutura },
    { item: 'Desconto', valor: -custos.desconto },
    { item: 'Licenciamento', valor: custos.licencas }
  ];

  breakdown.forEach(item => {
    pdf.setFontSize(11);
    pdf.setTextColor(item.valor < 0 ? 0 : 0, item.valor < 0 ? 150 : 0, 0);
    pdf.text(`${item.item}: ${formatCurrency(Math.abs(item.valor))}${item.valor < 0 ? ' (desconto)' : ''}`, margin + 10, yPos);
    yPos += 8;
  });
};

const calcularCustosPool = (pool: any) => {
  let infraestrutura = 0;
  let licencas = 0;

  // Computação
  infraestrutura += pool.vcpu * 0.0347 * 720;
  infraestrutura += pool.ram * 0.0278 * 720;

  // Storage + Backup
  const backupMultiplier: Record<string, number> = {
    padrao: 1,
    duplo: 1.5,
    triplo: 2
  };
  infraestrutura += pool.storageSSD * 0.55 * backupMultiplier[pool.backupType];
  infraestrutura += pool.storageFCM * 0.75 * backupMultiplier[pool.backupType];

  // Monitoramento
  infraestrutura += pool.quantidadeMonitoramento * 100;

  // Sistemas Operacionais
  if (pool.quantidadeWindows > 0) {
    const licencasWindows = Math.ceil(pool.vcpu / 2);
    licencas += licencasWindows * 55;
  }
  licencas += pool.quantidadeRHEL * 1200;
  licencas += pool.quantidadeSUSE * 900;

  // Licenças adicionais
  licencas += pool.quantidadeAntivirus * 55;
  
  // SQL Server
  if (pool.quantidadeSQL > 0) {
    const vcpuPorVM = Math.floor(pool.vcpu / (pool.quantidadeMonitoramento || 1));
    const licencasPorVM = Math.ceil(vcpuPorVM / 2);
    licencas += pool.quantidadeSQL * licencasPorVM * 800;
  }

  // IPs
  infraestrutura += pool.ipsAdicionais * 70;

  // Aplicar desconto apenas na infraestrutura
  const descontoValor = infraestrutura * (pool.desconto / 100);
  const totalInfra = infraestrutura - descontoValor;

  return {
    infraestrutura,
    licencas,
    desconto: descontoValor,
    totalInfra,
    total: totalInfra + licencas
  };
};
