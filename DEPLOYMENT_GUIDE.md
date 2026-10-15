# FitZone Pro – Deployment Guide

This guide walks you step-by-step through deploying:
1. **Database:** MongoDB Atlas (Free Cloud Database)
2. **Backend:** Render (Free Web Service)
3. **Frontend:** Vercel (Free React Hosting)

---

## Step 1: Set Up Free Cloud MongoDB (MongoDB Atlas)

Since local `mongodb://localhost:27017` won't be accessible by Render in the cloud, you need a free cloud MongoDB connection:

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign up / log in.
2. Click **Create a Deployment** -> Select **M0 Free Tier** (AWS / closest region).
3. Under **Security Quickstart**:
   - Create a database user:
     - Username: `fitzone_admin`
     - Password: Choose a secure password (e.g., `GymAdmin2026!`) — *save this!*
4. Under **Network Access**:
   - Click **Add IP Address** -> Select **Allow Access from Anywhere** (`0.0.0.0/0`).
5. Click **Connect** -> Choose **Drivers (Node.js)**:
   - Copy your connection string, which looks like:
     ```
     mongodb+srv://fitzone_admin:<password>@cluster0.xxxxx.mongodb.net/fitzone_pro?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password.

---

## Step 2: Push Your Code to GitHub

1. If you haven't initialized Git yet, open your terminal at `fitzone-pro`:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for FitZone Pro"
   ```
2. Go to [GitHub](https://github.com/new) and create a new repository called `fitzone-pro`.
3. Push your repository:
   ```bash
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/fitzone-pro.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 3: Deploy Backend to Render

1. Go to [https://render.com](https://render.com) and log in with your GitHub account.
2. Click **New +** -> **Web Service**.
3. Select your repository `fitzone-pro`.
4. Configure the Web Service settings:
   - **Name:** `fitzone-pro-backend` (or your choice)
   - **Region:** Closest to you (e.g., Singapore, Frankfurt, or Oregon)
   - **Root Directory:** `backend`  *(⚠️ Important!)*
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
5. Scroll down to **Environment Variables** and add:
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `JWT_SECRET` = `fitzone_pro_super_secret_jwt_key_2026`
   - `JWT_EXPIRE` = `7d`
   - `MONGODB_URI` = *(Paste your MongoDB Atlas connection string from Step 1)*
6. Click **Deploy Web Service**.
7. Once deployment finishes, Render gives you a live URL, for example:  
   `https://fitzone-pro-backend.onrender.com`
8. *(Optional - Seed Database on Cloud)*:
   In Render's dashboard for your service, go to **Shell** (or run locally by changing `.env` to the Atlas URI and running `npm run seed`) to seed initial demo accounts:
   ```bash
   npm run seed
   ```

---

## Step 4: Deploy Frontend to Vercel

1. Go to [https://vercel.com](https://vercel.com) and log in with GitHub.
2. Click **Add New...** -> **Project**.
3. Import your `fitzone-pro` repository.
4. Configure the Project:
   - **Framework Preset:** `Vite` (automatically detected)
   - **Root Directory:** Click **Edit** and select `frontend` *(⚠️ Important!)*
5. Expand **Environment Variables**:
   - Key: `VITE_API_URL`
   - Value: `https://fitzone-pro-backend.onrender.com` *(Paste your Render backend URL from Step 3 without a trailing slash)*
6. Click **Deploy**.
7. In under 1 minute, your site will be live at a URL like:  
   `https://fitzone-pro-frontend.vercel.app`

---

## ✅ Verification Checklist

- [ ] Visit your Vercel URL.
- [ ] Test public pages (Programs, Trainers, BMI Calculator).
- [ ] Test login using `admin@fitzonepro.com` / `Admin@1234` or member `rahul@example.com` / `Member@1234`.
- [ ] Test booking a workout class.
