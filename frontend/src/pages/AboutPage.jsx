import { Target, Users, Dumbbell, Heart, Award, Shield, Zap } from 'lucide-react';

const AboutPage = () => {
  const facilities = [
    { icon: Dumbbell, title: 'Free Weights Area', desc: '5,000+ sq ft of free weights, barbells, and dumbbells up to 100kg.' },
    { icon: Zap, title: 'Cardio Zone', desc: '50+ machines including treadmills, bikes, rowing, and ellipticals.' },
    { icon: Users, title: 'Group Classes', desc: 'Daily classes: HIIT, yoga, Zumba, spinning, boxing and more.' },
    { icon: Heart, title: 'Recovery Center', desc: 'Steam room, sauna, massage, and foam rolling stations.' },
    { icon: Shield, title: 'Locker Rooms', desc: 'Clean, secure lockers with shower facilities and towel service.' },
    { icon: Award, title: 'Pro Shop', desc: 'Supplements, gear, and nutrition products from top brands.' },
  ];

  const values = [
    { title: 'Science-Based', desc: 'Every program and recommendation is rooted in exercise science and evidence-based research.' },
    { title: 'Inclusivity', desc: 'We welcome all fitness levels, ages, and backgrounds. Everyone deserves access to professional fitness guidance.' },
    { title: 'Long-Term Results', desc: 'We focus on sustainable habits, not quick fixes. Real transformation takes time and consistency.' },
    { title: 'Community', desc: 'Fitness is better together. Our community of members and trainers supports each other every step of the way.' },
  ];

  return (
    <div style={{ paddingTop: 70 }}>
      {/* Hero */}
      <div style={{ position: 'relative', height: 400, overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1400" alt="FitZone Pro" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center', padding: '2rem' }}>
          <h1 className="section-title" style={{ marginBottom: '1rem' }}>About <span className="text-lime">FitZone Pro</span></h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: 600, fontSize: '1.05rem', lineHeight: 1.7 }}>
            More than a gym — a complete fitness ecosystem built to help you transform your body, mind, and lifestyle.
          </p>
        </div>
      </div>

      {/* Mission */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div className="accent-line" />
              <h2 className="section-title" style={{ marginBottom: '1.25rem' }}>Our <span className="text-lime">Mission</span></h2>
              <p style={{ color: 'var(--gray)', lineHeight: 1.8, marginBottom: '1.25rem' }}>
                At FitZone Pro, our mission is simple: make elite fitness accessible to everyone. We believe that a healthier, stronger version of yourself is within reach — regardless of where you're starting from.
              </p>
              <p style={{ color: 'var(--gray)', lineHeight: 1.8 }}>
                Founded in 2009, FitZone Pro has helped over 10,000 members achieve their fitness goals through expert coaching, state-of-the-art facilities, and a supportive community.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2rem' }}>
                {[['2009', 'Founded'], ['10K+', 'Members'], ['50+', 'Trainers'], ['15+', 'Years']].map(([val, lbl]) => (
                  <div key={lbl} style={{ padding: '1.25rem', background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--lime)' }}>{val}</p>
                    <p style={{ color: 'var(--gray)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{lbl}</p>
                  </div>
                ))}
              </div>
            </div>
            <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600" alt="Gym training" style={{ borderRadius: 'var(--radius-lg)', width: '100%', height: 450, objectFit: 'cover' }} />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ background: 'var(--dark2)' }}>
        <div className="container">
          <div className="section-header">
            <div className="accent-line" />
            <h2 className="section-title">Our <span className="text-lime">Values</span></h2>
          </div>
          <div className="grid-4">
            {values.map((v, i) => (
              <div key={i} style={{ padding: '1.5rem', background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', transition: 'var(--transition)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--lime)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                <div style={{ width: 40, height: 40, background: 'rgba(132,204,22,0.1)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Target size={18} color="var(--lime)" />
                </div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>{v.title}</h3>
                <p style={{ color: 'var(--gray)', fontSize: '0.875rem', lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="accent-line" />
            <h2 className="section-title">World-Class <span className="text-lime">Facilities</span></h2>
            <p className="section-subtitle mt-2">Everything you need for a complete fitness experience, under one roof.</p>
          </div>
          <div className="grid-3">
            {facilities.map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="card" style={{ padding: '1.75rem' }}>
                <div style={{ width: 48, height: 48, background: 'rgba(132,204,22,0.1)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Icon size={22} color="var(--lime)" />
                </div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '0.4rem' }}>{title}</h3>
                <p style={{ color: 'var(--gray)', fontSize: '0.875rem', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Training philosophy */}
      <section className="section" style={{ background: 'var(--dark2)' }}>
        <div className="container" style={{ maxWidth: 800, textAlign: 'center' }}>
          <div className="accent-line" style={{ margin: '0 auto 1.25rem' }} />
          <h2 className="section-title" style={{ marginBottom: '1.25rem' }}>Our Training <span className="text-lime">Philosophy</span></h2>
          <p style={{ color: 'var(--gray)', lineHeight: 1.9, fontSize: '1rem', marginBottom: '1.25rem' }}>
            We believe fitness is a lifelong journey, not a destination. Our approach combines progressive overload principles, sustainable nutrition habits, and mindful recovery to create results that last.
          </p>
          <p style={{ color: 'var(--gray)', lineHeight: 1.9, fontSize: '1rem' }}>
            Every member receives a personalized assessment, goal-setting session, and access to certified coaches who design programs specific to their unique needs, limitations, and aspirations. Whether you're recovering from an injury, preparing for a competition, or simply want to feel better in everyday life — FitZone Pro has a path for you.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
