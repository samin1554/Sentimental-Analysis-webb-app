// Configuration for API endpoints
export const API_CONFIG = {
  FEEDBACK_SERVICE_URL: import.meta.env.VITE_FEEDBACK_SERVICE_URL || 'http://localhost:8080/api/feedback',
  ANALYTICS_SERVICE_URL: import.meta.env.VITE_ANALYTICS_SERVICE_URL || 'http://localhost:8081/api/analytics',
  AI_SERVICE_URL: import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:4000',
};