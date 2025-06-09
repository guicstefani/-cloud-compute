
import React, { useState } from 'react';
import { Cpu, HardDrive, Monitor, Server, Shield } from 'lucide-react';
import ResumoPool from './ResumoPool';

const PoolDeRecursos = () => {
  const [pool, setPool] = useState({
    vcpu: 100,
    ram: 200,
    storageSSD: 0,
    storageFCM: 5000,
    backupType: 'padrao',
    quantidadeMonitoramento: 50,
    sistemaOperacional: '',
    quantidadeWindows: 0,
    quantidadeRHEL: 0,
    quantidadeSUSE: 0,
    antivirus: false,
    quantidadeAntivirus: 0,
    sqlServer: false,
    quantidadeSQL: 0,
    tsplus: false,
    quantidadeTSPlus: 0,
    ipsAdicionais: 0,
    desconto: 0
  });

  const updatePool = (field: string, value: any) => {
    setPool(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Coluna Principal - Configuração */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Card de Recursos Computacionais */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Cpu className="w-5 h-5 mr-2 text-blue-600" />
            Recursos Computacionais Totais
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* vCPU Total */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total de vCPUs
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={pool.vcpu}
                  onChange={(e) => updatePool('vcpu', parseInt(e.target.value) || 0)}
                  min="1"
                  max="10000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                />
                <span className="absolute right-4 top-3.5 text-gray-500">cores</span>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-gray-500">Limite: 10.000 cores</span>
                <span className="text-gray-700 font-medium">
                  R$ {(pool.vcpu * 0.0347 * 720).toFixed(2)}/mês
                </span>
              </div>
            </div>

            {/* RAM Total */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total de RAM
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={pool.ram}
                  onChange={(e) => updatePool('ram', parseInt(e.target.value) || 0)}
                  min="1"
                  max="100000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                />
                <span className="absolute right-4 top-3.5 text-gray-500">GB</span>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-gray-500">Limite: 100 TB</span>
                <span className="text-gray-700 font-medium">
                  R$ {(pool.ram * 0.0278 * 720).toFixed(2)}/mês
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card de Armazenamento */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <HardDrive className="w-5 h-5 mr-2 text-blue-600" />
            Armazenamento Total
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Storage SSD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Storage SSD (Alta Performance)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={pool.storageSSD}
                  onChange={(e) => updatePool('storageSSD', parseInt(e.target.value) || 0)}
                  min="0"
                  max="300000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                />
                <span className="absolute right-4 top-3.5 text-gray-500">GB</span>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-gray-500">R$ 0,55/GB - Limite: 300 TB</span>
                <span className="text-gray-700 font-medium">
                  R$ {(pool.storageSSD * 0.55).toFixed(2)}/mês
                </span>
              </div>
            </div>

            {/* Storage FCM */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Storage FCM (Capacidade)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={pool.storageFCM}
                  onChange={(e) => updatePool('storageFCM', parseInt(e.target.value) || 0)}
                  min="0"
                  max="300000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                />
                <span className="absolute right-4 top-3.5 text-gray-500">GB</span>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-gray-500">R$ 0,75/GB - Limite: 300 TB</span>
                <span className="text-gray-700 font-medium">
                  R$ {(pool.storageFCM * 0.75).toFixed(2)}/mês
                </span>
              </div>
            </div>
          </div>

          {/* Tipo de Backup */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de Backup para Todo o Pool
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['padrao', 'duplo', 'triplo'].map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => updatePool('backupType', tipo)}
                  className={`
                    p-3 rounded-lg border-2 text-center transition-all capitalize
                    ${pool.backupType === tipo 
                      ? 'border-green-500 bg-green-50 text-green-900 font-medium' 
                      : 'border-gray-300 bg-white hover:border-gray-400'
                    }
                  `}
                >
                  {tipo}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Card de Monitoramento */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Monitor className="w-5 h-5 mr-2 text-blue-600" />
            Monitoramento
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantidade de VMs para Monitorar
            </label>
            <div className="relative">
              <input
                type="number"
                value={pool.quantidadeMonitoramento}
                onChange={(e) => updatePool('quantidadeMonitoramento', parseInt(e.target.value) || 0)}
                min="0"
                max="1000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
              <span className="absolute right-4 top-3.5 text-gray-500">VMs</span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-gray-500">R$ 100,00 por VM monitorada</span>
              <span className="text-gray-700 font-medium">
                R$ {(pool.quantidadeMonitoramento * 100).toFixed(2)}/mês
              </span>
            </div>
          </div>
        </div>

        {/* Card de Sistemas Operacionais */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Server className="w-5 h-5 mr-2 text-blue-600" />
            Sistemas Operacionais
          </h3>
          
          <div className="space-y-4">
            {/* Windows */}
            <div className={`
              p-4 rounded-lg border-2 transition-all
              ${pool.quantidadeWindows > 0 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200'
              }
            `}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Windows Server</h4>
                  <p className="text-sm text-gray-600">R$ 55 por licença (a cada 2 vCPUs)</p>
                </div>
                <input
                  type="number"
                  value={pool.quantidadeWindows}
                  onChange={(e) => updatePool('quantidadeWindows', parseInt(e.target.value) || 0)}
                  min="0"
                  placeholder="Qtd VMs"
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-center"
                />
              </div>
              {pool.quantidadeWindows > 0 && (
                <p className="mt-2 text-sm text-green-700 font-medium">
                  Total: {Math.ceil(pool.vcpu / 2)} licenças = R$ {(Math.ceil(pool.vcpu / 2) * 55).toFixed(2)}/mês
                </p>
              )}
            </div>

            {/* RHEL */}
            <div className={`
              p-4 rounded-lg border-2 transition-all
              ${pool.quantidadeRHEL > 0 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200'
              }
            `}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Red Hat Enterprise Linux</h4>
                  <p className="text-sm text-gray-600">R$ 1.200,00 por servidor</p>
                </div>
                <input
                  type="number"
                  value={pool.quantidadeRHEL}
                  onChange={(e) => updatePool('quantidadeRHEL', parseInt(e.target.value) || 0)}
                  min="0"
                  placeholder="Qtd VMs"
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-center"
                />
              </div>
              {pool.quantidadeRHEL > 0 && (
                <p className="mt-2 text-sm text-green-700 font-medium">
                  Total: R$ {(pool.quantidadeRHEL * 1200).toFixed(2)}/mês
                </p>
              )}
            </div>

            {/* SUSE */}
            <div className={`
              p-4 rounded-lg border-2 transition-all
              ${pool.quantidadeSUSE > 0 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200'
              }
            `}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">SUSE Linux Enterprise</h4>
                  <p className="text-sm text-gray-600">R$ 900,00 por servidor</p>
                </div>
                <input
                  type="number"
                  value={pool.quantidadeSUSE}
                  onChange={(e) => updatePool('quantidadeSUSE', parseInt(e.target.value) || 0)}
                  min="0"
                  placeholder="Qtd VMs"
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-center"
                />
              </div>
              {pool.quantidadeSUSE > 0 && (
                <p className="mt-2 text-sm text-green-700 font-medium">
                  Total: R$ {(pool.quantidadeSUSE * 900).toFixed(2)}/mês
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Card de Licenças Adicionais */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-600" />
            Licenças e Segurança
          </h3>
          
          <div className="space-y-4">
            {/* Antivírus */}
            <div className={`
              p-4 rounded-lg border-2 transition-all
              ${pool.quantidadeAntivirus > 0 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200'
              }
            `}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Antivírus</h4>
                  <p className="text-sm text-gray-600">R$ 55,00 por VM</p>
                </div>
                <input
                  type="number"
                  value={pool.quantidadeAntivirus}
                  onChange={(e) => updatePool('quantidadeAntivirus', parseInt(e.target.value) || 0)}
                  min="0"
                  placeholder="Qtd VMs"
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-center"
                />
              </div>
              {pool.quantidadeAntivirus > 0 && (
                <p className="mt-2 text-sm text-green-700 font-medium">
                  Total: R$ {(pool.quantidadeAntivirus * 55).toFixed(2)}/mês
                </p>
              )}
            </div>

            {/* SQL Server */}
            <div className={`
              p-4 rounded-lg border-2 transition-all
              ${pool.quantidadeSQL > 0 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200'
              }
            `}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">SQL Server Standard</h4>
                  <p className="text-sm text-gray-600">R$ 800 por licença (a cada 2 vCPUs)</p>
                </div>
                <input
                  type="number"
                  value={pool.quantidadeSQL}
                  onChange={(e) => updatePool('quantidadeSQL', parseInt(e.target.value) || 0)}
                  min="0"
                  placeholder="Qtd VMs"
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-center"
                />
              </div>
              {pool.quantidadeSQL > 0 && (
                <p className="mt-2 text-sm text-green-700 font-medium">
                  Considerando {pool.quantidadeSQL} VMs com SQL
                </p>
              )}
            </div>

            {/* IPs Adicionais */}
            <div className={`
              p-4 rounded-lg border-2 transition-all
              ${pool.ipsAdicionais > 0 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200'
              }
            `}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">IPs Adicionais</h4>
                  <p className="text-sm text-gray-600">R$ 70,00 por IP</p>
                </div>
                <input
                  type="number"
                  value={pool.ipsAdicionais}
                  onChange={(e) => updatePool('ipsAdicionais', parseInt(e.target.value) || 0)}
                  min="0"
                  placeholder="Qtd IPs"
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-center"
                />
              </div>
              {pool.ipsAdicionais > 0 && (
                <p className="mt-2 text-sm text-green-700 font-medium">
                  Total: R$ {(pool.ipsAdicionais * 70).toFixed(2)}/mês
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Desconto Global */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Desconto Global
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Desconto sobre infraestrutura
              </span>
              <span className="text-lg font-semibold text-blue-600">
                {pool.desconto}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={pool.desconto}
              onChange={(e) => updatePool('desconto', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-gray-500">
              Aplicado apenas em infraestrutura. Licenças não têm desconto.
            </p>
          </div>
        </div>
      </div>

      {/* Coluna Lateral - Resumo */}
      <div className="lg:col-span-1">
        <ResumoPool pool={pool} />
      </div>
    </div>
  );
};

export default PoolDeRecursos;
