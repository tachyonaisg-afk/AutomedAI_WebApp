/**
 * API Service
 * Reusable HTTP methods (GET, POST, PUT, DELETE, PATCH)
 * All API calls go through this service
 *
 * ERPNext/Frappe:
 * - Authentication handled via browser cookies (sid)
 * - No Authorization / Cookie headers manually set
 */

import apiClient from "./apiClient";

class ApiService {
  /**
   * GET request
   */
  async get(endpoint, params = {}, headers = {}) {
    return apiClient.request({
      method: "GET",
      endpoint,
      params,
      headers,
      useCookieAuth: true,
    });
  }

  /**
   * POST request
   */
  async post(endpoint, data = {}, headers = {}) {
    return apiClient.request({
      method: "POST",
      endpoint,
      data,
      headers,
      useCookieAuth: true,
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data = {}, headers = {}) {
    return apiClient.request({
      method: "PUT",
      endpoint,
      data,
      headers,
      useCookieAuth: true,
    });
  }

  /**
   * PATCH request
   */
  async patch(endpoint, data = {}, headers = {}) {
    return apiClient.request({
      method: "PATCH",
      endpoint,
      data,
      headers,
      useCookieAuth: true,
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint, params = {}, headers = {}) {
    return apiClient.request({
      method: "DELETE",
      endpoint,
      params,
      headers,
      useCookieAuth: true,
    });
  }

  /**
   * Upload file (ERPNext-safe)
   */
  async upload(endpoint, formData, onProgress = null) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Progress handler
      if (onProgress) {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            onProgress(percentComplete);
          }
        });
      }

      // Load handler
      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve({
              data: response,
              status: xhr.status,
              statusText: xhr.statusText,
            });
          } catch {
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

      // Error handler
      xhr.addEventListener("error", () => {
        reject(new Error("Upload failed"));
      });

      // Build URL
      const url = apiClient.buildURL(endpoint);
      xhr.open("POST", url);

      // 🔥 CRITICAL: allow browser to send sid cookie
      xhr.withCredentials = true;

      // ❌ DO NOT set Authorization / Cookie headers
      // ❌ DO NOT set Content-Type (browser sets boundary)

      xhr.send(formData);
    });
  }
}

// Singleton
const apiService = new ApiService();

export default apiService;
