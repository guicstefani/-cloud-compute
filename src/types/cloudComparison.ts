
export interface CloudProvider {
  name: string;
  logo: string;
  color: string;
  region: string;
  calculatorUrl: string;
  compute: {
    vcpuPerMonth: number;
    ramPerGBMonth: number;
  };
  storage: {
    pricePerGBMonth: number;
    type: string;
  };
  windows: {
    included: boolean;
    additionalCost?: number;
    additionalCostPerVcpu?: number;
    note: string;
  };
}

export interface ComparisonResult {
  provider: string;
  name: string;
  totalCost: number;
  breakdown: {
    compute: number;
    storage: number;
    windows: number;
    total: number;
  };
  savings: {
    amount: number;
    percentage: number;
  };
  color: string;
  logo: string;
}

export interface VMSpec {
  vcpu: number;
  ram: number; // GB
  storage: number; // GB
  hasWindows: boolean;
}
