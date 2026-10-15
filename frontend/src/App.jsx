import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/RouteGuards';

// Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProgramsPage from './pages/ProgramsPage';
import TrainersPage from './pages/TrainersPage';
import MembershipPage from './pages/MembershipPage';
import NutritionPage from './pages/NutritionPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

// Member dashboard
import DashboardPage from './pages/DashboardPage';
import MyBookings from './pages/MyBookings';
import MyProgress from './pages/MyProgress';

// Admin pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminMemberships from './pages/AdminMemberships';
import AdminPrograms from './pages/AdminPrograms';
import AdminTrainers from './pages/AdminTrainers';
import AdminBookings from './pages/AdminBookings';
import AdminMessages from './pages/AdminMessages';

// Pages that use their own full-page layout (no public nav/footer)
const dashboardPaths = ['/dashboard', '/admin'];
const isDashboardPath = (path) => dashboardPaths.some(p => path.startsWith(p));

// Simple wrapper: shows navbar+footer only for public pages
const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* ── Public routes ──────────────────────────── */}
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/programs" element={<PublicLayout><ProgramsPage /></PublicLayout>} />
            <Route path="/trainers" element={<PublicLayout><TrainersPage /></PublicLayout>} />
            <Route path="/membership" element={<PublicLayout><MembershipPage /></PublicLayout>} />
            <Route path="/nutrition" element={<PublicLayout><NutritionPage /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />

            {/* ── Auth routes (redirect if logged in) ────── */}
            <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

            {/* ── Member dashboard ───────────────────────── */}
            <Route path="/dashboard" element={<ProtectedRoute><Navbar /><DashboardPage /></ProtectedRoute>} />
            <Route path="/dashboard/membership" element={<ProtectedRoute><Navbar /><MembershipPage /></ProtectedRoute>} />
            <Route path="/dashboard/programs" element={<ProtectedRoute><Navbar /><ProgramsPage /></ProtectedRoute>} />
            <Route path="/dashboard/bookings" element={<ProtectedRoute><Navbar /><MyBookings /></ProtectedRoute>} />
            <Route path="/dashboard/progress" element={<ProtectedRoute><Navbar /><MyProgress /></ProtectedRoute>} />
            <Route path="/dashboard/profile" element={<ProtectedRoute><Navbar /><DashboardPage /></ProtectedRoute>} />
            <Route path="/dashboard/settings" element={<ProtectedRoute><Navbar /><DashboardPage /></ProtectedRoute>} />

            {/* ── Admin dashboard ────────────────────────── */}
            <Route path="/admin" element={<AdminRoute><Navbar /><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><Navbar /><AdminUsers /></AdminRoute>} />
            <Route path="/admin/memberships" element={<AdminRoute><Navbar /><AdminMemberships /></AdminRoute>} />
            <Route path="/admin/programs" element={<AdminRoute><Navbar /><AdminPrograms /></AdminRoute>} />
            <Route path="/admin/trainers" element={<AdminRoute><Navbar /><AdminTrainers /></AdminRoute>} />
            <Route path="/admin/bookings" element={<AdminRoute><Navbar /><AdminBookings /></AdminRoute>} />
            <Route path="/admin/messages" element={<AdminRoute><Navbar /><AdminMessages /></AdminRoute>} />

            {/* ── 404 ───────────────────────────────────── */}
            <Route path="*" element={
              <PublicLayout>
                <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center', padding: '2rem' }}>
                  <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '8rem', fontWeight: 800, color: 'var(--lime)', lineHeight: 1 }}>404</h1>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Page Not Found</h2>
                  <p style={{ color: 'var(--gray)', marginBottom: '2rem' }}>The page you're looking for doesn't exist.</p>
                  <a href="/" className="btn btn-primary">Back to Home</a>
                </div>
              </PublicLayout>
            } />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
