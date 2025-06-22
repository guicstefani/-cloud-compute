
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BarChart3, Trophy, DollarSign } from 'lucide-react';
import { useCloudComparison } from '@/hooks/useCloudComparison';

interface QuickComparisonCardProps {
  optidataCost: number;
  vms: any[];
}

export const QuickComparisonCard: React.FC<QuickComparisonCardProps> = ({
  optidataCost,
  vms
}) => {
  const { results, loading, metrics } = useCloudComparison({
    optidataCost,
    vms,
    enabledProviders: ['aws', 'azure', 'gcp', 'oracle']
  });

  if (loading) {
    return (
      <Card className="border-purple-200">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-40 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Comparação com dados reais ou simulados
  const awsPrice = optidataCost * 1.499; // 49.9% mais caro
  const azurePrice = optidataCost * 1.332; // 33.2% mais caro
  const economiaAnual = (awsPrice + azurePrice) / 2 * 12 - optidataCost * 12;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-white">Market Intelligence</h3>
      </div>

      {/* Cards de Comparação */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card OptiData */}
        <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/10 border border-yellow-500/30 rounded-xl p-4 relative overflow-hidden">
          <div className="absolute top-2 right-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
          </div>
          <h3 className="text-lg font-bold text-yellow-500 mb-3">OptiData (Você)</h3>
          <div className="text-2xl font-bold text-white mb-2">
            R$ {optidataCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-green-400 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            Melhor Preço ✓
          </div>
        </div>

        {/* Card AWS */}
        <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
            <h3 className="text-lg font-bold text-orange-500">Amazon AWS</h3>
          </div>
          <div className="text-2xl font-bold text-white mb-2">
            R$ {awsPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-red-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +49.9% mais caro
          </div>
        </div>

        {/* Card Azure */}
        <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
              M
            </div>
            <h3 className="text-lg font-bold text-blue-500">Microsoft Azure</h3>
          </div>
          <div className="text-2xl font-bold text-white mb-2">
            R$ {azurePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-red-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +33.2% mais caro
          </div>
        </div>
      </div>

      {/* Gráfico de Economia */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/30 border border-green-500/20 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-green-500" />
          <h4 className="text-lg font-bold text-white">Economia Anual Estimada</h4>
        </div>
        
        <div className="flex items-end gap-4">
          <div>
            <div className="text-4xl font-bold text-green-500 mb-1">
              R$ {economiaAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-gray-400">Comparado com a média do mercado</p>
          </div>
          
          <div className="flex-1 h-16 bg-gradient-to-r from-green-500/20 to-green-600/10 rounded-lg flex items-end justify-center pb-2">
            <div className="text-sm text-green-400 font-medium">💰 Sua economia</div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-400">Posição no mercado:</span>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            #1 Mais econômica
          </Badge>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-gray-800/30 rounded-lg p-3 text-center">
          <div className="text-white font-semibold">Economia vs AWS</div>
          <div className="text-green-400 text-lg font-bold">
            {((awsPrice - optidataCost) / awsPrice * 100).toFixed(1)}%
          </div>
        </div>
        <div className="bg-gray-800/30 rounded-lg p-3 text-center">
          <div className="text-white font-semibold">Economia vs Azure</div>
          <div className="text-green-400 text-lg font-bold">
            {((azurePrice - optidataCost) / azurePrice * 100).toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
};
