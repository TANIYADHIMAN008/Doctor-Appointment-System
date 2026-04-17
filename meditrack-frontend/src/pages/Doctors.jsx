import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import SidebarPatient from "../components/SidebarPatient";
import DoctorQR from "../components/DoctorQR";

import "../styles/Dashboard.css";

function Doctors() {

  const navigate = useNavigate();
  const { token, role, loading } = useAuth();

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [showPayOptions, setShowPayOptions] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    if (role && role !== "patient") {
      navigate("/login", { replace: true });
      return;
    }

    fetchDoctors();

  }, [loading, token, role]);

  const fetchDoctors = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8001/doctors/", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setDoctors(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error(err);
    }
  };

  const handleBook = async () => {
    if (!selectedDoctor || !date) {
      alert("Select date ❌");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user?.id) {
        alert("Login again ❌");
        return;
      }

      const res = await fetch("http://127.0.0.1:8001/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          doctor_id: selectedDoctor.id,
          patient_id: user.id,
          date: date
        })
      });

      if (!res.ok) {
        alert("Booking failed ❌");
        return;
      }

      setShowPayOptions(true);
      setSuccessMsg("");

    } catch (err) {
      console.error(err);
    }
  };

  const handlePayment = (type) => {
    if (type === "now") {
      setShowQR(true);
    } else {
      setShowPayOptions(false);
      setSuccessMsg("✅ Appointment Confirmed (Pay Later)");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="dashboard-container">

      <SidebarPatient />

      <div className="main-content">

        <div className="topbar">
          <h1>🩺 Available Doctors</h1>
        </div>

        <div className="doctor-grid">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className={`doctor-card ${selectedDoctor?.id === doc.id ? "active-card" : ""}`}
              onClick={() => {
                setSelectedDoctor(doc);
                setShowModal(true);
                setShowPayOptions(false);
                setSuccessMsg("");
              }}
            >
              <h3>👨‍⚕️ {doc.name}</h3>
              <p>🏥 {doc.hospital_name}</p>
              <p>🩺 {doc.specialization}</p>
              <p>💰 ₹{doc.doctor_fee}</p>
            </div>
          ))}
        </div>

        {/* MODAL */}
        {showModal && selectedDoctor && (
          <div style={overlayStyle}>
            <div style={modalStyle}>

              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedDoctor(null);
                  setDate("");
                  setShowPayOptions(false);
                  setSuccessMsg("");
                }}
                style={closeBtn}
              >
                ✖
              </button>

              <h2>📅 Book Appointment</h2>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={inputStyle}
              />

              <button onClick={handleBook} style={bookBtn}>
                Book Appointment
              </button>

              {/* PAYMENT OPTIONS */}
              {showPayOptions && (
                <div style={{ marginTop: "15px" }}>

                  <button onClick={() => handlePayment("now")} style={payNowBtn}>
                    💳 Pay Now
                  </button>

                  <button onClick={() => handlePayment("later")} style={payLaterBtn}>
                    ⏳ Pay Later
                  </button>

                </div>
              )}

              {successMsg && (
                <p style={{ marginTop: "15px", color: "#22c55e" }}>
                  {successMsg}
                </p>
              )}

            </div>
          </div>
        )}

        {/* 🔥 FIXED QR */}
        {showQR && selectedDoctor && (
          <DoctorQR
            upiId="yourupi@okaxis"
            fee={selectedDoctor.doctor_fee}
            doctorName={selectedDoctor.name}

            onClose={() => {
              setShowQR(false); // ❌ ONLY CLOSE
            }}

            onSuccess={() => {
              setShowQR(false);
              setShowPayOptions(false);
              setSuccessMsg("✅ Appointment Confirmed (Paid)");
            }}
          />
        )}

      </div>
    </div>
  );
}

/* STYLES */

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};

const modalStyle = {
  background: "#1e293b",
  padding: "30px",
  borderRadius: "16px",
  width: "350px",
  color: "white",
  position: "relative"
};

const closeBtn = {
  position: "absolute",
  top: "10px",
  right: "10px",
  background: "#ef4444",
  border: "none",
  color: "white",
  borderRadius: "50%",
  width: "30px",
  height: "30px"
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px"
};

const bookBtn = {
  width: "100%",
  padding: "12px",
  background: "#3b82f6",
  borderRadius: "8px",
  color: "white"
};

const payNowBtn = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  background: "#22c55e",
  borderRadius: "8px",
  color: "white"
};

const payLaterBtn = {
  width: "100%",
  padding: "10px",
  background: "#f59e0b",
  borderRadius: "8px",
  color: "white"
};

export default Doctors;