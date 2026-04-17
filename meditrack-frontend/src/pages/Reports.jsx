import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import AppointmentSlip from "../components/AppointmentSlip";
import API_BASE_URL from "../services/api";

function Reports() {

  const [appointments, setAppointments] = useState([]);
  const [selected, setSelected] = useState(null);

  const token = localStorage.getItem("token");

  // ===== FETCH =====
  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/appointments/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      console.log("API DATA:", data); // 🔥 DEBUG

      // ✅ HANDLE ALL CASES
      if (Array.isArray(data)) {
        setAppointments(data);
      } else if (data.appointments) {
        setAppointments(data.appointments);
      } else {
        setAppointments([]);
      }

    } catch (err) {
      console.error(err);
      setAppointments([]);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      <div style={{ width: "250px" }}>
        <Sidebar />
      </div>

      <div style={{ flex: 1, padding: "30px" }}>

        <h1>📄 My Appointments</h1>

        {/* ✅ EMPTY STATE */}
        {appointments.length === 0 && (
          <p style={{ marginTop: "20px" }}>
            No appointments found ❗
          </p>
        )}

        {/* ✅ LIST */}
        {appointments.map((a) => (
          <div key={a.id} style={{
            background: "white",
            padding: "15px",
            marginTop: "15px",
            borderRadius: "10px"
          }}>
            <p><b>Doctor:</b> {a.doctor_name || "N/A"}</p>
            <p><b>Date:</b> {a.date || "N/A"}</p>

            <button
              onClick={() => setSelected(a)}
              style={{
                marginTop: "10px",
                padding: "8px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "6px"
              }}
            >
              Generate Slip
            </button>
          </div>
        ))}

        {/* ✅ SLIP */}
        {selected && (
          <AppointmentSlip
            patient={selected.patient_name || "N/A"}
            doctor={selected.doctor_name || "N/A"}
            hospital={selected.hospital || "N/A"}
            date={selected.date || "N/A"}
            time={selected.time || "N/A"}
            fee={selected.fee || 0}
            paid={selected.paid || false}
          />
        )}

      </div>
    </div>
  );
}

export default Reports;