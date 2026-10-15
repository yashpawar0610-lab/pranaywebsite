import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import DashboardSidebar from '../components/DashboardSidebar';
import { userAPI, progressAPI } from '../services/api';
import { Dumbbell, Calendar, TrendingUp, CreditCard, Clock, Flame, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

// ── BMI Calculator ────────────────────────────────────────
const BMICalculator = () => {
  const [h, setH] = useState('');
  const [w, setW] = useState('');
  const [bmi, setBmi] = useState(null);

  const calculate = () => {
    const height = parseFloat(h) / 100;
    const weight = parseFloat(w);
    if (!height || !weight || height <= 0 || weight <= 0) return;
    const b = (weight / (height * height)).toFixed(1);
    setBmi(b);
  };

  const getBMICategory = (b) => {
    if (b < 18.5) return { label: 'Underweight', color: 'var(--blue)' };
    if (b < 25) return { label: 'Normal Weight', color: 'var(--green)' };
    if (b < 30) return { label: 'Overweight', color: 'var(--amber)' };
    return { label: 'Obese', color: 'var(--red)' };
  };

  const cat = bmi ? getBMICategory(parseFloat(bmi)) : null;

  return (
    <div style={{ background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
      <h3 style={{ marginBottom: '1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Award size={18} color="var(--lime)" /> BMI Calculator
      </h3>
      <p style={{ color: 'var(--gray)', fontSize: '0.8rem', marginBottom: '1rem' }}>
        BMI is a general indicator, not a complete measure of health. Consult a professional for comprehensive assessment.
      </p>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">Height (cm)</label>
          <input type="number" className="form-control" placeholder="175" value={h} onChange={e => setH(e.target.value)} min={100} max={250} />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">Weight (kg)</label>
          <input type="number" className="form-control" placeholder="70" value={w} onChange={e => setW(e.target.value)} min={30} max={300} />
        </div>
      </div>
      <button onClick={calculate} className="btn btn-primary btn-sm btn-full" style={{ marginBottom: bmi ? '1rem' : 0 }}>
        Calculate BMI
      </button>
      {bmi && cat && (
        <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--dark4)', borderRadius: 'var(--radius-sm)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, color: cat.color, lineHeight: 1 }}>{bmi}</p>
          <p style={{ color: cat.color, fontWeight: 600, marginTop: '0.25rem' }}>{cat.label}</p>
        </div>
      )}
    </div>
  );
};

// ── Log Workout ───────────────────────────────────────────
const LogWorkout = ({ onLog }) => {
  const { toast } = useToast();
  const [form, setForm] = useState({ duration: '', caloriesBurned: '', notes: '', mood: '' });
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault();
    if (!form.duration) { toast('Please enter workout duration.', 'error'); return; }
    setLoading(true);
    try {
      await progressAPI.logProgress({ ...form, duration: parseInt(form.duration), caloriesBurned: parseInt(form.caloriesBurned) || 0 });
      toast('Workout logged!', 'success');
      setForm({ duration: '', caloriesBurned: '', notes: '', mood: '' });
      onLog();
    } catch { toast('Failed to log workout.', 'error'); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <TrendingUp size={18} color="var(--lime)" /> Log Today's Workout
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div className="form-group">
          <label className="form-label">Duration (min) *</label>
          <input type="number" className="form-control" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="45" min={1} />
        </div>
        <div className="form-group">
          <label className="form-label">Calories Burned</label>
          <input type="number" className="form-control" value={form.caloriesBurned} onChange={e => setForm(f => ({ ...f, caloriesBurned: e.target.value }))} placeholder="300" min={0} />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Mood</label>
        <select className="form-control" value={form.mood} onChange={e => setForm(f => ({ ...f, mood: e.target.value }))}>
          <option value="">Select mood</option>
          {['great', 'good', 'okay', 'tired', 'bad'].map(m => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Notes</label>
        <textarea className="form-control" rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="How was the session?" />
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Logging...' : 'Log Workout'}
      </button>
    </form>
  );
};

// ── Dashboard Overview ────────────────────────────────────
const DashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    setLoading(true);
    userAPI.getDashboard()
      .then(r => setData(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [refresh]);

  if (loading) return (
    <div className="dashboard-layout">
      <DashboardSidebar />
      <div className="dashboard-content">
        <div className="loading-container"><div className="spinner" /></div>
      </div>
    </div>
  );

  const membership = data?.membership;
  const progress = data?.recentProgress || [];
  const bookings = data?.upcomingBookings || [];

  // Chart data
  const chartData = progress.slice(0, 7).reverse().map((p, i) => ({
    day: new Date(p.date).toLocaleDateString('en', { weekday: 'short' }),
    duration: p.duration || 0,
    calories: p.caloriesBurned || 0
  }));

  const daysRemaining = membership ? Math.max(0, Math.ceil((new Date(membership.endDate) - new Date()) / (1000 * 60 * 60 * 24))) : 0;

  return (
    <div className="dashboard-layout">
      <DashboardSidebar />
      <div className="dashboard-content page-enter">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-display)' }}>
              Welcome back, <span style={{ color: 'var(--lime)' }}>{user?.name?.split(' ')[0]}!</span>
            </h1>
            <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Track your progress and manage your fitness journey.</p>
          </div>
          <Link to="/programs" className="btn btn-primary">
            <Dumbbell size={16} /> Browse Programs
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid-4" style={{ marginBottom: '2rem' }}>
          {[
            { icon: CreditCard, label: 'Plan', value: membership?.plan?.name || 'None', color: 'var(--lime)' },
            { icon: Clock, label: 'Days Remaining', value: membership ? daysRemaining : 'N/A', color: membership ? 'var(--green)' : 'var(--red)' },
            { icon: TrendingUp, label: 'Workouts (7d)', value: progress.length, color: 'var(--amber)' },
            { icon: Flame, label: 'Calories (7d)', value: progress.reduce((a, p) => a + (p.caloriesBurned || 0), 0).toLocaleString(), color: 'var(--red)' },
          ].map(({ icon: Icon, label, value, color }, i) => (
            <div key={i} className="stat-card">
              <div className="stat-icon"><Icon size={22} /></div>
              <div className="stat-value" style={{ color }}>{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>

        {/* Membership status */}
        {membership ? (
          <div style={{ background: 'var(--dark2)', border: '1px solid var(--lime)', borderRadius: 'var(--radius)', padding: '1.25rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{ fontWeight: 600 }}>
                <span style={{ color: 'var(--lime)' }}>{membership.plan?.name}</span> Membership
                <span className="badge badge-green" style={{ marginLeft: '0.75rem' }}>{membership.status}</span>
              </p>
              <p style={{ color: 'var(--gray)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                Valid until: {new Date(membership.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <Link to="/dashboard/membership" className="btn btn-outline btn-sm">Manage</Link>
          </div>
        ) : (
          <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius)', padding: '1.25rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontWeight: 600, color: '#fca5a5' }}>No Active Membership</p>
              <p style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>Subscribe to a plan to access all features.</p>
            </div>
            <Link to="/membership" className="btn btn-primary btn-sm">Subscribe Now</Link>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Weekly chart */}
          <div style={{ background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} color="var(--lime)" /> Weekly Progress
            </h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={chartData}>
                  <XAxis dataKey="day" stroke="var(--gray)" tick={{ fontSize: 11 }} />
                  <YAxis stroke="var(--gray)" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: 8 }} />
                  <Bar dataKey="duration" fill="var(--lime)" radius={[4, 4, 0, 0]} name="Duration (min)" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                <p>No workout data yet.</p>
                <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Log your first workout below.</p>
              </div>
            )}
          </div>

          {/* Upcoming bookings */}
          <div style={{ background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} color="var(--lime)" /> Upcoming Sessions
            </h3>
            {bookings.length > 0 ? bookings.map(b => (
              <div key={b._id} style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                <img src={b.trainer?.image} alt={b.trainer?.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{b.trainer?.name}</p>
                  <p style={{ color: 'var(--gray)', fontSize: '0.8rem' }}>
                    {new Date(b.date).toLocaleDateString()} • {b.timeSlot}
                  </p>
                </div>
                <span className={`badge ${b.status === 'confirmed' ? 'badge-green' : 'badge-amber'}`}>{b.status}</span>
              </div>
            )) : (
              <div className="empty-state">
                <p>No upcoming sessions.</p>
                <Link to="/trainers" style={{ color: 'var(--lime)', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>Book a trainer →</Link>
              </div>
            )}
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
            <LogWorkout onLog={() => setRefresh(r => r + 1)} />
          </div>
          <BMICalculator />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
