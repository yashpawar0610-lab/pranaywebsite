import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Dumbbell, Trophy, Star, Check, ChevronRight, Play, Flame, Zap, Target } from 'lucide-react';
import { membershipAPI, programAPI, trainerAPI } from '../services/api';

const stats = [
  { value: '50+', label: 'Expert Trainers' },
  { value: '200+', label: 'Workout Programs' },
  { value: '10K+', label: 'Happy Members' },
  { value: '15+', label: 'Years of Excellence' },
];

const features = [
  { icon: Zap, title: 'Expert Trainers', desc: 'Certified professionals with years of industry experience.' },
  { icon: Target, title: 'Personalized Plans', desc: 'Custom workout and nutrition plans tailored to your goals.' },
  { icon: Flame, title: 'Premium Equipment', desc: 'State-of-the-art equipment for maximum performance.' },
  { icon: Trophy, title: 'Proven Results', desc: 'Thousands of success stories and transformations.' },
];

const testimonials = [
  { name: 'Amit Kumar', plan: 'Pro Member', text: 'FitZone Pro completely transformed my fitness journey. Lost 15kg in 4 months with the elite program!', rating: 5, avatar: 'A' },
  { name: 'Priya Sharma', plan: 'Elite Member', text: 'The trainers here are incredible. Sneha helped me achieve my goal weight while building real strength.', rating: 5, avatar: 'P' },
  { name: 'Rohan Gupta', plan: 'Basic Member', text: 'As a complete beginner, the Beginner Bootcamp was perfect. Staff is super supportive and encouraging.', rating: 5, avatar: 'R' },
];

