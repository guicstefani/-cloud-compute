
import React from 'react';
import { Shield, Award, Zap } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-b from-[#0066CC] to-[#0052A3] text-white">
      {/* Mobile Hero */}
      <div className="mobile-show">
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold mb-2">
            Calculadora de Cloud Privada
          </h1>
          <p className="text-blue-100 text-sm mb-6">
            Infraestrutura enterprise com precisão
          </p>
          
          {/* Badges de credibilidade mobile */}
          <div className="flex gap-2 justify-center flex-wrap">
            <div className="bg-white/10 backdrop-blur rounded-full px-3 py-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="text-xs font-medium">ISO 27001</span>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur rounded-full px-3 py-2">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span className="text-xs font-medium">Tier III</span>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur rounded-full px-3 py-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span className="text-xs font-medium">99.99% SLA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Hero */}
      <div className="mobile-hide">
        {/* Padrão de fundo elegante */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
                <svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'>
                  <defs>
                    <pattern id='grid' x='0' y='0' width='40' height='40' patternUnits='userSpaceOnUse'>
                      <path d='M 40 0 L 0 0 0 40' fill='none' stroke='white' stroke-width='1'/>
                    </pattern>
                  </defs>
                  <rect width='100%' height='100%' fill='url(#grid)' />
                </svg>
              `)}")`
            }}
          />
        </div>

        {/* Gradiente sutil overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#003D7A] via-[#0066CC] to-[#003D7A] opacity-90"></div>

        {/* Conteúdo */}
        <div className="relative z-10 container-optidata py-20 lg:py-28">
          <div className="text-center">
            {/* Badge premium */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 mb-8 border border-white/20">
              <Shield className="w-5 h-5 text-white" />
              <span className="text-sm font-medium text-white">Enterprise Cloud Solutions</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-light text-white mb-6">
              Enterprise Cloud
              <span className="block font-semibold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Computing
              </span>
            </h1>
            
            <p className="text-xl text-blue-100 mb-16 max-w-2xl mx-auto font-light leading-relaxed">
              Infraestrutura de alta performance com a confiabilidade que sua empresa precisa
            </p>
            
            {/* Métricas refinadas - Optidata Style */}
            <div className="flex justify-center items-center gap-8 max-w-4xl mx-auto flex-wrap">
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-light text-white mb-2">99.99%</div>
                <div className="text-sm text-blue-200 uppercase tracking-wider font-medium">Uptime SLA</div>
              </div>
              <div className="h-16 w-px bg-blue-300/30 hidden md:block"></div>
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-light text-white mb-2">24/7</div>
                <div className="text-sm text-blue-200 uppercase tracking-wider font-medium">Suporte Premium</div>
              </div>
              <div className="h-16 w-px bg-blue-300/30 hidden md:block"></div>
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
      </div>
    </section>
  );
};

export default HeroSection;
