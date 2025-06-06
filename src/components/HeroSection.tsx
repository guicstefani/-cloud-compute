
import React from 'react';
import { Plane, Cloud, ChevronDown, Shield, Award, Zap } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background animado com elementos visuais */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-10"></div>
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 lg:py-24">
        <div className="text-center">
          {/* Badge premium */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-6">
            <Plane className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-gray-200">Enterprise Cloud Solutions</span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
            Your Next Level
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Private Cloud
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Calcule sua infraestrutura com a precisão e excelência que sua empresa merece
          </p>
          
          {/* Métricas de credibilidade */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">99.99%</div>
              <div className="text-sm text-gray-400">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-sm text-gray-400">Suporte Premium</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">Tier III</div>
              <div className="text-sm text-gray-400">Certificação</div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges de qualidade */}
      <div className="relative z-10 flex gap-4 justify-center pb-8">
        <div className="flex items-center gap-2 bg-gray-900/80 backdrop-blur-sm text-white px-4 py-2 rounded-full">
          <Shield className="w-4 h-4" />
          <span className="text-sm font-medium">ISO 27001</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-900/80 backdrop-blur-sm text-white px-4 py-2 rounded-full">
          <Award className="w-4 h-4" />
          <span className="text-sm font-medium">Tier III</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-900/80 backdrop-blur-sm text-white px-4 py-2 rounded-full">
          <Zap className="w-4 h-4" />
          <span className="text-sm font-medium">99.99% SLA</span>
        </div>
      </div>

      {/* Ícone de scroll */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-white/50" />
      </div>
    </div>
  );
};

export default HeroSection;
