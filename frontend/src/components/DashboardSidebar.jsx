import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, User, Dumbbell, CreditCard, Calendar,
  TrendingUp, Settings, LogOut, ChevronRight
} from 'lucide-react';

const DashboardSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Overview', end: true },
    { to: '/dashboard/profile', icon: User, label: 'My Profile' },
    { to: '/dashboard/membership', icon: CreditCard, label: 'Membership' },
    { to: '/dashboard/programs', icon: Dumbbell, label: 'My Programs' },
    { to: '/dashboard/bookings', icon: Calendar, label: 'Bookings' },
    { to: '/dashboard/progress', icon: TrendingUp, label: 'Progress' },
    { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="sidebar">
      <div style={{ padding: '0.75rem 1rem', background: 'var(--dark3)', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: 38, height: 38, background: 'var(--lime)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--black)', fontSize: '1.1rem', flexShrink: 0 }}>
          {user?.name?.charAt(0)?.toUpperCase() || 'M'}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</p>
          <p style={{ color: 'var(--gray)', fontSize: '0.75rem' }}>Member</p>
        </div>
      </div>

      <p className="sidebar-section-title">Main</p>
      {links.map(({ to, icon: Icon, label, end }) => (
        <NavLink key={to} to={to} end={end}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Icon size={16} />
          {label}
        </NavLink>
      ))}

      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
        <button onClick={() => { logout(); navigate('/'); }}
          className="sidebar-link" style={{ width: '100%', color: 'var(--red)' }}>
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
