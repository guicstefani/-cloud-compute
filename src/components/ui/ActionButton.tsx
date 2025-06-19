
import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { designSystem } from '@/styles/designSystem';

interface ActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

const ActionButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  fullWidth = false
}: ActionButtonProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return `bg-[${designSystem.colors.primary}] hover:bg-[${designSystem.colors.primaryHover}] text-black border-0`;
      case 'secondary':
        return `bg-[${designSystem.colors.surface}] hover:bg-[${designSystem.colors.surfaceHover}] text-white border border-[${designSystem.colors.border}]`;
      case 'ghost':
        return `bg-transparent hover:bg-[${designSystem.colors.surface}] text-white border-0`;
      default:
        return `bg-[${designSystem.colors.primary}] hover:bg-[${designSystem.colors.primaryHover}] text-black border-0`;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm';
      case 'md':
        return 'px-6 py-3 text-base';
      case 'lg':
        return 'px-8 py-4 text-lg';
      default:
        return 'px-6 py-3 text-base';
    }
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${fullWidth ? 'w-full' : ''}
        relative overflow-hidden rounded-lg font-semibold
        transition-all duration-200 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-[${designSystem.colors.primary}] focus:ring-opacity-50
        ${className}
      `}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="flex items-center justify-center"
        >
          <Loader2 className="w-5 h-5" />
        </motion.div>
      ) : (
        <>
          {children}
          <motion.div
            className="absolute inset-0 bg-white opacity-20"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.5 }}
          />
        </>
      )}
    </motion.button>
  );
};

export default ActionButton;
