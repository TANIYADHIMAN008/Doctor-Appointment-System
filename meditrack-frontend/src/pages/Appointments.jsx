import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarDoctor from "../components/SidebarDoctor";
import SidebarPatient from "../components/SidebarPatient";
import { apiRequest } from "../services/api";
import "../styles/Dashboard.css";

function Appointments() {

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      let data;

      if (role === "doctor") {
        data = await apiRequest("/appointments/doctor");
      } else {
        data = await apiRequest("/appointments/patient"); // ✅ FIXED
      }

      console.log("APPOINTMENTS:", data);

      setAppointments(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error("❌ Error fetching appointments:", err);

      if (err.message?.includes("401")) {
        localStorage.clear();
        navigate("/login");
      }

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const approve = async (id) => {
    await apiRequest(`/appointments/${id}`, "PUT", {
      status: "Accepted"
    });
    fetchAppointments();
  };

  const reject = async (id) => {
    await apiRequest(`/appointments/${id}`, "PUT", {
      status: "Rejected"
    });
    fetchAppointments();
  };

  return (
    <div className="dashboard-container">

      {role === "doctor" ? <SidebarDoctor /> : <SidebarPatient />}

      <div className="main-content">

        <div className="topbar">
          <h1>📅 Appointments</h1>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : appointments.length === 0 ? (
          <p>No appointments found</p>
        ) : (

          <div className="table-box">

            <table className="custom-table">

              <thead>
                <tr>
                  <th>{role === "doctor" ? "Patient" : "Doctor"}</th>
                  <th>Date</th>
                  <th>Status</th>
                  {role === "doctor" && <th>Action</th>}
                </tr>
              </thead>

              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id}>

                    <td>
                      {role === "doctor"
                        ? a.patient_name
                        : a.doctor_name}
                    </td>

                    <td>{a.date}</td>

                    <td>
                      <span className={`badge ${a.status?.toLowerCase()}`}>
                        {a.status}
                      </span>
                    </td>

                    {role === "doctor" && (
                      <td>
                        {a.status === "Pending" && (
                          <>
                            <button
                              className="btn-success"
                              onClick={() => approve(a.id)}
                            >
                              Accept
                            </button>

                            <button
                              className="btn-danger"
                              onClick={() => reject(a.id)}
                              style={{ marginLeft: "8px" }}
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {a.status === "Accepted" && "✔ Accepted"}
                        {a.status === "Rejected" && "❌ Rejected"}
                      </td>
                    )}

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

export default Appointments;