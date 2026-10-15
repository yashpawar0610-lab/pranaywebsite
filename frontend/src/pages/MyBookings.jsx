import { useEffect, useState } from 'react';
import { bookingAPI } from '../services/api';
import { useToast } from '../components/Toast';
import DashboardSidebar from '../components/DashboardSidebar';
import { Link } from 'react-router-dom';
import { Calendar, X } from 'lucide-react';

const MyBookings = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    bookingAPI.getMyBookings()
      .then(r => setBookings(r.data.data || []))
      .catch(() => toast('Failed to load bookings.', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await bookingAPI.cancelBooking(id, 'Cancelled by member');
      toast('Booking cancelled.', 'info');
      load();
    } catch (err) { toast(err.response?.data?.message || 'Failed.', 'error'); }
  };

  const statusColor = { pending: 'badge-amber', confirmed: 'badge-green', cancelled: 'badge-red', completed: 'badge-blue' };
  const upcoming = bookings.filter(b => new Date(b.date) >= new Date() && b.status !== 'cancelled');
  const past = bookings.filter(b => new Date(b.date) < new Date() || b.status === 'cancelled');

  const BookingCard = ({ b }) => (
    <div style={{ background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
      <img src={b.trainer?.image} alt={b.trainer?.name} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
        onError={e => { e.target.style.background='var(--dark3)'; e.target.src=''; }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontWeight: 700 }}>{b.trainer?.name}</p>
            <p style={{ color: 'var(--lime)', fontSize: '0.8rem' }}>{b.trainer?.specialization}</p>
          </div>
          <span className={`badge ${statusColor[b.status]}`}>{b.status}</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', color: 'var(--gray)', fontSize: '0.82rem' }}>
          <span>📅 {new Date(b.date).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span>
          <span>🕐 {b.timeSlot}</span>
          <span>🏋️ {b.sessionType}</span>
        </div>
      </div>
      {(b.status === 'pending' || b.status === 'confirmed') && new Date(b.date) > new Date() && (
        <button onClick={() => cancel(b._id)} className="btn btn-red btn-sm" title="Cancel booking">
          <X size={14} />
        </button>
      )}
    </div>
  );

  return (
    <div className="dashboard-layout">
      <DashboardSidebar />
      <div className="dashboard-content page-enter">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)' }}>
            My <span style={{ color: 'var(--lime)' }}>Bookings</span>
          </h1>
          <Link to="/trainers" className="btn btn-primary btn-sm"><Calendar size={15} /> Book Session</Link>
        </div>

        {loading ? <div className="loading-container"><div className="spinner" /></div> : (
          <>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--lime)' }}>
              Upcoming Sessions ({upcoming.length})
            </h3>
            {upcoming.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <p>No upcoming sessions.</p>
                <Link to="/trainers" style={{ color: 'var(--lime)', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>Book with a trainer →</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {upcoming.map(b => <BookingCard key={b._id} b={b} />)}
              </div>
            )}

            {past.length > 0 && (
              <>
                <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--gray)' }}>Past & Cancelled ({past.length})</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', opacity: 0.7 }}>
                  {past.map(b => <BookingCard key={b._id} b={b} />)}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
