
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud, formatCurrency, formatNumber } from '@/utils/calculadora';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calculator, 
  TrendingUp, 
  Server, 
  Download,
  Cpu,
  MemoryStick,
  HardDrive,
  Shield,
  BarChart3
} from 'lucide-react';
import { useState } from 'react';
import CriarPropostaModal from '@/components/CriarPropostaModal';
import { CloudComparisonButton } from '@/components/CloudComparisonButton';
import { QuickComparisonCard } from '@/components/QuickComparisonCard';

interface PricingSummaryProps {
  calculadora: CalculadoraCloud;
}

const PricingSummary = ({ calculadora }: PricingSummaryProps) => {
  const { vms, descontos } = useCalculadoraStore();
  
  if (vms.length === 0) {
    return (
      <div className="text-center py-12">
        <Server className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhuma VM configurada
        </h3>
        <p className="text-gray-600">
          Configure pelo menos uma VM para ver o resumo dos custos.
        </p>
      </div>
    );
  }

  const resultado = calculadora.calcularTotalGeral(vms, descontos);
  const { vms: vmsCustos, totalSemDesconto, totalComDesconto, economia } = resultado;

  // Estatísticas gerais
  const totalVCPUs = vms.reduce((total, vm) => total + vm.vcpu, 0);
  const totalRAM = vms.reduce((total, vm) => total + vm.ram, 0);
  const totalStorage = vms.reduce((total, vm) => total + vm.discoFCM + vm.discoSSD, 0);

  // Breakdown por categoria
  const categorias = vmsCustos.reduce((acc, { custo }) => {
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

  const breakdownData = [
    { nome: 'Computação', valor: categorias.computacao, cor: '#0066CC', icon: Cpu },
    { nome: 'Storage', valor: categorias.storage, cor: '#00A1E4', icon: HardDrive },
    { nome: 'Backup', valor: categorias.backup, cor: '#10B981', icon: Shield },
    { nome: 'Monitoramento', valor: categorias.monitoramento, cor: '#6B7280', icon: Server },
    { nome: 'Licenças', valor: categorias.licencas, cor: '#EF4444', icon: Shield }
  ].filter(item => item.valor > 0);

  return (
    <div className="space-y-6">
      {/* Resumo Executivo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-[#0066CC] to-[#0052A3] text-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Calculator className="w-8 h-8" />
            <Badge variant="secondary" className="bg-white/20 text-white">
              {vms.length} VMs
            </Badge>
          </div>
          <div className="text-3xl font-bold mb-1">
            {formatCurrency(totalComDesconto)}
          </div>
          <div className="text-white/80">Total Mensal</div>
        </div>

        {economia > 0 && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <Badge className="bg-green-100 text-green-700 border-green-300">
                -{((economia / totalSemDesconto) * 100).toFixed(1)}%
              </Badge>
            </div>
            <div className="text-3xl font-bold text-green-800 mb-1">
              {formatCurrency(economia)}
            </div>
            <div className="text-green-700">Economia Total</div>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Server className="w-8 h-8 text-gray-600" />
            <Badge variant="outline" className="text-gray-600 border-gray-300">Infraestrutura</Badge>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-semibold text-gray-900">
              {formatNumber(totalVCPUs)} vCPUs
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {formatNumber(totalRAM)}GB RAM
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {formatNumber(totalStorage)}GB Storage
            </div>
          </div>
        </div>
      </div>

      {/* Market Intelligence Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          Market Intelligence
        </h3>
        
        {/* Quick comparison preview */}
        <QuickComparisonCard 
          optidataCost={totalComDesconto}
          vms={vms}
        />
        
        {/* Cloud comparison button */}
        <CloudComparisonButton 
          optidataCost={totalComDesconto}
          vms={vms}
          size="lg"
          variant="default"
        />
      </div>

      {/* Breakdown por Categoria */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-2">
            📊
          </div>
          Distribuição de Custos
        </h3>

        <div className="space-y-4">
          {breakdownData.map((item, index) => {
            const Icon = item.icon;
            const percentage = (item.valor / totalComDesconto) * 100;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4" style={{ color: item.cor }} />
                    <span className="font-medium text-gray-900">{item.nome}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{formatCurrency(item.valor)}</div>
                    <div className="text-sm text-gray-600">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
                <Progress 
                  value={percentage} 
                  className="h-2"
                  style={{ 
                    '--progress-background': item.cor 
                  } as React.CSSProperties}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Detalhamento por VM */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-2">
            🖥️
          </div>
          Detalhamento por VM
        </h3>

        <div className="space-y-4">
          {vmsCustos.map(({ vm, custo }, index) => (
            <div 
              key={vm.id} 
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-gray-50"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{vm.nome}</h4>
                  <div className="text-sm text-gray-600">
                    {vm.vcpu} vCPU • {vm.ram}GB RAM • {vm.discoFCM + vm.discoSSD}GB Storage
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-[#0066CC]">
                    {formatCurrency(custo.total)}
                  </div>
                  <div className="text-sm text-gray-600">por mês</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Computação</div>
                  <div className="font-medium text-gray-900">
                    {formatCurrency(custo.vcpu + custo.ram)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Storage</div>
                  <div className="font-medium text-gray-900">
                    {formatCurrency(custo.storage + custo.backup)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Monitoramento</div>
                  <div className="font-medium text-gray-900">
                    {formatCurrency(custo.monitoramento)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Licenças</div>
                  <div className="font-medium text-gray-900">
                    {formatCurrency(custo.subtotalLicencas)}
                  </div>
                </div>
              </div>

              {Object.keys(custo.licencasAdicionais).length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">Licenças ativas:</div>
                  <div className="flex flex-wrap gap-1">
                    {Object.keys(custo.licencasAdicionais).map(licenca => (
                      <Badge key={licenca} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                        {licenca}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* TCO Projetado */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-2">
            📈
          </div>
          TCO Projetado
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-[#0066CC]">
              {formatCurrency(totalComDesconto * 12)}
            </div>
            <div className="text-sm text-gray-600">1 Ano</div>
          </div>
          <div className="text-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-[#0066CC]">
              {formatCurrency(totalComDesconto * 36)}
            </div>
            <div className="text-sm text-gray-600">3 Anos</div>
          </div>
          <div className="text-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-[#0066CC]">
              {formatCurrency(totalComDesconto * 60)}
            </div>
            <div className="text-sm text-gray-600">5 Anos</div>
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Próximos Passos</h3>
        
        <div className="flex flex-wrap gap-3">
          <Button className="bg-[#0066CC] hover:bg-[#0052A3] text-white">
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" />
            Exportar Excel
          </Button>
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
            📧 Solicitar Proposta
          </Button>
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
            🔗 Compartilhar
          </Button>
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-gray-700">
            <strong>Próximos passos:</strong> Entre em contato com nossa equipe comercial 
            para finalizar a proposta e iniciar a migração para a cloud privada Optidata.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingSummary;
