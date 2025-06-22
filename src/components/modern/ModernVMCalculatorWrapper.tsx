
import React, { Suspense, lazy } from 'react';
import { ModernVMLoader } from './ModernVMLoader';
import { ModernVMErrorBoundary } from './ModernVMErrorBoundary';

// Lazy load the heavy calculator component
const ModernVMCalculator = lazy(() => 
  import('./ModernVMCalculator').then(module => ({ 
    default: module.ModernVMCalculator 
  }))
);

export const ModernVMCalculatorWrapper = () => {
  return (
    <ModernVMErrorBoundary>
      <Suspense fallback={<ModernVMLoader />}>
        <ModernVMCalculator />
      </Suspense>
    </ModernVMErrorBoundary>
  );
};
