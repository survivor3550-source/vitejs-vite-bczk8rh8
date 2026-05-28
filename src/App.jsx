import { Component, useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// Layout
import Layout from './Components/Layout/Layout';

// Auth
import AuthGuard, { AdminGuard } from './Components/Auth/AuthGuard';
import { AuthProvider } from './hooks/useAuth.jsx';

// Pages - Lazy loaded for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const FeedPage = lazy(() => import('./pages/FeedPage'));
const TrendingPage = lazy(() => import('./pages/TrendingPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const WaitingApproval = lazy(() => import('./pages/WaitingApproval'));

// Loading component for lazy-loaded pages
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
          scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
        }}
        className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center"
      >
        <span className="text-2xl font-bold text-white">C</span>
      </motion.div>
      <p className="text-sm text-[var(--text-secondary)]">Loading...</p>
    </motion.div>
  </div>
);

// Error Boundary Component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card max-w-md w-full text-center"
    >
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
        <span className="text-3xl">⚠️</span>
      </div>
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
        Something went wrong
      </h2>
      <p className="text-sm text-[var(--text-secondary)] mb-6">
        {error?.message || 'An unexpected error occurred'}
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={resetErrorBoundary}
        className="glass-button text-white px-6 py-2"
      >
        Try Again
      </motion.button>
    </motion.div>
  </div>
);

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App caught error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return <ErrorFallback error={this.state.error} resetErrorBoundary={this.resetError} />;
    }

    return this.props.children;
  }
}

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

// Main App Component
function App() {
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to dark
    return localStorage.getItem('conferia-theme') || 'dark';
  });

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
    
    // Save theme preference
    localStorage.setItem('conferia-theme', theme);
  }, [theme]);

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      const savedTheme = localStorage.getItem('conferia-theme');
      if (!savedTheme) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <AppErrorBoundary>
      <AuthProvider>
        <ScrollToTop />
        
        {/* Toast Notifications */}
        <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--glass-bg)',
            color: 'var(--text-primary)',
            border: '1px solid var(--glass-border)',
            backdropFilter: 'blur(20px)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: 'white',
            },
          },
        }}
      />

      <Layout theme={theme} toggleTheme={toggleTheme}>
        <Suspense fallback={<PageLoader />}>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/" 
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <HomePage />
                  </motion.div>
                } 
              />
              
              <Route 
                path="/login" 
                element={
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <LoginPage />
                  </motion.div>
                } 
              />
              
              <Route 
                path="/signup" 
                element={
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <SignupPage />
                  </motion.div>
                } 
              />
              
              <Route 
                path="/waiting-approval" 
                element={
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <WaitingApproval />
                  </motion.div>
                } 
              />

              {/* Protected Routes - Requires Authentication */}
              <Route 
                path="/feed" 
                element={
                  <AuthGuard>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <FeedPage />
                    </motion.div>
                  </AuthGuard>
                } 
              />
              
              <Route 
                path="/trending" 
                element={
                  <AuthGuard>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <TrendingPage />
                    </motion.div>
                  </AuthGuard>
                } 
              />
              
              <Route 
                path="/profile" 
                element={
                  <AuthGuard>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <ProfilePage />
                    </motion.div>
                  </AuthGuard>
                } 
              />

              <Route 
                path="/profile/:userId" 
                element={
                  <AuthGuard>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <ProfilePage />
                    </motion.div>
                  </AuthGuard>
                } 
              />

              {/* Admin Routes - Requires Admin Access */}
              <Route 
                path="/admin" 
                element={
                  <AdminGuard>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <AdminPage />
                    </motion.div>
                  </AdminGuard>
                } 
              />

              {/* 404 - Not Found */}
              <Route 
                path="*" 
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4"
                  >
                    <div className="glass-card max-w-md w-full text-center">
                      <div className="text-6xl mb-4">🔍</div>
                      <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2">
                        404
                      </h1>
                      <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                        Page Not Found
                      </h2>
                      <p className="text-sm text-[var(--text-secondary)] mb-6">
                        The page you're looking for doesn't exist or has been moved.
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.history.back()}
                        className="glass-button text-white px-6 py-2 mr-3"
                      >
                        Go Back
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.href = '/feed'}
                        className="glass-morphism text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-6 py-2 rounded-xl transition-colors"
                      >
                        Go to Feed
                      </motion.button>
                    </div>
                  </motion.div>
                } 
              />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </Layout>
    </AuthProvider>
    </AppErrorBoundary>
  );
}

export default App;