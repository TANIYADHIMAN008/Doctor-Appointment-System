# Doctor Appointment System

A full-stack web application for managing doctor-patient appointments with automation using n8n.

---

## 🚀 Features

* Doctor & Patient Registration
* Secure Login System (JWT Authentication)
* Appointment Booking
* Accept/Reject Appointments
* Email Notifications
* REST API for all operations
* Workflow Automation using n8n
* Dockerized application (Frontend + Backend containers)

---

## 🛠️ Tech Stack

* Frontend: React (Vite)
* Backend: FastAPI
* Database: SQLite
* Authentication: JWT
* API: RESTful APIs
* Automation: n8n
* DevOps: Docker

---

## ⚙️ How to Run

### 🐳 Run with Docker (Recommended)

```bash
docker-compose up --build
```

---

### 💻 Manual Setup

#### Frontend

```bash
cd meditrack-frontend
npm install
npm run dev
```

#### Backend

```bash
cd meditrack-cloud
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

## 🎥 Demo Video

[Watch Demo](https://drive.google.com/file/d/1iY0UQ_JFAg1BKWovkPBpEkXBE2d2XJU3/view)

---

## 📌 About

This project demonstrates full-stack development combined with automation using n8n, including real-world features like authentication, API integration, and workflow automation.
