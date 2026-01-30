/**
 * API Client with Middleware
 * Handles all HTTP requests with interceptors, error handling, and authentication
 *
 * ERPNext/Frappe Cookie-Based Authentication:
 * - This client is configured to handle cookie-based authentication for ERPNext backend
 * - All requests include credentials: 'include' to send/receive cookies
 * - The session cookie (sid) is automatically sent with every request after login
 * - No need to manually manage authentication tokens for ERPNext endpoints
 */

import API_CONFIG from "../../config/api.config";

class ApiClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }

  /**
   * Add request interceptor
   * @param {Function} interceptor - Function that modifies request before sending
   */
  addRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add response interceptor
   * @param {Function} interceptor - Function that processes response
   */
  addResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Get authentication token from storage
   */
  getAuthToken() {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken") || localStorage.getItem("token");
    }
    return null;
  }

  /**
   * Get API key headers
   */
  getApiKeyHeaders() {
    const headers = {};

    // Backend expects Authorization header in the format:
    // token <api_key>:<api_secret>
    if (API_CONFIG.API_KEY && API_CONFIG.API_SECRET_KEY) {
      headers["Authorization"] = `token ${API_CONFIG.API_KEY}:${API_CONFIG.API_SECRET_KEY}`;
    }

    return headers;
  }

  /**
   * Apply request interceptors
   */
  async applyRequestInterceptors(config) {
    let modifiedConfig = { ...config };

    for (const interceptor of this.requestInterceptors) {
      modifiedConfig = await interceptor(modifiedConfig);
    }

    return modifiedConfig;
  }

  /**
   * Apply response interceptors
   */
  async applyResponseInterceptors(response) {
    let modifiedResponse = response;

    for (const interceptor of this.responseInterceptors) {
      modifiedResponse = await interceptor(modifiedResponse);
    }

    return modifiedResponse;
  }

  /**
   * Build full URL
   */
  buildURL(endpoint) {
    // If endpoint is already a full URL, return it
    if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
      return endpoint;
    }

    // Remove leading slash if present
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
    return `${this.baseURL}/${cleanEndpoint}`;
  }

  /**
   * Build query string from params
   */
  buildQueryString(params) {
    if (!params || Object.keys(params).length === 0) {
      return "";
    }

    const queryParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined) {
        queryParams.append(key, params[key]);
      }
    });

    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : "";
  }

  /**
   * Handle errors
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear auth and redirect to login
          if (typeof window !== "undefined") {
            localStorage.removeItem("authToken");
            localStorage.removeItem("token");
            localStorage.removeItem("isAuthenticated");
            window.location.href = "/login";
          }
          throw new Error("Unauthorized. Please login again.");

        case 403:
          throw new Error("Forbidden. You do not have permission to access this resource.");

        case 404:
          throw new Error("Resource not found.");

        case 500:
          throw new Error("Server error. Please try again later.");

        default:
          throw new Error(data?.message || `Request failed with status ${status}`);
      }
    } else if (error.request) {
      // Request was made but no response received
      throw new Error("Network error. Please check your connection.");
    } else {
      // Something else happened
      throw new Error(error.message || "An unexpected error occurred.");
    }
  }

  /**
   * Main request method
   */
  async request(config) {
    try {
      // Apply request interceptors
      let finalConfig = await this.applyRequestInterceptors(config);

      // Build URL
      const url = this.buildURL(finalConfig.endpoint);
      const queryString = finalConfig.params ? this.buildQueryString(finalConfig.params) : "";
      const fullURL = `${url}${queryString}`;

      // Prepare headers
      const headers = {
        ...API_CONFIG.DEFAULT_HEADERS,
        ...finalConfig.headers,
      };

      // Decide Authorization header (ERPNext first)
      const apiKeyHeaders = this.getApiKeyHeaders();

      if (apiKeyHeaders.Authorization) {
        // ✅ ERPNext / Frappe authentication
        headers["Authorization"] = apiKeyHeaders.Authorization;
      } else {
        // ✅ Fallback for other APIs (Bearer token)
        const authToken = this.getAuthToken();
        if (authToken) {
          headers["Authorization"] = `Bearer ${authToken}`;
        }
      }

      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      // Prepare fetch options
      const fetchOptions = {
        method: finalConfig.method || "GET",
        headers,
        signal: controller.signal,
        credentials: 'include', // Include cookies for ERPNext session management
      };

      // Add body for POST, PUT, PATCH requests
      if (finalConfig.data && ["POST", "PUT", "PATCH"].includes(finalConfig.method)) {
        fetchOptions.body = JSON.stringify(finalConfig.data);
      }

      // Make the request
      let response;
      try {
        response = await fetch(fullURL, fetchOptions);
        clearTimeout(timeoutId);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError.name === "AbortError") {
          throw new Error("Request timeout. Please try again.");
        }
        throw fetchError;
      }

      // Parse response
      let responseData;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      // Create response object
      const apiResponse = {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        ok: response.ok,
      };

      // Check if response is ok
      if (!response.ok) {
        const error = new Error(responseData?.message || `HTTP error! status: ${response.status}`);
        error.response = apiResponse;
        throw error;
      }

      // Apply response interceptors
      const finalResponse = await this.applyResponseInterceptors(apiResponse);

      return finalResponse;
    } catch (error) {
      return this.handleError(error);
    }
  }
}

// Create singleton instance
const apiClient = new ApiClient();

// Add default request interceptor for logging (optional)
if (process.env.NODE_ENV === "development") {
  apiClient.addRequestInterceptor((config) => {
    console.log("API Request:", config.method || "GET", config.endpoint);
    return config;
  });

  apiClient.addResponseInterceptor((response) => {
    console.log("API Response:", response.status, response.data);
    return response;
  });
}

export default apiClient;
