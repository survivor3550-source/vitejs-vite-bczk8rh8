import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiX, FiSmartphone } from 'react-icons/fi';

const STORAGE_KEY = 'conferia_pwa_dismissed_v1';

const isMobileBrowser = () => {
  const ua = navigator.userAgent || '';
  return /Android|iPhone|iPad|Mobile/i.test(ua);
};

const InstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isMobileBrowser()) return;

    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setVisible(false);
      localStorage.setItem(STORAGE_KEY, 'installed');
    } else {
      setVisible(false);
      localStorage.setItem(STORAGE_KEY, 'dismissed');
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, 'dismissed');
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed left-4 right-4 bottom-20 z-60 lg:hidden"
        >
          <div className="glass-card flex items-center gap-3 p-3 rounded-xl shadow-lg border border-[var(--glass-border)]">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white">
              <FiSmartphone className="text-xl" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Install Conferia</h4>
                <button onClick={handleDismiss} className="text-[var(--text-secondary)]">
                  <FiX />
                </button>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Add Conferia to your home screen for a better experience.</p>
              <div className="mt-3 flex items-center gap-2">
                <button onClick={handleInstall} className="glass-button px-3 py-2 text-sm flex items-center gap-2">
                  <FiDownload /> Install
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallBanner;
