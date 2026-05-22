import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ command, mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');
  
  // Common configuration
  const config = {
    // Plugins
    plugins: [
      react({
        // React Refresh configuration
        refresh: true,
        
        // JSX runtime
        jsxRuntime: 'automatic',
        
        // Babel configuration
        babel: {
          plugins: [
            // Remove console in production
            mode === 'production' && ['transform-remove-console', { exclude: ['error', 'warn'] }],
          ].filter(Boolean),
        },
      }),
    ],

    // Path aliases
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@firebase': path.resolve(__dirname, './src/firebase'),
        '@layouts': path.resolve(__dirname, './src/components/layout'),
        '@ui': path.resolve(__dirname, './src/components/ui'),
        '@auth': path.resolve(__dirname, './src/components/auth'),
        '@feed': path.resolve(__dirname, './src/components/feed'),
        '@admin': path.resolve(__dirname, './src/components/admin'),
      },
    },

    // Server configuration
    server: {
      // Port
      port: parseInt(env.VITE_PORT) || 3000,
      
      // Strict port
      strictPort: false,
      
      // Open browser
      open: true,
      
      // Host
      host: true, // Listen on all addresses
      
      // CORS
      cors: true,
      
      // Proxy configuration
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/firebase': {
          target: 'https://firestore.googleapis.com',
          changeOrigin: true,
          secure: true,
        },
      },
      
      // Hot Module Replacement
      hmr: {
        overlay: true,
      },
      
      // Watch options
      watch: {
        usePolling: false,
        ignored: ['**/node_modules/**', '**/dist/**'],
      },
    },

    // Build configuration
    build: {
      // Output directory
      outDir: 'dist',
      
      // Assets directory
      assetsDir: 'assets',
      
      // Source maps
      sourcemap: mode !== 'production',
      
      // Minification
      minify: mode === 'production' ? 'terser' : false,
      
      // Terser options
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
        },
        mangle: {
          safari10: true,
        },
        format: {
          comments: false,
        },
      },
      
      // Rollup options
      rollupOptions: {
        output: {
          // Manual chunk splitting
          manualChunks: {
            // React core
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            
            // Firebase
            'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
            
            // UI dependencies
            'ui-vendor': ['framer-motion', 'react-hot-toast'],
            
            // Icons
            'icons-vendor': ['react-icons'],
            
            // Utilities
            'utils-vendor': ['date-fns', 'uuid'],
          },
          
          // Chunk naming
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(assetInfo.name)) {
              return 'images/[name]-[hash].[ext]';
            }
            if (/\.(woff|woff2|eot|ttf|otf)$/.test(assetInfo.name)) {
              return 'fonts/[name]-[hash].[ext]';
            }
            if (/\.css$/.test(assetInfo.name)) {
              return 'css/[name]-[hash].[ext]';
            }
            
            return 'assets/[name]-[hash].[ext]';
          },
        },
      },
      
      // Chunk size warning limit
      chunkSizeWarningLimit: 1000,
      
      // CSS code splitting
      cssCodeSplit: true,
      
      // Target browsers
      target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    },

    // Preview configuration
    preview: {
      port: parseInt(env.VITE_PREVIEW_PORT) || 4173,
      strictPort: false,
      open: true,
      host: true,
    },

    // CSS configuration
    css: {
      // CSS modules
      modules: {
        scopeBehaviour: 'local',
        localsConvention: 'camelCaseOnly',
        generateScopedName: mode === 'production'
          ? '[hash:base64:8]'
          : '[name]__[local]__[hash:base64:5]',
      },
      
      // PostCSS
      postcss: './postcss.config.js',
      
      // Dev sourcemap
      devSourcemap: mode !== 'production',
    },

    // Environment variables prefix
    envPrefix: 'VITE_',

    // Environment directory
    envDir: process.cwd(),

    // Define global constants
    define: {
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION || '1.0.0'),
      __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
      __DEV__: mode === 'development',
      __PROD__: mode === 'production',
    },

    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'firebase/app',
        'firebase/auth',
        'firebase/firestore',
        'framer-motion',
        'react-hot-toast',
        'react-icons',
        'date-fns',
        'uuid',
      ],
      exclude: [],
      
      // Force dependency pre-bundling
      force: false,
    },

    // Worker configuration
    worker: {
      format: 'es',
      plugins: [],
    },

    // Esbuild configuration
    esbuild: {
      // Drop console in production
      drop: mode === 'production' ? ['console', 'debugger'] : [],
      
      // JSX configuration
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
      
      // Target
      target: 'es2020',
    },

    // Experimental features
    experimental: {
      // Import glob
      importGlobRestoreExtension: false,
    },

    // Public directory
    publicDir: 'public',

    // Cache directory
    cacheDir: '.vite',

    // Log level
    logLevel: 'info',
    
    // Clear screen
    clearScreen: true,
    
    // App type
    appType: 'spa',
  };

  return config;
});