const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = __dirname;

// Read screenshots and convert to base64
const getBase64 = (fileName) => {
  const filePath = path.join(rootDir, fileName);
  if (fs.existsSync(filePath)) {
    return `data:image/png;base64,${fs.readFileSync(filePath).toString('base64')}`;
  }
  return '';
};

const homeImg = getBase64('screenshot_home.png');
const loginImg = getBase64('screenshot_login.png');
const programsImg = getBase64('screenshot_programs.png');
const nutritionImg = getBase64('screenshot_nutrition.png');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>PROJECT DOCUMENTATION - FitZone Pro</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;600;700&display=swap');

  @page {
    size: A4;
    margin: 22mm 18mm 22mm 18mm;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif;
    color: #111827;
    line-height: 1.6;
    font-size: 11pt;
    background: #ffffff;
  }

  .cover-container {
    text-align: center;
    padding-top: 40px;
    padding-bottom: 30px;
    page-break-after: always;
  }

  .main-heading {
    font-size: 24pt;
    font-weight: 700;
    color: #1e3a8a;
    letter-spacing: 1px;
    margin-bottom: 6px;
  }

  .sub-heading {
    font-size: 13pt;
    color: #4b5563;
    font-weight: 600;
    margin-bottom: 50px;
  }

  .meta-table {
    width: 90%;
    margin: 0 auto 50px auto;
    border-collapse: collapse;
    font-size: 12pt;
    text-align: left;
  }

  .meta-table td {
    padding: 12px 10px;
    border: none;
    vertical-align: middle;
  }

  .meta-table td.label {
    width: 28%;
    font-weight: 700;
    color: #111827;
  }

  .meta-table td.value {
    width: 72%;
    border-bottom: 1.5px solid #111827;
    color: #1e3a8a;
    font-weight: 600;
  }

  .tech-footer {
    font-size: 12pt;
    color: #374151;
    font-weight: 600;
    margin-top: 80px;
  }

  .page-break {
    page-break-after: always;
  }

  .section {
    margin-bottom: 24px;
  }

  h2.sec-title {
    font-size: 14pt;
    font-weight: 700;
    color: #111827;
    margin-top: 20px;
    margin-bottom: 10px;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 4px;
  }

  p {
    margin-bottom: 10px;
    text-align: justify;
    color: #1f2937;
  }

  ul {
    margin: 8px 0 14px 24px;
  }

  li {
    margin-bottom: 5px;
    color: #374151;
  }

  .tree-block {
    background: #f9fafb;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    padding: 14px 18px;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 9.5pt;
    line-height: 1.5;
    color: #111827;
    margin: 12px 0;
    white-space: pre;
  }

  table.data-table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0 18px 0;
    font-size: 9pt;
  }

  table.data-table th, table.data-table td {
    border: 1px solid #d1d5db;
    padding: 8px 10px;
    text-align: left;
  }

  table.data-table th {
    background: #f3f4f6;
    color: #111827;
    font-weight: 700;
  }

  table.data-table tr:nth-child(even) td {
    background: #f9fafb;
  }

  .screenshot-card {
    page-break-inside: avoid;
    margin: 18px 0 24px 0;
    text-align: center;
  }

  .screenshot-card img {
    width: 96%;
    max-height: 380px;
    object-fit: cover;
    object-position: top;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.08);
  }

  .caption {
    font-size: 9.5pt;
    font-style: italic;
    color: #4b5563;
    margin-top: 6px;
  }

  .status-pass {
    color: #15803d;
    font-weight: 700;
  }
</style>
</head>
<body>

<!-- COVER PAGE (Exact match with Page 1 of college template) -->
<div class="cover-container">
  <div class="main-heading">PROJECT DOCUMENTATION</div>
  <div class="sub-heading">Node.js and React-Based Web Application</div>

  <table class="meta-table">
    <tr>
      <td class="label">Project Title:</td>
      <td class="value">FitZone Pro – Smart Gym Management and Fitness Platform</td>
    </tr>
    <tr>
      <td class="label">Submitted By:</td>
      <td class="value">Pranay Adangale</td>
    </tr>
    <tr>
      <td class="label">Roll Number:</td>
      <td class="value">201</td>
    </tr>
    <tr>
      <td class="label">Institute Name:</td>
      <td class="value">Guru Nanak Khalsa College</td>
    </tr>
    <tr>
      <td class="label">Academic Year:</td>
      <td class="value">2025 – 2026</td>
    </tr>
  </table>

  <div class="tech-footer">
    Technology: React.js • Node.js • Express.js • MongoDB
  </div>
