import { useEffect, useState } from 'react';
import { progressAPI } from '../services/api';
import { useToast } from '../components/Toast';
import DashboardSidebar from '../components/DashboardSidebar';
import { Trash2, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const MyProgress = () => {
  const { toast } = useToast();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    progressAPI.getMyProgress({ limit: 30 })
      .then(r => setProgress(r.data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const del = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    try { await progressAPI.deleteProgress(id); toast('Deleted.', 'info'); load(); }
    catch { toast('Failed.', 'error'); }
  };

  const chartData = [...progress].reverse().map(p => ({
    date: new Date(p.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    duration: p.duration || 0,
    calories: p.caloriesBurned || 0,
    weight: p.weight || null,
  }));

  const moodEmoji = { great: '😄', good: '🙂', okay: '😐', tired: '😴', bad: '😞' };
  const totalSessions = progress.length;
  const totalCal = progress.reduce((a, p) => a + (p.caloriesBurned || 0), 0);
  const totalMin = progress.reduce((a, p) => a + (p.duration || 0), 0);

  return (
    <div className="dashboard-layout">
      <DashboardSidebar />
      <div className="dashboard-content page-enter">
        <h1 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', marginBottom: '1.5rem' }}>
          Workout <span style={{ color: 'var(--lime)' }}>Progress</span>
        </h1>

        {/* Summary */}
        <div className="grid-3" style={{ marginBottom: '2rem' }}>
          {[
            { label: 'Sessions Logged', value: totalSessions, color: 'var(--lime)' },
            { label: 'Total Minutes', value: totalMin, color: 'var(--blue)' },
            { label: 'Calories Burned', value: totalCal.toLocaleString(), color: 'var(--amber)' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        {chartData.length > 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            {[
              { key: 'duration', label: 'Duration (min)', color: 'var(--lime)' },
              { key: 'calories', label: 'Calories Burned', color: 'var(--amber)' },
            ].map(({ key, label, color }) => (
              <div key={key} style={{ background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--gray)', marginBottom: '1rem' }}>{label}</h3>
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="date" stroke="var(--gray)" tick={{ fontSize: 10 }} />
                    <YAxis stroke="var(--gray)" tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: 8 }} />
                    <Line type="monotone" dataKey={key} stroke={color} strokeWidth={2} dot={{ fill: color, r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        )}

        {/* History */}
        <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Workout History</h3>
        {loading ? <div className="loading-container"><div className="spinner" /></div> : progress.length === 0 ? (
          <div className="empty-state">
            <TrendingUp size={40} style={{ margin: '0 auto 1rem', color: 'var(--gray)' }} />
            <h3>No workout logs yet.</h3>
            <p>Log your first workout from the Dashboard.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr><th>Date</th><th>Duration</th><th>Calories</th><th>Program</th><th>Mood</th><th>Notes</th><th></th></tr>
              </thead>
              <tbody>
                {progress.map(p => (
                  <tr key={p._id}>
                    <td style={{ fontWeight: 600, fontSize: '0.875rem' }}>{new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                    <td>{p.duration} min</td>
                    <td>{p.caloriesBurned || '—'}</td>
                    <td style={{ color: 'var(--gray)', fontSize: '0.8rem' }}>{p.program?.title || 'Free workout'}</td>
                    <td>{p.mood ? `${moodEmoji[p.mood] || ''} ${p.mood}` : '—'}</td>
                    <td style={{ color: 'var(--gray)', fontSize: '0.8rem', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.notes || '—'}</td>
                    <td>
                      <button onClick={() => del(p._id)} className="btn btn-red btn-sm"><Trash2 size={13} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProgress;
