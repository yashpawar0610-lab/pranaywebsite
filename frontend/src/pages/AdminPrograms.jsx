import { useEffect, useState } from 'react';
import { programAPI } from '../services/api';
import { useToast } from '../components/Toast';
import AdminSidebar from '../components/AdminSidebar';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const categories = ['weight_training','muscle_building','fat_loss','cardio','strength','functional','beginner','flexibility'];

const ProgramModal = ({ program, onClose, onSaved }) => {
  const { toast } = useToast();
  const isEdit = !!program?._id;
  const [form, setForm] = useState(program || {
    title: '', description: '', category: 'strength', difficulty: 'beginner',
    duration: 45, daysPerWeek: 3, calories: 300, targetArea: '', image: '', isActive: true
  });
  const [loading, setLoading] = useState(false);

  const save = async e => {
    e.preventDefault();
    if (!form.title || !form.description) { toast('Title and description required.', 'error'); return; }
    setLoading(true);
    try {
      const data = { ...form, targetArea: typeof form.targetArea === 'string' ? form.targetArea.split(',').map(s=>s.trim()).filter(Boolean) : form.targetArea };
      if (isEdit) await programAPI.updateProgram(form._id, data);
      else await programAPI.createProgram(data);
      toast(`Program ${isEdit ? 'updated' : 'created'}.`, 'success');
      onSaved(); onClose();
    } catch (err) { toast(err.response?.data?.message || 'Save failed.', 'error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.25rem' }}>{isEdit ? 'Edit' : 'Create'} Program</h2>
          <button onClick={onClose} style={{ color: 'var(--gray)' }}><X size={22} /></button>
        </div>
        <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input className="form-control" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea className="form-control" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-control" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {categories.map(c => <option key={c} value={c}>{c.replace('_',' ')}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Difficulty</label>
              <select className="form-control" value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}>
                {['beginner','intermediate','advanced'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Duration (min)</label>
              <input type="number" className="form-control" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Calories Burned</label>
              <input type="number" className="form-control" value={form.calories} onChange={e => setForm(f => ({ ...f, calories: e.target.value }))} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Target Areas (comma-separated)</label>
            <input className="form-control" value={Array.isArray(form.targetArea) ? form.targetArea.join(', ') : form.targetArea} onChange={e => setForm(f => ({ ...f, targetArea: e.target.value }))} placeholder="Chest, Back, Legs" />
          </div>
          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input className="form-control" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" onClick={onClose} className="btn btn-dark" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminPrograms = () => {
  const { toast } = useToast();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = () => {
    setLoading(true);
    programAPI.getPrograms({ limit: 50 })
      .then(r => setPrograms(r.data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const del = async (id) => {
    if (!window.confirm('Delete this program?')) return;
    try { await programAPI.deleteProgram(id); toast('Deleted.', 'success'); load(); }
    catch { toast('Failed.', 'error'); }
  };

  const diffColor = { beginner: 'badge-green', intermediate: 'badge-amber', advanced: 'badge-red' };

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <div className="dashboard-content page-enter">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)' }}>
            Workout <span style={{ color: 'var(--lime)' }}>Programs</span>
          </h1>
          <button onClick={() => setModal('create')} className="btn btn-primary"><Plus size={16} /> New Program</button>
        </div>

        {loading ? <div className="loading-container"><div className="spinner" /></div> : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr><th>Title</th><th>Category</th><th>Difficulty</th><th>Duration</th><th>Enrolled</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {programs.map(p => (
                  <tr key={p._id}>
                    <td style={{ fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {p.image && <img src={p.image} alt="" style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} onError={e => e.target.style.display='none'} />}
                        {p.title}
                      </div>
                    </td>
                    <td><span className="badge badge-gray">{p.category?.replace('_',' ')}</span></td>
                    <td><span className={`badge ${diffColor[p.difficulty]}`}>{p.difficulty}</span></td>
                    <td>{p.duration} min</td>
                    <td style={{ color: 'var(--gray)' }}>{p.enrolledCount || 0}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => setModal(p)} className="btn btn-dark btn-sm"><Edit2 size={13} /></button>
                        <button onClick={() => del(p._id)} className="btn btn-red btn-sm"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {modal && <ProgramModal program={modal === 'create' ? null : modal} onClose={() => setModal(null)} onSaved={load} />}
      </div>
    </div>
  );
};

export default AdminPrograms;
