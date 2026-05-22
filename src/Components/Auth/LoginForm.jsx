import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { ADMIN_EMAIL } from '../../utils/constants';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    setLoading(true);
    
    try {
      // Firebase authentication will be integrated here
      // await signInWithEmailAndPassword(auth, email, password);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await login(email, password);
      
      if (email === ADMIN_EMAIL) {
        toast.success('Welcome back, Admin! 👑', {
          icon: '👑',
          duration: 3000,
        });
        navigate('/admin');
      } else {
        toast.success('Welcome to Conferia! 🎓', {
          icon: '🎓',
          duration: 3000,
        });
        navigate('/feed');
      }
    } catch (error) {
      toast.error('Invalid credentials. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (type) => {
    setLoading(true);
    try {
      if (type === 'student') {
        setEmail('student@college.edu');
        setPassword('student123');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await login('student@college.edu', 'student123');
        toast.success('Logged in as Student! 🎓');
        navigate('/feed');
      } else if (type === 'admin') {
        setEmail(ADMIN_EMAIL);
        setPassword('admin123');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await login(ADMIN_EMAIL, 'admin123');
        toast.success('Logged in as Admin! 👑');
        navigate('/admin');
      }
    } catch (error) {
      toast.error('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="w-full max-w-md mx-auto"
    >
      <div className="glass-card relative overflow-hidden">
        {/* Decorative gradient line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" />
        
        {/* Header */}
        <div className="text-center mb-8 pt-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center"
          >
            <FiLogIn className="text-2xl text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-[var(--text-secondary)] text-sm">
            Your campus confessions await anonymously
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-1">
              College Email
              <span className="text-red-400">*</span>
            </label>
            <div className="relative group">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input pl-10 pr-4"
                placeholder="you@college.edu"
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-1">
              Password
              <span className="text-red-400">*</span>
            </label>
            <div className="relative group">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input pl-10 pr-12"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[var(--text-primary)] transition-colors p-1"
                tabIndex={-1}
              >
                {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-500 bg-transparent checked:bg-purple-500 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-xs text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                Remember me
              </span>
            </label>
            <button
              type="button"
              className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
              onClick={() => toast('Password reset feature coming soon!', { icon: '🔧' })}
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="glass-button w-full text-white flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <FiLogIn className="text-lg" />
                Sign In
              </>
            )}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--glass-border)]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-2 text-[var(--text-secondary)] bg-[var(--bg-secondary)] rounded">
              Demo Accounts
            </span>
          </div>
        </div>

        {/* Demo Login Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleDemoLogin('student')}
            disabled={loading}
            className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all text-sm font-medium"
          >
            🎓 Student Demo
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleDemoLogin('admin')}
            disabled={loading}
            className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 transition-all text-sm font-medium"
          >
            👑 Admin Demo
          </motion.button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center pb-2">
          <p className="text-[var(--text-secondary)] text-sm">
            New to Conferia?{' '}
            <Link
              to="/signup"
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              Create Anonymous Account
            </Link>
          </p>
        </div>
      </div>

      {/* Footer Text */}
      <p className="text-center text-xs text-[var(--text-secondary)] mt-4">
        Your identity stays anonymous. Always.
      </p>
    </motion.div>
  );
};

export default LoginForm;