
import { VM, Precos, DetalhamentoCusto, Desconto } from '@/types';

// Função de arredondamento para 2 casas decimais
const arredondar = (valor: number): number => {
  return Math.round(valor * 100) / 100;
};

export class CalculadoraCloud {
  constructor(private precos: Precos) {}

  calcularVM(vm: VM): DetalhamentoCusto {
    // Infraestrutura - cálculo preciso sem arredondamento intermediário
    const vcpuCalculo = vm.vcpu * this.precos.vcpuHora * this.precos.horasMes;
    const ramCalculo = vm.ram * this.precos.ramHora * this.precos.horasMes;
    
    // Arredondar apenas no final de cada cálculo
    const vcpu = arredondar(vcpuCalculo);
    const ram = arredondar(ramCalculo);
    
    // Storage
    const storage = this.calcularStorage(vm);
    
    // Backup
    const backup = this.calcularBackup(vm);
    
    // Monitoramento (sempre incluído)
    const monitoramento = this.precos.monitoramento;
    
    // Licenças
    const licencas = this.calcularLicencas(vm);

    // Subtotal infraestrutura ANTES do desconto individual
    const subtotalInfraOriginal = arredondar(vcpu + ram + storage + backup + monitoramento);
    
    // Aplicar desconto individual APENAS na infraestrutura
    const descontoIndividual = arredondar(subtotalInfraOriginal * (vm.descontoIndividual || 0) / 100);
    const subtotalInfra = arredondar(subtotalInfraOriginal - descontoIndividual);
    
    const subtotalLicencas = arredondar(Object.values(licencas).reduce((a, b) => a + b, 0));
    const total = arredondar(subtotalInfra + subtotalLicencas);

    return {
      vcpu,
      ram,
      storage,
      backup,
      monitoramento,
      licencas,
      subtotalInfra,
      subtotalInfraOriginal,
      subtotalLicencas,
      descontoIndividual,
      total
    };
  }

  private calcularStorage(vm: VM): number {
    const fcmCusto = vm.discoFCM * this.precos.fcmGB;
    const ssdCusto = vm.discoSSD * this.precos.ssdGB;
    return arredondar(fcmCusto + ssdCusto);
  }

  private calcularBackup(vm: VM): number {
    const storageTotal = vm.discoFCM + vm.discoSSD;
    let custoBackup = storageTotal * this.precos.backupPadrao;
    
    if (vm.backupTipo === 'duplo') {
      custoBackup = custoBackup + (storageTotal * this.precos.backupDuplo);
    } else if (vm.backupTipo === 'triplo') {
      custoBackup = custoBackup + (storageTotal * (this.precos.backupDuplo + this.precos.backupTriplo));
    }
    
    return arredondar(custoBackup);
  }

  private calcularLicencas(vm: VM): Record<string, number> {
    const licencas: Record<string, number> = {};
    
    // Windows Server: licenciado a cada 2 vCPUs (assim como SQL Server)
    if (vm.windowsServer) {
      const licencasWindows = Math.ceil(vm.vcpu / 2);
      licencas.windows = arredondar(licencasWindows * this.precos.windowsServer);
      
      // SQL Server só funciona com Windows
      if (vm.sqlServerSTD) {
        const coresSQL = Math.ceil(vm.vcpu / 2);
        licencas.sqlSTD = arredondar(coresSQL * this.precos.sqlServerSTD);
      }
    }
    
    if (vm.antivirus) licencas.antivirus = this.precos.antivirus;
    if (vm.sqlServerWEB) licencas.sqlWEB = this.precos.sqlServerWEB;
    
    // TSPlus
    if (vm.tsplus.enabled) {
      licencas.tsplus = this.precos.tsplus[vm.tsplus.usuarios];
      if (vm.tsplus.advancedSecurity) {
        licencas.tsplusAdvSec = this.precos.tsplusAdvSec;
      }
      if (vm.tsplus.twoFactor) {
        licencas.tsplus2FA = this.precos.tsplus2FA;
      }
    }
    
    // Outras licenças
    if (vm.thinprint) licencas.thinprint = this.precos.thinprint;
    if (vm.hana) licencas.hana = this.precos.hana;
    if (vm.suse) licencas.suse = this.precos.suse;
    if (vm.redhat) licencas.redhat = this.precos.redhat;
    if (vm.rhel) licencas.rhel = this.precos.rhel;
    
    if (vm.ipsAdicionais > 0) {
      licencas.ips = arredondar(vm.ipsAdicionais * this.precos.ipAdicional);
    }
    
    if (vm.waf !== 'none') {
      licencas.waf = this.precos.waf[vm.waf];
    }
    
    return licencas;
  }

  aplicarDescontos(custo: DetalhamentoCusto, descontos: Desconto[]): DetalhamentoCusto {
    const descontosAtivos = descontos.filter(d => d.ativo);
    
    let custoComDesconto = { ...custo };
    
    for (const desconto of descontosAtivos) {
      if (desconto.tipo === 'global') {
        const valor = arredondar((custo.total * desconto.valor) / 100);
        custoComDesconto.total = arredondar(custoComDesconto.total - valor);
      } else if (desconto.tipo === 'categoria') {
        if (desconto.categoria === 'infraestrutura') {
          const valor = arredondar((custo.subtotalInfra * desconto.valor) / 100);
          custoComDesconto.subtotalInfra = arredondar(custoComDesconto.subtotalInfra - valor);
          custoComDesconto.total = arredondar(custoComDesconto.total - valor);
        } else if (desconto.categoria === 'licencas') {
          const valor = arredondar((custo.subtotalLicencas * desconto.valor) / 100);
          custoComDesconto.subtotalLicencas = arredondar(custoComDesconto.subtotalLicencas - valor);
          custoComDesconto.total = arredondar(custoComDesconto.total - valor);
        }
      }
    }
    
    return custoComDesconto;
  }

  calcularTotalGeral(vms: VM[], descontos: Desconto[]): {
    vms: Array<{ vm: VM; custo: DetalhamentoCusto }>;
    totalSemDesconto: number;
    totalComDesconto: number;
    economia: number;
  } {
    const vmsCustos = vms.map(vm => ({
      vm,
      custo: this.aplicarDescontos(this.calcularVM(vm), descontos)
    }));

    const totalSemDesconto = arredondar(vmsCustos.reduce((total, item) => {
      const custoOriginal = this.calcularVM(item.vm);
      return total + custoOriginal.total;
    }, 0));

    const totalComDesconto = arredondar(vmsCustos.reduce((total, item) => 
      total + item.custo.total, 0));

    const economia = arredondar(totalSemDesconto - totalComDesconto);

    return {
      vms: vmsCustos,
      totalSemDesconto,
      totalComDesconto,
      economia
    };
  }
}

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

// Função auxiliar para arredondamento público - exportando a função interna
export { arredondar };
