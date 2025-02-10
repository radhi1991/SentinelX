import ENV from '../config/env';

// Generic API error class
export class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

// Generic API client with error handling
export const apiClient = {
  async request(endpoint, options = {}) {
    try {
      const url = `${ENV.API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new APIError(
          'API request failed',
          response.status,
          await response.json()
        );
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // HTTP method helpers
  get: (endpoint) => apiClient.request(endpoint),
  post: (endpoint, data) => apiClient.request(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  put: (endpoint, data) => apiClient.request(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (endpoint) => apiClient.request(endpoint, {
    method: 'DELETE',
  }),
};

// API service functions
export const apiService = {
  // Health
  getHealthStatus: () => apiClient.get(ENV.ENDPOINTS.HEALTH_STATUS),

  // Activity
  getActivityTimeline: () => apiClient.get(ENV.ENDPOINTS.ACTIVITY_TIMELINE),
  
  // Metrics
  getMetrics: () => apiClient.get(ENV.ENDPOINTS.METRICS),
  getPerformanceMetrics: () => apiClient.get(ENV.ENDPOINTS.PERFORMANCE_METRICS),
  getSecurityMetrics: () => apiClient.get(ENV.ENDPOINTS.SECURITY_METRICS),
  
  // Security
  getSecurityAlerts: () => apiClient.get(ENV.ENDPOINTS.SECURITY_ALERTS),
  getSecurityAlertsDetails: () => apiClient.get(ENV.ENDPOINTS.SECURITY_ALERTS_DETAILS),
  
  // Inventory
  getAPICategories: () => apiClient.get(ENV.ENDPOINTS.API_CATEGORIES),
};
