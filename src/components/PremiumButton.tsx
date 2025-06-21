
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface PremiumButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  glow?: boolean;
}

const PremiumButton = React.forwardRef<HTMLButtonElement, PremiumButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  glow = false,
  className = '',
  disabled,
  ...props
}, ref) => {
  const baseClasses = `
    inline-flex items-center justify-center gap-2 font-semibold rounded-xl
    transition-all duration-300 relative overflow-hidden
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `;

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-amber-500 to-yellow-500 text-black
      hover:from-amber-400 hover:to-yellow-400
      focus:ring-amber-500 shadow-lg hover:shadow-xl
      hover:shadow-amber-500/25
      ${glow ? 'shadow-2xl shadow-amber-500/30' : ''}
    `,
    secondary: `
      bg-white text-gray-900 border-2 border-gray-200
      hover:border-amber-300 hover:bg-amber-50
      focus:ring-amber-500 shadow-sm hover:shadow-md
    `,
    ghost: `
      bg-transparent text-gray-700 hover:bg-amber-50
      hover:text-amber-700 focus:ring-amber-500
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-red-600 text-white
      hover:from-red-400 hover:to-red-500
      focus:ring-red-500 shadow-lg hover:shadow-xl
      hover:shadow-red-500/25
    `
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  const isDisabled = disabled || loading;

  return (
    <motion.button
      ref={ref}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.02, y: -1 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...props}
    >
      {/* Background shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
        animate={!isDisabled ? {
          translateX: ['0%', '200%'],
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "easeInOut"
        }}
      />

      {/* Content */}
      <div className="relative flex items-center gap-2">
        {loading && (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
        
        {!loading && icon && iconPosition === 'left' && (
          <motion.div
            initial={{ rotate: 0 }}
            whileHover={{ rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {icon}
          </motion.div>
        )}
        
        <span>{children}</span>
        
        {!loading && icon && iconPosition === 'right' && (
          <motion.div
            initial={{ rotate: 0 }}
            whileHover={{ rotate: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {icon}
          </motion.div>
        )}
      </div>
    </motion.button>
  );
});

PremiumButton.displayName = 'PremiumButton';

export default PremiumButton;
