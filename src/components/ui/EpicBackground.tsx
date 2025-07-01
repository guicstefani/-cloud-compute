
import React from 'react';

const EpicBackground = () => (
  <div className="fixed inset-0 z-0">
    {/* Gradiente animado */}
    <div className="absolute inset-0 opacity-20">
      <div className="absolute top-20 left-20 w-96 h-96 bg-gold/20 rounded-full filter blur-[128px] animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gold-light/20 rounded-full filter blur-[128px] animate-pulse" 
           style={{ animationDelay: '2s' }} />
    </div>
    
    {/* Grid */}
    <div 
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `
          linear-gradient(#DCAE1D 1px, transparent 1px),
          linear-gradient(90deg, #DCAE1D 1px, transparent 1px)
        `,
        backgroundSize: '100px 100px'
      }}
    />
  </div>
);

export default EpicBackground;
