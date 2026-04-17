import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import API_BASE_URL from "../services/api";
import "./AppointmentCalendar.css";

function AppointmentCalendar() {

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAppointments();
  }, []);

  // =========================
  // FETCH APPOINTMENTS
  // =========================
  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/appointments/doctor`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = res.ok ? await res.json() : [];

      console.log("🔥 API DATA:", data);

      const formatted = (data || []).map((a) => {

        // 🔥 FINAL BULLETPROOF FIX
        const safePatient =
          a.patient_name &&
          a.patient_name.trim() !== "" &&
          a.patient_name !== a.doctor_name
            ? a.patient_name
            : "Patient";

        return {
          id: String(a.id),

          // ✅ ALWAYS PATIENT NAME
          title: safePatient,

          // ✅ FIX DATE
          start: a.date ? `${a.date}T00:00:00` : null,

          allDay: true,

          backgroundColor:
            a.status === "Accepted"
              ? "#22c55e"
              : a.status === "Pending"
              ? "#f59e0b"
              : "#ef4444",

          extendedProps: {
            patient: safePatient,
            doctor: a.doctor_name || "Doctor",
            time: a.time,
            status: a.status
          }
        };
      });

      setEvents(formatted);

    } catch (err) {
      console.error("❌ Calendar error:", err);
      setEvents([]);
    }
  };

  // =========================
  // MARK DONE
  // =========================
  const markDone = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/appointments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: "Completed" })
      });

      setSelectedEvent(null);
      fetchAppointments();

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto"
        eventDisplay="block"
        eventClick={(info) => setSelectedEvent(info.event)}
      />

      {/* ================= MODAL ================= */}
      {selectedEvent && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 999
        }}>

          <div style={{
            background: "#1e293b",
            padding: "25px",
            borderRadius: "12px",
            color: "white",
            width: "320px",
            textAlign: "center",
            boxShadow: "0 10px 25px rgba(0,0,0,0.4)"
          }}>

            <h3 style={{ marginBottom: "15px" }}>📅 Appointment</h3>

            {/* 🔥 ALWAYS CORRECT */}
            <p style={{ fontSize: "18px" }}>
              👤 {selectedEvent.extendedProps.patient}
            </p>

            <p>
              🩺 Doctor: {selectedEvent.extendedProps.doctor}
            </p>

            <p style={{ fontSize: "16px" }}>
              ⏰ {selectedEvent.extendedProps.time || "Not set"}
            </p>

            <p style={{ marginTop: "10px" }}>
              📌 Status: {selectedEvent.extendedProps.status}
            </p>

            <div style={{ marginTop: "20px" }}>

              <button
                style={{
                  background: "#ef4444",
                  color: "white",
                  padding: "8px 14px",
                  border: "none",
                  borderRadius: "6px",
                  marginRight: "10px",
                  cursor: "pointer"
                }}
                onClick={() => setSelectedEvent(null)}
              >
                Close
              </button>

              <button
                style={{
                  background: "#22c55e",
                  color: "white",
                  padding: "8px 14px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
                onClick={() => markDone(selectedEvent.id)}
              >
                Done
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default AppointmentCalendar;