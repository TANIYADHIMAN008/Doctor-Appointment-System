import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarPatient from "../components/SidebarPatient";
import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";

import "../styles/Dashboard.css";

function PatientDashboard() {

  const navigate = useNavigate();
  const { token, role, user, loading: authLoading } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FIXED AUTH + DATA LOAD
  useEffect(() => {
    if (authLoading) return;   // ✅ WAIT FOR AUTH

    // ✅ CHECK TOKEN FIRST
    if (!token) {
      navigate("/login");
      return;
    }

    // ✅ SAFE ROLE CHECK (NO REFRESH BUG)
    if (role && role !== "patient") {
      navigate("/login");
      return;
    }

    fetchData();

  }, [authLoading, token, role]);

  // =====================
  // FETCH DATA
  // =====================
  const fetchData = async () => {
    try {
      if (!user?.id) return;

      const [doctorsData, appointmentsData] = await Promise.all([
        apiRequest("/doctors/"),
        apiRequest("/appointments/patient")
      ]);

      setDoctors(doctorsData || []);
      setAppointments(appointmentsData || []);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <p>Loading...</p>;

  const goToDoctors = () => navigate("/patient/doctors");
  const goToAppointments = () => navigate("/patient/appointments");

  return (
    <div className="dashboard-container">

      <SidebarPatient />

      <div className="main-content">

        <div className="topbar">
          <h1>👤 Patient Dashboard</h1>
          <p>Welcome, {user?.name || "Patient"}</p>
        </div>

        {loading ? (
          <p style={{ color: "white" }}>Loading...</p>
        ) : (
          <>
            <div className="stats-grid">

              <div className="stat-card" onClick={goToDoctors}>
                <h3>👨‍⚕️ Doctors</h3>
                <h1>{doctors.length}</h1>
              </div>

              <div className="stat-card" onClick={goToAppointments}>
                <h3>📅 Appointments</h3>
                <h1>{appointments.length}</h1>
              </div>

            </div>

            <div className="quick-box">
              <h3 style={{ marginBottom: "15px" }}>⚡ Quick Actions</h3>

              <button className="btn-primary" onClick={goToDoctors}>
                📅 Book Appointment
              </button>

              <button
                className="btn-success"
                onClick={goToDoctors}
                style={{ marginLeft: "10px" }}
              >
                👨‍⚕️ View Doctors
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default PatientDashboard;