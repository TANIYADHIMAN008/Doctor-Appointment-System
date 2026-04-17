import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarDoctor from "../components/SidebarDoctor";
import Topbar from "../components/Topbar";
import { apiRequest } from "../services/api";
import "../styles/Dashboard.css";

function DoctorAppointments() {

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (!role || role !== "doctor") {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user"));

      if (!user?.id) {
        navigate("/login");
        return;
      }

      const data = await apiRequest(`/appointments/doctor`) || [];

      console.log("APPOINTMENTS:", data);

      setAppointments(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    console.log("CLICK ACCEPT/REJECT:", id, status);

    await apiRequest(`/appointments/${id}`, "PUT", { status });

    fetchAppointments();
  };

  const editTime = async (id) => {
    const time = prompt("Enter time (HH:MM)");
    if (!time) return;

    await apiRequest(`/appointments/${id}/time`, "PUT", { time });
    fetchAppointments();
  };

  return (
    <div className="dashboard-container">

      <SidebarDoctor />

      <div className="main-content">

        <Topbar />

        <div className="topbar">
          <h1>📅 Doctor Appointments</h1>
          <p>Manage your patient bookings</p>
        </div>

        {loading ? (
          <p style={{ color: "white" }}>Loading...</p>
        ) : appointments.length === 0 ? (
          <p style={{ color: "white" }}>No appointments</p>
        ) : (

          <div
            style={{
              background: "rgba(30,41,59,0.9)",
              padding: "25px",
              borderRadius: "16px",
              marginTop: "20px"
            }}
          >

            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: "0 12px",
                color: "white"
              }}
            >

              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "10px" }}>Patient</th>
                  <th style={{ textAlign: "left", padding: "10px" }}>Hospital</th>
                  <th style={{ textAlign: "left", padding: "10px" }}>Date</th>
                  <th style={{ textAlign: "left", padding: "10px" }}>Time</th>
                  <th style={{ textAlign: "left", padding: "10px" }}>Status</th>
                  <th style={{ textAlign: "left", padding: "10px" }}>Payment</th>
                  <th style={{ textAlign: "left", padding: "10px" }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((a) => (
                  <tr
                    key={a.id}
                    style={{
                      background: "rgba(255,255,255,0.06)"
                    }}
                  >

                    {/* ✅ FIXED HERE */}
                    <td style={{ padding: "14px" }}>
                      {a.patient_name || "Patient"}
                    </td>

                    <td style={{ padding: "14px" }}>
                      {a.hospital || a.hospital_name || "N/A"}
                    </td>

                    <td style={{ padding: "14px" }}>{a.date}</td>

                    <td style={{ padding: "14px" }}>
                      {a.time || "Not Set"}
                    </td>

                    <td style={{ padding: "14px" }}>
                      <span
                        style={{
                          padding: "6px 10px",
                          borderRadius: "8px",
                          background:
                            a.status === "Accepted"
                              ? "rgba(34,197,94,0.2)"
                              : a.status === "Rejected"
                              ? "rgba(239,68,68,0.2)"
                              : "rgba(251,191,36,0.2)",
                          color:
                            a.status === "Accepted"
                              ? "#22c55e"
                              : a.status === "Rejected"
                              ? "#ef4444"
                              : "#f59e0b"
                        }}
                      >
                        {a.status}
                      </span>
                    </td>

                    <td style={{ padding: "14px" }}>
                      <span
                        style={{
                          padding: "6px 10px",
                          borderRadius: "8px",
                          background:
                            a.payment_status === "Paid"
                              ? "rgba(34,197,94,0.2)"
                              : "rgba(239,68,68,0.2)",
                          color:
                            a.payment_status === "Paid"
                              ? "#22c55e"
                              : "#ef4444"
                        }}
                      >
                        {a.payment_status || "Unpaid"}
                      </span>
                    </td>

                    <td style={{ padding: "14px", display: "flex", gap: "8px" }}>

                      {a.status === "Pending" && (
                        <>
                          <button
                            style={{
                              background: "#3b82f6",
                              border: "none",
                              padding: "6px 10px",
                              borderRadius: "6px",
                              color: "white",
                              cursor: "pointer"
                            }}
                            onClick={() => editTime(a.id)}
                          >
                            Set Time
                          </button>

                          <button
                            style={{
                              background: "#22c55e",
                              border: "none",
                              padding: "6px 10px",
                              borderRadius: "6px",
                              color: "white"
                            }}
                            onClick={() => updateStatus(a.id, "Accepted")}
                          >
                            Accept
                          </button>

                          <button
                            style={{
                              background: "#ef4444",
                              border: "none",
                              padding: "6px 10px",
                              borderRadius: "6px",
                              color: "white"
                            }}
                            onClick={() => updateStatus(a.id, "Rejected")}
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {a.status === "Accepted" && "✔ Accepted"}
                      {a.status === "Rejected" && "❌ Rejected"}

                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}

      </div>
    </div>
  );
}

export default DoctorAppointments;