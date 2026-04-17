import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import AppointmentSlip from "../components/AppointmentSlip";
import API_BASE_URL from "../services/api";

function Reports() {

  const [appointments, setAppointments] = useState([]);
  const [selected, setSelected] = useState(null);

  const token = localStorage.getItem("token");

  // ===== FETCH APPOINTMENTS =====
  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/appointments/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) return;

      const data = await res.json();
      setAppointments(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div style={{ display: "flex" }}>

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENT */}
      <div style={{ padding: "30px", flex: 1 }}>

        <h1>📄 My Appointment Slips</h1>

        {/* ===== LIST ===== */}
        {appointments.length === 0 && <p>No appointments found</p>}

        {appointments.map((a) => (
          <div
            key={a.id}
            style={{
              background: "white",
              padding: "15px",
              marginTop: "15px",
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
            }}
          >
            <p><b>Doctor:</b> {a.doctor_name}</p>
            <p><b>Date:</b> {a.date}</p>
            <p><b>Status:</b> {a.status}</p>

            <button
              onClick={() => setSelected(a)}
              style={{
                marginTop: "10px",
                padding: "8px 12px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Generate Slip
            </button>
          </div>
        ))}

        {/* ===== SLIP ===== */}
        {selected && (
          <div style={{ marginTop: "30px" }}>
            <AppointmentSlip
              patient={selected.patient_name}
              doctor={selected.doctor_name}
              hospital={selected.hospital || "N/A"}
              date={selected.date}
              time={selected.time || "N/A"}
              fee={selected.fee || 0}
              paid={selected.paid || false}
            />
          </div>
        )}

      </div>
    </div>
  );
}

export default Reports;