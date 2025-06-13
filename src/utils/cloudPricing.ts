
import { CloudProvider } from '@/types/cloudComparison';

// Taxa de câmbio atual (13/06/2025)
const USD_TO_BRL = 5.58;
const HOURS_PER_MONTH = 720;

// Preços reais coletados das calculadoras oficiais
export const CLOUD_PRICING: Record<string, CloudProvider> = {
  aws: {
    name: 'Amazon AWS',
    logo: '🟧',
    color: 'orange',
    region: 'São Paulo (sa-east-1)',
    calculatorUrl: 'https://calculator.aws/#/',
    
    // Instâncias EC2 (USD/hora convertido para BRL/mês)
    compute: {
      // t3.medium: $0.027/vCPU/hora * 5.58 * 720 = R$ 108.58/vCPU/mês
      vcpuPerMonth: 0.027 * USD_TO_BRL * HOURS_PER_MONTH, // R$ 108.58
      // 4GB RAM no t3.medium = $0.054/hora, então $0.0135/GB/hora
      ramPerGBMonth: 0.0135 * USD_TO_BRL * HOURS_PER_MONTH, // R$ 54.29
    },
    
    // EBS GP3 Storage
    storage: {
      // $0.104/GB/mês * 5.58 = R$ 0.58/GB/mês
      pricePerGBMonth: 0.104 * USD_TO_BRL, // R$ 0.58
      type: 'EBS GP3 (3000 IOPS incluído)'
    },
    
    // Windows Server (incluído no preço da instância)
    windows: {
      included: true,
      additionalCost: 0,
      note: 'Incluído no preço da instância Windows'
    }
  },

  azure: {
    name: 'Microsoft Azure',
    logo: '☁️', 
    color: 'blue',
    region: 'Brasil Sul',
    calculatorUrl: 'https://azure.microsoft.com/pricing/calculator/',
    
    compute: {
      // Estimativa baseada em D2s_v3: ~$0.096/hora para 2vCPU
      vcpuPerMonth: 0.048 * USD_TO_BRL * HOURS_PER_MONTH, // R$ 193.02
      // D2s_v3 tem 8GB RAM, então ~$0.012/GB/hora
      ramPerGBMonth: 0.012 * USD_TO_BRL * HOURS_PER_MONTH, // R$ 48.26
    },
    
    storage: {
      // Standard SSD: ~$0.15/GB/mês estimado
      pricePerGBMonth: 0.15 * USD_TO_BRL, // R$ 0.84
      type: 'Managed Disk Standard SSD'
    },
    
    windows: {
      included: true,
      additionalCost: 0,
      note: 'Windows Server incluído'
    }
  },

  gcp: {
    name: 'Google Cloud Platform',
    logo: '🌐',
    color: 'green', 
    region: 'São Paulo (southamerica-east1)',
    calculatorUrl: 'https://cloud.google.com/products/calculator',
    
    compute: {
      // n1-standard: $0.04/vCPU/hora * 5.58 * 720 = R$ 160.70
      vcpuPerMonth: 0.04 * USD_TO_BRL * HOURS_PER_MONTH, // R$ 160.70
      // n1-standard-1: 3.75GB RAM para 1 vCPU = $0.0107/GB/hora
      ramPerGBMonth: 0.0107 * USD_TO_BRL * HOURS_PER_MONTH, // R$ 43.03
    },
    
    storage: {
      // Persistent Disk SSD: $0.17/GB/mês * 5.58 = R$ 0.95
      pricePerGBMonth: 0.17 * USD_TO_BRL, // R$ 0.95
      type: 'Persistent Disk SSD'
    },
    
    windows: {
      included: false,
      // $0.04/vCPU/hora adicional para Windows
      additionalCostPerVcpu: 0.04 * USD_TO_BRL * HOURS_PER_MONTH, // R$ 160.70
      note: 'Cobrança separada por vCPU'
    }
  },

  oracle: {
    name: 'Oracle Cloud Infrastructure',
    logo: '🔴',
    color: 'red',
    region: 'São Paulo',
    calculatorUrl: 'https://www.oracle.com/cloud/costestimator.html',
    
    compute: {
      // 1 OCPU = 2 vCPUs, então divido por 2
      vcpuPerMonth: 0.023 * USD_TO_BRL * HOURS_PER_MONTH, // R$ 92.42
      // Estimativa baseada em VM.Standard.E4.Flex
      ramPerGBMonth: 0.0035 * USD_TO_BRL * HOURS_PER_MONTH, // R$ 14.07
    },
    
    storage: {
      // Block Volume: ~$0.0425/GB/mês
      pricePerGBMonth: 0.0425 * USD_TO_BRL, // R$ 0.24
      type: 'Block Volume (Balanced Performance)'
    },
    
    windows: {
      included: false,
      // $0.046/vCPU/hora (conforme pesquisa)
      additionalCostPerVcpu: 0.046 * USD_TO_BRL * HOURS_PER_MONTH, // R$ 184.80
      note: 'Cobrança separada'
    }
  }
};
