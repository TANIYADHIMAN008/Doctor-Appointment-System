import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../services/api";
import "../styles/Auth.css";

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
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("role", "doctor");

        alert("Doctor Registered & Logged In ✅");
        navigate("/doctor/dashboard");

      } else {
        alert(data.detail || "Registration failed");
      }

    } catch (error) {
      alert("Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        {/* 🔥 Animated Heading */}
        <h2 className="auth-title">
          <span className="icon">👨‍⚕️</span> Register Doctor
        </h2>

        <form onSubmit={handleSubmit}>

          <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />

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
