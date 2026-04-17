import { useEffect, useState } from "react";
import API_BASE_URL from "../services/api";

function TodayAppointments() {

  const [appointments, setAppointments] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTodayAppointments();
  }, []);

  const fetchTodayAppointments = async () => {

    const today = new Date().toISOString().split("T")[0];

    try {
      const res = await fetch(`${API_BASE_URL}/appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = [];
      }

      // ✅ SAFE ARRAY FIX
      const safeData = Array.isArray(data) ? data : [];

      const todayList = safeData.filter(a => a.date === today);

      setAppointments(todayList);

    } catch (err) {
      console.error("Error fetching today's appointments:", err);
      setAppointments([]);
    }
  };

  return (

    <div className="glass-card">

      <h3>📅 Today's Appointments</h3>

      {appointments.length === 0 ? (

        <p>No appointments today</p>

      ) : (

        appointments.map(a => (
          <div key={a.id} style={{ marginBottom: "10px" }}>

            {/* ✅ FIXED FIELDS */}
            <b>{a.patient?.name || "New Patient"}</b><br />
            <span>{a.date} | {a.time || "Not set"}</span>

          </div>
        ))

      )}

    </div>

  );
}

export default TodayAppointments;