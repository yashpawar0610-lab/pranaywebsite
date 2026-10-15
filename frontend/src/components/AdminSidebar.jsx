import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, Dumbbell, CreditCard, Calendar,
  MessageSquare, Settings, LogOut, BarChart2, UserCheck
} from 'lucide-react';

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/users', icon: Users, label: 'Members' },
    { to: '/admin/memberships', icon: CreditCard, label: 'Memberships' },
    { to: '/admin/programs', icon: Dumbbell, label: 'Programs' },
    { to: '/admin/trainers', icon: UserCheck, label: 'Trainers' },
    { to: '/admin/bookings', icon: Calendar, label: 'Bookings' },
    { to: '/admin/messages', icon: MessageSquare, label: 'Messages' },
  ];

  return (
    <aside className="sidebar">
      <div style={{ padding: '0.75rem 1rem', background: 'rgba(132,204,22,0.1)', border: '1px solid rgba(132,204,22,0.2)', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--lime)', marginBottom: '0.25rem' }}>Admin Panel</p>
        <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user?.name}</p>
      </div>

      <p className="sidebar-section-title">Management</p>
      {links.map(({ to, icon: Icon, label, end }) => (
        <NavLink key={to} to={to} end={end}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Icon size={16} />
          {label}
        </NavLink>
      ))}

      <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)', marginTop: '2rem' }}>
        <button onClick={() => { logout(); navigate('/'); }}
          className="sidebar-link" style={{ width: '100%', color: 'var(--red)' }}>
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
