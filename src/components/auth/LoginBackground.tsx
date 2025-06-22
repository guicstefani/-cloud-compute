
import React from 'react';

export const LoginBackground: React.FC = () => {
  return (
    <>
      {/* Gradiente de fundo */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black" />
      
      {/* Partículas douradas flutuantes */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-[#DCAE1D] to-[#F4C430] opacity-20"
            style={{
              width: Math.random() * 4 + 1 + 'px',
              height: Math.random() * 4 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `float ${Math.random() * 10 + 10}s infinite linear`,
              animationDelay: Math.random() * 10 + 's'
            }}
          />
        ))}
      </div>

      {/* Efeito de blur no centro */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/50" />
      
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(100vh) translateX(0px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.2;
          }
          90% {
            opacity: 0.2;
          }
          100% {
            transform: translateY(-100px) translateX(${Math.random() * 200 - 100}px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};
