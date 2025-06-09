
import React from 'react';

interface PoolData {
  vcpu: number;
  ram: number;
  storageSSD: number;
  storageFCM: number;
  backupType: string;
  quantidadeMonitoramento: number;
  quantidadeWindows: number;
  quantidadeRHEL: number;
  quantidadeSUSE: number;
  quantidadeAntivirus: number;
  quantidadeSQL: number;
  ipsAdicionais: number;
  desconto: number;
}

interface ResumoPoolProps {
  pool: PoolData;
}

const ResumoPool: React.FC<ResumoPoolProps> = ({ pool }) => {
  // Cálculos
  const calcularCustos = () => {
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
    
    // SQL Server (estimativa baseada em quantidade de VMs)
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

  const custos = calcularCustos();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-4">
      {/* Header */}
      <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
        <h3 className="text-lg font-semibold text-gray-900">
          Resumo do Pool de Recursos
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Cotação para múltiplas VMs
        </p>
      </div>

      {/* Resumo de Recursos */}
      <div className="p-6 space-y-4">
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Recursos Totais
          </h4>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">vCPUs</span>
            <span className="font-medium">{pool.vcpu} cores</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">RAM</span>
            <span className="font-medium">{pool.ram} GB</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Storage Total</span>
            <span className="font-medium">
              {pool.storageSSD + pool.storageFCM} GB
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">VMs Monitoradas</span>
            <span className="font-medium">{pool.quantidadeMonitoramento}</span>
          </div>
        </div>

        {/* Breakdown de Custos */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Infraestrutura</span>
            <span className="font-medium">R$ {custos.infraestrutura.toFixed(2)}</span>
          </div>
          
          {custos.desconto > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Desconto ({pool.desconto}%)</span>
              <span>-R$ {custos.desconto.toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Licenciamento</span>
            <span className="font-medium">R$ {custos.licencas.toFixed(2)}</span>
          </div>
        </div>

        {/* Total */}
        <div className="pt-4 border-t">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm text-gray-500">Total Mensal</p>
              <p className="text-xs text-gray-400">Pool completo</p>
            </div>
            <p className="text-3xl font-bold text-blue-600">
              R$ {custos.total.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Economia */}
        {custos.desconto > 0 && (
          <div className="bg-green-50 rounded-lg p-4 mt-4">
            <p className="text-sm font-medium text-green-800">
              Economia mensal: R$ {custos.desconto.toFixed(2)}
            </p>
            <p className="text-xs text-green-600 mt-1">
              Economia anual: R$ {(custos.desconto * 12).toFixed(2)}
            </p>
          </div>
        )}

        {/* Ações */}
        <div className="space-y-3 mt-6">
          <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
            Gerar Proposta do Pool
          </button>
          <button className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
            Salvar Configuração
          </button>
        </div>

        {/* Avisos */}
        <div className="mt-6 p-4 bg-amber-50 rounded-lg">
          <p className="text-xs text-amber-800">
            <strong>Atenção:</strong> Esta é uma estimativa para pool de recursos. 
            A distribuição exata por VM pode variar conforme necessidade.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResumoPool;
