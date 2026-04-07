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
    COUNT: "/method/frappe.client.get_count",
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

  // Billing / Sales Invoice (ERPNext)
  BILLING: {
    LIST: "/resource/Sales Invoice",
    CREATE: "/resource/Sales Invoice",
    GET_BY_ID: (id) => `/resource/Sales Invoice/${id}`,
    UPDATE: (id) => `/resource/Sales Invoice/${id}`,
    DELETE: (id) => `/resource/Sales Invoice/${id}`,
    GENERATE_INVOICE: (id) => `/billing/${id}/invoice`,
  },

  // Items (ERPNext)
  ITEMS: {
    LIST: "/resource/Item",
    SEARCH: "/method/frappe.desk.search.search_link",
    GET_BY_ID: (id) => `/resource/Item/${id}`,
    GET_PRICE: "/resource/Item Price",
  },

  // Healthcare Practitioner (ERPNext)
  PRACTITIONERS: {
    LIST: "/resource/Healthcare Practitioner",
    SEARCH: "/method/frappe.desk.search.search_link",
  },

  // Healthcare Service Unit (ERPNext)
  SERVICE_UNITS: {
    LIST: "/resource/Healthcare Service Unit",
    SEARCH: "/method/frappe.desk.search.search_link",
  },

  // Company (ERPNext)
  COMPANY: {
    LIST: "/resource/Company",
    GET_BY_ID: (id) => `/resource/Company/${id}`,
  },

  // Warehouse (ERPNext)
  WAREHOUSE: {
    LIST: "/resource/Warehouse",
  },

  // Price List (ERPNext)
  PRICE_LIST: {
    LIST: "/resource/Price List",
  },

  // Sample Collection (ERPNext)
  SAMPLE_COLLECTION: {
    LIST: "/resource/Sample Collection",
    GET_BY_ID: (id) => `/resource/Sample Collection/${id}`,
    CREATE: "/resource/Sample Collection",
    UPDATE: (id) => `/resource/Sample Collection/${id}`,
  },

  //Sample Collectors
  SAMPLE_COLLECTORS: {
    LIST: "/resource/Employee",
  },

  // Lab Test (ERPNext)
  LAB_TEST: {
    LIST: "/resource/Lab Test",
    GET_BY_ID: (id) => `/resource/Lab Test/${id}`,
    UPDATE: (id) => `/resource/Lab Test/${id}`,
    COUNT: "/method/frappe.client.get_count",
  },

  // Employee (ERPNext)
  EMPLOYEE: {
    LIST: "/resource/Employee",
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

  // Reports
  REPORTS: {
    RUN_QUERY_REPORT: "/method/frappe.desk.query_report.run",
    GENERAL_LEDGER: "General Ledger",
    SALES_REGISTER: "Sales Register",
  },
};

export default API_ENDPOINTS;
