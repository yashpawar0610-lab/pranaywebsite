import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';

const RegisterPage = () => {
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const validate = () => {
    if (!form.name.trim()) return 'Full name is required.';
    if (!form.email) return 'Email is required.';
    if (!/^[0-9]{10}$/.test(form.phone)) return 'Enter a valid 10-digit phone number.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      const { name, email, phone, password } = form;
      await register({ name, email, phone, password });
      toast('Welcome to FitZone Pro! Account created successfully.', 'success');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  const perks = ['Access to all programs', 'Personal dashboard', 'Progress tracking', 'Connect with trainers'];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--black)', paddingTop: 70 }}>
      {/* Left panel */}
      <div style={{ flex: 1, display: 'none', background: 'var(--dark2)', borderRight: '1px solid var(--border)', padding: '4rem 3rem', flexDirection: 'column', justifyContent: 'center' }} className="register-panel">
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, marginBottom: '1rem' }}>
          Start Your <span style={{ color: 'var(--lime)' }}>Journey</span>
        </div>
        <p style={{ color: 'var(--gray)', marginBottom: '2.5rem', lineHeight: 1.7 }}>
          Join thousands of members who transformed their lives at FitZone Pro.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {perks.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CheckCircle size={18} color="var(--lime)" />
              <span style={{ color: 'var(--gray-light)', fontSize: '0.9rem' }}>{p}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div style={{ width: '100%', maxWidth: 460 }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Fit<span style={{ color: 'var(--lime)' }}>Zone</span> Pro
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 600, fontFamily: 'var(--font-body)', marginBottom: '0.25rem' }}>Create your account</h1>
            <p style={{ color: 'var(--gray)', fontSize: '0.875rem' }}>Fill in your details to get started</p>
          </div>

          <div style={{ background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-name">Full Name</label>
                <input id="reg-name" name="name" type="text" className="form-control"
                  placeholder="John Doe" value={form.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-email">Email Address</label>
                <input id="reg-email" name="email" type="email" className="form-control"
                  placeholder="you@example.com" value={form.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-phone">Phone Number (10 digits)</label>
                <input id="reg-phone" name="phone" type="tel" className="form-control"
                  placeholder="9876543210" value={form.phone} onChange={handleChange} maxLength={10} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-password">Password</label>
                <div style={{ position: 'relative' }}>
                  <input id="reg-password" name="password" type={showPass ? 'text' : 'password'} className="form-control"
                    placeholder="Min 6 characters" value={form.password} onChange={handleChange} style={{ paddingRight: '2.75rem' }} />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }}>
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
                <input id="reg-confirm" name="confirmPassword" type="password" className="form-control"
                  placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} />
              </div>

              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: '0.5rem' }}>
                {loading ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Creating...</> : <>Create Account <ArrowRight size={16} /></>}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--gray)', fontSize: '0.875rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--lime)', fontWeight: 600 }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
