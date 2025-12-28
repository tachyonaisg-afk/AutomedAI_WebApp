/**
 * API Service
 * Reusable HTTP methods (GET, POST, PUT, DELETE, PATCH)
 * All API calls go through this service
 */

import apiClient from './apiClient';

class ApiService {
  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @param {object} params - Query parameters
   * @param {object} headers - Additional headers
   * @returns {Promise} API response
   */
  async get(endpoint, params = {}, headers = {}) {
    return apiClient.request({
      method: 'GET',
      endpoint,
      params,
      headers,
    });
  }

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request body data
   * @param {object} headers - Additional headers
   * @returns {Promise} API response
   */
  async post(endpoint, data = {}, headers = {}) {
    return apiClient.request({
      method: 'POST',
      endpoint,
      data,
      headers,
    });
  }

  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request body data
   * @param {object} headers - Additional headers
   * @returns {Promise} API response
   */
  async put(endpoint, data = {}, headers = {}) {
    return apiClient.request({
      method: 'PUT',
      endpoint,
      data,
      headers,
    });
  }

  /**
   * PATCH request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request body data
   * @param {object} headers - Additional headers
   * @returns {Promise} API response
   */
  async patch(endpoint, data = {}, headers = {}) {
    return apiClient.request({
      method: 'PATCH',
      endpoint,
      data,
      headers,
    });
  }

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @param {object} params - Query parameters
   * @param {object} headers - Additional headers
   * @returns {Promise} API response
   */
  async delete(endpoint, params = {}, headers = {}) {
    return apiClient.request({
      method: 'DELETE',
      endpoint,
      params,
      headers,
    });
  }

  /**
   * Upload file
   * @param {string} endpoint - API endpoint
   * @param {FormData} formData - FormData with file
   * @param {Function} onProgress - Progress callback
   * @returns {Promise} API response
   */
  async upload(endpoint, formData, onProgress = null) {
    // Remove Content-Type header for FormData (browser will set it with boundary)
    const headers = {};
    
    // Add auth token if available
    const authToken = apiClient.getAuthToken();
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    // Add API keys
    const apiKeyHeaders = apiClient.getApiKeyHeaders();
    Object.assign(headers, apiKeyHeaders);
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      // Handle progress
      if (onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            onProgress(percentComplete);
          }
        });
      }
      
      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve({
              data: response,
              status: xhr.status,
              statusText: xhr.statusText,
            });
          } catch (e) {
            resolve({
              data: xhr.responseText,
              status: xhr.status,
              statusText: xhr.statusText,
            });
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });
      
      // Handle errors
      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });
      
      // Open and send request
      const url = apiClient.buildURL(endpoint);
      xhr.open('POST', url);

      // Enable cookies for ERPNext session
      xhr.withCredentials = true;

      // Set headers
      Object.keys(headers).forEach(key => {
        xhr.setRequestHeader(key, headers[key]);
      });

      xhr.send(formData);
    });
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;

