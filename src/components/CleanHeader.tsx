
import React from 'react';
import { Shield, Zap, Clock, Globe } from 'lucide-react';

const CleanHeader = () => {
  return (
    <div className="bg-black text-white py-8 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col space-y-4">
          {/* Main Title */}
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Cloud Computing
            </h1>
            <p className="text-xl text-gray-300">
              Infraestrutura Enterprise com Performance Garantida
            </p>
          </div>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-900/30 border border-green-700/50 rounded-full">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-300 font-medium">99.9% Uptime SLA</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-900/30 border border-blue-700/50 rounded-full">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-300 font-medium">ISO 27001</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-900/30 border border-purple-700/50 rounded-full">
              <Globe className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300 font-medium">Tier III</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-900/30 border border-amber-700/50 rounded-full">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-300 font-medium">Deploy em 15min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleanHeader;
