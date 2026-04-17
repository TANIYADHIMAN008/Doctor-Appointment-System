import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarDoctor from "../components/SidebarDoctor";
import Topbar from "../components/Topbar";

function Patients() {

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* ================= FETCH PATIENTS ================= */
  const fetchPatients = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch("http://127.0.0.1:8001/patients/all", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.clear();
        navigate("/login");
        return;
      }

      const data = await res.json();
      setPatients(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error("Error loading patients:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const deletePatient = async (id) => {
    if (!window.confirm("Delete this patient?")) return;

    try {
      const token = localStorage.getItem("token");

      await fetch(`http://127.0.0.1:8001/patients/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      setPatients((prev) => prev.filter((p) => p.id !== id));

    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  /* ================= AUTH + REDIRECT ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    // 🔥 IMPORTANT: redirect instead of showing UI
    navigate("/doctor/dashboard");

    // (keeping fetch just in case future use)
    fetchPatients();

  }, [navigate]);

  return (
    <div style={{ display: "flex" }}>

      {/* SIDEBAR */}
      <SidebarDoctor />

      {/* MAIN CONTENT */}
      <div style={mainContent}>

        <div style={{ marginBottom: "20px" }}>
          <Topbar />
        </div>

        {/* ❌ REMOVED ALL PATIENT UI */}
        <h2 style={{ color: "#64748b" }}>
          Redirecting to Dashboard...
        </h2>

      </div>
    </div>
  );
}

/* ===== STYLES ===== */

const mainContent = {
  marginLeft: "240px",
  padding: "20px",
  width: "100%",
  background: "#f1f5f9",
  minHeight: "100vh"
};

export default Patients;