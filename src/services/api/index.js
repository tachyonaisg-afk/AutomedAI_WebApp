/**
 * API Service Export
 * Main entry point for all API services
 */

import apiService from "./apiService";
import API_ENDPOINTS from "./endpoints";

export { default as apiService } from "./apiService";
export { default as apiClient } from "./apiClient";
export { default as API_ENDPOINTS } from "./endpoints";

// Convenience exports for common operations

export const api = {
  // HTTP methods
  get: (endpoint, params, headers) => apiService.get(endpoint, params, headers),
  post: (endpoint, data, headers) => apiService.post(endpoint, data, headers),
  put: (endpoint, data, headers) => apiService.put(endpoint, data, headers),
  patch: (endpoint, data, headers) => apiService.patch(endpoint, data, headers),
  delete: (endpoint, params, headers) => apiService.delete(endpoint, params, headers),
  upload: (endpoint, formData, onProgress) => apiService.upload(endpoint, formData, onProgress),

  // Endpoints
  endpoints: API_ENDPOINTS,
};

export default api;
