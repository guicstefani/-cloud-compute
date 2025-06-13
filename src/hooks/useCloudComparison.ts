
import { useState, useEffect, useMemo } from 'react';
import { CloudCalculator } from '@/utils/cloudCalculator';
import { ComparisonResult } from '@/types/cloudComparison';

interface UseCloudComparisonProps {
  optidataCost: number;
  vms: any[];
  enabledProviders?: string[];
}

export const useCloudComparison = ({
  optidataCost,
  vms,
  enabledProviders = ['aws', 'azure', 'gcp', 'oracle', 'magalu']
}: UseCloudComparisonProps) => {
  const [results, setResults] = useState<ComparisonResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canCompare = useMemo(() => 
    CloudCalculator.canCompare(vms), 
    [vms]
  );

  const vmSpecs = useMemo(() => 
    CloudCalculator.convertOptidataVMs(vms),
    [vms]
  );

  useEffect(() => {
    if (!canCompare || optidataCost <= 0) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simula delay para UX mais realística
      setTimeout(() => {
        const calculator = new CloudCalculator(optidataCost, vmSpecs);
        const allResults = calculator.calculateAllProviders();
        
        // Filtra apenas providers habilitados
        const filteredResults = allResults.filter(result => 
          enabledProviders.includes(result.provider)
        );

        setResults(filteredResults);
        setLoading(false);
      }, 1200);
      
    } catch (err) {
      setError('Erro ao calcular comparação');
      setLoading(false);
    }
  }, [optidataCost, vmSpecs, enabledProviders, canCompare]);

  // Métricas calculadas
  const metrics = useMemo(() => {
    if (results.length === 0) return null;

    const cheapest = results[0];
    const mostExpensive = results[results.length - 1];
    const optidataPosition = results.findIndex(r => r.totalCost >= optidataCost) + 1;

    return {
      cheapest,
      mostExpensive,
      optidataPosition: optidataPosition || results.length + 1,
      totalProviders: results.length + 1, // +1 para Optidata
      averageCost: results.reduce((sum, r) => sum + r.totalCost, 0) / results.length,
      maxSavings: Math.max(...results.map(r => r.savings.amount))
    };
  }, [results, optidataCost]);

  return {
    results,
    loading,
    error,
    canCompare,
    metrics,
    refresh: () => {
      if (canCompare) {
        setResults([]);
      }
    }
  };
};
