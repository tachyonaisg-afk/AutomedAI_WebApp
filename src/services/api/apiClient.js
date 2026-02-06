/**
 * API Client with Middleware
 * Handles all HTTP requests with interceptors, error handling, and authentication
 *
 * ERPNext/Frappe Cookie-Based Authentication:
 * - Uses browser-managed cookies (sid)
 * - credentials: 'include' ensures sid is sent automatically
 * - No manual Cookie or Authorization header required for ERPNext
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
   */
  addRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Get auth token (only for NON-ERP APIs)
   */
  getAuthToken() {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken") || localStorage.getItem("token");
    }
    return null;
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
    if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
      return endpoint;
    }

    const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
    return `${this.baseURL}/${cleanEndpoint}`;
  }

  /**
   * Build query string
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
      const { status, data } = error.response;

      switch (status) {
        case 401:
          if (typeof window !== "undefined") {
            localStorage.removeItem("authToken");
            localStorage.removeItem("token");
            localStorage.removeItem("isAuthenticated");
            window.location.href = "/login";
          }
          throw new Error("Unauthorized. Please login again.");

        case 403:
          throw new Error("Forbidden. You do not have permission.");

        case 404:
          throw new Error("Resource not found.");

        case 500:
          throw new Error("Server error. Please try again later.");

        default:
          throw new Error(data?.message || `Request failed with status ${status}`);
      }
    } else if (error.request) {
      throw new Error("Network error. Please check your connection.");
    } else {
      throw new Error(error.message || "An unexpected error occurred.");
    }
  }

  /**
   * Main request method
   */
  async request(config) {
    try {
      let finalConfig = await this.applyRequestInterceptors(config);

      const url = this.buildURL(finalConfig.endpoint);
      const queryString = finalConfig.params
        ? this.buildQueryString(finalConfig.params)
        : "";
      const fullURL = `${url}${queryString}`;

      // Base headers
      const headers = {
        ...API_CONFIG.DEFAULT_HEADERS,
        ...finalConfig.headers,
      };

      /**
       * ✅ IMPORTANT:
       * - ERPNext auth is handled ONLY via cookies
       * - Authorization header is ONLY for non-ERP APIs
       */
      if (!finalConfig.useCookieAuth) {
        const authToken = this.getAuthToken();
        if (authToken) {
          headers["Authorization"] = `Bearer ${authToken}`;
        }
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const fetchOptions = {
        method: finalConfig.method || "GET",
        headers,
        signal: controller.signal,
        credentials: "include", // 🔥 THIS sends sid automatically
      };

      if (
        finalConfig.data &&
        ["POST", "PUT", "PATCH"].includes(finalConfig.method)
      ) {
        fetchOptions.body = JSON.stringify(finalConfig.data);
      }

      let response;
      try {
        response = await fetch(fullURL, fetchOptions);
        clearTimeout(timeoutId);
      } catch (err) {
        clearTimeout(timeoutId);
        if (err.name === "AbortError") {
          throw new Error("Request timeout. Please try again.");
        }
        throw err;
      }

      const contentType = response.headers.get("content-type");
      const responseData =
        contentType && contentType.includes("application/json")
          ? await response.json()
          : await response.text();

      const apiResponse = {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        ok: response.ok,
      };

      if (!response.ok) {
        const error = new Error(
          responseData?.message || `HTTP error! status: ${response.status}`
        );
        error.response = apiResponse;
        throw error;
      }

      return await this.applyResponseInterceptors(apiResponse);
    } catch (error) {
      return this.handleError(error);
    }
  }
}

// Singleton instance
const apiClient = new ApiClient();

// Dev logging
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
