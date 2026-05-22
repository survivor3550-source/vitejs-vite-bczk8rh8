import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from './BottomNav';
import Sidebar from './Sidebar';
import ThemeToggle from '../ui/ThemeToggle';

const Layout = ({ children, theme, toggleTheme }) => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // Page transition variants
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
      {/* Background gradient effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 fixed left-0 top-0 h-screen z-50">
          <Sidebar theme={theme} toggleTheme={toggleTheme} />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-64 min-h-screen relative">
          {/* Mobile Header */}
          <div className="lg:hidden fixed top-0 left-0 right-0 z-40 px-4 py-3 glass-morphism border-b border-[var(--glass-border)]">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                CONFERIA
              </h1>
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            </div>
          </div>

          {/* Page Content with Transitions */}
          <div className="pt-16 lg:pt-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="min-h-screen"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden">
        <BottomNav />
      </div>

      {/* Development Mode Indicator */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-20 right-4 z-50 lg:bottom-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-medium backdrop-blur-xl"
          >
            Dev Mode
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Layout;