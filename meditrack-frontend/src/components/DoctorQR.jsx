import { QRCodeCanvas } from "qrcode.react";

function DoctorQR({ upiId, fee, doctorName, onClose, onSuccess }) {

  const upiLink = `upi://pay?pa=${upiId}&pn=${doctorName}&am=${fee}&cu=INR`;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2000
    }}>

      <div style={{
        background: "#1e293b",
        padding: "25px",
        borderRadius: "12px",
        textAlign: "center",
        color: "white",
        width: "300px"
      }}>

        <h2>💳 Scan & Pay</h2>

        <p>{doctorName}</p>

        <QRCodeCanvas value={upiLink} size={220} />

        <p style={{ marginTop: "10px" }}>Amount: ₹{fee}</p>

        {/* 🔥 NEW MESSAGE */}
        <p style={{ fontSize: "12px", color: "#94a3b8" }}>
          After payment, click confirm
        </p>

        {/* ✅ CONFIRM BUTTON */}
        <button
          onClick={onSuccess}
          style={{
            marginTop: "10px",
            padding: "10px",
            background: "green",
            border: "none",
            color: "white",
            borderRadius: "6px",
            cursor: "pointer",
            width: "100%"
          }}
        >
          I Have Paid ✅
        </button>

        {/* ❌ CLOSE ONLY CLOSES */}
        <button
          onClick={onClose}
          style={{
            marginTop: "10px",
            padding: "8px",
            background: "#ef4444",
            border: "none",
            color: "white",
            borderRadius: "6px",
            cursor: "pointer",
            width: "100%"
          }}
        >
          Close
        </button>

      </div>
    </div>
  );
}

export default DoctorQR;