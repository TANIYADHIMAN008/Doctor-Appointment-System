import { Link } from "react-router-dom";

function Layout({ children }) {
  return (

    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* Sidebar */}
      <div className="sidebar">

        <div className="logo-container">
          <div className="logo-icon">🏥</div>
          <h2>"DocConnect"</h2>
        </div>

        <div style={{ marginTop: "40px" }}>

          <Link to="/dashboard">📊 Dashboard</Link>

          <Link to="/patients">👨‍⚕️ Patients</Link>

          <Link to="/appointments">📅 Appointments</Link>

        </div>

      </div>

      {/* Main content */}
      <div
        style={{
          marginLeft: "240px",
          padding: "40px",
          width: "100%"
        }}
      >

        {children}

      </div>

    </div>

  );
}

export default Layout;