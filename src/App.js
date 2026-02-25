import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './hoc/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientDetail from './pages/PatientDetail';
import PatientRegistration from './pages/PatientRegistration';
import PathLabBilling from './pages/PathLabBilling';
import PathLabResults from './pages/PathLabResults';
import PathLabAdmin from './pages/PathLabAdmin';
import Collection from './pages/Collection';
import NewCollection from './pages/NewCollection';
import LabTest from './pages/LabTest';
import NewLabTest from './pages/NewLabTest';
import LabTestResult from './pages/LabTestResult';
import ResultPrint from './pages/ResultPrint';
import Prescription from './pages/Prescription';
import Consultations from './pages/Consultations';
import Appointments from './pages/Appointments';
import Billing from './pages/Billing';
import AddBilling from './pages/AddBilling';
import ClinicDetails from './pages/ClinicDetails';
import Settings from './pages/Settings';
import ComingSoon from './pages/ComingSoon';
import SalesReport from './pages/SalesReport';
import './App.css';
import OpdAdmin from './pages/OpdAdmin';

const LogoutHandler = () => {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(true);

  React.useEffect(() => {
    const handleLogout = async () => {
      await logout();
      setIsLoggingOut(false);
    };
    handleLogout();
  }, [logout]);

  if (isLoggingOut) {
    return <div>Logging out...</div>;
  }

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
            path="/prescription/:id"
            element={
              <ProtectedRoute>
                <Prescription />
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
          {/* OPD Routes */}
          <Route
            path="/opd"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/opd/patient-registration"
            element={
              <ProtectedRoute>
                <PatientRegistration />
              </ProtectedRoute>
            }
          />
          <Route
            path="/opd/billing"
            element={
              <ProtectedRoute>
                <Billing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/opd/billing/add"
            element={
              <ProtectedRoute>
                <AddBilling />
              </ProtectedRoute>
            }
          />
          <Route
            path="/opd/appointments"
            element={
              <ProtectedRoute>
                <ComingSoon />
              </ProtectedRoute>
            }
          />
          <Route
            path="/opd/consultation"
            element={
              <ProtectedRoute>
                <ComingSoon />
              </ProtectedRoute>
            }
          />
          <Route
            path="/opd/telemedicine"
            element={
              <ProtectedRoute>
                <ComingSoon />
              </ProtectedRoute>
            }
          />
          <Route
            path="/opd/admin"
            element={
              <ProtectedRoute>
                <OpdAdmin />
              </ProtectedRoute>
            }
          />
          {/* PathLab Routes */}
          <Route
            path="/pathlab"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pathlab/patient-registration"
            element={
              <ProtectedRoute>
                <PatientRegistration />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pathlab/billing"
            element={
              <ProtectedRoute>
                <PathLabBilling />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pathlab/billing/add"
            element={
              <ProtectedRoute>
                <AddBilling />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pathlab/results"
            element={
              <ProtectedRoute>
                <PathLabResults />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pathlab/admin"
            element={
              <ProtectedRoute>
                <PathLabAdmin />
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
            path="/pathlab/result-print"
            element={
              <ProtectedRoute>
                <ResultPrint />
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
            path="/billing/add"
            element={
              <ProtectedRoute>
                <AddBilling />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <SalesReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/sales"
            element={
              <ProtectedRoute>
                <SalesReport />
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
