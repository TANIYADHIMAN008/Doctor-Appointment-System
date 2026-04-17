const API_BASE_URL = "http://127.0.0.1:8001";

/* =========================
   COMMON FETCH WRAPPER
========================= */

export const apiRequest = async (
  endpoint,
  method = "GET",
  body = null,
  isForm = false
) => {
  const token = localStorage.getItem("token");

  const headers = {};

  if (!isForm) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = isForm ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    // ✅ FIXED: DO NOT LOGOUT ON 401
    if (response.status === 401) {
  console.warn("⚠️ 401 Unauthorized (ignored)");
  return null;   // ✅ IMPORTANT
   }

    let data;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      console.error("API Error:", data);
      throw new Error(data?.detail || "API Error");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
};

/* =========================
   AUTH
========================= */

export const loginUser = async (email, password) => {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.detail || "Login failed");
  }

  if (data && data.access_token) {
    localStorage.setItem("token", data.access_token);

    const userData = {
      id: data.user?.id,
      name: data.user?.name || email,
      email: email,
      role: (data.user?.role || "").toLowerCase().trim(),
    };

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("role", userData.role);
  }

  return data;
};

/* =========================
   REGISTER
========================= */

export const registerUser = (payload) =>
  apiRequest("/register", "POST", payload);

/* =========================
   DOCTORS
========================= */

export const getDoctors = () =>
  apiRequest("/doctors/");

export const createDoctor = (data) =>
  apiRequest("/doctors/register", "POST", data);

/* =========================
   PATIENTS
========================= */

export const createPatient = (data) =>
  apiRequest("/patients", "POST", data);

export const getPatients = () =>
  apiRequest("/patients/all");

/* =========================
   APPOINTMENTS
========================= */

export const createAppointment = (data) =>
  apiRequest("/appointments", "POST", data);

export const getPatientAppointments = () =>
  apiRequest("/appointments");

export const getDoctorAppointments = () =>
  apiRequest("/appointments/doctor");

export const updateAppointmentStatus = (id, status) =>
  apiRequest(`/appointments/${id}`, "PUT", { status });

export const setAppointmentTime = (id, time) =>
  apiRequest(`/appointments/${id}/time`, "PUT", { time });

export const markAppointmentPaid = (id) =>
  apiRequest(`/appointments/${id}/pay`, "PUT");

export default API_BASE_URL;