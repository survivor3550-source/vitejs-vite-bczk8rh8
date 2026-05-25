import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShield, FiUsers, FiMessageSquare, FiLock } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth.jsx';

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
    },
    {
      icon: FiUsers,
      title: 'Campus Community',
      description: 'Connect with students from your college. Share experiences and stories.',
    },
    {
      icon: FiMessageSquare,
      title: 'Real Conversations',
      description: 'Discuss topics that matter. From academics to campus life and beyond.',
    },
    {
      icon: FiLock,
      title: 'Private & Secure',
      description: 'End-to-end encrypted. Your data never leaves the campus network.',
    },
  ];

  const stats = [
    { label: 'Active Students', value: '2,500+' },
    { label: 'Daily Confessions', value: '150+' },
    { label: 'Campus Communities', value: '45+' },
    { label: 'Anonymous Posts', value: '50K+' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 pt-24 pb-28 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
            >
              <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <span className="text-sm text-sky-400 font-medium">Now Open for Your Campus</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">CONFERIA</h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-slate-300 mb-4 max-w-2xl mx-auto"
            >
              The anonymous campus community for honest conversations and meaningful connections.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-base text-slate-400 mb-10 max-w-xl mx-auto"
            >
              Share confessions, ask questions, and stay connected with your college community — all while staying completely anonymous.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900 px-8 py-4 text-lg font-semibold text-white transition hover:border-slate-500 hover:bg-slate-800"
              >
                Join Anonymously
                <FiArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-transparent px-8 py-4 text-lg font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
              >
                Sign In
              </button>
            </motion.div>

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
                  transition={{ delay: 1 + index * 0.08 }}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6"
                >
                  <h3 className="text-3xl md:text-4xl font-bold text-white">{stat.value}</h3>
                  <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why students love Conferia</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">A safe, private campus space for honest conversations and authentic connection.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-4 text-sky-400">
                  {(() => { const Icon = feature.icon; return <Icon className="h-5 w-5" />; })()}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[var(--bg-secondary)]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How it works</h2>
            <p className="text-slate-400">Get started in three simple steps.</p>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                step: '01',
                title: 'Register with college email',
                description: 'Sign up using your college email. Your real identity is only used for verification and never shown publicly.',
              },
              {
                step: '02',
                title: 'Get your anonymous identity',
                description: 'Receive a randomly generated username and avatar. Your anonymous identity is ready.',
              },
              {
                step: '03',
                title: 'Start sharing anonymously',
                description: 'Post confessions, join discussions, and connect with your campus community — all anonymously.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="flex flex-col gap-6 md:flex-row md:items-start"
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-3xl bg-slate-900 flex items-center justify-center text-white text-2xl font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center rounded-3xl border border-white/10 bg-white/5 p-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to join the conversation?</h2>
            <p className="text-slate-400 mb-8">Become part of your campus’s anonymous community. Share, connect, and express yourself freely.</p>
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="rounded-full border border-slate-700 bg-slate-900 px-10 py-4 text-lg font-semibold text-white transition hover:border-slate-500 hover:bg-slate-800"
            >
              Get Started Now
            </button>
            <p className="text-xs text-slate-400 mt-4">
              Already have an account? <button onClick={() => navigate('/login')} className="text-sky-400 hover:text-sky-300 transition">Sign in</button>
            </p>
          </motion.div>
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-slate-400">© 2026 Conferia. Your privacy is our priority.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
