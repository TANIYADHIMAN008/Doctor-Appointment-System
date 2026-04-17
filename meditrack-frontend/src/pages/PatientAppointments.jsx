import { useEffect, useState } from "react";
import SidebarPatient from "../components/SidebarPatient";
import Topbar from "../components/Topbar";
import jsPDF from "jspdf";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";

import "../styles/Dashboard.css";

function PatientAppointments() {

  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ✅ FETCH
  const fetchAppointments = async () => {
    try {
      const data = await apiRequest("/appointments/patient");
      console.log("PATIENT APPOINTMENTS:", data);
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setAppointments([]);
    }
  };

  // ✅ FIXED PDF FUNCTION
  const downloadSlip = (a) => {
    const doc = new jsPDF();

    const patient = user?.name || "Patient";

    // ✅ USE DIRECT DATA FROM API
    const doctorName = a.doctor_name || "Doctor";
    const specialization = a.specialization || "N/A";
    const hospital = a.hospital || "DocConnect";

    doc.setFontSize(18);
    doc.setTextColor(0, 102, 204);
    doc.text(hospital, 60, 20);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Appointment Slip", 80, 28);

    doc.line(20, 32, 190, 32);

    doc.text(`Patient Name: ${patient}`, 20, 50);
    doc.text(`Doctor Name: ${doctorName}`, 20, 60);
    doc.text(`Specialization: ${specialization}`, 20, 70);

    doc.text(`Date: ${a.date}`, 20, 80);
    doc.text(`Time: ${a.time || "Not Assigned"}`, 20, 90);

    doc.text(`Consultation Fee: ₹500`, 20, 100);

    doc.text(
      `Payment Status: ${
        a.payment_status === "Paid" ? "Paid ✅" : "Unpaid ❌"
      }`,
      20,
      110
    );

    doc.text(`Appointment Status: ${a.status}`, 20, 120);

    doc.line(130, 150, 180, 150);
    doc.text("Doctor Signature", 130, 160);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Thank you for choosing DocConnect ❤️", 55, 180);

    doc.save(`Appointment_${a.id}.pdf`);
  };

  return (
    <div className="dashboard-container">
      <SidebarPatient />

      <div className="main-content">
        <Topbar />

        <h1 style={{ marginBottom: "20px" }}>📋 My Appointments</h1>

        {appointments.length === 0 ? (
          <p>No appointments found</p>
        ) : (
          <div className="appointments-list">
            {appointments.map((a) => (
              <div key={a.id} className="appointment-row">

                <div className="appt-name">
                  👨‍⚕️ {a.doctor_name || "Doctor"}
                </div>

                <div className={`appt-status ${a.status?.toLowerCase()}`}>
                  {a.status}
                </div>

                <div className="appt-actions">
                  <button
                    className="btn-primary"
                    onClick={() => setSelected(a)}
                  >
                    View
                  </button>

                  <button
                    className="btn-success"
                    onClick={() => downloadSlip(a)}
                  >
                    Download
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* MODAL */}
        {selected && (
          <div className="modal-overlay">
            <div className="modal-box">

              <h2>Appointment Details</h2>
              <p>Doctor: {selected.doctor_name}</p>
              <p>Patient: {user?.name}</p>
              <p>Date: {selected.date}</p>
              <p>Status: {selected.status}</p>

              <button
                className="logout-btn"
                onClick={() => setSelected(null)}
              >
                Close
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default PatientAppointments;