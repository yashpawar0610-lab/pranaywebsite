import { NavLink } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="grid-4" style={{ marginBottom: '3rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem' }}>
              Fit<span style={{ color: 'var(--lime)' }}>Zone</span> Pro
            </div>
            <p style={{ color: 'var(--gray)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Your ultimate fitness destination. Build strength, lose weight, and transform your life with professional guidance.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" style={{
                  width: 38, height: 38, background: 'var(--dark3)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--gray)', transition: 'var(--transition)'
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--lime)'; e.currentTarget.style.color = 'var(--lime)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--gray)'; }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gray-light)', marginBottom: '1rem' }}>
              Quick Links
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                ['/', 'Home'], ['/programs', 'Programs'], ['/trainers', 'Trainers'],
                ['/membership', 'Membership'], ['/nutrition', 'Nutrition']
              ].map(([to, label]) => (
                <li key={to}>
                  <NavLink to={to} style={{ color: 'var(--gray)', fontSize: '0.9rem', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = 'var(--lime)'}
                    onMouseLeave={e => e.target.style.color = 'var(--gray)'}>
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gray-light)', marginBottom: '1rem' }}>
              Programs
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {['Weight Training', 'Muscle Building', 'Fat Loss', 'Cardio', 'Flexibility', 'Functional'].map(p => (
                <li key={p}>
                  <NavLink to="/programs" style={{ color: 'var(--gray)', fontSize: '0.9rem', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = 'var(--lime)'}
                    onMouseLeave={e => e.target.style.color = 'var(--gray)'}>
                    {p}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gray-light)', marginBottom: '1rem' }}>
              Contact
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                [MapPin, '123 Fitness Street, Mumbai, Maharashtra 400001 (Demo Address)'],
                [Phone, '+91 98765 43210 (Demo Number)'],
                [Mail, 'info@fitzonepro.com (Demo Email)'],
              ].map(([Icon, text], i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'var(--gray)', fontSize: '0.875rem' }}>
                  <Icon size={15} style={{ color: 'var(--lime)', marginTop: 2, flexShrink: 0 }} />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>
            © {year} FitZone Pro. All rights reserved. This is a demonstration project.
          </p>
          <p style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>
            Built with ❤️ using React, Node.js & MongoDB
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
