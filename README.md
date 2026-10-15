# FitZone Pro 🏋️

**Smart Gym Management & Fitness Platform**  
A full-stack web application built with React.js, Node.js, Express.js, and MongoDB.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (running locally on port 27017)
- npm

### 1. Clone / Open Project
```bash
cd fitzone-pro
```

### 2. Backend Setup
```bash
cd backend
npm install
# Copy environment file
copy .env.example .env
# Edit .env with your MongoDB URI if different

# Seed the database with demo data
npm run seed

# Start backend (development)
npm run dev
```

Backend runs at: **http://localhost:5000**

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 🔐 Demo Credentials

| Role   | Email                    | Password     |
|--------|--------------------------|--------------|
| Admin  | admin@fitzonepro.com     | Admin@1234   |
| Member | rahul@example.com        | Member@1234  |
| Member | priya@example.com        | Member@1234  |

---

## 📁 Project Structure

```
fitzone-pro/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── controllers/              # Business logic
│   ├── middleware/               # Auth + error handlers
│   ├── models/                   # Mongoose schemas
│   ├── routes/                   # API endpoints
│   ├── scripts/seed.js           # Demo data seeder
│   ├── utils/tokenUtils.js       # JWT helpers
│   └── server.js                 # Express app entry
└── frontend/
    ├── src/
    │   ├── components/           # Navbar, Footer, Guards, Toast, Sidebars
    │   ├── context/AuthContext   # Global auth state
    │   ├── pages/                # All page components
    │   └── services/api.js       # Axios API layer
    └── index.html
```

---

## 🛠️ Tech Stack

| Layer     | Technology                           |
|-----------|--------------------------------------|
| Frontend  | React.js, Vite, React Router, Recharts |
| Backend   | Node.js, Express.js                  |
| Database  | MongoDB, Mongoose                    |
| Auth      | JWT, bcrypt                          |
| Styling   | Vanilla CSS (Dark theme + Lime green)|
| Icons     | Lucide React                         |

---

## 📡 API Endpoints

| Route              | Description               |
|--------------------|---------------------------|
| POST /api/auth/register | Register new user    |
| POST /api/auth/login    | Login                |
| GET  /api/programs      | All workout programs |
| GET  /api/trainers      | All trainers         |
| GET  /api/memberships/plans | Membership plans |
| POST /api/bookings      | Create booking       |
| GET  /api/admin/stats   | Admin dashboard stats|

Full API: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## ⚠️ Disclaimers

- **Demo Project**: No real payments are processed. Membership subscription is for demonstration only.
- **Demo Contacts**: All contact information is fictional and for display purposes.
- **Testimonials**: Sample testimonials are clearly demonstration content.
- **BMI**: The BMI calculator is a general educational tool, not medical advice.
- **Nutrition**: Meal plans are general guidance, not personalized medical recommendations.

---

## 🎓 College Project Info

This project was developed as a full-stack web development college project demonstrating:
- MERN Stack architecture
- REST API design
- JWT Authentication & Authorization
- Role-based access control
- MongoDB data modeling
- Responsive UI/UX design

---

*Built with ❤️ using React, Node.js, Express.js & MongoDB*
