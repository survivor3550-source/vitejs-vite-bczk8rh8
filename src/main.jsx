import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Import Firebase config (initializes Firebase)
import './firebase/config';

// Service Worker Registration for PWA
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registered:', registration.scope);
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error);
      });
  });
}

// Performance monitoring in development
if (import.meta.env.DEV) {
  // Report web vitals
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  });
}

// Error handling for uncaught errors
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  // In production, send to error tracking service
  if (import.meta.env.PROD) {
    // Example: Sentry.captureException(event.error);
  }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // In production, send to error tracking service
  if (import.meta.env.PROD) {
    // Example: Sentry.captureException(event.reason);
  }
});

// App version and environment info
console.log(`
🚀 CONFERIA v1.0.0
📦 Environment: ${import.meta.env.MODE}
🔗 API Base: ${import.meta.env.VITE_API_BASE_URL || 'Not configured'}
🔥 Firebase: ${import.meta.env.VITE_FIREBASE_PROJECT_ID ? 'Configured' : 'Using mock data'}
🕒 Started at: ${new Date().toLocaleString()}
`);

// Create root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    'Root element not found! Make sure there is a <div id="root"></div> in your index.html'
  );
}

// Create React root
const root = ReactDOM.createRoot(rootElement);

// Render app with StrictMode in development
root.render(
  import.meta.env.DEV ? (
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  ) : (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
);

// Enable Hot Module Replacement (HMR) in development
if (import.meta.hot) {
  import.meta.hot.accept();
}

// Remove loading screen (if present)
const removeLoadingScreen = () => {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.style.opacity = '0';
    loadingScreen.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
      loadingScreen.remove();
    }, 300);
  }
};

// Remove loading screen after initial render
window.addEventListener('load', removeLoadingScreen);

// Preload critical fonts
const preloadFonts = () => {
  const fontLinks = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
  ];

  fontLinks.forEach((href) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    document.head.appendChild(link);
  });
};

preloadFonts();

// Detect and apply system theme on initial load
const applyInitialTheme = () => {
  const savedTheme = localStorage.getItem('conferia-theme');
  
  if (savedTheme) {
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light');
    }
  } else {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (!prefersDark) {
      document.documentElement.classList.add('light');
    }
  }
};

applyInitialTheme();

// Handle online/offline status
const updateOnlineStatus = () => {
  const isOnline = navigator.onLine;
  
  if (!isOnline) {
    console.warn('⚠️ Application is offline');
    // Show offline notification
    const offlineToast = document.createElement('div');
    offlineToast.id = 'offline-toast';
    offlineToast.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #ef4444;
      color: white;
      text-align: center;
      padding: 8px;
      font-size: 14px;
      z-index: 999999;
      font-family: 'Inter', sans-serif;
    `;
    offlineToast.textContent = 'You are offline. Some features may be unavailable.';
    
    if (!document.getElementById('offline-toast')) {
      document.body.prepend(offlineToast);
    }
  } else {
    // Remove offline notification
    const offlineToast = document.getElementById('offline-toast');
    if (offlineToast) {
      offlineToast.remove();
      console.log('✅ Back online');
    }
  }
};

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// Initial check
updateOnlineStatus();

// Export for testing purposes
export { root };