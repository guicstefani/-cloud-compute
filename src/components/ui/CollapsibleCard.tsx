
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { designSystem } from '@/styles/designSystem';

interface CollapsibleCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  subtitle?: string;
  badge?: string;
  className?: string;
}

const CollapsibleCard = ({
  title,
  icon,
  children,
  defaultOpen = false,
  subtitle,
  badge,
  className = ''
}: CollapsibleCardProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.div 
      className={`bg-[${designSystem.colors.surface}] border border-[${designSystem.colors.border}] rounded-xl overflow-hidden ${className}`}
      initial={false}
      whileHover={{ borderColor: designSystem.colors.primary }}
      transition={{ duration: 0.2 }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-6 flex items-center justify-between hover:bg-[${designSystem.colors.surfaceHover}] transition-colors duration-200`}
      >
        <div className="flex items-center gap-4">
          <motion.div 
            className={`w-12 h-12 bg-[${designSystem.colors.primary}]/10 rounded-lg flex items-center justify-center`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="text-[#FFD500]">
              {icon}
            </div>
          </motion.div>
          <div className="text-left">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              {badge && (
                <span className={`px-2 py-1 bg-[${designSystem.colors.primary}] text-black text-xs font-medium rounded-full`}>
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-6 h-6 text-[#FFD500]" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
            className={`border-t border-[${designSystem.colors.border}]`}
          >
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CollapsibleCard;
