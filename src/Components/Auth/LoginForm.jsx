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
      await new Promise((resolve) => setTimeout(resolve, 1500));
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


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="w-full"
    >
      <div className="rounded-3xl border border-white/10 bg-[#070707] p-8 shadow-[0_25px_80px_-40px_rgba(0,0,0,0.75)]">
        <div className="text-center mb-8 pb-2 border-b border-white/10">
          <div className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
            Welcome back
          </div>
          <h1 className="text-3xl font-bold text-white">Sign in to get started</h1>
          <p className="mt-3 text-sm text-slate-400">
            Fast login, secure access, campus-only conversations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">College Email</label>
            <div className="relative">
              <FiMail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-3xl border border-slate-800 bg-[#0f0f0f] px-10 py-3 text-sm text-white outline-none transition focus:border-sky-400"
                placeholder="you@college.edu"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Password</label>
            <div className="relative">
              <FiLock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-3xl border border-slate-800 bg-[#0f0f0f] px-10 py-3 pr-12 text-sm text-white outline-none transition focus:border-sky-400"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-slate-400">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-500 focus:ring-sky-500"
              />
              Remember me
            </label>
            <button
              type="button"
              className="text-sky-400 hover:text-sky-300"
              onClick={() => toast('Password reset feature coming soon!', { icon: '🔧' })}
            >
              Forgot password?
            </button>
          </div>

          <motion.button
            type="submit"
            className="w-full rounded-3xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Signing in...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <FiLogIn className="h-5 w-5" /> Sign in
              </span>
            )}
          </motion.button>
        </form>


        <p className="text-center text-sm text-slate-400">
          New to Conferia?{' '}
          <Link to="/signup" className="text-sky-400 hover:text-sky-300 font-medium">
            Create account
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginForm;
