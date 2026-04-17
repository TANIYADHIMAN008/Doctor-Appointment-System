import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../services/api";
import "../styles/RegisterPatient.css";

function RegisterPatient() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "Male",
    email: "",
    password: "",
    phone: "",
    patientHistory: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculateAge = (dob) => {
    const birth = new Date(dob);
    const today = new Date();
    return today.getFullYear() - birth.getFullYear();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      if (!form.email || !form.password || !form.phone) {
        alert("Email, Password & Phone required ❌");
        return;
      }

      // ✅ REGISTER USER
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.firstName + " " + form.lastName,
          email: form.email,
          password: form.password,
          role: "patient",
          phone: form.phone
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Already registered ❌");
        return;
      }

      const token = data.access_token || data.token;

      localStorage.setItem("token", token);
      localStorage.setItem("role", "patient");

      const userData = data.user || {
        id: data.id || 0,
        name: form.firstName + " " + form.lastName,
        email: form.email,
        phone: form.phone
      };

      // ✅ 🔥 FIXED (IMPORTANT)
      localStorage.setItem("patient", JSON.stringify(userData));

      // ❌ REMOVE THIS
      // localStorage.setItem("user", JSON.stringify(userData));

      // ✅ CREATE PATIENT
      const patientRes = await fetch(`${API_BASE_URL}/patients/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: form.firstName + " " + form.lastName,
          email: form.email,
          age: calculateAge(form.dob),
          gender: form.gender,
          history: form.patientHistory,
          phone: form.phone
        })
      });

      if (!patientRes.ok) {
        alert("Patient creation failed ❌");
        return;
      }

      alert("Patient Registered Successfully ✅");
      navigate("/patient/dashboard");

    } catch (error) {
      console.error(error);
      alert("Something went wrong ❌");
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">

        <h2>🧑‍⚕️ Register Patient</h2>

        <form onSubmit={handleSubmit}>

          <input name="firstName" placeholder="First Name" onChange={handleChange} required />
          <input name="lastName" placeholder="Last Name" onChange={handleChange} required />

          <input type="date" name="dob" onChange={handleChange} required />

          <select name="gender" onChange={handleChange}>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <input name="email" placeholder="Email" onChange={handleChange} required />

          <input
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            required
          />

          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />

          <textarea
            name="patientHistory"
            placeholder="Patient History (Optional)"
            onChange={handleChange}
            rows="3"
          />

          <button type="submit">Register Patient</button>

        </form>

      </div>
    </div>
  );
}

export default RegisterPatient;