
import React from 'react';
import { Plane, Cloud } from 'lucide-react';

const PremiumFloatingElements = () => {
  return (
    <div className="fixed pointer-events-none inset-0 z-0 overflow-hidden">
      {/* Jato animado */}
      <div className="absolute top-20 right-10 opacity-5">
        <Plane className="w-32 h-32 text-blue-600 animate-fly" />
      </div>
      
      {/* Nuvens flutuantes */}
      <Cloud className="absolute top-40 left-20 w-24 h-24 text-gray-200 opacity-20 animate-float" />
      <Cloud className="absolute bottom-20 right-40 w-16 h-16 text-gray-300 opacity-15 animate-float-delayed" />
      <Cloud className="absolute top-1/2 left-10 w-20 h-20 text-blue-200 opacity-10 animate-float-slow" />
    </div>
  );
};

export default PremiumFloatingElements;
