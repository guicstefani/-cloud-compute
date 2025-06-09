
import * as XLSX from 'xlsx';
import { VM, DetalhamentoCusto } from '@/types';
import { CalculadoraCloud, formatCurrency } from './calculadora';
import { todosSistemasOperacionais, todosBancosDados } from '@/data/sistemasOperacionais';

export interface ExportData {
  vms: Array<{
    vm: VM;
    custo: DetalhamentoCusto;
  }>;
  totalGeral: number;
  economia: number;
  calculadora: CalculadoraCloud;
}

export const exportToExcel = (data: ExportData) => {
  // Planilha 1: Resumo Executivo
  const resumoData = [
    ['RESUMO EXECUTIVO'],
    [''],
    ['Quantidade de VMs', data.vms.length],
    ['Total Mensal (com descontos)', formatCurrency(data.totalGeral)],
    ['Economia Total', formatCurrency(data.economia)],
    [''],
    ['TCO - 12 meses', formatCurrency(data.totalGeral * 12)],
    ['TCO - 36 meses', formatCurrency(data.totalGeral * 36)],
    ['TCO - 60 meses', formatCurrency(data.totalGeral * 60)],
  ];

  // Planilha 2: Detalhamento por VM
  const vmHeaders = [
    'Nome da VM',
    'vCPU',
    'RAM (GB)',
    'Disco FCM (GB)',
    'Disco SSD (GB)',
    'Backup',
    'Sistema Operacional',
    'Banco de Dados',
    'Antivirus',
    'TSPlus',
    'ThinPrint',
    'IPs Adicionais',
    'WAF',
    'Custo Computação',
    'Custo Storage',
    'Custo Backup',
    'Custo Licenças',
    'Total Mensal'
  ];

  const vmData = data.vms.map(({ vm, custo }) => {
    // Obter nomes dos sistemas e bancos
    const sistemaOperacional = todosSistemasOperacionais.find(so => so.id === vm.sistemaOperacional);
    const bancoDados = todosBancosDados.find(bd => bd.id === vm.bancoDados);

    return [
      vm.nome,
      vm.vcpu,
      vm.ram,
      vm.discoFCM,
      vm.discoSSD,
      vm.backupTipo,
      sistemaOperacional?.nome || 'Nenhum',
      bancoDados?.nome || 'Nenhum',
      vm.antivirus ? 'Sim' : 'Não',
      vm.tsplus.enabled ? `${vm.tsplus.usuarios} usuários` : 'Não',
      vm.thinprint ? 'Sim' : 'Não',
      vm.ipsAdicionais || 0,
      vm.waf !== 'none' ? vm.waf : 'Nenhum',
      formatCurrency(custo.vcpu + custo.ram),
      formatCurrency(custo.storage),
      formatCurrency(custo.backup),
      formatCurrency(custo.subtotalLicencas),
      formatCurrency(custo.total)
    ];
  });

  // Planilha 3: Breakdown de Custos
  const breakdownData = [
    ['BREAKDOWN DE CUSTOS POR CATEGORIA'],
    [''],
    ['Categoria', 'Valor Total'],
  ];

  const categorias = data.vms.reduce((acc, { custo }) => {
    acc.computacao += custo.vcpu + custo.ram;
    acc.storage += custo.storage;
    acc.backup += custo.backup;
    acc.monitoramento += custo.monitoramento;
    acc.licencas += custo.subtotalLicencas;
    return acc;
  }, {
    computacao: 0,
    storage: 0,
    backup: 0,
    monitoramento: 0,
    licencas: 0
  });

  breakdownData.push(
    ['Computação (vCPU + RAM)', formatCurrency(categorias.computacao)],
    ['Storage', formatCurrency(categorias.storage)],
    ['Backup', formatCurrency(categorias.backup)],
    ['Monitoramento', formatCurrency(categorias.monitoramento)],
    ['Licenças', formatCurrency(categorias.licencas)],
    [''],
    ['TOTAL', formatCurrency(data.totalGeral)]
  );

  // Criar workbook
  const wb = XLSX.utils.book_new();

  // Adicionar planilhas
  const wsResumo = XLSX.utils.aoa_to_sheet(resumoData);
  const wsVMs = XLSX.utils.aoa_to_sheet([vmHeaders, ...vmData]);
  const wsBreakdown = XLSX.utils.aoa_to_sheet(breakdownData);

  XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo Executivo');
  XLSX.utils.book_append_sheet(wb, wsVMs, 'Detalhamento VMs');
  XLSX.utils.book_append_sheet(wb, wsBreakdown, 'Breakdown Custos');

  // Aplicar formatação básica
  const range = XLSX.utils.decode_range(wsVMs['!ref'] || 'A1');
  wsVMs['!cols'] = Array(range.e.c - range.s.c + 1).fill({ wch: 15 });

  // Gerar e baixar arquivo
  const fileName = `calculadora-cloud-${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
};

export const exportToCSV = (data: ExportData) => {
  const headers = [
    'Nome da VM',
    'vCPU',
    'RAM (GB)',
    'Storage Total (GB)',
    'Sistema Operacional',
    'Banco de Dados',
    'Custo Total (R$)'
  ];

  const csvData = data.vms.map(({ vm, custo }) => {
    const sistemaOperacional = todosSistemasOperacionais.find(so => so.id === vm.sistemaOperacional);
    const bancoDados = todosBancosDados.find(bd => bd.id === vm.bancoDados);

    return [
      vm.nome,
      vm.vcpu,
      vm.ram,
      vm.discoFCM + vm.discoSSD,
      sistemaOperacional?.nome || 'Nenhum',
      bancoDados?.nome || 'Nenhum',
      custo.total.toFixed(2)
    ];
  });

  const csvContent = [headers, ...csvData]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `calculadora-cloud-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Função auxiliar para gerar relatório JSON
export const exportToJSON = (data: ExportData) => {
  const exportData = {
    metadata: {
      exportDate: new Date().toISOString(),
      totalVMs: data.vms.length,
      totalMensal: data.totalGeral,
      economia: data.economia
    },
    vms: data.vms.map(({ vm, custo }) => ({
      configuracao: {
        nome: vm.nome,
        vcpu: vm.vcpu,
        ram: vm.ram,
        storage: {
          fcm: vm.discoFCM,
          ssd: vm.discoSSD,
          total: vm.discoFCM + vm.discoSSD
        },
        sistemaOperacional: vm.sistemaOperacional,
        bancoDados: vm.bancoDados || null,
        licencas: {
          antivirus: vm.antivirus,
          tsplus: vm.tsplus.enabled ? vm.tsplus : null,
          thinprint: vm.thinprint,
          waf: vm.waf !== 'none' ? vm.waf : null
        }
      },
      custos: {
        computacao: custo.vcpu + custo.ram,
        storage: custo.storage,
        backup: custo.backup,
        monitoramento: custo.monitoramento,
        licencas: custo.subtotalLicencas,
        total: custo.total
      }
    })),
    tco: {
      mensal: data.totalGeral,
      anual: data.totalGeral * 12,
      trienio: data.totalGeral * 36,
      quinquenio: data.totalGeral * 60
    }
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `calculadora-cloud-${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
