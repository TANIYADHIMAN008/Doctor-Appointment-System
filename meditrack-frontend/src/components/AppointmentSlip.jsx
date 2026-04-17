import React from "react";

function AppointmentSlip({
  patient,
  doctor,
  hospital,
  specialization,
  date,
  time,
  fee,
  paid,
  status,
  pdfMode = false
}) {

  const doctorName = doctor || "N/A";

  return (
    <div style={{
      background: "white",
      padding: "20px",
      borderRadius: "14px",
      width: pdfMode ? "700px" : "360px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
      fontFamily: "Arial"
    }}>

      {/* HEADER */}
      <div style={{
        textAlign: "center",
        borderBottom: "2px solid #2563eb",
        paddingBottom: "10px"
      }}>
        
        {/* 🔥 LOGO */}
        <img src="/logo.png" style={{ height: "50px", marginBottom: "5px" }} />

        <h2>{hospital || "DocConnect"}</h2>
        <p style={{ fontSize: "13px" }}>Appointment Receipt</p>
      </div>

      {/* INFO */}
      <div style={{ marginTop: "15px" }}>
        <p><b>👤 Patient:</b> {patient}</p>
        <p><b>👨‍⚕️ Doctor:</b> {doctorName}</p>
        <p><b>🩺 Specialization:</b> {specialization || "N/A"}</p>
        <p><b>📅 Date:</b> {date}</p>
        <p><b>⏰ Time:</b> {time}</p>
      </div>

      {/* PAYMENT */}
      <div style={{
        background: "#f1f5f9",
        padding: "10px",
        borderRadius: "8px",
        marginTop: "10px"
      }}>
        <p><b>Fee:</b> ₹{fee || 0}</p>
        <p>
          <b>Status:</b>
          <span style={{ color: paid ? "green" : "red", marginLeft: "5px" }}>
            {paid ? "PAID ✔" : "UNPAID ❌"}
          </span>
        </p>
      </div>

      {/* STATUS */}
      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <b>Status:</b>{" "}
        <span style={{
          color:
            status === "Accepted" ? "green" :
            status === "Rejected" ? "red" : "orange"
        }}>
          {status}
        </span>
      </div>

    </div>
  );
}

export default AppointmentSlip;