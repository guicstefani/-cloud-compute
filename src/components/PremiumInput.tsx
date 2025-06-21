
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

interface PremiumInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  showPasswordToggle?: boolean;
  fullWidth?: boolean;
  variant?: 'default' | 'premium' | 'minimal';
}

const PremiumInput = React.forwardRef<HTMLInputElement, PremiumInputProps>(({
  label,
  error,
  success,
  hint,
  icon,
  iconPosition = 'left',
  showPasswordToggle = false,
  fullWidth = true,
  variant = 'default',
  className = '',
  type = 'text',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = showPasswordToggle && type === 'password' 
    ? (showPassword ? 'text' : 'password') 
    : type;

  const hasError = Boolean(error);
  const hasSuccess = Boolean(success);

  const baseInputClasses = `
    w-full px-4 py-3 text-base transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-offset-1
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `;

  const variantClasses = {
    default: `
      bg-white border-2 rounded-xl
      ${hasError 
        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
        : hasSuccess
        ? 'border-green-300 focus:border-green-500 focus:ring-green-500/20'
        : 'border-gray-200 focus:border-amber-400 focus:ring-amber-500/20 hover:border-gray-300'
      }
    `,
    premium: `
      bg-gradient-to-r from-gray-50 to-white border-2 rounded-xl
      shadow-sm hover:shadow-md focus:shadow-lg
      ${hasError 
        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
        : hasSuccess
        ? 'border-green-300 focus:border-green-500 focus:ring-green-500/20'
        : 'border-amber-200 focus:border-amber-400 focus:ring-amber-500/20 hover:border-amber-300'
      }
    `,
    minimal: `
      bg-transparent border-0 border-b-2 rounded-none px-0
      ${hasError 
        ? 'border-red-300 focus:border-red-500' 
        : hasSuccess
        ? 'border-green-300 focus:border-green-500'
        : 'border-gray-200 focus:border-amber-400 hover:border-gray-300'
      }
    `
  };

  const iconClasses = `
    absolute top-1/2 transform -translate-y-1/2 
    ${iconPosition === 'left' ? 'left-3' : 'right-3'}
    ${hasError ? 'text-red-400' : hasSuccess ? 'text-green-400' : 'text-gray-400'}
  `;

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {/* Label */}
      {label && (
        <motion.label
          className={`block text-sm font-semibold mb-2 transition-colors duration-200 ${
            isFocused 
              ? hasError 
                ? 'text-red-600' 
                : hasSuccess 
                ? 'text-green-600' 
                : 'text-amber-600'
              : 'text-gray-700'
          }`}
          initial={{ opacity: 0.7 }}
          animate={{ opacity: isFocused ? 1 : 0.7 }}
        >
          {label}
        </motion.label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Icon */}
        {icon && (
          <div className={iconClasses}>
            {icon}
          </div>
        )}

        {/* Input */}
        <motion.input
          ref={ref}
          type={inputType}
          className={`
            ${baseInputClasses} 
            ${variantClasses[variant]}
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${(icon && iconPosition === 'right') || showPasswordToggle ? 'pr-10' : ''}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          whileFocus={{ scale: variant === 'premium' ? 1.01 : 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          {...props}
        />

        {/* Password Toggle */}
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </motion.div>
          </button>
        )}

        {/* Status Icons */}
        {(hasError || hasSuccess) && !icon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {hasError && <AlertCircle className="w-5 h-5 text-red-400" />}
            {hasSuccess && <CheckCircle2 className="w-5 h-5 text-green-400" />}
          </div>
        )}

        {/* Focus ring effect */}
        <AnimatePresence>
          {isFocused && variant === 'premium' && (
            <motion.div
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400/10 to-yellow-400/10 pointer-events-none"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Messages */}
      <AnimatePresence mode="wait">
        {(error || success || hint) && (
          <motion.div
            className="mt-2"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {error && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            )}
            {success && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                {success}
              </p>
            )}
            {hint && !error && !success && (
              <p className="text-sm text-gray-500">{hint}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

PremiumInput.displayName = 'PremiumInput';

export default PremiumInput;
