import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_BASE_URL from "../services/api";

function RegisterDoctor() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState("");
  const [doctorFee, setDoctorFee] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const res = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          specialization,
          phone,
          experience,
          hospital_name: hospitalName,
          doctor_fee: Number(doctorFee),
          email,
          password,
          role: "doctor"
        })
      });

      const data = await res.json();

      if (res.ok) {

        // ✅ SAVE TOKEN (AUTO LOGIN)
        localStorage.setItem("token", data.token);

        // ✅ SAVE USER INFO
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("Doctor Registered & Logged In ✅");

        // ✅ GO TO DASHBOARD
        navigate("/dashboard");

      } else {
        alert(data.detail || "Registration failed");
      }

    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  return (

    <div className="dashboard-container">

      <div className="sidebar">

        <h2>DocConnect</h2>

        <Link to="/dashboard">Dashboard</Link>
        <Link to="/patients">Patients</Link>
        <Link to="/doctors">Doctors</Link>
        <Link to="/appointments">Appointments</Link>
        <Link to="/register-patient">Register Patient</Link>
        <Link to="/register-doctor">Register Doctor</Link>
        <Link to="/reports">Reports</Link>

      </div>

      <div className="dashboard-content">

        <h1>Register Doctor</h1>

        <form onSubmit={handleSubmit}>

          <input type="text" placeholder="Doctor Name" value={name} onChange={(e) => setName(e.target.value)} required />

          <input type="text" placeholder="Specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} required />

          <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />

          <input type="number" placeholder="Experience (years)" value={experience} onChange={(e) => setExperience(e.target.value)} required />

          <input type="number" placeholder="Consultation Fee" value={doctorFee} onChange={(e) => setDoctorFee(e.target.value)} required />

          <input type="text" placeholder="Hospital Name" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} required />

          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <button type="submit">Register Doctor</button>

        </form>

      </div>

    </div>

  );
}

export default RegisterDoctor;