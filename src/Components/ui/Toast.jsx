import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCheckCircle, 
  FiAlertCircle, 
  FiInfo, 
  FiXCircle,
  FiX,
  FiLoader
} from 'react-icons/fi';

// Custom Toast Component (if not using react-hot-toast)
const Toast = ({ 
  message, 
  type = 'info', 
  duration = 3000, 
  onClose,
  position = 'top-center',
  id 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(id), 300); // Wait for exit animation
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(id), 300);
  };

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: FiCheckCircle,
          bg: 'bg-green-500/10',
          border: 'border-green-500/20',
          text: 'text-green-400',
          iconBg: 'bg-green-500/20',
          progressBg: 'bg-green-500',
        };
      case 'error':
        return {
          icon: FiXCircle,
          bg: 'bg-red-500/10',
          border: 'border-red-500/20',
          text: 'text-red-400',
          iconBg: 'bg-red-500/20',
          progressBg: 'bg-red-500',
        };
      case 'warning':
        return {
          icon: FiAlertCircle,
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/20',
          text: 'text-yellow-400',
          iconBg: 'bg-yellow-500/20',
          progressBg: 'bg-yellow-500',
        };
      case 'loading':
        return {
          icon: FiLoader,
          bg: 'bg-purple-500/10',
          border: 'border-purple-500/20',
          text: 'text-purple-400',
          iconBg: 'bg-purple-500/20',
          progressBg: 'bg-purple-500',
        };
      default:
        return {
          icon: FiInfo,
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/20',
          text: 'text-blue-400',
          iconBg: 'bg-blue-500/20',
          progressBg: 'bg-blue-500',
        };
    }
  };

  const styles = getToastStyles();
  const Icon = styles.icon;

  const getPositionStyles = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 -translate-x-1/2';
      default:
        return 'top-4 left-1/2 -translate-x-1/2';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ 
            type: 'spring', 
            stiffness: 300, 
            damping: 25 
          }}
          className={`fixed ${getPositionStyles()} z-[100] w-[90%] max-w-sm`}
        >
          <div className={`relative overflow-hidden rounded-xl ${styles.bg} ${styles.border} border backdrop-blur-xl shadow-2xl`}>
            {/* Progress Bar */}
            {duration > 0 && (
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: duration / 1000, ease: 'linear' }}
                className={`absolute top-0 left-0 h-0.5 ${styles.progressBg}`}
              />
            )}

            <div className="flex items-start gap-3 p-4">
              {/* Icon */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${styles.iconBg} flex items-center justify-center`}>
                <motion.div
                  animate={type === 'loading' ? { rotate: 360 } : {}}
                  transition={type === 'loading' ? { duration: 1.5, repeat: Infinity, ease: 'linear' } : {}}
                >
                  <Icon className={`text-sm ${styles.text}`} />
                </motion.div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${styles.text}`}>
                  {message}
                </p>
              </div>

              {/* Close Button */}
              {type !== 'loading' && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
                  className="flex-shrink-0 p-1 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <FiX className="text-sm text-[var(--text-secondary)]" />
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Toast Container for managing multiple toasts
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2 w-[90%] max-w-sm">
      <AnimatePresence>
        {toasts.map((toast, index) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 25,
              delay: index * 0.05 
            }}
            layout
          >
            <Toast
              {...toast}
              onClose={removeToast}
              position="top-right"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Custom hook for managing toasts (alternative to react-hot-toast)
export const useCustomToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration + 300);
    }
    
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const toast = {
    success: (message, duration) => addToast(message, 'success', duration),
    error: (message, duration) => addToast(message, 'error', duration),
    warning: (message, duration) => addToast(message, 'warning', duration),
    info: (message, duration) => addToast(message, 'info', duration),
    loading: (message, duration) => addToast(message, 'loading', duration),
    dismiss: (id) => removeToast(id),
  };

  return { toasts, toast, removeToast };
};

// Toast configurations for react-hot-toast
export const toastConfig = {
  success: {
    icon: '✅',
    style: {
      background: 'var(--glass-bg)',
      color: 'var(--text-primary)',
      border: '1px solid rgba(34, 197, 94, 0.2)',
      backdropFilter: 'blur(20px)',
    },
  },
  error: {
    icon: '❌',
    style: {
      background: 'var(--glass-bg)',
      color: 'var(--text-primary)',
      border: '1px solid rgba(239, 68, 68, 0.2)',
      backdropFilter: 'blur(20px)',
    },
  },
  loading: {
    icon: '⏳',
    style: {
      background: 'var(--glass-bg)',
      color: 'var(--text-primary)',
      border: '1px solid rgba(168, 85, 247, 0.2)',
      backdropFilter: 'blur(20px)',
    },
  },
};

// Export custom toast component as named export
export const CustomToast = ({
  message,
  type = 'info',
  isVisible = true,
  onClose,
}) => {
  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'from-green-500/10 to-emerald-500/5',
          border: 'border-green-500/20',
          icon: '✅',
          textColor: 'text-green-400',
        };
      case 'error':
        return {
          bg: 'from-red-500/10 to-rose-500/5',
          border: 'border-red-500/20',
          icon: '❌',
          textColor: 'text-red-400',
        };
      case 'warning':
        return {
          bg: 'from-yellow-500/10 to-amber-500/5',
          border: 'border-yellow-500/20',
          icon: '⚠️',
          textColor: 'text-yellow-400',
        };
      case 'info':
        return {
          bg: 'from-blue-500/10 to-cyan-500/5',
          border: 'border-blue-500/20',
          icon: 'ℹ️',
          textColor: 'text-blue-400',
        };
      default:
        return {
          bg: 'from-gray-500/10 to-slate-500/5',
          border: 'border-gray-500/20',
          icon: '📢',
          textColor: 'text-gray-400',
        };
    }
  };

  const styles = getStyles();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          className="overflow-hidden"
        >
          <div className={`p-4 rounded-xl bg-gradient-to-br ${styles.bg} border ${styles.border} backdrop-blur-xl`}>
            <div className="flex items-center gap-3">
              <span className="text-lg">{styles.icon}</span>
              <p className={`text-sm font-medium ${styles.textColor} flex-1`}>
                {message}
              </p>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <FiX className="text-sm text-[var(--text-secondary)]" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;