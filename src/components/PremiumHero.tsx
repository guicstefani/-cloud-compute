
import React from 'react';
import { Shield, Award, Zap, Check, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const PremiumHero = () => {
  return (
    <div className="relative bg-gradient-to-br from-black via-gray-900 to-amber-900/20 text-white overflow-hidden min-h-[60vh]">
      {/* Animated Background Effects */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-amber-500/20 to-transparent rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-yellow-500/10 to-transparent rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -40, -20],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-6"
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6"
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(245, 158, 11, 0.3)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-amber-200 text-sm font-semibold">Calculadora Premium Optidata</span>
            </motion.div>
            
            <motion.h1 
              className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-amber-200 to-amber-400"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
            >
              Cloud Computing
            </motion.h1>
          </motion.div>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Infraestrutura Enterprise de Alta Performance com{' '}
            <span className="text-amber-400 font-semibold">Transparência Total de Custos</span>
          </motion.p>
          
          {/* Premium Trust Badges */}
          <motion.div 
            className="flex flex-wrap gap-6 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            {[
              { icon: <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />, text: "99.99% Uptime", color: "from-green-400 to-emerald-600" },
              { icon: <Shield className="w-5 h-5" />, text: "ISO 27001", color: "from-blue-400 to-blue-600" },
              { icon: <Award className="w-5 h-5" />, text: "Tier III", color: "from-purple-400 to-purple-600" },
              { icon: <Zap className="w-5 h-5" />, text: "Deploy em 5min", color: "from-amber-400 to-orange-600" },
              { icon: <TrendingUp className="w-5 h-5" />, text: "ROI Garantido", color: "from-amber-400 to-yellow-600" }
            ].map((badge, index) => (
              <motion.div
                key={index}
                className="group relative"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-yellow-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-black/40 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-3 border border-amber-500/20 group-hover:border-amber-400/40 transition-all duration-300">
                  <motion.div
                    className="text-amber-400"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {badge.icon}
                  </motion.div>
                  <span className="text-sm font-semibold bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
                    {badge.text}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            {[
              { number: "10,000+", label: "VMs Criadas", suffix: "" },
              { number: "R$ 50M+", label: "Economia Gerada", suffix: "" },
              { number: "500+", label: "Clientes Enterprise", suffix: "" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative">
                  <motion.div 
                    className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent mb-2"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 1 + index * 0.1 }}
                  >
                    {stat.number}
                  </motion.div>
                  <p className="text-gray-400 font-medium group-hover:text-amber-300 transition-colors duration-300">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent" />
    </div>
  );
};

export default PremiumHero;
