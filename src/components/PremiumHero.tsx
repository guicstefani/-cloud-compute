import React from 'react';
import { Calculator, Shield, Award, Zap } from 'lucide-react';

const PremiumHero = () => {
  return (
    <>
      {/* Background Effects */}
      <div className="background-container">
        <div className="background-gradient animate-floatGradient"></div>
        <div className="grid-background animate-gridMove"></div>
        <div className="orb orb1 animate-floatOrb"></div>
        <div className="orb orb2 animate-floatOrb"></div>
        <div className="orb orb3 animate-floatOrb"></div>
      </div>

      {/* Premium Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="container mx-auto px-4 py-16">
          {/* Main Header */}
          <header className="text-center mb-16 animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-black mb-6 text-gradient-gold uppercase tracking-wider">
              OptiCloud
            </h1>
            <p className="text-2xl md:text-3xl text-white/80 mb-4 font-light">
              Premium Cloud Computing
            </p>
            <p className="text-lg text-white/60 max-w-3xl mx-auto leading-relaxed">
              Infraestrutura Enterprise de Alta Performance com Transparência Total de Custos
            </p>
          </header>

          {/* Stats Bar */}
          <div className="flex flex-wrap gap-6 justify-center mb-16 animate-slide-up">
            <div className="glass-effect rounded-2xl p-6 flex items-center gap-4 hover:glow-gold transition-all duration-300 hover:-translate-y-2">
              <div className="relative">
                <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <div className="text-xl font-bold text-gold">99.99%</div>
                <div className="text-sm text-white/60">Uptime</div>
              </div>
            </div>

            <div className="glass-effect rounded-2xl p-6 flex items-center gap-4 hover:glow-gold transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-gold" />
              </div>
              <div>
                <div className="text-xl font-bold text-gold">ISO 27001</div>
                <div className="text-sm text-white/60">Certificado</div>
              </div>
            </div>

            <div className="glass-effect rounded-2xl p-6 flex items-center gap-4 hover:glow-gold transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-gold" />
              </div>
              <div>
                <div className="text-xl font-bold text-gold">Tier III</div>
                <div className="text-sm text-white/60">Datacenter</div>
              </div>
            </div>

            <div className="glass-effect rounded-2xl p-6 flex items-center gap-4 hover:glow-gold transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-gold" />
              </div>
              <div>
                <div className="text-xl font-bold text-gold">Deploy 5min</div>
                <div className="text-sm text-white/60">Provisionamento</div>
              </div>
            </div>
          </div>

          {/* Calculator Header */}
          <div className="text-center animate-scale-in">
            <div className="glass-effect rounded-3xl p-8 max-w-4xl mx-auto relative overflow-hidden">
              {/* Rotating Background Effect */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-r from-gold/30 to-transparent rounded-full animate-rotate"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gold-gradient rounded-2xl flex items-center justify-center glow-gold">
                    <Calculator className="w-8 h-8 text-black" />
                  </div>
                  <h2 className="text-4xl font-bold text-white">
                    Calculadora de Projetos
                  </h2>
                </div>
                
                <p className="text-xl text-white/70 mb-8">
                  Configure e dimensione sua infraestrutura cloud com precisão enterprise
                </p>

                {/* Feature Pills */}
                <div className="flex flex-wrap gap-3 justify-center">
                  <span className="px-4 py-2 bg-white/10 rounded-full text-sm text-white/80 border border-white/20">
                    ✅ Cálculos Oficiais OptiData
                  </span>
                  <span className="px-4 py-2 bg-white/10 rounded-full text-sm text-white/80 border border-white/20">
                    💎 Configuração Premium
                  </span>
                  <span className="px-4 py-2 bg-white/10 rounded-full text-sm text-white/80 border border-white/20">
                    🚀 Deploy Instantâneo
                  </span>
                  <span className="px-4 py-2 bg-white/10 rounded-full text-sm text-white/80 border border-white/20">
                    📊 Relatórios Detalhados
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PremiumHero;