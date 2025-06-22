
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Check, 
  ExternalLink,
  Trophy,
  Zap,
  Shield,
  Clock
} from 'lucide-react';
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud } from '@/utils/calculadora';
import { useCloudComparison } from '@/hooks/useCloudComparison';

export const CloudComparatorModule: React.FC = () => {
  const { vms, precos } = useCalculadoraStore();
  const calculadora = new CalculadoraCloud(precos);
  const totalOptidata = calculadora.calcularTotalGeral(vms, {}).totalComDesconto;

  const { results, loading, canCompare } = useCloudComparison({
    optidataCost: totalOptidata,
    vms,
    enabledProviders: ['aws', 'azure', 'gcp']
  });

  if (!canCompare) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-10 h-10 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Configure VMs para Comparar
            </h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Adicione pelo menos uma VM com recursos configurados para visualizar 
              a comparação multi-cloud em tempo real.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-6"></div>
            <h2 className="text-xl font-bold text-white mb-2">
              Consultando Preços em Tempo Real
            </h2>
            <p className="text-gray-400">
              Comparando com AWS, Azure e Google Cloud...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calcular dados para comparação
  const awsResult = results.find(r => r.provider === 'aws');
  const azureResult = results.find(r => r.provider === 'azure');
  const gcpResult = results.find(r => r.provider === 'gcp');

  const economiaMedia = results.reduce((acc, r) => acc + r.savings.amount, 0) / results.length;
  const descontoMedio = results.reduce((acc, r) => acc + r.savings.percentage, 0) / results.length;
  const economiaAnual = economiaMedia * 12;

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Comparação Multi-Cloud Real-Time
              </h1>
              <p className="text-gray-400">
                Veja quanto você economiza vs. Big Tech
              </p>
            </div>
          </div>
        </div>

        {/* Main Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          
          {/* OptiData Card */}
          <Card className="border-2 border-green-500 bg-green-50/5 backdrop-blur relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <Badge className="bg-green-500 text-white">
                <Trophy className="w-3 h-3 mr-1" />
                MELHOR PREÇO
              </Badge>
            </div>
            
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#0066CC] to-[#0052A3] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">🚀</span>
                </div>
                <div>
                  <CardTitle className="text-white text-lg">OptiData Cloud</CardTitle>
                  <p className="text-green-400 text-sm font-medium">por mês</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="text-4xl font-bold text-green-400 mb-4">
                R$ {totalOptidata.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-green-300">
                  <Check className="w-4 h-4" />
                  Premium Support 24/7
                </div>
                <div className="flex items-center gap-2 text-sm text-green-300">
                  <Check className="w-4 h-4" />
                  Auto-scaling
                </div>
                <div className="flex items-center gap-2 text-sm text-green-300">
                  <Check className="w-4 h-4" />
                  Backup incluído
                </div>
                <div className="flex items-center gap-2 text-sm text-green-300">
                  <Check className="w-4 h-4" />
                  SLA 99.9%
                </div>
              </div>
              
              <div className="text-center">
                <Badge variant="outline" className="border-green-500 text-green-400">
                  Transparência Total
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* AWS Card */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">AWS</span>
                </div>
                <div>
                  <CardTitle className="text-white text-lg">Amazon AWS</CardTitle>
                  <p className="text-gray-400 text-sm">por mês</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="text-4xl font-bold text-white mb-2">
                R$ {awsResult?.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '---'}
              </div>
              
              <div className="mb-4">
                <div className="text-red-400 font-semibold mb-1">
                  Mais caro: +R$ {awsResult?.savings.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0'}
                </div>
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                  +{awsResult?.savings.percentage.toFixed(0) || '0'}% mais caro
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  Standard Support
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  Manual scaling
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Azure Card */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">AZ</span>
                </div>
                <div>
                  <CardTitle className="text-white text-lg">Microsoft Azure</CardTitle>
                  <p className="text-gray-400 text-sm">por mês</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="text-4xl font-bold text-white mb-2">
                R$ {azureResult?.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '---'}
              </div>
              
              <div className="mb-4">
                <div className="text-red-400 font-semibold mb-1">
                  Mais caro: +R$ {azureResult?.savings.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0'}
                </div>
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                  +{azureResult?.savings.percentage.toFixed(0) || '0'}% mais caro
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  Business Support
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  Semi-auto scaling
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Google Cloud Card */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">GCP</span>
                </div>
                <div>
                  <CardTitle className="text-white text-lg">Google Cloud</CardTitle>
                  <p className="text-gray-400 text-sm">por mês</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="text-4xl font-bold text-white mb-2">
                R$ {gcpResult?.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '---'}
              </div>
              
              <div className="mb-4">
                <div className="text-red-400 font-semibold mb-1">
                  Mais caro: +R$ {gcpResult?.savings.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0'}
                </div>
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                  +{gcpResult?.savings.percentage.toFixed(0) || '0'}% mais caro
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  Standard Support
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  Auto-scaling
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-900/50 border-green-500/30">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                R$ {economiaMedia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-gray-300 font-medium">Economia média mensal</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-blue-500/30">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {descontoMedio.toFixed(0)}%
              </div>
              <div className="text-gray-300 font-medium">Desconto médio vs. Big Tech</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-purple-500/30">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                R$ {economiaAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-gray-300 font-medium">Economia anual projetada</div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg"
            onClick={() => window.open('https://calculator.aws/#/', '_blank')}
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Ver Calculadora AWS
          </Button>
          <Button 
            variant="outline"
            className="border-blue-500 text-blue-400 hover:bg-blue-500/10 px-8 py-4 text-lg"
            onClick={() => window.open('https://azure.microsoft.com/pricing/calculator/', '_blank')}
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Ver Calculadora Azure
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm pt-8 border-t border-gray-800">
          <p>
            OptiData Cloud Calculator - Transparência e controle total para decisores de TI
          </p>
          <p className="mt-2">
            Auditável • API pública • Comparação real-time
          </p>
        </div>
      </div>
    </div>
  );
};
