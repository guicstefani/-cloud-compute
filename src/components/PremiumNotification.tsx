
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react';

interface NotificationProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const PremiumNotification: React.FC<NotificationProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
  action
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  };

  const colors = {
    success: {
      bg: 'from-green-50 to-emerald-50',
      border: 'border-green-200',
      icon: 'text-green-600',
      title: 'text-green-900',
      message: 'text-green-700',
      glow: 'shadow-green-500/20'
    },
    error: {
      bg: 'from-red-50 to-rose-50',
      border: 'border-red-200',
      icon: 'text-red-600',
      title: 'text-red-900',
      message: 'text-red-700',
      glow: 'shadow-red-500/20'
    },
    warning: {
      bg: 'from-amber-50 to-yellow-50',
      border: 'border-amber-200',
      icon: 'text-amber-600',
      title: 'text-amber-900',
      message: 'text-amber-700',
      glow: 'shadow-amber-500/20'
    },
    info: {
      bg: 'from-blue-50 to-cyan-50',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      title: 'text-blue-900',
      message: 'text-blue-700',
      glow: 'shadow-blue-500/20'
    }
  };

  const Icon = icons[type];
  const colorScheme = colors[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`
        relative bg-gradient-to-r ${colorScheme.bg} border ${colorScheme.border}
        rounded-xl p-4 shadow-lg ${colorScheme.glow} max-w-md w-full
        backdrop-blur-sm
      `}
    >
      {/* Progress bar */}
      {duration > 0 && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-b-xl"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: "linear" }}
        />
      )}

      <div className="flex items-start space-x-3">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
        >
          <Icon className={`w-6 h-6 ${colorScheme.icon} flex-shrink-0`} />
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <motion.h4
            className={`font-semibold ${colorScheme.title}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {title}
          </motion.h4>
          {message && (
            <motion.p
              className={`text-sm ${colorScheme.message} mt-1`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {message}
            </motion.p>
          )}
          {action && (
            <motion.button
              onClick={action.onClick}
              className="text-sm font-medium text-amber-600 hover:text-amber-700 mt-2 underline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {action.label}
            </motion.button>
          )}
        </div>

        {/* Close button */}
        <motion.button
          onClick={() => onClose(id)}
          className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-xl"
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          repeatDelay: 3,
          ease: "easeInOut" 
        }}
      />
    </motion.div>
  );
};

// Notification container component
interface NotificationContainerProps {
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
    action?: {
      label: string;
      onClick: () => void;
    };
  }>;
  onClose: (id: string) => void;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onClose
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <PremiumNotification
            key={notification.id}
            {...notification}
            onClose={onClose}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default PremiumNotification;
