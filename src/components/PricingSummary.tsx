
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
  Shield
} from 'lucide-react';

interface PricingSummaryProps {
  calculadora: CalculadoraCloud;
}

const PricingSummary = ({ calculadora }: PricingSummaryProps) => {
  const { vms, descontos } = useCalculadoraStore();
  
  if (vms.length === 0) {
    return (
      <div className="text-center py-12">
        <Server className="w-16 h-16 mx-auto mb-4 text-optidata-gray-400" />
        <h3 className="text-lg font-medium text-optidata-gray-900 mb-2">
          Nenhuma VM configurada
        </h3>
        <p className="text-optidata-gray-600">
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
    { nome: 'Backup', valor: categorias.backup, cor: '#00C851', icon: Shield },
    { nome: 'Monitoramento', valor: categorias.monitoramento, cor: '#FFB300', icon: Server },
    { nome: 'Licenças', valor: categorias.licencas, cor: '#FF3547', icon: Shield }
  ].filter(item => item.valor > 0);

  return (
    <div className="space-y-6">
      {/* Resumo Executivo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-optidata-blue to-optidata-blue-light text-white">
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
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-optidata-success" />
            <Badge variant="outline" className="text-optidata-success border-optidata-success">
              -{((economia / totalSemDesconto) * 100).toFixed(1)}%
            </Badge>
          </div>
          <div className="text-3xl font-bold text-optidata-success mb-1">
            {formatCurrency(economia)}
          </div>
          <div className="text-optidata-gray-600">Economia Total</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Server className="w-8 h-8 text-optidata-gray-600" />
            <Badge variant="outline">Infraestrutura</Badge>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-semibold">
              {formatNumber(totalVCPUs)} vCPUs
            </div>
            <div className="text-lg font-semibold">
              {formatNumber(totalRAM)}GB RAM
            </div>
            <div className="text-lg font-semibold">
              {formatNumber(totalStorage)}GB Storage
            </div>
          </div>
        </Card>
      </div>

      {/* Breakdown por Categoria */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <div className="w-8 h-8 rounded-lg bg-optidata-blue/10 flex items-center justify-center mr-2">
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
                    <span className="font-medium">{item.nome}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(item.valor)}</div>
                    <div className="text-sm text-optidata-gray-600">
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
      </Card>

      {/* Detalhamento por VM */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <div className="w-8 h-8 rounded-lg bg-optidata-blue/10 flex items-center justify-center mr-2">
            🖥️
          </div>
          Detalhamento por VM
        </h3>

        <div className="space-y-4">
          {vmsCustos.map(({ vm, custo }, index) => (
            <div 
              key={vm.id} 
              className="p-4 border border-optidata-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold">{vm.nome}</h4>
                  <div className="text-sm text-optidata-gray-600">
                    {vm.vcpu} vCPU • {vm.ram}GB RAM • {vm.discoFCM + vm.discoSSD}GB Storage
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-optidata-blue">
                    {formatCurrency(custo.total)}
                  </div>
                  <div className="text-sm text-optidata-gray-600">por mês</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-optidata-gray-600">Computação</div>
                  <div className="font-medium">
                    {formatCurrency(custo.vcpu + custo.ram)}
                  </div>
                </div>
                <div>
                  <div className="text-optidata-gray-600">Storage</div>
                  <div className="font-medium">
                    {formatCurrency(custo.storage + custo.backup)}
                  </div>
                </div>
                <div>
                  <div className="text-optidata-gray-600">Monitoramento</div>
                  <div className="font-medium">
                    {formatCurrency(custo.monitoramento)}
                  </div>
                </div>
                <div>
                  <div className="text-optidata-gray-600">Licenças</div>
                  <div className="font-medium">
                    {formatCurrency(custo.subtotalLicencas)}
                  </div>
                </div>
              </div>

              {Object.keys(custo.licencas).length > 0 && (
                <div className="mt-3 pt-3 border-t border-optidata-gray-100">
                  <div className="text-sm text-optidata-gray-600 mb-1">Licenças ativas:</div>
                  <div className="flex flex-wrap gap-1">
                    {Object.keys(custo.licencas).map(licenca => (
                      <Badge key={licenca} variant="secondary" className="text-xs">
                        {licenca}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* TCO Projetado */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <div className="w-8 h-8 rounded-lg bg-optidata-blue/10 flex items-center justify-center mr-2">
            📈
          </div>
          TCO Projetado
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-optidata-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-optidata-blue">
              {formatCurrency(totalComDesconto * 12)}
            </div>
            <div className="text-sm text-optidata-gray-600">1 Ano</div>
          </div>
          <div className="text-center p-4 bg-optidata-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-optidata-blue">
              {formatCurrency(totalComDesconto * 36)}
            </div>
            <div className="text-sm text-optidata-gray-600">3 Anos</div>
          </div>
          <div className="text-center p-4 bg-optidata-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-optidata-blue">
              {formatCurrency(totalComDesconto * 60)}
            </div>
            <div className="text-sm text-optidata-gray-600">5 Anos</div>
          </div>
        </div>
      </Card>

      {/* Ações */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Próximos Passos</h3>
        
        <div className="flex flex-wrap gap-3">
          <Button className="bg-optidata-blue hover:bg-optidata-blue/90">
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar Excel
          </Button>
          <Button variant="outline">
            📧 Solicitar Proposta
          </Button>
          <Button variant="outline">
            🔗 Compartilhar
          </Button>
        </div>

        <div className="mt-4 p-4 bg-optidata-blue/5 rounded-lg">
          <div className="text-sm text-optidata-gray-700">
            <strong>Próximos passos:</strong> Entre em contato com nossa equipe comercial 
            para finalizar a proposta e iniciar a migração para a cloud privada Optidata.
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PricingSummary;
