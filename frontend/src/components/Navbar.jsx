import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home', end: true },
    { to: '/programs', label: 'Programs' },
    { to: '/trainers', label: 'Trainers' },
    { to: '/membership', label: 'Membership' },
    { to: '/nutrition', label: 'Nutrition' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <NavLink to="/" className="navbar-brand">
        Fit<span>Zone</span> <span style={{ color: 'var(--lime)' }}>Pro</span>
      </NavLink>

      <div className={`navbar-nav ${mobileOpen ? 'open' : ''}`}>
        {navLinks.map(link => (
          <NavLink key={link.to} to={link.to} end={link.end}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}>
            {link.label}
          </NavLink>
        ))}

        <div className="navbar-actions" style={{ display: 'flex' }}>
          {isAuthenticated ? (
            <>
              <NavLink to={isAdmin ? '/admin' : '/dashboard'}
                className="btn btn-dark btn-sm"
                onClick={() => setMobileOpen(false)}>
                <LayoutDashboard size={15} />
                {isAdmin ? 'Admin' : 'Dashboard'}
              </NavLink>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                <LogOut size={15} /> Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn btn-dark btn-sm" onClick={() => setMobileOpen(false)}>
                Login
              </NavLink>
              <NavLink to="/register" className="btn btn-primary btn-sm" onClick={() => setMobileOpen(false)}>
                Join Now
              </NavLink>
            </>
          )}
        </div>
      </div>

      <div className="navbar-actions" style={{ display: 'flex' }}>
        {isAuthenticated ? (
          <>
            <NavLink to={isAdmin ? '/admin' : '/dashboard'} className="btn btn-dark btn-sm">
              <LayoutDashboard size={15} />
              {isAdmin ? 'Admin' : 'Dashboard'}
            </NavLink>
            <button onClick={handleLogout} className="btn btn-outline btn-sm">
              <LogOut size={15} /> Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="btn btn-dark btn-sm">Login</NavLink>
            <NavLink to="/register" className="btn btn-primary btn-sm">Join Now</NavLink>
          </>
        )}
      </div>

      <button className="hamburger" onClick={() => setMobileOpen(v => !v)} aria-label="Toggle menu">
        {mobileOpen ? <X size={22} color="white" /> : (
          <><span /><span /><span /></>
        )}
      </button>
    </nav>
  );
};

export default Navbar;
