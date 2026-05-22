import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiShield, 
  FiUsers, 
  FiUserPlus, 
  FiArrowLeft,
  FiCheckCircle,
  FiLock,
  FiEye
} from 'react-icons/fi';
import SignupForm from '../components/auth/SignupForm';
import { useAuth } from '../hooks/useAuth';

const SignupPage = () => {
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
      {/* Left Side - Info Panel (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-900/40 via-[var(--bg-secondary)] to-pink-900/40 relative overflow-hidden items-center justify-center">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
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
              <FiUserPlus className="text-4xl text-white" />
            </motion.div>

            <h1 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Join CONFERIA
              </span>
            </h1>
            
            <p className="text-xl text-[var(--text-secondary)] mb-8 leading-relaxed">
              Create your anonymous identity and become part of your campus community.
              Your real identity stays hidden — always.
            </p>

            {/* How It Works */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                How It Works
              </h3>
              {[
                {
                  step: '1',
                  icon: FiUserPlus,
                  title: 'Register with College Email',
                  description: 'Sign up using your college email for verification',
                },
                {
                  step: '2',
                  icon: FiShield,
                  title: 'Get Anonymous Identity',
                  description: 'Receive an auto-generated username and avatar',
                },
                {
                  step: '3',
                  icon: FiUsers,
                  title: 'Join the Community',
                  description: 'Start sharing confessions and connecting anonymously',
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.15 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 flex items-center justify-center">
                    <span className="text-purple-400 font-bold text-sm">{item.step}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)] text-sm">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="grid grid-cols-2 gap-4 mt-12 pt-8 border-t border-white/10"
            >
              {[
                { icon: FiLock, text: 'End-to-End Encrypted' },
                { icon: FiShield, text: 'Identity Protected' },
                { icon: FiEye, text: 'No Personal Data Shown' },
                { icon: FiCheckCircle, text: 'Verified Students Only' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <item.icon className="text-purple-400 text-sm flex-shrink-0" />
                  <span className="text-xs text-[var(--text-secondary)]">{item.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 lg:py-0">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center"
            >
              <FiUserPlus className="text-3xl text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Join CONFERIA
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-2">
              Create your anonymous campus identity
            </p>
          </div>

          {/* Signup Form */}
          <SignupForm />

          {/* Mobile How It Works */}
          <div className="lg:hidden mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-4"
            >
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
                What happens next?
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <FiCheckCircle className="text-green-400 flex-shrink-0" />
                  Admin verifies your college email
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <FiCheckCircle className="text-green-400 flex-shrink-0" />
                  You get an anonymous username
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <FiCheckCircle className="text-green-400 flex-shrink-0" />
                  Start posting anonymously!
                </div>
              </div>
            </motion.div>
          </div>

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

          {/* Already have account */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-sm text-[var(--text-secondary)] mt-4"
          >
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              Sign In
            </Link>
          </motion.p>

          {/* Footer */}
          <p className="text-center text-xs text-[var(--text-secondary)] mt-6">
            By signing up, you agree to our{' '}
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

export default SignupPage;