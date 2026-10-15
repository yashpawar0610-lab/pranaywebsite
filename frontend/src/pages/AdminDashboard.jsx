import { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';
import AdminSidebar from '../components/AdminSidebar';
import { Users, CreditCard, Dumbbell, Calendar, MessageSquare, TrendingUp, UserCheck, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';

const StatCard = ({ icon: Icon, label, value, color = 'var(--lime)', sub }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ background: `${color}18` }}>
      <Icon size={22} style={{ color }} />
    </div>
    <div className="stat-value" style={{ color }}>{value}</div>
    <div className="stat-label">{label}</div>
    {sub && <div style={{ fontSize: '0.75rem', color: 'var(--gray)', marginTop: '0.25rem' }}>{sub}</div>}
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats()
      .then(r => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <div className="dashboard-content loading-container"><div className="spinner" /></div>
    </div>
  );

  const membershipData = [
    { name: 'Active', value: stats?.activeMemberships || 0, color: 'var(--green)' },
    { name: 'Expired', value: stats?.expiredMemberships || 0, color: 'var(--red)' },
    { name: 'Pending', value: stats?.pendingMemberships || 0, color: 'var(--amber)' },
  ];

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <div className="dashboard-content page-enter">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-display)' }}>
            Admin <span style={{ color: 'var(--lime)' }}>Dashboard</span>
          </h1>
          <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Real-time overview of FitZone Pro platform.</p>
        </div>

        {/* Stats grid */}
        <div className="grid-4" style={{ marginBottom: '2rem' }}>
          <StatCard icon={Users} label="Total Members" value={stats?.totalUsers || 0} color="var(--lime)" />
          <StatCard icon={CreditCard} label="Active Memberships" value={stats?.activeMemberships || 0} color="var(--green)" sub={`${stats?.expiredMemberships || 0} expired`} />
          <StatCard icon={Dumbbell} label="Programs" value={stats?.totalPrograms || 0} color="var(--blue)" />
          <StatCard icon={UserCheck} label="Trainers" value={stats?.totalTrainers || 0} color="var(--amber)" />
          <StatCard icon={Calendar} label="Total Bookings" value={stats?.totalBookings || 0} color="var(--lime)" sub={`${stats?.pendingBookings || 0} pending`} />
          <StatCard icon={MessageSquare} label="Unread Messages" value={stats?.unreadMessages || 0} color={stats?.unreadMessages > 0 ? 'var(--red)' : 'var(--gray)'} />
          <StatCard icon={DollarSign} label="Demo Revenue" value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`} color="var(--amber)" sub="Active memberships" />
          <StatCard icon={TrendingUp} label="Expired Plans" value={stats?.expiredMemberships || 0} color="var(--red)" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Membership status pie */}
          <div style={{ background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>Membership Distribution</h3>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie data={membershipData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                    {membershipData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {membershipData.map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: d.color, flexShrink: 0 }} />
                    <span style={{ color: 'var(--gray-light)', fontSize: '0.875rem' }}>{d.name}</span>
                    <span style={{ fontWeight: 700, marginLeft: 'auto' }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent members */}
          <div style={{ background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>Recent Members</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stats?.recentMembers?.length > 0 ? stats.recentMembers.map(m => (
                <div key={m._id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 34, height: 34, background: 'var(--lime)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--black)', fontSize: '1rem', flexShrink: 0 }}>
                    {m.name?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</p>
                    <p style={{ color: 'var(--gray)', fontSize: '0.75rem' }}>{new Date(m.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              )) : <p style={{ color: 'var(--gray)', fontSize: '0.875rem' }}>No members yet.</p>}
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div style={{ background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>Quick Actions</h3>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {[
              ['/admin/users', 'Manage Members'],
              ['/admin/programs', 'Manage Programs'],
              ['/admin/trainers', 'Manage Trainers'],
              ['/admin/memberships', 'View Memberships'],
              ['/admin/bookings', 'View Bookings'],
              ['/admin/messages', 'View Messages'],
            ].map(([to, label]) => (
              <a key={to} href={to} className="btn btn-dark btn-sm">{label}</a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
