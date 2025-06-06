
import * as XLSX from 'xlsx';
import { VM, DetalhamentoCusto } from '@/types';
import { CalculadoraCloud, formatCurrency, arredondar } from './calculadora';

export const exportarResumoExcel = (
  vms: VM[], 
  calculadora: CalculadoraCloud
) => {
  const wb = XLSX.utils.book_new();
  
  // Calcular totais
  const totalVcpus = vms.reduce((sum, vm) => sum + vm.vcpu, 0);
  const totalRam = vms.reduce((sum, vm) => sum + vm.ram, 0);
  const totalStorage = vms.reduce((sum, vm) => sum + vm.discoFCM + vm.discoSSD, 0);
  
  const custosVMs = vms.map(vm => calculadora.calcularVM(vm));
  const totalInfra = arredondar(custosVMs.reduce((sum, custo) => sum + custo.subtotalInfra, 0));
  const totalLicencas = arredondar(custosVMs.reduce((sum, custo) => sum + custo.subtotalLicencas, 0));
  const totalDesconto = arredondar(custosVMs.reduce((sum, custo) => sum + custo.descontoIndividual, 0));
  const totalGeral = arredondar(custosVMs.reduce((sum, custo) => sum + custo.total, 0));
  
  // Aba 1: Resumo Geral
  const resumoGeral = [
    ['RESUMO DE CUSTOS - CLOUD PRIVADA'],
    ['Data:', new Date().toLocaleDateString('pt-BR')],
    [''],
    ['TOTAIS GERAIS'],
    ['Quantidade de VMs:', vms.length],
    ['Total vCPUs:', totalVcpus],
    ['Total RAM (GB):', totalRam],
    ['Total Storage (GB):', totalStorage],
    [''],
    ['CUSTOS POR CATEGORIA'],
    ['Infraestrutura:', formatCurrency(totalInfra)],
    ['Licenciamento:', formatCurrency(totalLicencas)],
    ['Desconto Aplicado:', formatCurrency(totalDesconto)],
    ['TOTAL MENSAL:', formatCurrency(totalGeral)]
  ];
  
  // Aba 2: Detalhamento por VM
  const detalhamentoVMs = [
    ['VM', 'vCPU', 'RAM', 'Storage', 'SO', 'Infra', 'Licenças', 'Desconto', 'Total'],
    ...vms.map((vm, index) => {
      const custo = custosVMs[index];
      return [
        vm.nome,
        vm.vcpu,
        vm.ram,
        vm.discoFCM + vm.discoSSD,
        getSOName(vm),
        formatCurrency(custo.subtotalInfraOriginal),
        formatCurrency(custo.subtotalLicencas),
        `${vm.descontoIndividual || 0}%`,
        formatCurrency(custo.total)
      ];
    })
  ];
  
  // Aba 3: Breakdown de Custos
  const totalFCM = vms.reduce((sum, vm) => sum + vm.discoFCM, 0);
  const totalSSD = vms.reduce((sum, vm) => sum + vm.discoSSD, 0);
  const totalBackup = arredondar(custosVMs.reduce((sum, custo) => sum + custo.backup, 0));
  
  const breakdown = [
    ['BREAKDOWN DETALHADO DE CUSTOS'],
    [''],
    ['INFRAESTRUTURA'],
    ['Componente', 'Quantidade', 'Preço Unit.', 'Total'],
    ['vCPU (horas)', totalVcpus * 720, 'R$ 0,0347', formatCurrency(arredondar(totalVcpus * 0.0347 * 720))],
    ['RAM (GB/hora)', totalRam * 720, 'R$ 0,0278', formatCurrency(arredondar(totalRam * 0.0278 * 720))],
    ['Disco FCM (GB)', totalFCM, 'R$ 0,75', formatCurrency(arredondar(totalFCM * 0.75))],
    ['Disco SSD (GB)', totalSSD, 'R$ 0,55', formatCurrency(arredondar(totalSSD * 0.55))],
    ['Backup', totalStorage, 'Variável', formatCurrency(totalBackup)],
    ['Monitoramento', vms.length, 'R$ 100,00', formatCurrency(vms.length * 100)],
    [''],
    ['LICENCIAMENTO'],
    ['Software', 'Quantidade', 'Preço Unit.', 'Total'],
    ...gerarLinhasLicencas(vms)
  ];
  
  // Criar as abas
  const ws1 = XLSX.utils.aoa_to_sheet(resumoGeral);
  const ws2 = XLSX.utils.aoa_to_sheet(detalhamentoVMs);
  const ws3 = XLSX.utils.aoa_to_sheet(breakdown);
  
  XLSX.utils.book_append_sheet(wb, ws1, 'Resumo Geral');
  XLSX.utils.book_append_sheet(wb, ws2, 'VMs');
  XLSX.utils.book_append_sheet(wb, ws3, 'Breakdown');
  
  // Aplicar larguras
  ws1['!cols'] = [{ wch: 30 }, { wch: 20 }];
  ws2['!cols'] = Array(9).fill({ wch: 15 });
  ws3['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
  
  // Exportar
  XLSX.writeFile(wb, `resumo-custos-cloud-${new Date().toISOString().split('T')[0]}.xlsx`);
};

const getSOName = (vm: VM): string => {
  if (vm.windowsServer) return 'Windows Server';
  if (vm.rhel) return 'RHEL';
  if (vm.suse) return 'SUSE';
  if (vm.redhat) return 'Red Hat';
  return 'Linux';
};

const gerarLinhasLicencas = (vms: VM[]): string[][] => {
  const licencas: string[][] = [];
  
  vms.forEach(vm => {
    if (vm.windowsServer) {
      const qtd = Math.ceil(vm.vcpu / 2);
      licencas.push([`Windows Server (${vm.nome})`, qtd.toString(), 'R$ 55,00', formatCurrency(qtd * 55)]);
    }
    if (vm.sqlServerSTD) {
      const qtd = Math.ceil(vm.vcpu / 2);
      licencas.push([`SQL Server STD (${vm.nome})`, qtd.toString(), 'R$ 1.450,00', formatCurrency(qtd * 1450)]);
    }
    if (vm.rhel) {
      licencas.push([`RHEL (${vm.nome})`, '1', 'R$ 1.200,00', 'R$ 1.200,00']);
    }
    if (vm.suse) {
      licencas.push([`SUSE (${vm.nome})`, '1', 'R$ 900,00', 'R$ 900,00']);
    }
    if (vm.antivirus) {
      licencas.push([`Antivírus (${vm.nome})`, '1', 'R$ 55,00', 'R$ 55,00']);
    }
    if (vm.tsplus.enabled) {
      licencas.push([`TSPlus ${vm.tsplus.usuarios} users (${vm.nome})`, '1', formatCurrency(getTSplusPrice(vm.tsplus.usuarios)), formatCurrency(getTSplusPrice(vm.tsplus.usuarios))]);
    }
  });
  
  return licencas;
};

const getTSplusPrice = (usuarios: 3 | 5 | 10 | 15 | 25 | 35 | 49 | 'ilimitado'): number => {
  const precos = {
    3: 140,
    5: 180,
    10: 310,
    15: 390,
    25: 550,
    35: 730,
    49: 990,
    ilimitado: 1190
  };
  return precos[usuarios];
};
