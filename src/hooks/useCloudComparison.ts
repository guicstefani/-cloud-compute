
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
  enabledProviders = ['aws', 'azure', 'gcp', 'oracle']
}: UseCloudComparisonProps) => {
  const [results, setResults] = useState<ComparisonResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canCompare = useMemo(() => {
    console.log('Checking canCompare:', { vms, optidataCost });
    return CloudCalculator.canCompare(vms) && optidataCost > 0;
  }, [vms, optidataCost]);

  const vmSpecs = useMemo(() => {
    console.log('Converting VMs:', vms);
    return CloudCalculator.convertOptidataVMs(vms);
  }, [vms]);

  useEffect(() => {
    console.log('useCloudComparison effect:', { canCompare, optidataCost, vmsLength: vms.length });
    
    if (!canCompare || optidataCost <= 0) {
      console.log('Cannot compare - clearing results');
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Starting comparison calculation...');
      
      // Simula delay para UX mais realística
      const timer = setTimeout(() => {
        try {
          const calculator = new CloudCalculator(optidataCost, vmSpecs);
          const allResults = calculator.calculateAllProviders();
          
          console.log('Calculation results:', allResults);
          
          // Filtra apenas providers habilitados
          const filteredResults = allResults.filter(result => 
            enabledProviders.includes(result.provider)
          );

          console.log('Filtered results:', filteredResults);
          setResults(filteredResults);
          setLoading(false);
        } catch (calcError) {
          console.error('Calculation error:', calcError);
          setError('Erro ao calcular comparação');
          setLoading(false);
        }
      }, 1200);

      return () => clearTimeout(timer);
      
    } catch (err) {
      console.error('Hook error:', err);
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
        setLoading(true);
      }
    }
  };
};
