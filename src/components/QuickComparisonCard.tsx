
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BarChart3 } from 'lucide-react';
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
    enabledProviders: ['aws', 'azure', 'gcp', 'oracle'] // Sem Magalu
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

  if (!metrics) return null;

  const savings = results.find(r => r.provider === 'aws')?.savings;
  const position = metrics.optidataPosition;

  return (
    <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium">vs Clouds Públicas</span>
          </div>
          
          <Badge variant={position <= 2 ? "default" : "secondary"}>
            {position <= 2 ? (
              <>🏆 #{position} mais barata</>
            ) : (
              <>📊 Posição #{position}</>
            )}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="text-2xl font-bold text-purple-900">
            {savings && savings.amount < 0 ? (
              <>
                {Math.abs(savings.percentage).toFixed(0)}% economia
                <div className="text-sm font-normal text-gray-600">
                  vs AWS (R$ {Math.abs(savings.amount).toLocaleString('pt-BR')} menos)
                </div>
              </>
            ) : (
              <>
                Posição #{position}
                <div className="text-sm font-normal text-gray-600">
                  de {metrics.totalProviders} providers
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
          <span>Comparação vs {results.length} clouds globais</span>
          <TrendingUp className="w-3 h-3" />
        </div>
      </CardContent>
    </Card>
  );
};
