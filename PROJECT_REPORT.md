# FitZone Pro – Project Documentation & Presentation Guide

## 1. Project Title
**FitZone Pro – Smart Gym Management and Fitness Platform**

---

## 2. Executive Summary / Abstract
FitZone Pro is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application designed to digitize and automate gym operations. It addresses challenges faced by traditional fitness centers, such as manual membership tracking, inefficient class scheduling, lack of member progress analytics, and disjointed administrative workflows.

### Key Capabilities:
- **Role-Based Access Control (RBAC):** Admin and Member role segregation.
- **Membership Lifecycle Management:** Tier-based subscriptions (Basic, Standard, Premium, Elite) with status tracking.
- **Class & Session Booking:** Real-time reservation system with seat capacity limits and conflict detection.
- **Fitness & Progress Tracker:** BMI calculator, workout history logging, and visual weight/calorie burn analytics using Recharts.
- **Administrative Control Panel:** Metrics overview, member management, trainer assignment, program scheduling, and contact inquiries handling.

---

## 3. Technology Stack & Architecture

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, React Router v6, Axios, Recharts, Lucide React, Modern CSS3 Design Tokens |
| **Backend** | Node.js, Express.js RESTful API, JSON Web Token (JWT), bcryptjs |
| **Database** | MongoDB (Mongoose ODM) |
| **Tooling & Build** | Vite, Nodemon, Git |

### Architecture Diagram
```
[ Client: React + Vite (Port 5173) ]
               │
          REST / JSON
               ▼
[ Server: Express API + JWT Auth (Port 5000) ]
               │
          Mongoose ODM
               ▼
[ Database: MongoDB Engine (Port 27017) ]
```

---

## 4. Database Schema (Mongoose Models)

1. **User Schema (`User.js`):**
   - Fields: `name`, `email`, `password` (hashed), `role` (`member` | `admin`), `phone`, `membership` (`plan`, `startDate`, `endDate`, `status`), `emergencyContact`.
2. **Program Schema (`Program.js`):**
   - Fields: `title`, `description`, `category` (Strength, Cardio, Yoga, HIIT, Pilates, Boxing), `intensity`, `duration`, `schedule` (`days`, `time`), `capacity`, `trainer` (Ref: User), `image`.
3. **Trainer Schema (`Trainer.js`):**
   - Fields: `name`, `email`, `phone`, `specialization`, `experience`, `bio`, `rating`, `image`, `socialLinks`.
4. **Booking Schema (`Booking.js`):**
   - Fields: `user` (Ref: User), `program` (Ref: Program), `sessionDate`, `status` (`confirmed`, `cancelled`, `completed`), `notes`.
5. **Progress Schema (`Progress.js`):**
   - Fields: `user` (Ref: User), `date`, `weight`, `bodyFatPercentage`, `caloriesBurned`, `workoutMinutes`, `notes`.
6. **Contact Schema (`Contact.js`):**
   - Fields: `name`, `email`, `phone`, `subject`, `message`, `status` (`new`, `in-progress`, `resolved`).

---

## 5. API Endpoints Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create member account
- `POST /api/auth/login` - Authenticate user & issue JWT token
- `GET /api/auth/me` - Fetch authenticated user profile

### Members & Admin (`/api/users`)
- `GET /api/users` - List all members (Admin only)
- `GET /api/users/:id` - Get member details
- `PUT /api/users/:id` - Update member status / membership
- `DELETE /api/users/:id` - Remove user

### Programs & Classes (`/api/programs`)
- `GET /api/programs` - List public programs with filter & search
- `POST /api/programs` - Create workout program (Admin)
- `PUT /api/programs/:id` - Update program details (Admin)
- `DELETE /api/programs/:id` - Delete program (Admin)

### Bookings (`/api/bookings`)
- `GET /api/bookings/my-bookings` - Logged-in member's class reservations
- `POST /api/bookings` - Book a slot for a program
- `PUT /api/bookings/:id/cancel` - Cancel reservation
- `GET /api/bookings` - List all bookings across gym (Admin)
- `PUT /api/bookings/:id/status` - Update reservation status (Admin)

### Progress & Analytics (`/api/progress`)
- `GET /api/progress/my-progress` - Member workout and metric timeline
- `POST /api/progress` - Log daily workout metrics (weight, calories, duration)
- `DELETE /api/progress/:id` - Remove metric entry

### Analytics & Reports (`/api/analytics`)
- `GET /api/analytics/dashboard` - Admin overview stats (total revenue, active members, capacity fill rate)

---

## 6. Demo Credentials for Evaluation

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@fitzonepro.com` | `Admin@1234` |
| **Member** | `rahul@example.com` | `Member@1234` |
| **New Member** | Register via `http://localhost:5173/register` |

---

## 7. How to Run Locally

### Terminal 1: Backend
```bash
cd backend
npm install
npm run seed     # Pre-populates sample programs, trainers, and users
npm run dev      # Runs on http://localhost:5000
```

### Terminal 2: Frontend
```bash
cd frontend
npm install
npm run dev      # Runs on http://localhost:5173
```

---

## 8. Common Viva & Defense Questions

1. **Q: How is security handled for passwords and routes?**  
   **A:** Passwords are never stored in plaintext; they are salted and hashed using `bcryptjs` (salt rounds: 10). Authentication is stateless using JSON Web Tokens (JWT) sent via Bearer Authorization headers and validated through Express middleware (`authMiddleware.js`). Role-based guards (`authorize('admin')`) protect sensitive routes.

2. **Q: How does the booking system prevent overbooking?**  
   **A:** The booking controller queries existing confirmed reservations for the selected program and date. If `confirmedCount >= program.capacity`, the API rejects the request with HTTP 400 Bad Request.

3. **Q: How does the application scale?**  
   **A:** The architecture separates concerns cleanly into decoupled frontend and backend layers. The Express API is stateless, making it horizontal-scaling ready behind a load balancer (such as Nginx). MongoDB indexes on frequently queried fields (`email`, `sessionDate`, `user`) ensure high-throughput queries.
