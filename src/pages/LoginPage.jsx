import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShield, FiUsers, FiMessageSquare, FiArrowRight } from 'react-icons/fi';
import LoginForm from '../Components/Auth/LoginForm';
import { useAuth } from '../hooks/useAuth.jsx';

const features = [
  {
    icon: FiMessageSquare,
    title: 'Real campus conversations',
    description: 'Discover what students are sharing anonymously in real time.',
  },
  {
    icon: FiShield,
    title: 'Private by design',
    description: 'Join with confidence, no public profiles and no tracking.',
  },
  {
    icon: FiUsers,
    title: 'Built for your college',
    description: 'A private network for classmates, groups, and campus life.',
  },
];

const LoginPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/feed');
    }
  }, [user, navigate]);

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <motion.section
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="space-y-8"
          >
            <div className="space-y-5 max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-400">
                Welcome to Conferia
              </span>
              <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl text-white">
                See what your campus is saying, anonymously.
              </h1>
              <p className="max-w-xl text-sm leading-7 text-slate-400">
                A clean, private feed for students to share stories, ask questions, and stay connected without the pressure of public profiles.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sky-400">
                    {(() => { const Icon = feature.icon; return <Icon className="h-5 w-5" />; })()}
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-white">{feature.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
              >
                Create account
                <FiArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                to="/feed"
                className="inline-flex items-center justify-center rounded-full border border-slate-800 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
              >
                Explore feed
              </Link>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
            className="flex justify-center"
          >
            <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_80px_-40px_rgba(0,0,0,0.75)] sm:p-8">
              <div className="mb-8">
                <div className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                  Sign in
                </div>
                <h2 className="text-3xl font-bold text-white">Log in to Conferia</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Secure college-only access with anonymous campus conversations.
                </p>
              </div>

              <LoginForm />

              <div className="mt-6 border-t border-white/10 pt-5 text-center text-sm text-slate-400">
                New to Conferia?{' '}
                <Link to="/signup" className="font-medium text-sky-400 hover:text-sky-300">
                  Create an account
                </Link>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
