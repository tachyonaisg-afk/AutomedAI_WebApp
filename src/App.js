import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './hoc/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientDetail from './pages/PatientDetail';
import PatientRegistration from './pages/PatientRegistration';
import PathLab from './pages/PathLab';
import Collection from './pages/Collection';
import NewCollection from './pages/NewCollection';
import LabTest from './pages/LabTest';
import NewLabTest from './pages/NewLabTest';
import LabTestResult from './pages/LabTestResult';
import Consultations from './pages/Consultations';
import Appointments from './pages/Appointments';
import Billing from './pages/Billing';
import ClinicDetails from './pages/ClinicDetails';
import Settings from './pages/Settings';
import './App.css';

const LogoutHandler = () => {
  const { logout } = useAuth();
  
  React.useEffect(() => {
    logout();
  }, [logout]);

  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients"
            element={
              <ProtectedRoute>
                <Patients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients/:id"
            element={
              <ProtectedRoute>
                <PatientDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient-registration"
            element={
              <ProtectedRoute>
                <PatientRegistration />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pathlab"
            element={
              <ProtectedRoute>
                <PathLab />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pathlab/collection"
            element={
              <ProtectedRoute>
                <Collection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pathlab/collection/new"
            element={
              <ProtectedRoute>
                <NewCollection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pathlab/labtest"
            element={
              <ProtectedRoute>
                <LabTest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pathlab/labtest/new"
            element={
              <ProtectedRoute>
                <NewLabTest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pathlab/labtest/:id/result"
            element={
              <ProtectedRoute>
                <LabTestResult />
              </ProtectedRoute>
            }
          />
          <Route
            path="/consultations"
            element={
              <ProtectedRoute>
                <Consultations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/billing"
            element={
              <ProtectedRoute>
                <Billing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clinic-details"
            element={
              <ProtectedRoute>
                <ClinicDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logout"
            element={
              <ProtectedRoute>
                <LogoutHandler />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
