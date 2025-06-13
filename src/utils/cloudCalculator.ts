
import { CLOUD_PRICING } from './cloudPricing';
import { VMSpec, ComparisonResult, CloudProvider } from '@/types/cloudComparison';

export class CloudCalculator {
  private optidataCost: number;
  private vmSpecs: VMSpec[];

  constructor(optidataCost: number, vmSpecs: VMSpec[]) {
    this.optidataCost = optidataCost;
    this.vmSpecs = vmSpecs;
  }

  calculateAllProviders(): ComparisonResult[] {
    const results: ComparisonResult[] = [];

    Object.entries(CLOUD_PRICING).forEach(([key, provider]) => {
      const totalCost = this.calculateProviderCost(provider);
      const savings = this.calculateSavings(totalCost);

      results.push({
        provider: key,
        name: provider.name,
        totalCost,
        breakdown: this.getDetailedBreakdown(provider),
        savings,
        color: provider.color,
        logo: provider.logo
      });
    });

    // Ordena por menor custo
    return results.sort((a, b) => a.totalCost - b.totalCost);
  }

  private calculateProviderCost(provider: CloudProvider): number {
    let totalCost = 0;

    this.vmSpecs.forEach(vm => {
      // Custo de compute (vCPU + RAM)
      const computeCost = 
        (vm.vcpu * provider.compute.vcpuPerMonth) +
        (vm.ram * provider.compute.ramPerGBMonth);

      // Custo de storage
      const storageCost = vm.storage * provider.storage.pricePerGBMonth;

      // Custo do Windows (se aplicável)
      let windowsCost = 0;
      if (vm.hasWindows && !provider.windows.included) {
        if (provider.windows.additionalCostPerVcpu) {
          windowsCost = vm.vcpu * provider.windows.additionalCostPerVcpu;
        } else if (provider.windows.additionalCost) {
          windowsCost = provider.windows.additionalCost;
        }
      }

      totalCost += computeCost + storageCost + windowsCost;
    });

    return Math.round(totalCost * 100) / 100; // Arredonda para 2 casas
  }

  private getDetailedBreakdown(provider: CloudProvider) {
    let compute = 0, storage = 0, windows = 0;

    this.vmSpecs.forEach(vm => {
      compute += (vm.vcpu * provider.compute.vcpuPerMonth) + 
                 (vm.ram * provider.compute.ramPerGBMonth);
      
      storage += vm.storage * provider.storage.pricePerGBMonth;
      
      if (vm.hasWindows && !provider.windows.included) {
        if (provider.windows.additionalCostPerVcpu) {
          windows += vm.vcpu * provider.windows.additionalCostPerVcpu;
        }
      }
    });

    const total = compute + storage + windows;

    return {
      compute: Math.round(compute * 100) / 100,
      storage: Math.round(storage * 100) / 100,
      windows: Math.round(windows * 100) / 100,
      total: Math.round(total * 100) / 100
    };
  }

  private calculateSavings(competitorCost: number) {
    const difference = competitorCost - this.optidataCost;
    const percentage = (difference / competitorCost) * 100;

    return {
      amount: Math.round(difference * 100) / 100,
      percentage: Math.round(percentage * 100) / 100
    };
  }

  // Método para converter VMs da Optidata para VMSpec
  static convertOptidataVMs(vms: any[]): VMSpec[] {
    return vms.map(vm => ({
      vcpu: vm.vcpu || 0,
      ram: vm.ram || 0,
      storage: (vm.discoFCM || 0) + (vm.discoSSD || 0),
      hasWindows: vm.sistemaOperacional?.includes('windows') || vm.sistemaOperacional?.includes('Windows') || false
    }));
  }

  // Método para validar se pode fazer comparação
  static canCompare(vms: any[]): boolean {
    return vms.length > 0 && vms.some(vm => 
      vm.vcpu > 0 && vm.ram > 0
    );
  }
}
