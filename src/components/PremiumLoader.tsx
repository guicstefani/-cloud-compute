
import React from 'react';
import { Cloud, Loader2 } from 'lucide-react';

interface PremiumLoaderProps {
  message?: string;
}

const PremiumLoader = ({ message = "Calculando sua infraestrutura premium..." }: PremiumLoaderProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        <Cloud className="w-16 h-16 text-blue-600 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      </div>
      <p className="mt-4 text-gray-600 text-center">{message}</p>
    </div>
  );
};

export default PremiumLoader;
