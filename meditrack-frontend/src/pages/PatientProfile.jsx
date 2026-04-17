import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SidebarDoctor from "../components/SidebarDoctor";
import Topbar from "../components/Topbar";
import API_BASE_URL from "../services/api";

function PatientProfile() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      // PATIENT
      const patientRes = await fetch(`${API_BASE_URL}/patients/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (patientRes.status === 401) {
        localStorage.clear();
        navigate("/login");
        return;
      }

      const patientData = await patientRes.json();
      setPatient(patientData);

      // APPOINTMENTS
      const appRes = await fetch(`${API_BASE_URL}/appointments/patient/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const appData = await appRes.json();
      setAppointments(Array.isArray(appData) ? appData : []);

    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="dashboard-container">

      {/* SIDEBAR */}
      <SidebarDoctor />

      {/* MAIN CONTENT */}
      <div className="dashboard-content">

        <Topbar />

        <h2>👤 Patient Profile</h2>

        {loading ? (
          <p>Loading...</p>
        ) : !patient ? (
          <p>No patient found</p>
        ) : (
          <>
            <div className="card" style={cardStyle}>
              <p><b>Name:</b> {patient.name}</p>
              <p><b>Email:</b> {patient.email || "N/A"}</p>
              <p><b>Phone:</b> {patient.phone || "N/A"}</p>
              <p><b>Status:</b> {patient.status}</p>
            </div>

            <h3 style={{ marginTop: "30px" }}>📅 Appointments</h3>

            {appointments.length === 0 ? (
              <p>No appointments found</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Doctor</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {appointments.map((a) => (
                    <tr key={a.id}>
                      <td>{a.date}</td>
                      <td>{a.doctor_name || "N/A"}</td>
                      <td>{a.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

      </div>
    </div>
  );
}

/* OPTIONAL INLINE STYLE */

const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  marginTop: "20px",
  color: "#0f172a"
};

export default PatientProfile;