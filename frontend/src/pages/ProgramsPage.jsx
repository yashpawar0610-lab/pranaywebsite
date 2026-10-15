import { useEffect, useState } from 'react';
import { programAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { Search, Filter, Clock, Flame, Dumbbell, Check, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  { value: '', label: 'All Programs' },
  { value: 'weight_training', label: 'Weight Training' },
  { value: 'muscle_building', label: 'Muscle Building' },
  { value: 'fat_loss', label: 'Fat Loss' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'strength', label: 'Strength' },
  { value: 'functional', label: 'Functional' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'flexibility', label: 'Flexibility' },
];

const difficulties = [
  { value: '', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const diffBadge = { beginner: 'badge-green', intermediate: 'badge-amber', advanced: 'badge-red' };

// ── Program Detail Modal ─────────────────────────────────
const ProgramModal = ({ program, onClose, onEnroll, enrolled }) => {
  if (!program) return null;
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.5rem' }}>{program.title}</h2>
          <button onClick={onClose} style={{ color: 'var(--gray)' }}><X size={22} /></button>
        </div>
        <img src={program.image} alt={program.title} style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem' }} onError={e => e.target.style.display='none'} />
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <span className={`badge ${diffBadge[program.difficulty]}`}>{program.difficulty}</span>
          <span className="badge badge-gray"><Clock size={12} style={{ marginRight: 4 }} />{program.duration} min</span>
          <span className="badge badge-lime"><Flame size={12} style={{ marginRight: 4 }} />{program.calories} cal</span>
          <span className="badge badge-blue">{program.daysPerWeek} days/week</span>
        </div>
        <p style={{ color: 'var(--gray-light)', lineHeight: 1.7, marginBottom: '1.25rem' }}>{program.description}</p>
        {program.targetArea?.length > 0 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <p style={{ fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gray)', marginBottom: '0.5rem' }}>Target Areas</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {program.targetArea.map(a => <span key={a} className="badge badge-gray">{a}</span>)}
            </div>
          </div>
        )}
        {program.exercises?.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gray)', marginBottom: '0.75rem' }}>Exercises</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {program.exercises.map((ex, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0.875rem', background: 'var(--dark3)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>
                  <span style={{ fontWeight: 500 }}>{i + 1}. {ex.name}</span>
                  <span style={{ color: 'var(--gray)' }}>{ex.sets ? `${ex.sets} sets × ${ex.reps || ex.duration}` : ex.duration}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <button onClick={() => { onEnroll(program._id); onClose(); }}
          className={`btn ${enrolled ? 'btn-dark' : 'btn-primary'} btn-full`}>
          {enrolled ? '✓ Enrolled – Click to Unenroll' : 'Enroll in This Program'}
        </button>
      </div>
    </div>
  );
};

const ProgramsPage = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [programs, setPrograms] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const load = () => {
    setLoading(true);
    const params = {};
    if (category) params.category = category;
    if (difficulty) params.difficulty = difficulty;
    if (search) params.search = search;
    programAPI.getPrograms(params)
      .then(r => setPrograms(r.data.data || []))
      .catch(() => toast('Failed to load programs.', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [category, difficulty]);

  useEffect(() => {
    if (isAuthenticated) {
      programAPI.getEnrolled().then(r => setEnrolled(r.data.data?.map(p => p._id) || [])).catch(() => {});
    }
  }, [isAuthenticated]);

  const handleSearch = e => {
    e.preventDefault();
    load();
  };

  const handleEnroll = async (id) => {
    if (!isAuthenticated) { toast('Please login to enroll in programs.', 'info'); return; }
    try {
      const res = await programAPI.enrollProgram(id);
      if (res.data.enrolled) {
        setEnrolled(prev => [...prev, id]);
        toast('Enrolled successfully!', 'success');
      } else {
        setEnrolled(prev => prev.filter(e => e !== id));
        toast('Unenrolled from program.', 'info');
      }
    } catch { toast('Failed to update enrollment.', 'error'); }
  };

  return (
    <div style={{ paddingTop: 70 }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--dark) 0%, var(--dark2) 100%)', borderBottom: '1px solid var(--border)', padding: '4rem 0 3rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 className="section-title">Workout <span className="text-lime">Programs</span></h1>
          <p className="section-subtitle mt-2">Science-backed programs for every fitness level and goal.</p>

          {/* Search */}
          <form onSubmit={handleSearch} style={{ display: 'flex', maxWidth: 500, margin: '2rem auto 0', gap: '0.75rem' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
              <input type="text" className="form-control" placeholder="Search programs..."
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: '2.75rem' }} />
            </div>
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem', alignItems: 'center' }}>
          <span style={{ color: 'var(--gray)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Filter size={14} /> Filter:</span>
          {categories.map(c => (
            <button key={c.value} onClick={() => setCategory(c.value)}
              className={`btn btn-sm ${category === c.value ? 'btn-primary' : 'btn-dark'}`}>
              {c.label}
            </button>
          ))}
          <div style={{ borderLeft: '1px solid var(--border)', height: 24, margin: '0 0.25rem' }} />
          {difficulties.map(d => (
            <button key={d.value} onClick={() => setDifficulty(d.value)}
              className={`btn btn-sm ${difficulty === d.value ? 'btn-primary' : 'btn-dark'}`}>
              {d.label}
            </button>
          ))}
        </div>

        {/* Programs grid */}
        {loading ? (
          <div className="loading-container"><div className="spinner" /></div>
        ) : programs.length === 0 ? (
          <div className="empty-state">
            <Dumbbell size={48} style={{ margin: '0 auto 1rem', color: 'var(--gray)' }} />
            <h3>No Programs Found</h3>
            <p>Try adjusting your filters.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {programs.map(p => {
              const isEnrolled = enrolled.includes(p._id);
              return (
                <div key={p._id} className="card program-card" onClick={() => setSelected(p)} style={{ cursor: 'pointer' }}>
                  <div style={{ overflow: 'hidden', position: 'relative' }}>
                    <img src={p.image || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600'} alt={p.title} className="program-card-img"
                      onError={e => e.target.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600'} />
                    {isEnrolled && (
                      <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'var(--lime)', color: 'var(--black)', borderRadius: 100, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={14} />
                      </div>
                    )}
                  </div>
                  <div className="program-card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span className={`badge ${diffBadge[p.difficulty] || 'badge-gray'}`}>{p.difficulty}</span>
                      <div style={{ display: 'flex', gap: '0.75rem', color: 'var(--gray)', fontSize: '0.8rem' }}>
                        <span><Clock size={12} style={{ marginRight: 3, verticalAlign: 'middle' }} />{p.duration}m</span>
                        <span><Flame size={12} style={{ marginRight: 3, verticalAlign: 'middle' }} />{p.calories}</span>
                      </div>
                    </div>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>{p.title}</h3>
                    <p style={{ color: 'var(--gray)', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '1rem' }}>{p.description?.substring(0, 75)}...</p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                      {p.targetArea?.slice(0, 3).map(a => <span key={a} className="badge badge-gray" style={{ fontSize: '0.7rem' }}>{a}</span>)}
                    </div>
                    <button onClick={e => { e.stopPropagation(); handleEnroll(p._id); }}
                      className={`btn ${isEnrolled ? 'btn-dark' : 'btn-outline'} btn-sm btn-full`}>
                      {isEnrolled ? '✓ Enrolled' : 'Enroll'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selected && (
        <ProgramModal
          program={selected}
          enrolled={enrolled.includes(selected._id)}
          onClose={() => setSelected(null)}
          onEnroll={handleEnroll}
        />
      )}
    </div>
  );
};

export default ProgramsPage;
