import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function SidebarPatient() {

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="sidebar">

      <div>

        {/* 🔥 LOGO */}
        <div style={{ textAlign: "center", marginBottom: "15px" }}>
          <img src="/logo.png" style={{ height: "50px" }} />
        </div>

        <h2>Patient Panel</h2>

        <div className="user-info">
          <p className="user-name">👤 {user?.name || "Patient"}</p>
          <p className="user-email">{user?.email || ""}</p>
        </div>

        <ul className="sidebar-menu">

          <li>
            <NavLink to="/patient/dashboard" className="sidebar-link" end>
              📊 Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink to="/patient/doctors" className="sidebar-link" end>
              👨‍⚕️ Doctors
            </NavLink>
          </li>

          <li>
            <NavLink to="/patient/appointments" className="sidebar-link" end>
              📅 My Appointments
            </NavLink>
          </li>

        </ul>
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        🚪 Logout
      </button>

    </div>
  );
}

export default SidebarPatient;