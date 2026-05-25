import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';

const ThemeToggle = ({ 
  theme, 
  toggleTheme, 
  size = 'md',
  showLabel = false,
  className = '' 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Size configurations
  const sizes = {
    sm: {
      button: 'p-1.5',
      icon: 'text-base',
      wrapper: 'w-8 h-8',
    },
    md: {
      button: 'p-2',
      icon: 'text-lg',
      wrapper: 'w-10 h-10',
    },
    lg: {
      button: 'p-2.5',
      icon: 'text-xl',
      wrapper: 'w-12 h-12',
    },
    xl: {
      button: 'p-3',
      icon: 'text-2xl',
      wrapper: 'w-14 h-14',
    },
  };

  const currentSize = sizes[size] || sizes.md;

  const handleToggle = () => {
    setIsAnimating(true);
    toggleTheme();
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle theme with Ctrl/Cmd + J
      if ((e.ctrlKey || e.metaKey) && e.key === 'j') {
        e.preventDefault();
        handleToggle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [theme]);

  return (
    <motion.div
      className={`relative ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleToggle}
        className={`
          ${currentSize.button}
          relative
          rounded-xl 
          glass-morphism 
          hover:bg-[var(--bg-tertiary)] 
          transition-colors 
          group
          overflow-hidden
          focus:outline-none
          focus:ring-2
          focus:ring-purple-500/50
        `}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        title={`${theme === 'dark' ? 'Light' : 'Dark'} mode (Ctrl+J)`}
      >
        {/* Background glow effect */}
        <motion.div
          animate={{
            scale: isHovered ? 1.2 : 1,
            opacity: isHovered ? 0.1 : 0,
          }}
          className={`absolute inset-0 rounded-xl ${
            theme === 'dark' 
              ? 'bg-amber-400' 
              : 'bg-purple-400'
          }`}
        />

        {/* Ripple effect on click */}
        <AnimatePresence>
          {isAnimating && (
            <motion.div
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className={`absolute inset-0 rounded-full ${
                theme === 'dark' 
                  ? 'bg-amber-400' 
                  : 'bg-purple-400'
              }`}
            />
          )}
        </AnimatePresence>

        {/* Icon Container */}
        <div className={`relative ${currentSize.wrapper} flex items-center justify-center`}>
          <AnimatePresence mode="wait">
            {theme === 'dark' ? (
              <motion.div
                key="moon"
                initial={{ rotate: -180, scale: 0, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 180, scale: 0, opacity: 0 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 20 
                }}
                className="absolute"
              >
                <FiMoon className={`${currentSize.icon} text-purple-400`} />
                
                {/* Moon craters */}
                <motion.div
                  animate={{ opacity: [0, 0.3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-1 right-1 w-1 h-1 rounded-full bg-purple-600"
                />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ rotate: 180, scale: 0, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: -180, scale: 0, opacity: 0 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 20 
                }}
                className="absolute"
              >
                <FiSun className={`${currentSize.icon} text-amber-400`} />
                
                {/* Sun rays */}
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                  }}
                  className="absolute inset-0 rounded-full border-2 border-amber-400/20"
                  style={{ margin: '-4px' }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Label */}
        {showLabel && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            className="ml-2 text-sm font-medium text-[var(--text-secondary)] hidden sm:inline"
          >
            {theme === 'dark' ? 'Dark' : 'Light'}
          </motion.span>
        )}

        {/* Tooltip */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-[var(--bg-primary)] border border-[var(--glass-border)] text-xs text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden md:block">
          {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          <span className="ml-1 text-[10px] opacity-50">Ctrl+J</span>
        </div>
      </motion.button>
    </motion.div>
  );
};

// Alternative: Auto theme toggle based on system preference
export const SystemThemeToggle = ({ size = 'md', className = '' }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'system';
    }
    return 'system';
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme(mediaQuery.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const applyTheme = (newTheme) => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  };

  const cycleTheme = () => {
    const themeOrder = ['system', 'dark', 'light'];
    const currentIndex = themeOrder.indexOf(theme);
    const nextTheme = themeOrder[(currentIndex + 1) % themeOrder.length];
    
    setTheme(nextTheme);
    
    if (nextTheme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(isDark ? 'dark' : 'light');
    } else {
      applyTheme(nextTheme);
    }
    
    localStorage.setItem('theme', nextTheme);
  };

  const getIcon = () => {
    switch (theme) {
      case 'dark': return FiMoon;
      case 'light': return FiSun;
      default: return FiMonitor;
    }
  };

  const Icon = getIcon();

  const sizes = {
    sm: { button: 'p-1.5', icon: 'text-base' },
    md: { button: 'p-2', icon: 'text-lg' },
    lg: { button: 'p-2.5', icon: 'text-xl' },
  };

  const currentSize = sizes[size] || sizes.md;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      onClick={cycleTheme}
      className={`${currentSize.button} rounded-xl glass-morphism hover:bg-[var(--bg-tertiary)] transition-colors ${className}`}
      aria-label={`Theme: ${theme}`}
      title={`Theme: ${theme} (Click to change)`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, scale: 0 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <Icon className={`${currentSize.icon} text-[var(--text-secondary)]`} />
      </motion.div>
    </motion.button>
  );
};

// Theme toggle with three states: Light, Dark, System
export const TriStateThemeToggle = ({ size = 'md', className = '' }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  const cycleTheme = () => {
    const themes = ['dark', 'light'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    
    setTheme(nextTheme);
    
    if (nextTheme === 'dark') {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
    
    localStorage.setItem('theme', nextTheme);
  };

  const sizes = {
    sm: { button: 'p-1.5', icon: 'text-sm' },
    md: { button: 'p-2', icon: 'text-base' },
    lg: { button: 'p-2.5', icon: 'text-lg' },
  };

  const currentSize = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-1 p-1 rounded-xl glass-morphism ${className}`}>
      {/* Dark Mode Button */}
        <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setTheme('dark');
          document.documentElement.classList.remove('light');
          localStorage.setItem('theme', 'dark');
        }}
        className={`${currentSize.button} rounded-lg transition-all ${
          theme === 'dark' 
            ? 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]' 
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
        }`}
        title="Dark Mode"
      >
        <FiMoon className={currentSize.icon} />
      </motion.button>

      {/* Light Mode Button */}
        <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setTheme('light');
          document.documentElement.classList.add('light');
          localStorage.setItem('theme', 'light');
        }}
        className={`${currentSize.button} rounded-lg transition-all ${
          theme === 'light' 
            ? 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]' 
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
        }`}
        title="Light Mode"
      >
        <FiSun className={currentSize.icon} />
      </motion.button>
    </div>
  );
};

export default ThemeToggle;