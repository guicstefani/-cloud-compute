
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface NeonButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "success";
  disabled?: boolean;
  className?: string;
}

export const NeonButton = ({ 
  children, 
  onClick, 
  variant = "primary",
  disabled = false,
  className = ""
}: NeonButtonProps) => {
  const variants = {
    primary: "from-cyan-500 to-blue-500 hover:shadow-cyan-500/50",
    secondary: "from-purple-500 to-pink-500 hover:shadow-purple-500/50",
    success: "from-green-500 to-emerald-500 hover:shadow-green-500/50"
  };
  
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative px-8 py-4 rounded-xl font-bold text-white
        bg-gradient-to-r ${variants[variant]}
        transition-all duration-300
        hover:scale-105 hover:shadow-2xl
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {/* Conteúdo */}
      <span className="relative z-10">{children}</span>
      
      {/* Borda brilhante */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent"
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.button>
  );
};
