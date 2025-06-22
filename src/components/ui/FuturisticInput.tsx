
import { motion } from "framer-motion";
import { useState } from "react";

interface FuturisticInputProps {
  label: string;
  value: string | number;
  onChange: (value: any) => void;
  type?: "text" | "number" | "email";
  placeholder?: string;
  disabled?: boolean;
}

export const FuturisticInput = ({ 
  label, 
  value, 
  onChange, 
  type = "text",
  placeholder,
  disabled = false
}: FuturisticInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative group">
      <label className="text-gray-400 text-sm font-medium block mb-2">{label}</label>
      
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="
            w-full px-4 py-3 
            bg-gray-900/50 backdrop-blur-sm
            border-2 border-gray-700
            rounded-lg text-white
            focus:border-cyan-400 focus:outline-none
            focus:bg-gray-900/70
            transition-all duration-300
            hover:bg-gray-900/70
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        />
        
        {/* Linha de foco animada */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isFocused ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Glow effect quando focado */}
        {isFocused && (
          <motion.div
            className="absolute inset-0 bg-cyan-400/10 rounded-lg -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </div>
    </div>
  );
};
