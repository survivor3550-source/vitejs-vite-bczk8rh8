import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShield, FiUsers, FiUserPlus, FiCheckCircle, FiLock } from 'react-icons/fi';
import SignupForm from '../Components/Auth/SignupForm';
import { useAuth } from '../hooks/useAuth.jsx';

const SignupPage = () => {
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
        <div className="grid gap-10 lg:grid-cols-[0.95fr_0.8fr] lg:items-center">
          <motion.section
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="space-y-8"
          >
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <div className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400 mb-4">
                Join Conferia
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">Create an anonymous campus identity.</h1>
              <p className="text-slate-400 leading-7">
                Sign up with your college email, secure your membership, and start posting anonymously on your campus network.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: FiLock,
                  title: 'Verified access',
                  description: 'College-only signups keep the community safe and authentic.',
                },
                {
                  icon: FiShield,
                  title: 'Private by default',
                  description: 'No public profiles, no tracking, no pressure.',
                },
                {
                  icon: FiUsers,
                  title: 'Campus first',
                  description: 'Built for your college community and student groups.',
                },
                {
                  icon: FiCheckCircle,
                  title: 'Fast approval',
                  description: 'Admins verify email quickly to get you into the feed.',
                },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sky-400">
                    {(() => { const Icon = item.icon; return <Icon className="h-5 w-5" />; })()}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{item.description}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
            className="flex justify-center"
          >
            <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#070707] p-6 shadow-[0_25px_80px_-40px_rgba(0,0,0,0.75)] sm:p-8">
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <FiUserPlus className="text-3xl" />
                </div>
                <h2 className="text-3xl font-bold text-white">Create your account</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Start with a verified college email and keep your identity anonymous.
                </p>
              </div>

              <SignupForm />

              <div className="mt-6 border-t border-white/10 pt-5 text-center text-sm text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-sky-400 hover:text-sky-300">
                  Sign in
                </Link>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  );
};

export default SignupPage;
