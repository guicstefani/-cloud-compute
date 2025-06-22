
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FuturisticCardProps {
  children: ReactNode;
  className?: string;
  highlight?: boolean;
  onClick?: () => void;
}

export const FuturisticCard = ({ 
  children, 
  className = "", 
  highlight = false,
  onClick 
}: FuturisticCardProps) => {
  const baseClasses = `
    relative overflow-hidden rounded-2xl cursor-pointer
    bg-gradient-to-br from-gray-800/40 to-gray-900/40
    backdrop-blur-md border transition-all duration-300
    ${highlight 
      ? 'border-cyan-400/50 shadow-2xl shadow-cyan-500/20' 
      : 'border-gray-700/50 shadow-xl shadow-black/50'
    }
    hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-500/20
  `;
  
  return (
    <motion.div
      className={`${baseClasses} ${className}`}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Linha de brilho superior */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
      
      {/* Conteúdo */}
      <div className="relative z-10 p-6">{children}</div>
      
      {/* Efeito de reflexo */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-transparent pointer-events-none" />
    </motion.div>
  );
};
