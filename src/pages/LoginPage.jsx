import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShield, FiUsers, FiMessageSquare, FiArrowLeft } from 'react-icons/fi';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/feed');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col lg:flex-row">
      {/* Left Side - Branding (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-900/40 via-[var(--bg-secondary)] to-pink-900/40 relative overflow-hidden items-center justify-center">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 max-w-lg px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center mb-8"
            >
              <FiMessageSquare className="text-4xl text-white" />
            </motion.div>

            <h1 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                CONFERIA
              </span>
            </h1>
            
            <p className="text-xl text-[var(--text-secondary)] mb-8 leading-relaxed">
              Welcome back to your anonymous campus community. 
              Share, connect, and express yourself freely.
            </p>

            {/* Feature List */}
            <div className="space-y-4">
              {[
                {
                  icon: FiShield,
                  title: '100% Anonymous',
                  description: 'Your identity is always protected',
                },
                {
                  icon: FiUsers,
                  title: 'Campus Only',
                  description: 'Exclusive to your college community',
                },
                {
                  icon: FiMessageSquare,
                  title: 'Real Conversations',
                  description: 'Honest discussions about campus life',
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <feature.icon className="text-purple-400 text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--text-primary)] text-sm">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-white/10"
            >
              {[
                { value: '2.5K+', label: 'Students' },
                { value: '50K+', label: 'Posts' },
                { value: '100%', label: 'Anonymous' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <h4 className="text-2xl font-bold text-[var(--text-primary)]">
                    {stat.value}
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)]">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 lg:py-0">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center"
            >
              <FiMessageSquare className="text-3xl text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              CONFERIA
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-2">
              Welcome back! Sign in to continue.
            </p>
          </div>

          {/* Login Form */}
          <LoginForm />

          {/* Back to Home */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <FiArrowLeft className="text-sm" />
              Back to Home
            </Link>
          </motion.div>

          {/* Footer */}
          <p className="text-center text-xs text-[var(--text-secondary)] mt-8">
            By signing in, you agree to our{' '}
            <button className="text-purple-400 hover:text-purple-300 transition-colors">
              Terms of Service
            </button>
            {' '}and{' '}
            <button className="text-purple-400 hover:text-purple-300 transition-colors">
              Privacy Policy
            </button>
          </p>
        </div>
      </div>

      {/* Mobile Background Effects */}
      <div className="lg:hidden fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default LoginPage;