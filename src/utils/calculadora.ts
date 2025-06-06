
import { VM, Precos, DetalhamentoCusto, Desconto } from '@/types';

export class CalculadoraCloud {
  constructor(private precos: Precos) {}

  calcularVM(vm: VM): DetalhamentoCusto {
    // Infraestrutura
    const vcpu = vm.vcpu * this.precos.vcpuHora * this.precos.horasMes;
    const ram = vm.ram * this.precos.ramHora * this.precos.horasMes;
    
    // Storage
    const storage = this.calcularStorage(vm);
    
    // Backup
    const backup = this.calcularBackup(vm);
    
    // Monitoramento (sempre incluído)
    const monitoramento = this.precos.monitoramento;
    
    // Licenças
    const licencas = this.calcularLicencas(vm);

    // Subtotal infraestrutura ANTES do desconto individual
    const subtotalInfraOriginal = vcpu + ram + storage + backup + monitoramento;
    
    // Aplicar desconto individual APENAS na infraestrutura
    const descontoIndividual = subtotalInfraOriginal * (vm.descontoIndividual || 0) / 100;
    const subtotalInfra = subtotalInfraOriginal - descontoIndividual;
    
    const subtotalLicencas = Object.values(licencas).reduce((a, b) => a + b, 0);
    const total = subtotalInfra + subtotalLicencas;

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
    return (vm.discoFCM * this.precos.fcmGB) + (vm.discoSSD * this.precos.ssdGB);
  }

  private calcularBackup(vm: VM): number {
    const storageTotal = vm.discoFCM + vm.discoSSD;
    let custoBackup = storageTotal * this.precos.backupPadrao;
    
    if (vm.backupTipo === 'duplo') {
      custoBackup += storageTotal * this.precos.backupDuplo;
    } else if (vm.backupTipo === 'triplo') {
      custoBackup += storageTotal * (this.precos.backupDuplo + this.precos.backupTriplo);
    }
    
    return custoBackup;
  }

  private calcularLicencas(vm: VM): Record<string, number> {
    const licencas: Record<string, number> = {};
    
    // Windows Server: licenciado a cada 2 vCPUs (assim como SQL Server)
    if (vm.windowsServer) {
      const licencasWindows = Math.ceil(vm.vcpu / 2);
      licencas.windows = licencasWindows * this.precos.windowsServer;
      
      // SQL Server só funciona com Windows
      if (vm.sqlServerSTD) {
        const coresSQL = Math.ceil(vm.vcpu / 2);
        licencas.sqlSTD = coresSQL * this.precos.sqlServerSTD;
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
    if (vm.rhel) licencas.rhel = this.precos.rhel; // Novo: RHEL
    
    if (vm.ipsAdicionais > 0) {
      licencas.ips = vm.ipsAdicionais * this.precos.ipAdicional;
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
        const valor = (custo.total * desconto.valor) / 100;
        custoComDesconto.total -= valor;
      } else if (desconto.tipo === 'categoria') {
        if (desconto.categoria === 'infraestrutura') {
          const valor = (custo.subtotalInfra * desconto.valor) / 100;
          custoComDesconto.subtotalInfra -= valor;
          custoComDesconto.total -= valor;
        } else if (desconto.categoria === 'licencas') {
          const valor = (custo.subtotalLicencas * desconto.valor) / 100;
          custoComDesconto.subtotalLicencas -= valor;
          custoComDesconto.total -= valor;
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

    const totalSemDesconto = vmsCustos.reduce((total, item) => {
      const custoOriginal = this.calcularVM(item.vm);
      return total + custoOriginal.total;
    }, 0);

    const totalComDesconto = vmsCustos.reduce((total, item) => 
      total + item.custo.total, 0);

    const economia = totalSemDesconto - totalComDesconto;

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
