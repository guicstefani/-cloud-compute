
import React from 'react';
import { Calculator, Cloud, Shield, Zap } from 'lucide-react';

const ModernHero = () => {
  return (
    <>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.08]"
          style={{
            background: `
              radial-gradient(circle at 20% 50%, #FFB300 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, #8A2BE2 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, #FFB300 0%, transparent 50%)
            `,
            animation: 'meshFlow 20s ease-in-out infinite'
          }}
        />
      </div>

      {/* Header Section */}
      <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden">
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 lg:px-6 text-center">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#FFB300] to-[#8A2BE2] rounded-2xl flex items-center justify-center shadow-2xl">
              <Calculator className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl lg:text-6xl font-light text-gray-900 mb-4 tracking-tight">
            Calculadora
            <span className="block font-semibold bg-gradient-to-r from-[#FFB300] to-[#8A2BE2] bg-clip-text text-transparent">
              Cloud Privada
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg lg:text-xl text-gray-600 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Configure e dimensione sua infraestrutura de nuvem privada com precisão profissional
          </p>
          
          {/* Feature Badges */}
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm text-gray-800 px-6 py-3 rounded-full shadow-lg border border-gray-200/50">
              <Shield className="w-5 h-5 text-[#FFB300]" />
              <span className="text-sm font-medium">Enterprise Security</span>
            </div>
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm text-gray-800 px-6 py-3 rounded-full shadow-lg border border-gray-200/50">
              <Cloud className="w-5 h-5 text-[#8A2BE2]" />
              <span className="text-sm font-medium">Multi-Cloud Ready</span>
            </div>
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm text-gray-800 px-6 py-3 rounded-full shadow-lg border border-gray-200/50">
              <Zap className="w-5 h-5 text-[#FFB300]" />
              <span className="text-sm font-medium">High Performance</span>
            </div>
          </div>
        </div>

        {/* Fade Gradient Overlay */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(249, 250, 251, 0.8) 70%, rgb(249, 250, 251) 100%)'
          }}
        />
      </section>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes meshFlow {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(-10px, -10px) scale(1.05);
          }
          50% {
            transform: translate(10px, 5px) scale(0.98);
          }
          75% {
            transform: translate(-5px, 10px) scale(1.02);
          }
        }
      `}</style>
    </>
  );
};

export default ModernHero;
