import { useNavigate } from "react-router-dom";

function SelectRole() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      
      {/* 🔥 LOGO */}
      <img 
        src="/logo.png" 
        alt="DocConnect"
        style={{ height: "120px", marginBottom: "10px" }}
      />

      {/* TITLE */}
      <h1>DocConnect</h1>
      <h2>Select Your Role</h2>

      {/* BUTTONS */}
      <button
        onClick={() => navigate("/register/patient")}
        style={{ margin: "10px", padding: "10px 20px" }}
      >
        Register as Patient
      </button>

      <button
        onClick={() => navigate("/register/doctor")}
        style={{ margin: "10px", padding: "10px 20px" }}
      >
        Register as Doctor
      </button>

      <br /><br />

      <button
        onClick={() => navigate("/login")}
        style={{ padding: "10px 20px" }}
      >
        Already have account? Login
      </button>
    </div>
  );
}

export default SelectRole;