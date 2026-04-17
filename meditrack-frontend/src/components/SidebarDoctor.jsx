import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Dashboard.css";

function SidebarDoctor() {

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

        <h2 className="logo" style={{ marginBottom: "20px" }}>
          Doctor Panel
        </h2>

        <div className="user-info">
          <p className="user-name">
            👨‍⚕️ {user?.name || "Doctor"}
          </p>
          <p className="user-email">
            {user?.email || ""}
          </p>
        </div>

        <ul className="sidebar-menu">

          <li>
            <NavLink to="/doctor/dashboard" className="sidebar-link">
              📊 Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink to="/doctor/appointments" className="sidebar-link">
              📅 Appointments
            </NavLink>
          </li>

          <li>
            <NavLink to="/doctor/calendar" className="sidebar-link">
              🗓 Calendar
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

export default SidebarDoctor;