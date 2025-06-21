
import React from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

interface PremiumInputProps {
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  error?: string;
  success?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  required?: boolean;
  autoComplete?: string;
}

const PremiumInput: React.FC<PremiumInputProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  success,
  disabled,
  icon,
  rightIcon,
  className = '',
  required,
  autoComplete
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(value || '');

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {label && (
        <motion.label
          className="block text-sm font-medium text-gray-700 mb-2"
          animate={{ 
            color: error ? '#ef4444' : success ? '#10b981' : isFocused ? '#f59e0b' : '#374151' 
          }}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <motion.input
          type={inputType}
          value={internalValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          className={`
            w-full px-4 py-3 rounded-xl border-2 transition-all duration-300
            ${icon ? 'pl-10' : ''}
            ${type === 'password' || rightIcon ? 'pr-10' : ''}
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
              : success 
                ? 'border-green-300 focus:border-green-500 focus:ring-green-500/20'
                : 'border-gray-300 focus:border-amber-500 focus:ring-amber-500/20'
            }
            focus:outline-none focus:ring-4
            disabled:opacity-50 disabled:cursor-not-allowed
            bg-white placeholder-gray-400
          `}
          whileFocus={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
        
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
        
        {rightIcon && type !== 'password' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
        
        {/* Focus indicator */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          initial={false}
          animate={{
            boxShadow: isFocused 
              ? error 
                ? '0 0 0 3px rgba(239, 68, 68, 0.1)'
                : success 
                  ? '0 0 0 3px rgba(16, 185, 129, 0.1)'
                  : '0 0 0 3px rgba(245, 158, 11, 0.1)'
              : 'none'
          }}
          transition={{ duration: 0.2 }}
        />
      </div>
      
      {/* Error/Success message */}
      {(error || success) && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-2 text-sm ${error ? 'text-red-600' : 'text-green-600'}`}
        >
          {error || (success && '✓ Válido')}
        </motion.div>
      )}
    </motion.div>
  );
};

export default PremiumInput;