</div>

<!-- SECTION 1 & 2 -->
<div class="section">
  <h2 class="sec-title">1. Introduction</h2>
  <p>
    <strong>FitZone Pro</strong> is a complete, modern, responsive full-stack web application designed for comprehensive gym administration, trainer management, member engagement, and workout progress tracking.
  </p>
  <p>
    Traditional gym operations rely heavily on manual registers, disconnected paper forms, and basic spreadsheets. This leads to common challenges such as lost attendance records, double-booked workout slots, untracked membership expirations, and a complete lack of progress visibility for fitness enthusiasts. FitZone Pro addresses these problems by providing an automated, real-time digital platform connecting members and gym administrators through an intuitive web interface.
  </p>
</div>

<div class="section">
  <h2 class="sec-title">2. Objectives</h2>
  <ul>
    <li>Develop a user-friendly, responsive web application for gym operations and fitness tracking.</li>
    <li>Build a modern frontend interface using React.js, React Router, and interactive Recharts data visualization.</li>
    <li>Create robust backend services and RESTful APIs using Node.js and Express.js.</li>
    <li>Process user requests efficiently and securely with JSON Web Token (JWT) stateless authentication and bcrypt password salting/hashing.</li>
    <li>Provide role-based dashboards (Admin and Member) with end-to-end membership lifecycle and class reservation workflows.</li>
    <li>Incorporate health calculation tools including an interactive Body Mass Index (BMI) calculator and Macronutrient / Calorie planner.</li>
  </ul>
</div>

<!-- SECTION 3 & 4 -->
<div class="section">
  <h2 class="sec-title">3. Technology Stack</h2>
  <ul>
    <li><strong>Frontend:</strong> React.js 18, React Router v6, Axios, Recharts (Data Visualization), Lucide React (Icons), HTML5, CSS3 (Modern Responsive Flexbox/Grid).</li>
    <li><strong>Backend:</strong> Node.js, Express.js (REST API Architecture).</li>
    <li><strong>Database:</strong> MongoDB Atlas (Cloud NoSQL Database) with Mongoose ODM (Object Data Modeling).</li>
    <li><strong>Authentication & Security:</strong> JSON Web Tokens (JWT), bcryptjs (12 salt rounds), Express Middleware authorization guards.</li>
    <li><strong>Development Tools:</strong> Visual Studio Code, Git, GitHub, Vite (Build Tool), Postman / Curl.</li>
    <li><strong>Cloud Deployment:</strong> Render (Node.js Web Service) and Vercel (React Global Edge Hosting).</li>
  </ul>
</div>

<div class="section">
  <h2 class="sec-title">4. System Requirements</h2>
  <ul>
    <li><strong>Hardware Requirements:</strong>
      <ul>
        <li>Processor: Intel Core i3 / AMD Ryzen 3 or higher.</li>
        <li>RAM: Minimum 4 GB RAM (8 GB recommended for simultaneous server/client builds).</li>
        <li>Storage: Minimum 1 GB available disk space.</li>
        <li>Network: Active internet connection for cloud database connectivity and deployment.</li>
      </ul>
    </li>
    <li><strong>Software Requirements:</strong>
      <ul>
        <li>Operating System: Windows 10/11, macOS, or Linux.</li>
        <li>Runtime & Environment: Node.js (v18.0.0 or higher) and npm (v9.0.0 or higher).</li>
        <li>Code Editor: Visual Studio Code.</li>
        <li>Web Browser: Modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari).</li>
      </ul>
    </li>
  </ul>
</div>

