/**
 * API Configuration
 * Centralized configuration for API base URL and keys
 */

const API_CONFIG = {
  // Base URL - can be overridden by environment variable
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://hms.automedai.in',

  
  // API Keys - loaded from environment variables
  API_KEY: process.env.REACT_APP_API_KEY || '',
  API_SECRET_KEY: process.env.REACT_APP_API_SECRET_KEY || '',
  
  // Request timeout in milliseconds
  TIMEOUT: 30000, // 30 seconds
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

export default API_CONFIG;

