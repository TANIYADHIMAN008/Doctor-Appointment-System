import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import SelectRole from "./pages/SelectRole";
import RegisterDoctor from "./pages/RegisterDoctor";
import RegisterPatient from "./pages/RegisterPatient";

import Dashboard from "./pages/Dashboard";
import PatientDashboard from "./pages/PatientDashboard";
import Doctors from "./pages/Doctors";
import Patients from "./pages/Patients";
import PatientProfile from "./pages/PatientProfile";
import AppointmentCalendar from "./pages/AppointmentCalendar";

import DoctorAppointments from "./pages/DoctorAppointments";
import PatientAppointments from "./pages/PatientAppointments";

/* ✅ PROTECTED ROUTE */
const ProtectedRoute = ({ children, allowedRole }) => {
  const { token, role, loading } = useAuth();

  if (loading) {
    return <div style={{ color: "white", textAlign: "center" }}>Loading...</div>;
  }

  if (!token || !role) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {

  const { token, role } = useAuth();

  return (
    <Routes>

      {/* PUBLIC */}
      <Route path="/" element={<SelectRole />} />

      {/* ✅ FIXED LOGIN (NO AUTO REDIRECT HERE) */}
      <Route path="/login" element={<Login />} />

      <Route path="/register/patient" element={<RegisterPatient />} />
      <Route path="/register/doctor" element={<RegisterDoctor />} />

      {/* DOCTOR ROUTES */}
      <Route path="/doctor/dashboard" element={
        <ProtectedRoute allowedRole="doctor">
          <Dashboard />
        </ProtectedRoute>
      } />

      <Route path="/doctor/patients" element={
        <ProtectedRoute allowedRole="doctor">
          <Patients />
        </ProtectedRoute>
      } />

      <Route path="/doctor/patients/:id" element={
        <ProtectedRoute allowedRole="doctor">
          <PatientProfile />
        </ProtectedRoute>
      } />

      <Route path="/doctor/appointments" element={
        <ProtectedRoute allowedRole="doctor">
          <DoctorAppointments />
        </ProtectedRoute>
      } />

      <Route path="/doctor/calendar" element={
        <ProtectedRoute allowedRole="doctor">
          <AppointmentCalendar />
        </ProtectedRoute>
      } />

      {/* PATIENT ROUTES */}
      <Route path="/patient/dashboard" element={
        <ProtectedRoute allowedRole="patient">
          <PatientDashboard />
        </ProtectedRoute>
      } />

      <Route path="/patient/doctors" element={
        <ProtectedRoute allowedRole="patient">
          <Doctors />
        </ProtectedRoute>
      } />

      <Route path="/patient/appointments" element={
        <ProtectedRoute allowedRole="patient">
          <PatientAppointments />
        </ProtectedRoute>
      } />

      {/* FALLBACK */}
      <Route path="*" element={
        token
          ? role === "doctor"
            ? <Navigate to="/doctor/dashboard" replace />
            : <Navigate to="/patient/dashboard" replace />
          : <Navigate to="/login" replace />
      } />

    </Routes>
  );
}

export default App;