<!-- SECTION 5 -->
<div class="section">
  <h2 class="sec-title">5. System Architecture</h2>
  <p>
    FitZone Pro is architected as a decoupled Three-Tier Model separating presentation, application business logic, and persistent storage:
  </p>
  <ul>
    <li><strong>Presentation Layer (React Frontend):</strong> The single-page application (SPA) handles UI state, user interactions, local form validation, and dynamic page routing. It initiates HTTP requests via Axios.</li>
    <li><strong>Application Layer (Node.js & Express Backend):</strong> The Express server exposes RESTful API endpoints at <code>/api/*</code>. Requests pass through a security middleware pipeline (CORS, body parsing, JWT token authentication, and role authorization). Controllers execute business rules (checking class capacity, hashing passwords, filtering dates).</li>
    <li><strong>Data Layer (MongoDB Atlas & Mongoose):</strong> Mongoose models define strict schemas, default values, and relational references (e.g., Bookings referencing Users and Programs) persisting data in the cloud.</li>
  </ul>

  <div class="tree-block">
[ Client Browser: React 18 + Vite ]
         │  ▲
         │  │ HTTP / HTTPS (JSON Payloads)
         │  │ Authorization: Bearer &lt;JWT_Token&gt;
         ▼  │
[ Server: Node.js + Express.js API ]
   ├── Middleware: CORS, Morgan, Auth Guards, Error Handler
   └── Controllers: Auth, Users, Programs, Trainers, Bookings, Progress
         │  ▲
         │  │ Mongoose ODM Wire Protocol
         ▼  │
[ Cloud Database: MongoDB Atlas (fitzone_pro) ]
   └── Collections: users, workoutprograms, trainers, trainingbookings, etc.
  </div>
</div>

<div class="page-break"></div>

<!-- SECTION 6 -->
<div class="section">
  <h2 class="sec-title">6. Project Structure</h2>
  <p>The project follows a clean, modular structure isolating frontend and backend concerns:</p>
  <div class="tree-block">
fitzone-pro/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── controllers/
│   │   ├── authController.js       # Login, register, profile
│   │   ├── bookingController.js    # Class reservation & capacity control
│   │   ├── programController.js    # Workout programs CRUD
│   │   ├── progressController.js   # Metric logging & charts data
│   │   ├── trainerController.js    # Trainer profiles & bios
│   │   └── adminController.js      # Gym statistics & KPI aggregation
│   ├── middleware/
│   │   ├── auth.js               # JWT verification & role authorization
│   │   └── errorHandler.js       # Centralized error handler
│   ├── models/
│   │   ├── User.js               # Member & Admin schema
│   │   ├── WorkoutProgram.js     # Class schedule & capacity schema
│   │   ├── Trainer.js            # Coach profile schema
│   │   ├── TrainingBooking.js    # Booking reservation schema
│   │   └── WorkoutProgress.js    # Calorie & weight tracking schema
│   ├── routes/                   # Modular route definitions
│   ├── scripts/
│   │   └── seed.js               # Database population script
│   ├── package.json
│   └── server.js                 # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── components/           # Navbar, Footer, Sidebars, Toast alerts
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global user state & JWT handling
│   │   ├── pages/
│   │   │   ├── HomePage.jsx      # Hero, BMI calculator, featured plans
│   │   │   ├── ProgramsPage.jsx  # Filterable programs catalog
│   │   │   ├── TrainersPage.jsx  # Coach roster & consultation
│   │   │   ├── NutritionPage.jsx # Macro & TDEE calorie calculator
│   │   │   ├── LoginPage.jsx     # Auth with demo login buttons
│   │   │   ├── DashboardPage.jsx # Member personal dashboard
│   │   │   ├── MyBookings.jsx    # User reservations & cancellation
│   │   │   ├── MyProgress.jsx    # Visual Recharts weight/calorie charts
│   │   │   └── AdminDashboard.jsx# Admin metrics, user roster, CRUD
│   │   ├── services/
│   │   │   └── api.js            # Axios client with interceptors
│   │   ├── App.jsx               # Route definitions & protected guards
│   │   ├── main.jsx              # React DOM root entry
│   │   └── index.css             # Design tokens & responsive styles
│   ├── package.json
│   ├── vercel.json               # SPA client-side rewrite rules
│   └── vite.config.js            # Vite bundler & dev proxy configuration
├── PROJECT_REPORT.md             # Project documentation markdown
├── DEPLOYMENT_GUIDE.md           # Cloud deployment instructions
├── README.md                     # Quickstart documentation
└── .gitignore                    # Excludes node_modules & .env
  </div>
</div>

<!-- SECTION 7 -->
<div class="section">
  <h2 class="sec-title">7. Module Description</h2>
  <ul>
    <li><strong>Authentication Module:</strong>
      <ul>
        <li><em>Purpose:</em> Manages user registration, credential authentication, and session persistence.</li>
        <li><em>Inputs:</em> Name, email, password, phone, selected membership tier.</li>
        <li><em>Outputs:</em> Signed JSON Web Token (JWT), user object, and authorized access redirect.</li>
      </ul>
    </li>
    <li><strong>Member Dashboard & Progress Module:</strong>
      <ul>
        <li><em>Purpose:</em> Empowers gym members to track their membership status, schedule classes, and record fitness gains.</li>
        <li><em>Inputs:</em> Daily workout date, body weight (kg), calories burned, duration.</li>
        <li><em>Outputs:</em> Interactive Recharts timeline graphs, workout history table, active membership countdown.</li>
      </ul>
    </li>
    <li><strong>Class & Session Booking Engine:</strong>
      <ul>
        <li><em>Purpose:</em> Facilitates real-time slot reservation for fitness classes.</li>
        <li><em>Inputs:</em> Program ID, session date.</li>
        <li><em>Outputs:</em> Reservation confirmation, updated slot capacity count, cancellation receipt.</li>
      </ul>
    </li>
    <li><strong>Administrative Management Module:</strong>
      <ul>
        <li><em>Purpose:</em> Complete gym operational oversight for administrators.</li>
        <li><em>Inputs:</em> Program details, trainer bios, member role edits, status updates.</li>
        <li><em>Outputs:</em> Financial KPI reports, attendance metrics, member roster, inquiry messages.</li>
      </ul>
    </li>
    <li><strong>Health Calculation Tools Module:</strong>
      <ul>
        <li><em>Purpose:</em> Public self-service tools for calculating BMI, BMR, and daily macronutrient breakdowns.</li>
        <li><em>Inputs:</em> Height (cm), weight (kg), age, gender, activity level, fitness objective.</li>
        <li><em>Outputs:</em> BMI classification score, daily target calorie limit, protein/carb/fat gram distribution.</li>
      </ul>
    </li>
  </ul>
</div>

<div class="page-break"></div>

<!-- SECTION 8 -->
<div class="section">
  <h2 class="sec-title">8. Implementation</h2>
  <p>
    The implementation employs modern software engineering patterns across both client and server:
  </p>
  <ul>
    <li><strong>State Management & Interceptors:</strong> Global authentication state is managed via React's <code>Context API</code>. Axios interceptors automatically attach the <code>Bearer &lt;token&gt;</code> to every outgoing API request and automatically handle 401 Unauthorized token expirations.</li>
    <li><strong>Password Security:</strong> Implemented using <code>bcryptjs</code> with 12 salt rounds during registration. The password hash is compared during login without ever decrypting or storing plaintext.</li>
    <li><strong>Capacity Collision Detection:</strong> In <code>bookingController.js</code>, when a booking request is received:
      <div class="tree-block">
const existingCount = await TrainingBooking.countDocuments({
  program: programId,
  sessionDate: sessionDate,
  status: 'confirmed'
});
if (existingCount &gt;= program.capacity) {
  return res.status(400).json({ success: false, message: 'Class session is fully booked.' });
}
      </div>
    </li>
    <li><strong>Data Visualization:</strong> Implemented using <code>Recharts</code> components (<code>ResponsiveContainer</code>, <code>LineChart</code>, <code>Line</code>, <code>XAxis</code>, <code>YAxis</code>, <code>Tooltip</code>) rendering dynamic SVG charts of weight and calorie metrics directly in the member dashboard.</li>
  </ul>
</div>

<!-- SECTION 9 -->
<div class="section">
  <h2 class="sec-title">9. Screenshots</h2>

  <div class="screenshot-card">
    <img src="${homeImg}" alt="FitZone Pro Home Page">
    <div class="caption">Figure 9.1: FitZone Pro Landing Page featuring Hero Section, Statistics Counter, and Navigation</div>
  </div>

  <div class="screenshot-card">
    <img src="${programsImg}" alt="Programs Page">
    <div class="caption">Figure 9.2: Workout Programs Catalog with Category Filters and Instant Booking Modal</div>
  </div>

  <div class="screenshot-card">
    <img src="${nutritionImg}" alt="Nutrition Calculator Page">
    <div class="caption">Figure 9.3: Interactive Nutrition & Macronutrient Calculator Suite</div>
  </div>

  <div class="screenshot-card">
    <img src="${loginImg}" alt="Authentication Login Screen">
    <div class="caption">Figure 9.4: Secure Login Interface with One-Click Demo Credentials for Evaluators</div>
  </div>
</div>

<div class="page-break"></div>

<!-- SECTION 10 -->
<div class="section">
  <h2 class="sec-title">10. Testing</h2>
  <p>System testing was conducted across all core functional workflows with the following test cases:</p>

  <table class="data-table">
    <thead>
      <tr>
        <th>Test ID</th>
        <th>Feature Tested</th>
        <th>Test Steps</th>
        <th>Expected Result</th>
        <th>Actual Result</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>TC-01</td>
        <td>Member Registration</td>
        <td>Submit valid registration form with name, email, password, and plan</td>
        <td>New User created with hashed password, JWT returned, redirected</td>
        <td>Account registered and redirected to dashboard</td>
        <td><span class="status-pass">PASS</span></td>
      </tr>
      <tr>
        <td>TC-02</td>
        <td>JWT Authentication</td>
        <td>Login with valid credentials (e.g. rahul@example.com / Member@1234)</td>
        <td>JWT token issued and stored in localStorage; user logged in</td>
        <td>Token stored and header updated; dashboard loaded</td>
        <td><span class="status-pass">PASS</span></td>
      </tr>
      <tr>
        <td>TC-03</td>
        <td>Invalid Login Guard</td>
        <td>Attempt login with incorrect password</td>
        <td>Server responds with 401 Unauthorized; error toast displayed</td>
        <td>HTTP 401 returned with "Invalid email or password" error toast</td>
        <td><span class="status-pass">PASS</span></td>
      </tr>
      <tr>
        <td>TC-04</td>
        <td>Role-Based Access</td>
        <td>Normal member attempts to access route <code>/admin/dashboard</code></td>
        <td>AdminRoute redirects unauthorized user to member dashboard</td>
        <td>Access denied; smoothly redirected</td>
        <td><span class="status-pass">PASS</span></td>
      </tr>
      <tr>
        <td>TC-05</td>
        <td>Class Booking</td>
        <td>Select program and click "Book Session" for upcoming date</td>
        <td>Reservation record created with status 'confirmed'</td>
        <td>Booking successful; visible in My Bookings tab</td>
        <td><span class="status-pass">PASS</span></td>
      </tr>
      <tr>
        <td>TC-06</td>
        <td>Progress Logging</td>
        <td>Enter weight (74 kg) and calories (450 kcal) in tracker modal</td>
        <td>New progress document inserted; chart updates dynamically</td>
        <td>Record saved and Recharts graph re-rendered with new plot point</td>
        <td><span class="status-pass">PASS</span></td>
      </tr>
      <tr>
        <td>TC-07</td>
        <td>Admin Program CRUD</td>
        <td>Admin creates new workout program with title, category, and duration</td>
        <td>Program document created and visible immediately on public page</td>
        <td>Program saved and displayed across grid</td>
        <td><span class="status-pass">PASS</span></td>
      </tr>
      <tr>
        <td>TC-08</td>
        <td>BMI Calculator</td>
        <td>Input height = 175 cm, weight = 70 kg on homepage</td>
        <td>Calculates BMI = 22.86 with category classification "Normal"</td>
        <td>Displayed BMI 22.9 with normal weight badge</td>
        <td><span class="status-pass">PASS</span></td>
      </tr>
    </tbody>
  </table>
</div>

<!-- SECTION 11, 12, 13, 14 -->
<div class="section">
  <h2 class="sec-title">11. Results</h2>
  <p>
    The implemented system fully achieves all specified project goals. It provides a reliable, secure, and visually appealing web platform for gym operations. The integration between React 18, Express.js, and MongoDB Atlas functions seamlessly with sub-second API response times and zero breaking errors under normal workloads. Both administrators and gym members benefit from streamlined digital workflows that completely eliminate manual paper-based tracking.
  </p>
</div>

<div class="section">
  <h2 class="sec-title">12. Conclusion</h2>
  <p>
    The <strong>FitZone Pro</strong> web application successfully demonstrates full-stack software development best practices using the MERN stack. Through this project, practical competency was achieved in RESTful API engineering, JWT security, NoSQL schema modeling with Mongoose, state management via React Context, and modern cloud deployment using Render and Vercel. The resulting platform solves real-world challenges faced by physical fitness facilities and provides a modern digital experience for members.
  </p>
</div>

<div class="section">
  <h2 class="sec-title">13. Future Scope</h2>
  <ul>
    <li><strong>Payment Gateway Integration:</strong> Embedding Razorpay or Stripe for automated online subscription renewals and automated billing invoices.</li>
    <li><strong>Mobile Application:</strong> Developing a cross-platform companion mobile app using React Native for barcode-based turnstile gym check-in.</li>
    <li><strong>AI Workout Coach:</strong> Integrating OpenAI or Gemini API for personalized AI workout and diet generation based on logged progress.</li>
    <li><strong>Automated Reminders:</strong> Automated WhatsApp/SMS alerts for upcoming booked fitness classes and expiring memberships via Twilio.</li>
  </ul>
</div>

<div class="section">
  <h2 class="sec-title">14. References</h2>
  <ul>
    <li>Project GitHub Repository: <a href="https://github.com/yashpawar0610-lab/pranaywebsite">https://github.com/yashpawar0610-lab/pranaywebsite</a></li>
    <li>Live Backend API (Render): <a href="https://pranaywebsite.onrender.com">https://pranaywebsite.onrender.com</a></li>
    <li>React Official Documentation: <a href="https://react.dev/">https://react.dev/</a></li>
    <li>Node.js Official Documentation: <a href="https://nodejs.org/docs/">https://nodejs.org/docs/</a></li>
    <li>Express.js Web Framework Documentation: <a href="https://expressjs.com/">https://expressjs.com/</a></li>
    <li>MongoDB Atlas & Mongoose ODM Guides: <a href="https://www.mongodb.com/docs/">https://www.mongodb.com/docs/</a> and <a href="https://mongoosejs.com/">https://mongoosejs.com/</a></li>
    <li>Recharts Data Visualization Library: <a href="https://recharts.org/">https://recharts.org/</a></li>
    <li>Render Cloud Platform Documentation: <a href="https://render.com/docs">https://render.com/docs</a></li>
    <li>Vercel Platform & Edge Network: <a href="https://vercel.com/docs">https://vercel.com/docs</a></li>
  </ul>
</div>

</body>
</html>
`;

fs.writeFileSync(path.join(rootDir, 'official_report.html'), htmlContent);
console.log('✅ official_report.html created!');

// Convert to PDF using Edge headless
const outputPath = path.join(rootDir, 'PROJECT_DOCUMENTATION_PRANAY_ADANGALE_201.pdf');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const cmd = `"${edgePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --no-pdf-header-footer --print-to-pdf="${outputPath}" "${path.join(rootDir, 'official_report.html')}"`;

console.log('⏳ Generating PDF via Edge headless...');
execSync(cmd);
console.log(`🎉 PDF generated successfully at: ${outputPath}`);
