import { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';
import { useToast } from '../components/Toast';
import AdminSidebar from '../components/AdminSidebar';
import { Search, Trash2, UserX, UserCheck, ChevronLeft, ChevronRight } from 'lucide-react';

const AdminUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const load = (pg = 1, q = search) => {
    setLoading(true);
    adminAPI.getAllUsers({ page: pg, limit: 10, search: q })
      .then(r => { setUsers(r.data.data || []); setPagination(r.data.pagination || {}); })
      .catch(() => toast('Failed to load users.', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(1); }, []);

  const handleSearch = e => { e.preventDefault(); load(1, search); };

  const toggleActive = async (user) => {
    try {
      await adminAPI.updateUser(user._id, { isActive: !user.isActive });
      toast(`User ${user.isActive ? 'deactivated' : 'activated'}.`, 'success');
      load(page);
    } catch { toast('Failed to update user.', 'error'); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    try {
      await adminAPI.deleteUser(id);
      toast('User deleted.', 'success');
      load(page);
    } catch { toast('Failed to delete user.', 'error'); }
  };

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <div className="dashboard-content page-enter">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)' }}>
            Manage <span style={{ color: 'var(--lime)' }}>Members</span>
          </h1>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
              <input type="text" className="form-control" placeholder="Search name or email..."
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: '2.5rem', width: 260 }} />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">Search</button>
          </form>
        </div>

        {loading ? (
          <div className="loading-container"><div className="spinner" /></div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--gray)', padding: '3rem' }}>No members found.</td></tr>
                  ) : users.map(u => (
                    <tr key={u._id}>
                      <td style={{ fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <div style={{ width: 30, height: 30, background: 'var(--lime)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--black)', fontSize: '0.85rem', flexShrink: 0 }}>
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          {u.name}
                        </div>
                      </td>
                      <td style={{ color: 'var(--gray)' }}>{u.email}</td>
                      <td style={{ color: 'var(--gray)' }}>{u.phone}</td>
                      <td style={{ color: 'var(--gray)', fontSize: '0.8rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${u.isActive ? 'badge-green' : 'badge-red'}`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => toggleActive(u)} className={`btn btn-sm ${u.isActive ? 'btn-dark' : 'btn-outline'}`} title={u.isActive ? 'Deactivate' : 'Activate'}>
                            {u.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                          </button>
                          <button onClick={() => deleteUser(u._id)} className="btn btn-red btn-sm" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.pages > 1 && (
              <div className="pagination">
                <button onClick={() => { setPage(p => p - 1); load(page - 1); }} disabled={page === 1} className="page-btn">
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => { setPage(p); load(p); }} className={`page-btn ${page === p ? 'active' : ''}`}>{p}</button>
                ))}
                <button onClick={() => { setPage(p => p + 1); load(page + 1); }} disabled={page === pagination.pages} className="page-btn">
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
            <p style={{ textAlign: 'center', color: 'var(--gray)', fontSize: '0.8rem', marginTop: '0.75rem' }}>
              {pagination.total || 0} total members
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
