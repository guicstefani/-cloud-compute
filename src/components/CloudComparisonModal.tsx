
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  ExternalLink, 
  Trophy,
  Calculator,
  DollarSign,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useCloudComparison } from '@/hooks/useCloudComparison';
import { CLOUD_PRICING } from '@/utils/cloudPricing';

interface CloudComparisonModalProps {
  optidataCost: number;
  vms: any[];
  onClose: () => void;
}

export const CloudComparisonModal: React.FC<CloudComparisonModalProps> = ({
  optidataCost,
  vms,
  onClose
}) => {
  const [enabledProviders, setEnabledProviders] = useState([
    'aws', 'azure', 'gcp', 'oracle', 'magalu'
  ]);

  const { results, loading, metrics, canCompare } = useCloudComparison({
    optidataCost,
    vms,
    enabledProviders
  });

  if (!canCompare) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Configuração Necessária</h3>
        <p className="text-gray-600">
          Configure pelo menos uma VM com recursos de CPU e RAM para habilitar a comparação.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mt-4 mb-2">Consultando Calculadoras</h3>
        <p className="text-gray-600">
          Comparando preços em tempo real com as principais clouds...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas de Resumo */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium">Mais Barato</span>
              </div>
              <div className="text-xl font-bold">{metrics.cheapest.name}</div>
              <div className="text-lg text-green-600">
                R$ {metrics.cheapest.totalCost.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">Posição Optidata</span>
              </div>
              <div className="text-xl font-bold">#{metrics.optidataPosition}</div>
              <div className="text-lg">
                de {metrics.totalProviders} providers
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Máxima Economia</span>
              </div>
              <div className="text-xl font-bold text-green-600">
                R$ {metrics.maxSavings.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2
                })}
              </div>
              <div className="text-sm text-gray-600">vs mais caro</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Card da Optidata */}
      <Card className="border-2 border-blue-500 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                O
              </div>
              <div>
                <div className="font-semibold text-lg">Optidata Cloud (Atual)</div>
                <div className="text-sm text-gray-600">
                  Cloud Privada • Tier III • Brasil • {vms.length} VM{vms.length > 1 ? 's' : ''}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                R$ {optidataCost.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2
                })}
              </div>
              <div className="text-sm text-gray-600">por mês</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium text-green-600 mb-2">✓ INCLUÍDO</div>
                <div>• Suporte 24/7 em português</div>
                <div>• Monitoramento R$ 100/VM</div>
                <div>• Backup automático</div>
                <div>• SLA 99.99%</div>
              </div>
              <div>
                <div className="font-medium text-blue-600 mb-2">📊 RECURSOS TOTAIS</div>
                <div>• {vms.reduce((sum, vm) => sum + vm.vcpu, 0)} vCPUs</div>
                <div>• {vms.reduce((sum, vm) => sum + vm.ram, 0)} GB RAM</div>
                <div>• {vms.reduce((sum, vm) => sum + (vm.discoFCM || 0) + (vm.discoSSD || 0), 0)} GB Storage</div>
              </div>
              <div>
                <div className="font-medium text-purple-600 mb-2">🇧🇷 COMPLIANCE</div>
                <div>• LGPD compliant</div>
                <div>• Dados no Brasil</div>
                <div>• Sem IOF</div>
                <div>• Moeda nacional</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Comparações */}
      <div className="space-y-4">
        {results.map((result, index) => (
          <Card key={result.provider} className="transition-all hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                    {result.logo}
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{result.name}</div>
                    <div className="text-sm text-gray-600">Cloud Pública</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    {result.totalCost < optidataCost ? (
                      <TrendingDown className="w-5 h-5 text-red-500" />
                    ) : (
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    )}
                    <span className="text-3xl font-bold">
                      R$ {result.totalCost.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={result.totalCost < optidataCost ? "destructive" : "secondary"}>
                      {result.savings.amount >= 0 ? '+' : ''}
                      {result.savings.percentage.toFixed(1)}%
                    </Badge>
                    <span className="text-sm text-gray-600">
                      vs Optidata
                    </span>
                  </div>
                </div>
              </div>

              {/* Breakdown detalhado */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Computação</div>
                    <div className="font-semibold">
                      R$ {result.breakdown.compute.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Storage</div>
                    <div className="font-semibold">
                      R$ {result.breakdown.storage.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Windows</div>
                    <div className="font-semibold">
                      R$ {result.breakdown.windows.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Total</div>
                    <div className="font-semibold text-lg">
                      R$ {result.breakdown.total.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-gray-600">Diferença anual: </span>
                  <span className={`font-semibold ${result.savings.amount >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {result.savings.amount >= 0 ? '+' : ''}
                    R$ {(result.savings.amount * 12).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2
                    })}
                  </span>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(CLOUD_PRICING[result.provider].calculatorUrl, '_blank')}
                  className="flex items-center gap-2"
                >
                  Calculadora Oficial
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Disclaimer */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div className="text-sm text-orange-800">
              <strong>Disclaimer:</strong> Preços baseados em pesquisa de 13/06/2025 nas calculadoras oficiais. 
              Valores podem variar conforme região, comprometimento, descontos por volume e configurações específicas. 
              Clouds internacionais sujeitas a IOF e variação cambial. 
              Para cotações precisas, consulte sempre as calculadoras oficiais.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
