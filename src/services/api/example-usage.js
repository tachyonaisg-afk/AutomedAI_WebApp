/**
 * Example Usage of API Service
 * This file shows practical examples of how to use the API service
 * You can reference this when implementing API calls in your components
 */

import api, { API_ENDPOINTS } from "./index";

// ============================================
// EXAMPLE 1: Authentication
// ============================================
export const authService = {
  // Login
  async login(email, password) {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      // Store token if provided
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  async logout() {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem("authToken");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
    }
  },
};

// ============================================
// EXAMPLE 2: Patients Service
// ============================================
export const patientsService = {
  // Get all patients with pagination
  async getPatients(page = 1, limit = 10, search = "") {
    try {
      const response = await api.get(API_ENDPOINTS.PATIENTS.LIST, {
        page,
        limit,
        search,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single patient
  async getPatientById(id) {
    try {
      const response = await api.get(API_ENDPOINTS.PATIENTS.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new patient
  async createPatient(patientData) {
    try {
      const response = await api.post(API_ENDPOINTS.PATIENTS.CREATE, patientData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update patient
  async updatePatient(id, patientData) {
    try {
      const response = await api.put(API_ENDPOINTS.PATIENTS.UPDATE(id), patientData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete patient
  async deletePatient(id) {
    try {
      const response = await api.delete(API_ENDPOINTS.PATIENTS.DELETE(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// ============================================
// EXAMPLE 3: Appointments Service
// ============================================
export const appointmentsService = {
  // Get all appointments
  async getAppointments(filters = {}) {
    try {
      const response = await api.get(API_ENDPOINTS.APPOINTMENTS.LIST, filters);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create appointment
  async createAppointment(appointmentData) {
    try {
      const response = await api.post(API_ENDPOINTS.APPOINTMENTS.CREATE, appointmentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cancel appointment
  async cancelAppointment(id, reason) {
    try {
      const response = await api.post(API_ENDPOINTS.APPOINTMENTS.CANCEL(id), { reason });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// ============================================
// EXAMPLE 4: Dashboard Service
// ============================================
export const dashboardService = {
  // Get dashboard statistics
  async getStats() {
    try {
      const response = await api.get(API_ENDPOINTS.DASHBOARD.STATS);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get recent activities
  async getRecentActivities(limit = 10) {
    try {
      const response = await api.get(API_ENDPOINTS.DASHBOARD.RECENT_ACTIVITIES, {
        limit,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// ============================================
// EXAMPLE 5: Using in React Component
// ============================================
/*
import React, { useState, useEffect } from 'react';
import { patientsService } from '../services/api/example-usage';

function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await patientsService.getPatients(1, 10);
      setPatients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePatient = async (patientData) => {
    try {
      await patientsService.createPatient(patientData);
      // Refresh list
      loadPatients();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Patients</h1>
      {patients.map(patient => (
        <div key={patient.id}>{patient.name}</div>
      ))}
    </div>
  );
}
*/
