
import React, { useEffect, useRef } from 'react';

export const CosmicBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Criar partículas douradas flutuantes
    const createParticles = () => {
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'gold-particle';
        
        // Variações aleatórias para movimento orgânico
        const duration = 8 + Math.random() * 12; // 8-20s
        const delay = Math.random() * 10; // 0-10s
        const drift = -50 + Math.random() * 100; // -50px a +50px
        
        particle.style.setProperty('--duration', `${duration}s`);
        particle.style.setProperty('--delay', `${delay}s`);
        particle.style.setProperty('--drift', `${drift}px`);
        particle.style.left = `${Math.random() * 100}%`;
        
        // Tamanhos variados
        const size = 1 + Math.random() * 3;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        container.appendChild(particle);
      }
    };

    createParticles();

    // Limpar partículas quando componente for desmontado
    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return <div ref={containerRef} className="cosmic-background" />;
};
