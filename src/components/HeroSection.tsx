
import React from 'react';
import { Plane, Cloud, ChevronDown, Shield, Award, Zap } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative bg-[#1B365D] overflow-hidden">
      {/* Padrão de fundo elegante */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full">
          <defs>
            <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Gradiente sutil overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1B365D] via-[#1E40AF] to-[#1B365D] opacity-90"></div>

      {/* Elementos flutuantes refinados */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-[#2563EB] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-[#10B981] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#1D4ED8] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 lg:py-28">
        <div className="text-center">
          {/* Badge premium */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 mb-8 border border-white/20">
            <Plane className="w-5 h-5 text-white" />
            <span className="text-sm font-medium text-white">Enterprise Cloud Solutions</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-light text-white mb-6">
            Enterprise Cloud
            <span className="block font-semibold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Computing
            </span>
          </h1>
          
          <p className="text-xl text-blue-100 mb-16 max-w-2xl mx-auto font-light leading-relaxed">
            Infraestrutura de alta performance com a confiabilidade que sua empresa precisa
          </p>
          
          {/* Métricas refinadas */}
          <div className="flex justify-center items-center gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-light text-white mb-2">99.99%</div>
              <div className="text-sm text-blue-200 uppercase tracking-wider font-medium">Uptime SLA</div>
            </div>
            <div className="h-16 w-px bg-blue-300/30"></div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-light text-white mb-2">24/7</div>
              <div className="text-sm text-blue-200 uppercase tracking-wider font-medium">Suporte Premium</div>
            </div>
            <div className="h-16 w-px bg-blue-300/30"></div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-light text-white mb-2">Tier III</div>
              <div className="text-sm text-blue-200 uppercase tracking-wider font-medium">Certificado</div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges de qualidade refinados */}
      <div className="relative z-10 flex flex-wrap gap-4 justify-center pb-12">
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full border border-white/20 hover:bg-white/15 transition-all duration-300">
          <Shield className="w-5 h-5" />
          <span className="text-sm font-medium">ISO 27001</span>
        </div>
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full border border-white/20 hover:bg-white/15 transition-all duration-300">
          <Award className="w-5 h-5" />
          <span className="text-sm font-medium">Tier III</span>
        </div>
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full border border-white/20 hover:bg-white/15 transition-all duration-300">
          <Zap className="w-5 h-5" />
          <span className="text-sm font-medium">99.99% SLA</span>
        </div>
      </div>

      {/* Ícone de scroll elegante */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
          <ChevronDown className="w-6 h-6 text-white/70" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
