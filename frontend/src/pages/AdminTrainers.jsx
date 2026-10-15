import { useEffect, useState } from 'react';
import { trainerAPI } from '../services/api';
import { useToast } from '../components/Toast';
import AdminSidebar from '../components/AdminSidebar';
import { Plus, Edit2, Trash2, X, Star } from 'lucide-react';

const TrainerModal = ({ trainer, onClose, onSaved }) => {
  const { toast } = useToast();
  const isEdit = !!trainer?._id;
  const [form, setForm] = useState(trainer || {
    name: '', specialization: '', experience: '', bio: '',
    certifications: '', categories: '', image: '', rating: 4.5, totalClients: 0
  });
  const [loading, setLoading] = useState(false);

  const save = async e => {
    e.preventDefault();
    if (!form.name || !form.specialization) { toast('Name and specialization required.', 'error'); return; }
    setLoading(true);
    try {
      const data = {
        ...form,
        experience: parseInt(form.experience),
        certifications: typeof form.certifications === 'string' ? form.certifications.split(',').map(s=>s.trim()).filter(Boolean) : form.certifications,
        categories: typeof form.categories === 'string' ? form.categories.split(',').map(s=>s.trim()).filter(Boolean) : form.categories,
      };
      if (isEdit) await trainerAPI.updateTrainer(form._id, data);
      else await trainerAPI.createTrainer(data);
      toast(`Trainer ${isEdit ? 'updated' : 'created'}.`, 'success');
      onSaved(); onClose();
    } catch (err) { toast(err.response?.data?.message || 'Save failed.', 'error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.25rem' }}>{isEdit ? 'Edit' : 'Add'} Trainer</h2>
          <button onClick={onClose} style={{ color: 'var(--gray)' }}><X size={22} /></button>
        </div>
        <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Specialization *</label>
              <input className="form-control" value={form.specialization} onChange={e => setForm(f => ({ ...f, specialization: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Experience (years)</label>
              <input type="number" className="form-control" value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Rating (0-5)</label>
              <input type="number" step="0.1" min="0" max="5" className="form-control" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea className="form-control" rows={3} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Certifications (comma-separated)</label>
            <input className="form-control" value={Array.isArray(form.certifications) ? form.certifications.join(', ') : form.certifications} onChange={e => setForm(f => ({ ...f, certifications: e.target.value }))} placeholder="CSCS, CPT-NASM" />
          </div>
          <div className="form-group">
            <label className="form-label">Categories (comma-separated)</label>
            <input className="form-control" value={Array.isArray(form.categories) ? form.categories.join(', ') : form.categories} onChange={e => setForm(f => ({ ...f, categories: e.target.value }))} placeholder="Strength, HIIT" />
          </div>
          <div className="form-group">
            <label className="form-label">Photo URL</label>
            <input className="form-control" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" onClick={onClose} className="btn btn-dark" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update' : 'Add Trainer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminTrainers = () => {
  const { toast } = useToast();
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = () => {
    setLoading(true);
    trainerAPI.getTrainers().then(r => setTrainers(r.data.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const del = async (id) => {
    if (!window.confirm('Delete this trainer?')) return;
    try { await trainerAPI.deleteTrainer(id); toast('Deleted.', 'success'); load(); }
    catch { toast('Failed.', 'error'); }
  };

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <div className="dashboard-content page-enter">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)' }}>
            Manage <span style={{ color: 'var(--lime)' }}>Trainers</span>
          </h1>
          <button onClick={() => setModal('create')} className="btn btn-primary"><Plus size={16} /> Add Trainer</button>
        </div>

        {loading ? <div className="loading-container"><div className="spinner" /></div> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {trainers.map(t => (
              <div key={t._id} style={{ background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                <div style={{ height: 160, overflow: 'hidden' }}>
                  <img src={t.image} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                    onError={e => { e.target.style.background='var(--dark3)'; e.target.style.display='block'; }} />
                </div>
                <div style={{ padding: '1.1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1rem' }}>{t.name}</h3>
                      <p style={{ color: 'var(--lime)', fontSize: '0.8rem' }}>{t.specialization}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Star size={12} fill="var(--amber)" color="var(--amber)" />
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{t.rating}</span>
                    </div>
                  </div>
                  <p style={{ color: 'var(--gray)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>{t.experience} years exp • {t.totalClients} clients</p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => setModal(t)} className="btn btn-dark btn-sm" style={{ flex: 1 }}><Edit2 size={13} /> Edit</button>
                    <button onClick={() => del(t._id)} className="btn btn-red btn-sm"><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {modal && <TrainerModal trainer={modal === 'create' ? null : modal} onClose={() => setModal(null)} onSaved={load} />}
      </div>
    </div>
  );
};

export default AdminTrainers;
