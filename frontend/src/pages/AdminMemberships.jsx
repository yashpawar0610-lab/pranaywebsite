import { useEffect, useState } from 'react';
import { membershipAPI } from '../services/api';
import { useToast } from '../components/Toast';
import AdminSidebar from '../components/AdminSidebar';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';

const defaultPlan = { name: '', price: '', duration: 1, description: '', features: '', isPopular: false, isActive: true };

const PlanModal = ({ plan, onClose, onSaved }) => {
  const { toast } = useToast();
  const [form, setForm] = useState(plan || defaultPlan);
  const [loading, setLoading] = useState(false);
  const isEdit = !!plan?._id;

  const save = async e => {
    e.preventDefault();
    if (!form.name || !form.price) { toast('Name and price are required.', 'error'); return; }
    setLoading(true);
    try {
      const data = {
        ...form,
        price: parseFloat(form.price),
        duration: parseInt(form.duration),
        features: typeof form.features === 'string' ? form.features.split('\n').filter(Boolean) : form.features
      };
      if (isEdit) await membershipAPI.updatePlan(form._id, data);
      else await membershipAPI.createPlan(data);
      toast(`Plan ${isEdit ? 'updated' : 'created'}.`, 'success');
      onSaved();
      onClose();
    } catch (err) {
      toast(err.response?.data?.message || 'Save failed.', 'error');
    } finally { setLoading(false); }
  };

  const featuresStr = Array.isArray(form.features) ? form.features.join('\n') : form.features;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 style={{ fontSize: '1.25rem' }}>{isEdit ? 'Edit' : 'Create'} Membership Plan</h2>
          <button onClick={onClose} style={{ color: 'var(--gray)' }}><X size={22} /></button>
        </div>
        <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Plan Name *</label>
              <input className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Pro" />
            </div>
            <div className="form-group">
              <label className="form-label">Price (₹) *</label>
              <input type="number" className="form-control" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="1999" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Duration (months)</label>
            <input type="number" className="form-control" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} min={1} />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <input className="form-control" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Features (one per line)</label>
            <textarea className="form-control" rows={5} value={featuresStr} onChange={e => setForm(f => ({ ...f, features: e.target.value }))} placeholder="Full gym access&#10;Unlimited classes&#10;Personal training" />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
            <input type="checkbox" checked={form.isPopular} onChange={e => setForm(f => ({ ...f, isPopular: e.target.checked }))} />
            Mark as popular
          </label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" onClick={onClose} className="btn btn-dark" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Plan' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminMemberships = () => {
  const { toast } = useToast();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'create' | plan object

  const loadPlans = () => {
    setLoading(true);
    membershipAPI.getPlans()
      .then(r => setPlans(r.data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadPlans(); }, []);

  const deletePlan = async (id) => {
    if (!window.confirm('Delete this plan?')) return;
    try {
      await membershipAPI.deletePlan(id);
      toast('Plan deleted.', 'success');
      loadPlans();
    } catch { toast('Failed to delete.', 'error'); }
  };

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <div className="dashboard-content page-enter">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)' }}>
            Membership <span style={{ color: 'var(--lime)' }}>Plans</span>
          </h1>
          <button onClick={() => setModal('create')} className="btn btn-primary">
            <Plus size={16} /> New Plan
          </button>
        </div>

        {loading ? <div className="loading-container"><div className="spinner" /></div> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {plans.map(p => (
              <div key={p._id} style={{ background: 'var(--dark2)', border: `2px solid ${p.isPopular ? 'var(--lime)' : 'var(--border)'}`, borderRadius: 'var(--radius)', padding: '1.5rem', position: 'relative' }}>
                {p.isPopular && <span className="plan-popular-badge">Popular</span>}
                <h3 style={{ textTransform: 'uppercase', marginBottom: '0.5rem' }}>{p.name}</h3>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--lime)', marginBottom: '0.5rem' }}>
                  ₹{p.price.toLocaleString()}<span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--gray)' }}>/mo</span>
                </p>
                <p style={{ color: 'var(--gray)', fontSize: '0.8rem', marginBottom: '1rem' }}>{p.description}</p>
                <ul style={{ marginBottom: '1.25rem' }}>
                  {p.features?.map((f, i) => (
                    <li key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--gray-light)', marginBottom: '0.4rem' }}>
                      <Check size={13} color="var(--lime)" style={{ flexShrink: 0, marginTop: 2 }} /> {f}
                    </li>
                  ))}
                </ul>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => setModal(p)} className="btn btn-dark btn-sm" style={{ flex: 1 }}>
                    <Edit2 size={13} /> Edit
                  </button>
                  <button onClick={() => deletePlan(p._id)} className="btn btn-red btn-sm">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {modal && (
          <PlanModal
            plan={modal === 'create' ? null : modal}
            onClose={() => setModal(null)}
            onSaved={loadPlans}
          />
        )}
      </div>
    </div>
  );
};

export default AdminMemberships;
