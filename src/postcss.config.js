export default {
  plugins: {
    // Tailwind CSS - Utility-first CSS framework
    tailwindcss: {},
    
    // Autoprefixer - Adds vendor prefixes automatically
    autoprefixer: {
      // Browser targets for vendor prefixes
      overrideBrowserslist: [
        '> 0.5%',                // Browsers with >0.5% global usage
        'last 2 versions',       // Last 2 versions of each browser
        'Firefox ESR',           // Firefox Extended Support Release
        'not dead',              // Exclude dead browsers
        'not op_mini all',       // Exclude Opera Mini
        'iOS >= 14',            // iOS Safari 14+
        'Android >= 10',        // Android Browser 10+
      ],
      
      // Enable grid autoplacement prefixes
      grid: 'autoplace',
      
      // Enable flexbox prefixes
      flexbox: 'no-2009',
    },
    
    // PostCSS Preset Env - Modern CSS features
    'postcss-preset-env': {
      // Enable all modern CSS features
      stage: 3,
      
      // Features to enable
      features: {
        'nesting-rules': true,           // CSS nesting
        'custom-media-queries': true,    // Custom media queries
        'media-query-ranges': true,      // Media query ranges
        'custom-properties': false,      // Already handled by Tailwind
        'color-function': true,          // Modern color functions
        'oklab-function': true,          // OKLab color space
      },
      
      // Autoprefixer integration
      autoprefixer: {
        flexbox: 'no-2009',
      },
      
      // Preserve original CSS
      preserve: false,
    },
    
    // CSSNano - CSS minification (production only)
    ...(process.env.NODE_ENV === 'production' ? {
      cssnano: {
        preset: [
          'default',
          {
            // Remove all comments
            discardComments: {
              removeAll: true,
            },
            
            // Normalize whitespace
            normalizeWhitespace: true,
            
            // Minify font values
            minifyFontValues: true,
            
            // Minify gradients
            minifyGradients: true,
            
            // Minify selectors
            minifySelectors: true,
            
            // Merge longhand properties
            mergeLonghand: true,
            
            // Merge adjacent rules
            mergeRules: true,
            
            // Reduce CSS calc expressions
            reduceCalc: true,
            
            // Reduce initial values
            reduceInitial: true,
            
            // Reduce transforms
            reduceTransforms: true,
            
            // Sort declarations
            sortDeclarations: true,
            
            // Unique selectors
            uniqueSelectors: true,
            
            // Z-index optimization
            zindex: false,
            
            // Colormin optimization
            colormin: true,
            
            // Convert colors to shorter format
            convertColors: {
              currentColor: true,
            },
          },
        ],
      },
    } : {}),
    
    // PostCSS Import - Inline @import rules
    'postcss-import': {
      // Resolve paths
      path: ['src'],
      
      // Add extensions to resolve
      extensions: ['.css', '.scss'],
      
      // Skip duplicates
      skipDuplicates: true,
    },
    
    // PostCSS URL - Rebase URLs
    'postcss-url': {
      // URL rebasing
      url: 'rebase',
      
      // Asset handling
      assetsPath: '../assets',
      
      // Use modern URL resolution
      useHash: true,
    },
    
    // PostCSS Mixins - Reusable CSS snippets
    'postcss-mixins': {
      // Mixins directory
      mixinsDir: 'src/styles/mixins',
      
      // Default namespace
      namespace: 'mixins',
    },
    
    // PostCSS Simple Vars - CSS variables for older browsers
    'postcss-simple-vars': {
      // Variables
      variables: {
        'primary-color': '#7c3aed',
        'secondary-color': '#ec4899',
        'text-dark': '#1a1a2e',
        'text-light': '#e8e6f0',
        'bg-dark': '#0a0a0f',
        'bg-light': '#fafbff',
        'font-primary': "'Inter', system-ui, -apple-system, sans-serif",
        'radius-sm': '8px',
        'radius-md': '12px',
        'radius-lg': '16px',
        'radius-xl': '20px',
        'radius-full': '9999px',
        'shadow-sm': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'shadow-md': '0 4px 16px rgba(0, 0, 0, 0.15)',
        'shadow-lg': '0 8px 32px rgba(0, 0, 0, 0.2)',
        'transition-fast': '150ms ease',
        'transition-base': '300ms ease',
        'transition-slow': '500ms ease',
      },
      
      // Only if variables are used
      only: false,
    },
    
    // PostCSS Nested - Unwrap nested rules
    'postcss-nested': {
      // Unwrap nested rules
      unwrap: ['screen', 'document'],
      
      // Preserve empty rules
      preserveEmpty: true,
    },
    
    // PostCSS Extend - Extend selectors
    'postcss-extend-rule': {
      // Extend functionality
      onFunctionalSelector: 'warn',
      
      // Recursive extend
      recursive: true,
    },
    
    // PostCSS Reporter - Log processed files
    'postcss-reporter': {
      // Clear console before reporting
      clearReportedMessages: false,
      
      // Show source maps
      noMap: false,
      
      // Plugin to report
      plugins: [
        'postcss-import',
        'tailwindcss',
        'autoprefixer',
        'cssnano',
      ],
      
      // Throw on error
      throwError: true,
      
      // Sort by plugin
      sortByPlugin: true,
    },
  },
  
  // Source map configuration
  sourceMap: process.env.NODE_ENV !== 'production',
  
  // Parser configuration
  parser: 'postcss-scss',
  
  // Syntax configuration
  syntax: 'postcss-scss',
  
  // Stringifier
  stringifier: 'postcss-scss',
};