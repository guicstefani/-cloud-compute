
import { motion } from "framer-motion";

interface MoneyDisplayProps {
  value: number;
  label: string;
  size?: "sm" | "md" | "lg";
}

export const MoneyDisplay = ({ value, label, size = "lg" }: MoneyDisplayProps) => {
  const sizeClasses = {
    sm: "text-2xl",
    md: "text-4xl", 
    lg: "text-6xl"
  };

  return (
    <div className="relative">
      {/* Label discreto */}
      <p className="text-gray-400 text-sm mb-2 font-medium">{label}</p>
      
      {/* Valor monumental */}
      <div className="relative">
        <motion.h2 
          className={`${sizeClasses[size]} font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </motion.h2>
        
        {/* Glow effect */}
        <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-yellow-400/20 to-orange-500/20 -z-10" />
      </div>
      
      {/* Linha de energia */}
      <motion.div 
        className="h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mt-4"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  );
};
