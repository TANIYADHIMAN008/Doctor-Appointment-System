import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{
      background: "#1976d2",
      padding: "10px 20px",
      color: "white",
      display: "flex",
      alignItems: "center",
      gap: "20px"
    }}>

      {/* 🔥 LOGO + NAME */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img 
          src="/logo.png" 
          alt="DocConnect"
          style={{ height: "35px" }}
        />
        <h3 style={{ margin: 0 }}>DocConnect</h3>
      </div>

      {/* LINKS */}
      <Link to="/dashboard" style={{ color: "white" }}>Dashboard</Link>
      <Link to="/patients" style={{ color: "white" }}>Patients</Link>
      <Link to="/appointments" style={{ color: "white" }}>Appointments</Link>

    </nav>
  );
}

export default Navbar;