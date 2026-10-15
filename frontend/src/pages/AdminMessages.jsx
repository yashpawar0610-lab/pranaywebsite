import { useEffect, useState } from 'react';
import { contactAPI } from '../services/api';
import { useToast } from '../components/Toast';
import AdminSidebar from '../components/AdminSidebar';
import { Mail, MailOpen, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const AdminMessages = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [filter, setFilter] = useState('all');

  const load = (pg = 1) => {
    setLoading(true);
    const params = { page: pg, limit: 10 };
    if (filter === 'unread') params.isRead = false;
    if (filter === 'read') params.isRead = true;
    contactAPI.getMessages(params)
      .then(r => { setMessages(r.data.data || []); setPagination(r.data.pagination || {}); })
      .catch(() => toast('Failed to load messages.', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(1); }, [filter]);

  const markRead = async (id) => {
    try {
      await contactAPI.markAsRead(id);
      setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: true } : m));
      if (selected?._id === id) setSelected(prev => ({ ...prev, isRead: true }));
    } catch { toast('Failed to mark as read.', 'error'); }
  };

  const deleteMsg = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await contactAPI.deleteMessage(id);
      toast('Message deleted.', 'success');
      setSelected(null);
      load(page);
    } catch { toast('Failed to delete.', 'error'); }
  };

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <div className="dashboard-content page-enter">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)' }}>
            Contact <span style={{ color: 'var(--lime)' }}>Messages</span>
          </h1>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['all', 'unread', 'read'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-dark'}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
          {/* Messages list */}
          <div className="table-wrapper">
            {loading ? <div className="loading-container"><div className="spinner" /></div> : (
              <>
                {messages.length === 0 ? (
                  <div className="empty-state"><p>No messages found.</p></div>
                ) : messages.map(m => (
                  <div key={m._id} onClick={() => { setSelected(m); if (!m.isRead) markRead(m._id); }}
                    style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', cursor: 'pointer', background: selected?._id === m._id ? 'var(--dark3)' : m.isRead ? 'transparent' : 'rgba(132,204,22,0.04)', transition: 'background 0.2s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                        {m.isRead ? <MailOpen size={16} style={{ color: 'var(--gray)', flexShrink: 0 }} /> : <Mail size={16} style={{ color: 'var(--lime)', flexShrink: 0 }} />}
                        <div style={{ overflow: 'hidden' }}>
                          <p style={{ fontWeight: m.isRead ? 500 : 700, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</p>
                          <p style={{ color: 'var(--gray)', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.subject}</p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ color: 'var(--gray)', fontSize: '0.75rem' }}>{new Date(m.createdAt).toLocaleDateString()}</p>
                        {!m.isRead && <span className="badge badge-lime" style={{ fontSize: '0.65rem', marginTop: '0.25rem' }}>New</span>}
                      </div>
                    </div>
                  </div>
                ))}
                {pagination.pages > 1 && (
                  <div className="pagination" style={{ padding: '1rem' }}>
                    <button onClick={() => { setPage(p => p - 1); load(page - 1); }} disabled={page === 1} className="page-btn"><ChevronLeft size={14} /></button>
                    <span style={{ color: 'var(--gray)', fontSize: '0.8rem' }}>{page}/{pagination.pages}</span>
                    <button onClick={() => { setPage(p => p + 1); load(page + 1); }} disabled={page === pagination.pages} className="page-btn"><ChevronRight size={14} /></button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Message detail */}
          {selected && (
            <div style={{ background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{selected.subject}</h3>
                  <p style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>From: <strong style={{ color: 'var(--gray-light)' }}>{selected.name}</strong> ({selected.email})</p>
                  {selected.phone && <p style={{ color: 'var(--gray)', fontSize: '0.8rem' }}>Phone: {selected.phone}</p>}
                  <p style={{ color: 'var(--gray)', fontSize: '0.8rem' }}>{new Date(selected.createdAt).toLocaleString()}</p>
                </div>
                <button onClick={() => deleteMsg(selected._id)} className="btn btn-red btn-sm"><Trash2 size={14} /></button>
              </div>
              <div style={{ background: 'var(--dark3)', borderRadius: 'var(--radius-sm)', padding: '1.25rem', lineHeight: 1.8, color: 'var(--gray-light)', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                {selected.message}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
