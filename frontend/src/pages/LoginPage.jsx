import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { Eye, EyeOff, Dumbbell, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      const res = await login(form);
      toast(`Welcome back, ${res.user.name}!`, 'success');
      navigate(res.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--black)', padding: '5rem 1rem 2rem' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Fit<span style={{ color: 'var(--lime)' }}>Zone</span> Pro
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, fontFamily: 'var(--font-body)', marginBottom: '0.25rem' }}>Welcome back</h1>
          <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Sign in to your account to continue</p>
        </div>

        <div style={{ background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input id="email" name="email" type="email" className="form-control" placeholder="you@example.com"
                value={form.email} onChange={handleChange} autoComplete="email" />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div style={{ position: 'relative' }}>
                <input id="password" name="password" type={showPass ? 'text' : 'password'} className="form-control"
                  placeholder="••••••••" value={form.password} onChange={handleChange} autoComplete="current-password"
                  style={{ paddingRight: '2.75rem' }} />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: '0.5rem' }}>
              {loading ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Signing in...</> : <>Sign In <ArrowRight size={16} /></>}
            </button>
          </form>

          {/* Demo credentials */}
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--dark3)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--gray)' }}>
            <p style={{ fontWeight: 600, color: 'var(--gray-light)', marginBottom: '0.5rem' }}>🎯 Demo Credentials</p>
            <p>Admin: admin@fitzonepro.com / Admin@1234</p>
            <p>Member: rahul@example.com / Member@1234</p>
          </div>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--gray)', fontSize: '0.875rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--lime)', fontWeight: 600 }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
