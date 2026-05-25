import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from './BottomNav';
import Sidebar from './Sidebar';
import ThemeToggle from '../ui/ThemeToggle';
import InstallBanner from '../ui/InstallBanner';

const Layout = ({ children, theme, toggleTheme }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.98,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] transition-colors duration-300">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative flex">
        <div className="hidden lg:block w-64 fixed left-0 top-0 h-screen z-50">
          <Sidebar theme={theme} toggleTheme={toggleTheme} />
        </div>

        <main className="flex-1 lg:ml-64 min-h-screen relative">
          <div className="lg:hidden fixed top-0 left-0 right-0 z-40 px-4 py-3 bg-[#070707] border-b border-slate-800">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              <h1 className="text-lg font-bold text-white">CONFERIA</h1>
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            </div>
          </div>

          <div className="pt-16 lg:pt-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="min-h-screen pb-24 lg:pb-8 px-0"
              >
                <div className="w-full max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-4">
                  {children}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <div className="lg:hidden">
        <BottomNav />
      </div>

      <InstallBanner />

      {import.meta.env.DEV && (
        <div className="fixed bottom-20 right-4 z-50 lg:bottom-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-medium"
          >
            Dev Mode
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Layout;
