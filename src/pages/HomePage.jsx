import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShield, FiUsers, FiMessageSquare, FiLock } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/feed');
    }
  }, [user, navigate]);

  const features = [
    {
      icon: FiShield,
      title: '100% Anonymous',
      description: 'Your identity is always protected. Post freely without fear of judgment.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: FiUsers,
      title: 'Campus Community',
      description: 'Connect with students from your college. Share experiences and stories.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: FiMessageSquare,
      title: 'Real Conversations',
      description: 'Discuss topics that matter. From academics to campus life and beyond.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: FiLock,
      title: 'Private & Secure',
      description: 'End-to-end encrypted. Your data never leaves the campus network.',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const stats = [
    { label: 'Active Students', value: '2,500+' },
    { label: 'Daily Confessions', value: '150+' },
    { label: 'Campus Communities', value: '45+' },
    { label: 'Anonymous Posts', value: '50K+' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 pt-20 pb-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8"
            >
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-purple-400 font-medium">
                Now Open for Your Campus
              </span>
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                CONFERIA
              </span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-[var(--text-secondary)] mb-4 max-w-2xl mx-auto"
            >
              The Anonymous Campus Community
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-base text-[var(--text-secondary)] mb-10 max-w-xl mx-auto"
            >
              Share confessions, discuss campus life, and connect with fellow students — 
              all while staying completely anonymous.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/signup')}
                className="glass-button text-white px-8 py-4 text-lg font-semibold flex items-center gap-2 group"
              >
                Join Anonymously
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="px-8 py-4 rounded-xl border border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-lg font-semibold"
              >
                Sign In
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="text-center"
                >
                  <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
              Why Students Love Conferia
            </h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              A safe space for honest conversations on campus
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-card group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="text-white text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-[var(--bg-secondary)]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
              How It Works
            </h2>
            <p className="text-[var(--text-secondary)]">
              Get started in three simple steps
            </p>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                step: '01',
                title: 'Register with College Email',
                description: 'Sign up using your college email. Your real identity is only used for verification and never shown publicly.',
              },
              {
                step: '02',
                title: 'Get Your Anonymous Identity',
                description: 'Receive a randomly generated username and avatar. Your anonymous identity is ready!',
              },
              {
                step: '03',
                title: 'Start Sharing Anonymously',
                description: 'Post confessions, join discussions, and connect with your campus community — all anonymously.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="flex items-start gap-6"
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[var(--text-secondary)]">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
              Ready to Join the Conversation?
            </h2>
            <p className="text-[var(--text-secondary)] mb-8 max-w-lg mx-auto">
              Become part of your campus's anonymous community. Share, connect, and express yourself freely.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signup')}
              className="glass-button text-white px-10 py-4 text-lg font-semibold"
            >
              Get Started Now
            </motion.button>
            <p className="text-xs text-[var(--text-secondary)] mt-4">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                Sign in
              </button>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-[var(--glass-border)]">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-[var(--text-secondary)]">
            © 2026 Conferia. Your privacy is our priority.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;