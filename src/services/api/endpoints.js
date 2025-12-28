/**
 * API Endpoints
 * Centralized endpoint definitions
 * Update these based on your actual API endpoints
 */

const API_ENDPOINTS = {
  // Authentication (ERPNext/Frappe style)
  AUTH: {
    LOGIN: "method/login", // ERPNext login endpoint (no leading slash)
    LOGOUT: "method/logout", // ERPNext logout endpoint
    REGISTER: "method/frappe.core.doctype.user.user.sign_up",
    GET_LOGGED_USER: "method/frappe.auth.get_logged_user",
    FORGOT_PASSWORD: "method/frappe.core.doctype.user.user.reset_password",
    RESET_PASSWORD: "method/frappe.core.doctype.user.user.update_password",
  },

  // Patients
  PATIENTS: {
    // ERPNext/Frappe-style patient resource
    LIST: "/resource/Patient",
    CREATE: "/resource/Patient",
    GET_BY_ID: (id) => `/resource/Patient/${id}`,
    DETAIL: (id) => `/resource/Patient/${id}`,
    UPDATE: (id) => `/resource/Patient/${id}`,
    DELETE: (id) => `/resource/Patient/${id}`,
    SEARCH: "/resource/Patient",
    SEARCH_LINK: "/method/frappe.desk.search.search_link",
  },

  // Appointments
  APPOINTMENTS: {
    LIST: "/appointments",
    CREATE: "/appointments",
    GET_BY_ID: (id) => `/appointments/${id}`,
    UPDATE: (id) => `/appointments/${id}`,
    DELETE: (id) => `/appointments/${id}`,
    CANCEL: (id) => `/appointments/${id}/cancel`,
    RESCHEDULE: (id) => `/appointments/${id}/reschedule`,
  },

  // Billing
  BILLING: {
    LIST: "/billing",
    CREATE: "/billing",
    GET_BY_ID: (id) => `/billing/${id}`,
    UPDATE: (id) => `/billing/${id}`,
    DELETE: (id) => `/billing/${id}`,
    GENERATE_INVOICE: (id) => `/billing/${id}/invoice`,
  },

  // Dashboard
  DASHBOARD: {
    STATS: "/dashboard/stats",
    RECENT_ACTIVITIES: "/dashboard/activities",
    UPCOMING_APPOINTMENTS: "/dashboard/appointments",
  },

  // Settings
  SETTINGS: {
    GET: "/settings",
    UPDATE: "/settings",
    CHANGE_PASSWORD: "/settings/password",
  },

  // Users
  USERS: {
    LIST: "/users",
    CREATE: "/users",
    GET_BY_ID: (id) => `/users/${id}`,
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
  },
};

export default API_ENDPOINTS;
