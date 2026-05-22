import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock, FiShield, FiLoader } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { ADMIN_EMAIL } from '../../utils/constants';

const AuthGuard = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(true);

  // Show loader for minimum time to avoid flash
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Loading state
  if (loading || showLoader) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          {/* Animated Logo */}
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
              scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
            }}
            className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center"
          >
            <FiLoader className="text-2xl text-white" />
          </motion.div>
          
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
            CONFERIA
          </h2>
          <p className="text-sm text-[var(--text-secondary)] flex items-center justify-center gap-2">
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Verifying access
            </motion.span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            >
              .
            </motion.span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.7 }}
            >
              .
            </motion.span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.9 }}
            >
              .
            </motion.span>
          </p>
        </motion.div>
      </div>
    );
  }

  // Not authenticated - Redirect to login
  if (!user) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }}
        replace 
      />
    );
  }

  // Not approved - Redirect to waiting approval
  if (!user.isApproved) {
    return <Navigate to="/waiting-approval" replace />;
  }

  // Admin access required but user is not admin
  if (requireAdmin && user.email !== ADMIN_EMAIL) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4"
      >
        <div className="glass-card max-w-md w-full text-center">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, -10, 10, -10, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center"
          >
            <FiLock className="text-3xl text-red-400" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Access Denied
          </h2>
          <p className="text-[var(--text-secondary)] mb-6">
            You don't have permission to access the admin dashboard. 
            This area is restricted to administrators only.
          </p>
          
          <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-red-500/5 border border-red-500/10 mb-6">
            <FiShield className="text-red-400" />
            <p className="text-xs text-[var(--text-secondary)] text-left">
              If you believe this is a mistake, please contact the system administrator 
              at survivor3550@gmail.com
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.history.back()}
            className="glass-button text-white px-8"
          >
            Go Back
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // User is authenticated and authorized
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

// Higher-order component for admin routes
export const AdminGuard = ({ children }) => {
  return (
    <AuthGuard requireAdmin={true}>
      {children}
    </AuthGuard>
  );
};

export default AuthGuard;