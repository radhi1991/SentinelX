const ENV = {
  // API Base URLs
  API_BASE_URL: 'http://localhost:8080/api',
  
  // API Endpoints
  ENDPOINTS: {
    // Health
    HEALTH_STATUS: '/health/status',

    // Activity
    ACTIVITY_TIMELINE: '/activity/timeline',
    
    // Metrics
    METRICS: '/metrics',
    PERFORMANCE_METRICS: '/metrics/performance',
    SECURITY_METRICS: '/metrics/security',
    
    // Security
    SECURITY_ALERTS: '/security/alerts',
    SECURITY_ALERTS_DETAILS: '/security/alerts/details',
    
    // Inventory
    API_CATEGORIES: '/inventory/categories',
  },

  // Database Config
  DB: {
    HOST: 'localhost',
    PORT: 5432,
    NAME: 'windsurf_db',
    USER: 'windsurf_user',
    // Password should be in .env file, not here
    PASSWORD_ENV_KEY: 'DB_PASSWORD',
  },

  // Authentication
  AUTH: {
    TOKEN_KEY: 'auth_token',
    REFRESH_TOKEN_KEY: 'refresh_token',
    TOKEN_EXPIRY: '1h',
  },

  // Feature Flags
  FEATURES: {
    ENABLE_WEBSOCKET: true,
    ENABLE_NOTIFICATIONS: true,
    ENABLE_DARK_MODE: true,
  },

  // Misc Config
  APP: {
    NAME: 'Windsurf API Dashboard',
    VERSION: '1.0.0',
    DEFAULT_LANGUAGE: 'en',
    DEFAULT_THEME: 'light',
    DEFAULT_PAGE_SIZE: 10,
  }
};

export default ENV;
