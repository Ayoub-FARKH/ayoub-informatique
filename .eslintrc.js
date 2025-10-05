module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    serviceworker: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // Règles de base
    'no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-alert': 'warn',

    // Style du code
    'indent': ['error', 2, { SwitchCase: 1 }],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single', { avoidEscape: true }],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],

    // Bonnes pratiques
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-template': 'error',

    // Sécurité
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',

    // Gestion des erreurs
    'no-throw-literal': 'error',
    'no-return-await': 'error',

    // Variables
    'no-use-before-define': ['error', { functions: false }],
    'no-shadow': 'error',

    // Commentaires
    'spaced-comment': ['error', 'always']
  },
  globals: {
    // Variables globales du navigateur
    window: 'readonly',
    document: 'readonly',
    console: 'readonly',
    navigator: 'readonly',
    fetch: 'readonly',
    localStorage: 'readonly',
    sessionStorage: 'readonly',
    location: 'readonly',
    history: 'readonly',
    setTimeout: 'readonly',
    clearTimeout: 'readonly',
    setInterval: 'readonly',
    clearInterval: 'readonly',

    // Variables de l'application
    EmailJSManager: 'readonly',
    EMAILJS_CONFIG: 'readonly',
    AppState: 'readonly',

    // Service Worker globals
    self: 'readonly',
    caches: 'readonly',
    clients: 'readonly',
    importScripts: 'readonly',
    workbox: 'readonly'
  },
  overrides: [
    {
      files: ['server.js', 'build.js', 'test.js'],
      env: {
        node: true,
        browser: false
      }
    },
    {
      files: ['sw.js'],
      env: {
        serviceworker: true,
        browser: true,
        node: false
      },
      globals: {
        self: 'readonly',
        caches: 'readonly',
        clients: 'readonly'
      }
    },
    {
      files: ['*.config.js'],
      env: {
        node: true,
        browser: false
      }
    }
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'temp/',
    '*.min.js',
    'coverage/',
    'ssl/',
    '.env*'
  ]
};