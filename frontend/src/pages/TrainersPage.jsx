import { useEffect, useState } from 'react';
import { trainerAPI, bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { Star, Award, Users, Clock, X, Calendar } from 'lucide-react';

const BookingModal = ({ trainer, onClose, onBooked }) => {
  const { toast } = useToast();
  const [form, setForm] = useState({ date: '', timeSlot: '', sessionType: 'personal', notes: '' });
  const [loading, setLoading] = useState(false);

  const timeSlots = ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];

  const submit = async e => {
    e.preventDefault();
    if (!form.date || !form.timeSlot) { toast('Please select date and time slot.', 'error'); return; }
    // Don't allow past dates
    if (new Date(form.date) < new Date().setHours(0, 0, 0, 0)) { toast('Please select a future date.', 'error'); return; }
    setLoading(true);
    try {
      await bookingAPI.createBooking({ trainerId: trainer._id, ...form });
      toast(`Session booked with ${trainer.name}!`, 'success');
      onBooked();
      onClose();
    } catch (err) {
      toast(err.response?.data?.message || 'Booking failed.', 'error');
    } finally { setLoading(false); }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 style={{ fontSize: '1.25rem' }}>Book Session with {trainer.name}</h2>
          <button onClick={onClose} style={{ color: 'var(--gray)' }}><X size={22} /></button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem', background: 'var(--dark3)', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem' }}>
          <img src={trainer.image} alt={trainer.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} onError={e => e.target.style.background='var(--lime)'} />
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{trainer.name}</p>
            <p style={{ color: 'var(--lime)', fontSize: '0.8rem' }}>{trainer.specialization}</p>
          </div>
        </div>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Session Date *</label>
            <input type="date" className="form-control" min={today}
              value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Time Slot *</label>
            <select className="form-control" value={form.timeSlot} onChange={e => setForm(f => ({ ...f, timeSlot: e.target.value }))}>
              <option value="">Select a time slot</option>
              {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Session Type</label>
            <select className="form-control" value={form.sessionType} onChange={e => setForm(f => ({ ...f, sessionType: e.target.value }))}>
              <option value="personal">Personal Training</option>
              <option value="group">Group Session</option>
              <option value="online">Online Session</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Notes (optional)</label>
            <textarea className="form-control" rows={2} placeholder="Any specific goals or requirements..."
              value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>
            * This is a demonstration booking. No real payment or commitment is made.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" onClick={onClose} className="btn btn-dark" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={loading}>
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TrainersPage = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingTrainer, setBookingTrainer] = useState(null);

  useEffect(() => {
    trainerAPI.getTrainers()
      .then(r => setTrainers(r.data.data || []))
      .catch(() => toast('Failed to load trainers.', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const handleBookClick = (trainer) => {
    if (!isAuthenticated) { toast('Please login to book a session.', 'info'); return; }
    setBookingTrainer(trainer);
  };

  return (
    <div style={{ paddingTop: 70 }}>
      <div style={{ background: 'linear-gradient(135deg, var(--dark) 0%, var(--dark2) 100%)', borderBottom: '1px solid var(--border)', padding: '4rem 0 3rem', textAlign: 'center' }}>
        <div className="container">
          <h1 className="section-title">Our Expert <span className="text-lime">Trainers</span></h1>
          <p className="section-subtitle mt-2">Certified professionals dedicated to helping you achieve your fitness goals.</p>
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        {loading ? (
          <div className="loading-container"><div className="spinner" /></div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {trainers.map(t => (
              <div key={t._id} className="card trainer-card">
                <div style={{ overflow: 'hidden' }}>
                  <img src={t.image} alt={t.name} className="trainer-card-img"
                    onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400'; }} />
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', marginBottom: '0.2rem' }}>{t.name}</h3>
                      <p style={{ color: 'var(--lime)', fontSize: '0.85rem', fontWeight: 600 }}>{t.specialization}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Star size={14} fill="var(--amber)" color="var(--amber)" />
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.rating}</span>
                      </div>
                      <p style={{ color: 'var(--gray)', fontSize: '0.75rem' }}>{t.totalClients} clients</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', color: 'var(--gray)', fontSize: '0.8rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Award size={13} color="var(--lime)" /> {t.experience} yrs exp
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Users size={13} color="var(--lime)" /> {t.totalClients}+ clients
                    </span>
                  </div>

                  <p style={{ color: 'var(--gray)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                    {t.bio?.substring(0, 100)}...
                  </p>

                  {t.certifications?.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      {t.certifications.map(c => (
                        <span key={c} className="badge badge-gray" style={{ fontSize: '0.7rem' }}>{c}</span>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                    {t.categories?.map(c => (
                      <span key={c} className="badge badge-lime" style={{ fontSize: '0.7rem' }}>{c}</span>
                    ))}
                  </div>

                  <button onClick={() => handleBookClick(t)} className="btn btn-primary btn-full">
                    <Calendar size={15} /> Book Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {bookingTrainer && (
        <BookingModal
          trainer={bookingTrainer}
          onClose={() => setBookingTrainer(null)}
          onBooked={() => {}}
        />
      )}
    </div>
  );
};

export default TrainersPage;
