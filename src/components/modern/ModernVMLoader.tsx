
import { motion } from "framer-motion";
import { Server, Database, Cpu, HardDrive } from "lucide-react";

export const ModernVMLoader = () => {
  const icons = [Server, Database, Cpu, HardDrive];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 relative flex items-center justify-center">
      {/* Background effects */}
      <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-radial from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10 text-center">
        {/* Animated Icons */}
        <div className="flex justify-center gap-4 mb-8">
          {icons.map((Icon, index) => (
            <motion.div
              key={index}
              className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 2,
                delay: index * 0.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Icon className="w-6 h-6 text-cyan-400" />
            </motion.div>
          ))}
        </div>
        
        {/* Loading Text */}
        <motion.h2
          className="text-2xl font-bold text-white mb-4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Inicializando Calculadora
        </motion.h2>
        
        <motion.p
          className="text-gray-400"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
        >
          Carregando recursos e configurações...
        </motion.p>
        
        {/* Progress Bar */}
        <div className="w-64 h-2 bg-gray-800 rounded-full mx-auto mt-6 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
};