const HomePage = () => {
  const [plans, setPlans] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    membershipAPI.getPlans().then(r => setPlans(r.data.data?.slice(0, 3) || [])).catch(() => {});
    programAPI.getPrograms({ limit: 4 }).then(r => setPrograms(r.data.data || [])).catch(() => {});
    trainerAPI.getTrainers().then(r => setTrainers(r.data.data?.slice(0, 4) || [])).catch(() => {});
  }, []);

  const difficultyColor = { beginner: 'badge-green', intermediate: 'badge-amber', advanced: 'badge-red' };

  return (
    <div style={{ paddingTop: 0 }}>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero" style={{ minHeight: '100vh' }}>
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1400&q=80"
          alt="FitZone Pro Gym"
          className="hero-img"
        />
        <div className="hero-bg" />
        <div className="hero-content container" style={{ paddingTop: 80 }}>
          <div style={{ maxWidth: 700 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(132,204,22,0.15)', border: '1px solid rgba(132,204,22,0.3)', borderRadius: 100, padding: '0.4rem 1rem', marginBottom: '1.5rem' }}>
              <Flame size={14} color="var(--lime)" />
              <span style={{ fontSize: '0.8rem', color: 'var(--lime)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Start Your Transformation
              </span>
            </div>
            <h1 className="display-text" style={{ marginBottom: '1.25rem' }}>
              BUILD YOUR<br />
              <span style={{ color: 'var(--lime)' }}>STRONGER</span><br />
              SELF.
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', maxWidth: 480, lineHeight: 1.7, marginBottom: '2rem' }}>
              Transform your body and mind with expert trainers, premium equipment, and personalized fitness programs designed for real results.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary btn-lg">
                Join Now <ArrowRight size={18} />
              </Link>
              <Link to="/programs" className="btn btn-outline btn-lg">
                Explore Programs
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 2, animation: 'bounce 2s infinite' }}>
          <div style={{ width: 1, height: 50, background: 'linear-gradient(to bottom, transparent, var(--lime))', margin: '0 auto' }} />
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────── */}
      <section style={{ background: 'var(--dark2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ padding: '3rem 1.5rem' }}>
          <div className="grid-4">
            {stats.map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '1rem' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', fontWeight: 800, color: 'var(--lime)', lineHeight: 1 }}>{s.value}</p>
                <p style={{ color: 'var(--gray)', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.8rem', fontWeight: 600 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Programs ─────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="accent-line" />
            <h2 className="section-title">Featured <span className="text-lime">Programs</span></h2>
            <p className="section-subtitle mt-2">Train smarter with science-backed workout programs for every fitness goal.</p>
          </div>
          {programs.length > 0 ? (
            <div className="grid-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
              {programs.map(p => (
                <Link to={`/programs`} key={p._id} className="card program-card">
                  <div style={{ overflow: 'hidden' }}>
                    <img src={p.image || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600'} alt={p.title} className="program-card-img" onError={e => e.target.src='https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600'} />
                  </div>
                  <div className="program-card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span className={`badge ${difficultyColor[p.difficulty] || 'badge-gray'}`}>{p.difficulty}</span>
                      <span style={{ color: 'var(--gray)', fontSize: '0.8rem' }}>{p.duration} min</span>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>{p.title}</h3>
                    <p style={{ color: 'var(--gray)', fontSize: '0.85rem', lineHeight: 1.5 }}>{p.description?.substring(0, 80)}...</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <div className="spinner" style={{ margin: '0 auto' }} />
              <p style={{ color: 'var(--gray)', marginTop: '1rem' }}>Loading programs...</p>
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/programs" className="btn btn-outline">
              View All Programs <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Membership Plans ─────────────────────────────── */}
      <section className="section" style={{ background: 'var(--dark2)' }}>
        <div className="container">
          <div className="section-header">
            <div className="accent-line" />
            <h2 className="section-title">Choose Your <span className="text-lime">Plan</span></h2>
            <p className="section-subtitle mt-2">Flexible membership plans for every budget and fitness goal.</p>
          </div>
          <div className="grid-3">
            {plans.length > 0 ? plans.map(plan => (
              <div key={plan._id} className={`plan-card ${plan.isPopular ? 'popular' : ''}`}>
                {plan.isPopular && <div className="plan-popular-badge">Most Popular</div>}
                <h3 style={{ marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{plan.name}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', margin: '1rem 0' }}>
                  <span className="plan-price">₹{plan.price.toLocaleString()}</span>
                  <span style={{ color: 'var(--gray)' }}>/month</span>
                </div>
                <p style={{ color: 'var(--gray)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{plan.description}</p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.75rem' }}>
                  {plan.features?.map((f, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--gray-light)' }}>
                      <Check size={15} style={{ color: 'var(--lime)', flexShrink: 0, marginTop: 2 }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/membership" className={`btn ${plan.isPopular ? 'btn-primary' : 'btn-outline'} btn-full`}>
                  Choose {plan.name}
                </Link>
              </div>
            )) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--gray)' }}>
                <div className="spinner" style={{ margin: '0 auto 1rem' }} />
                Loading plans...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Trainers ─────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="accent-line" />
            <h2 className="section-title">Meet Our <span className="text-lime">Trainers</span></h2>
            <p className="section-subtitle mt-2">Expert certified professionals dedicated to your success.</p>
          </div>
          <div className="grid-4">
            {trainers.map(t => (
              <div key={t._id} className="card trainer-card">
                <div style={{ overflow: 'hidden' }}>
                  <img src={t.image} alt={t.name} className="trainer-card-img" onError={e => e.target.src='https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400'} />
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{t.name}</h3>
                  <p style={{ color: 'var(--lime)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>{t.specialization}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} fill={i < Math.round(t.rating) ? 'var(--amber)' : 'none'} color={i < Math.round(t.rating) ? 'var(--amber)' : 'var(--gray)'} />
                    ))}
                    <span style={{ color: 'var(--gray)', fontSize: '0.8rem', marginLeft: '0.25rem' }}>{t.rating}</span>
                  </div>
                  <p style={{ color: 'var(--gray)', fontSize: '0.8rem', marginTop: '0.5rem' }}>{t.experience} years experience</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/trainers" className="btn btn-outline">
              Meet All Trainers <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ─────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--dark2)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div className="accent-line" />
              <h2 className="section-title" style={{ marginBottom: '1.25rem' }}>
                Why Choose<br /><span className="text-lime">FitZone Pro?</span>
              </h2>
              <p style={{ color: 'var(--gray)', lineHeight: 1.8, marginBottom: '2rem' }}>
                We're more than a gym — we're a complete fitness ecosystem designed to help you achieve lasting transformations with professional guidance every step of the way.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {features.map(({ icon: Icon, title, desc }, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: 44, height: 44, background: 'rgba(132,204,22,0.1)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={20} color="var(--lime)" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>{title}</h4>
                      <p style={{ color: 'var(--gray)', fontSize: '0.875rem' }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600" alt="Fitness" style={{ borderRadius: 'var(--radius-lg)', width: '100%', height: 500, objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem', background: 'rgba(17,17,17,0.9)', backdropFilter: 'blur(10px)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between' }}>
                {[['10K+', 'Members'], ['98%', 'Satisfaction'], ['500+', 'Transformations']].map(([val, lbl]) => (
                  <div key={lbl} style={{ textAlign: 'center' }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--lime)' }}>{val}</p>
                    <p style={{ color: 'var(--gray)', fontSize: '0.75rem' }}>{lbl}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="accent-line" />
            <h2 className="section-title">Member <span className="text-lime">Stories</span></h2>
            <p className="section-subtitle mt-2">These are demonstration testimonials for illustration purposes.</p>
          </div>
          <div className="grid-3">
            {testimonials.map((t, i) => (
              <div key={i} className="card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', marginBottom: '1rem' }}>
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={16} fill="var(--amber)" color="var(--amber)" />
                  ))}
                </div>
                <p style={{ color: 'var(--gray-light)', lineHeight: 1.7, marginBottom: '1.25rem', fontSize: '0.9rem' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 38, height: 38, background: 'var(--lime)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--black)' }}>{t.avatar}</div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{t.name}</p>
                    <p style={{ color: 'var(--gray)', fontSize: '0.75rem' }}>{t.plan}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a2a0a 50%, #0a0a0a 100%)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '6rem 0', textAlign: 'center' }}>
        <div className="container">
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>
            Ready to Start Your<br /><span className="text-lime">Fitness Journey?</span>
          </h2>
          <p style={{ color: 'var(--gray)', marginBottom: '2.5rem', fontSize: '1rem' }}>
            Join thousands of members already transforming their lives at FitZone Pro.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link to="/contact" className="btn btn-outline btn-lg">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
