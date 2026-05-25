import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiClock, 
  FiCheckCircle, 
  FiAlertCircle,
  FiShield,
  FiMail,
  FiRefreshCw,
  FiLogOut,
  FiInfo,
  FiUserCheck,
  FiUsers,
  FiArrowLeft
} from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth.jsx';
import toast from 'react-hot-toast';

const WaitingApproval = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [elapsedTime, setElapsedTime] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [checkCount, setCheckCount] = useState(0);

  // Calculate elapsed time since registration
  useEffect(() => {
    const registrationTime = new Date(Date.now() - 3600000 * 2); // 2 hours ago for demo
    
    const updateElapsed = () => {
      const now = new Date();
      const diff = now - registrationTime;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 0) {
        setElapsedTime(`${hours}h ${minutes}m`);
      } else {
        setElapsedTime(`${minutes}m`);
      }
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Check approval status
  const handleCheckStatus = async () => {
    setIsChecking(true);
    
    // Firebase: Check if user status changed to 'approved'
    // const userDoc = await getDoc(doc(db, 'users', user.uid));
    // if (userDoc.data()?.status === 'active') {
    //   navigate('/feed');
    // }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setCheckCount(prev => prev + 1);
    setIsChecking(false);
    
    if (checkCount >= 3) {
      toast('Still pending. Some approvals take up to 24 hours.', {
        icon: '⏰',
        duration: 4000,
      });
    } else {
      toast('Account still under review. Please wait.', {
        icon: '🔍',
        duration: 3000,
      });
    }
  };

  // Handle logout
  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to sign out? You can check again later.')) {
      await logout();
      navigate('/login');
      toast.success('Signed out. Check back soon!');
    }
  };

  // If user is already approved, redirect to feed
  useEffect(() => {
    if (user?.isApproved) {
      navigate('/feed');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4 py-12">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-lg relative"
      >
        {/* Main Card */}
        <div className="glass-card text-center relative overflow-hidden">
          {/* Decorative top gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500" />
          
          {/* Animated Clock Icon */}
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-yellow-500/10 border-2 border-yellow-500/20 flex items-center justify-center relative"
          >
            <FiClock className="text-4xl text-yellow-400" />
            
            {/* Orbiting dots */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: i * 1,
                }}
                className="absolute w-2 h-2 rounded-full bg-yellow-400"
                style={{
                  top: '50%',
                  left: '50%',
                  transformOrigin: `0 -${12 + i * 4}px`,
                }}
              />
            ))}
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-2">
              Account Under Review
            </h1>
            <p className="text-[var(--text-secondary)] text-sm mb-6">
              Your account is pending admin verification
            </p>
          </motion.div>

          {/* Status Timeline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 mb-8 px-4"
          >
            {/* Step 1 - Completed */}
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <FiCheckCircle className="text-green-400 text-lg" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-sm font-semibold text-green-400">
                  Account Created
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Your registration was successful
                </p>
              </div>
              <span className="text-xs text-[var(--text-secondary)]">✓</span>
            </div>

            {/* Connector Line */}
            <div className="w-0.5 h-6 bg-[var(--glass-border)] ml-5" />

            {/* Step 2 - In Progress */}
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center"
              >
                <FiUserCheck className="text-yellow-400 text-lg" />
              </motion.div>
              <div className="flex-1 text-left">
                <h3 className="text-sm font-semibold text-yellow-400">
                  Verification in Progress
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Admin is reviewing your details
                </p>
              </div>
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-yellow-400"
              />
            </div>

            {/* Connector Line */}
            <div className="w-0.5 h-6 bg-[var(--glass-border)] ml-5" />

            {/* Step 3 - Pending */}
            <div className="flex items-center gap-4 opacity-50">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-500/20 flex items-center justify-center">
                <FiUsers className="text-gray-400 text-lg" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-sm font-semibold text-[var(--text-secondary)]">
                  Access Granted
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Start posting anonymously
                </p>
              </div>
              <span className="text-xs text-[var(--text-secondary)]">⏳</span>
            </div>
          </motion.div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mx-4 mb-6 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/10"
          >
            <div className="flex items-start gap-3">
              <FiInfo className="text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <h4 className="text-sm font-medium text-yellow-400 mb-1">
                  What to expect
                </h4>
                <ul className="space-y-1 text-xs text-[var(--text-secondary)]">
                  <li>• Verification usually takes 1-4 hours</li>
                  <li>• You'll receive an anonymous username and avatar</li>
                  <li>• Your real identity stays completely hidden</li>
                  <li>• You can check status below or come back later</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Time Elapsed */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mb-6"
          >
            <p className="text-xs text-[var(--text-secondary)]">
              Waiting time: <span className="text-yellow-400 font-medium">{elapsedTime}</span>
            </p>
            {checkCount > 0 && (
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Checked {checkCount} time{checkCount > 1 ? 's' : ''}
              </p>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="space-y-3 px-4 pb-6"
          >
            {/* Check Status Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckStatus}
              disabled={isChecking}
              className="w-full glass-button text-white py-3 flex items-center justify-center gap-2 font-medium"
            >
              {isChecking ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <FiRefreshCw className="text-lg" />
                  Check Approval Status
                </>
              )}
            </motion.button>

            {/* Contact Admin */}
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="mailto:survivor3550@gmail.com"
              className="w-full glass-morphism text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-all text-sm"
            >
              <FiMail className="text-lg" />
              Contact Admin for Help
            </motion.a>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--glass-border)]" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 text-xs text-[var(--text-secondary)] bg-[var(--bg-primary)] rounded">
                  or
                </span>
              </div>
            </div>

            {/* Sign Out Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full py-3 rounded-xl text-[var(--text-secondary)] hover:text-red-400 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <FiLogOut className="text-lg" />
              Sign Out and Check Later
            </motion.button>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-6 text-center space-y-2"
        >
          <div className="flex items-center justify-center gap-2 text-xs text-[var(--text-secondary)]">
            <FiShield className="text-purple-400" />
            <span>Your privacy is protected during verification</span>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <FiArrowLeft className="text-xs" />
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WaitingApproval;