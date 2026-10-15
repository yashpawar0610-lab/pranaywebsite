import { useEffect, useState } from 'react';
import { bookingAPI } from '../services/api';
import { useToast } from '../components/Toast';
import AdminSidebar from '../components/AdminSidebar';
import { Calendar, ChevronDown } from 'lucide-react';

const AdminBookings = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const load = () => {
    setLoading(true);
    const params = { limit: 50 };
    if (filter) params.status = filter;
    bookingAPI.getAllBookings(params)
      .then(r => setBookings(r.data.data || []))
      .catch(() => toast('Failed to load bookings.', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const updateStatus = async (id, status) => {
    try {
      await bookingAPI.updateBookingStatus(id, status);
      toast('Booking status updated.', 'success');
      load();
    } catch { toast('Failed to update.', 'error'); }
  };

  const statusColors = { pending: 'badge-amber', confirmed: 'badge-green', cancelled: 'badge-red', completed: 'badge-blue' };

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <div className="dashboard-content page-enter">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)' }}>
            Training <span style={{ color: 'var(--lime)' }}>Bookings</span>
          </h1>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
              <button key={s} onClick={() => setFilter(s)} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-dark'}`}>
                {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
              </button>
            ))}
          </div>
        </div>

        {loading ? <div className="loading-container"><div className="spinner" /></div> : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Trainer</th>
                  <th>Date & Time</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--gray)', padding: '3rem' }}>No bookings found.</td></tr>
                ) : bookings.map(b => (
                  <tr key={b._id}>
                    <td>
                      <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{b.user?.name}</p>
                      <p style={{ color: 'var(--gray)', fontSize: '0.75rem' }}>{b.user?.email}</p>
                    </td>
                    <td style={{ fontWeight: 500 }}>{b.trainer?.name}</td>
                    <td>
                      <p style={{ fontSize: '0.875rem' }}>{new Date(b.date).toLocaleDateString('en-IN')}</p>
                      <p style={{ color: 'var(--lime)', fontSize: '0.8rem' }}>{b.timeSlot}</p>
                    </td>
                    <td><span className="badge badge-gray">{b.sessionType}</span></td>
                    <td><span className={`badge ${statusColors[b.status]}`}>{b.status}</span></td>
                    <td>
                      <select className="form-control" style={{ width: 'auto', fontSize: '0.8rem', padding: '0.35rem 0.6rem' }}
                        value={b.status} onChange={e => updateStatus(b._id, e.target.value)}>
                        {['pending', 'confirmed', 'completed', 'cancelled'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
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

export default AdminBookings;
