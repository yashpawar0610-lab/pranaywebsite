import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { membershipAPI } from '../services/api';
import { Check, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const MembershipPage = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [plans, setPlans] = useState([]);
  const [myMembership, setMyMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(null);

  useEffect(() => {
    Promise.all([
      membershipAPI.getPlans(),
      isAuthenticated ? membershipAPI.getMyMembership() : Promise.resolve(null)
    ]).then(([plansRes, memRes]) => {
      setPlans(plansRes.data.data || []);
      if (memRes) setMyMembership(memRes.data.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [isAuthenticated]);

  const handleSubscribe = async (planId) => {
    if (!isAuthenticated) { toast('Please login to subscribe to a plan.', 'info'); return; }
    setSubscribing(planId);
    try {
      const res = await membershipAPI.subscribe(planId);
      setMyMembership(res.data.data);
      toast(res.data.message, 'success');
    } catch (err) {
      toast(err.response?.data?.message || 'Subscription failed.', 'error');
    } finally { setSubscribing(null); }
  };

  const daysRemaining = myMembership ? Math.max(0, Math.ceil((new Date(myMembership.endDate) - new Date()) / 86400000)) : 0;

  return (
    <div style={{ paddingTop: 70 }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--dark) 0%, var(--dark2) 100%)', borderBottom: '1px solid var(--border)', padding: '4rem 0 3rem', textAlign: 'center' }}>
        <div className="container">
          <h1 className="section-title">Membership <span className="text-lime">Plans</span></h1>
          <p className="section-subtitle mt-2">Invest in yourself. Choose the plan that fits your goals and budget.</p>
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        {/* Current membership status */}
        {isAuthenticated && myMembership && (
          <div style={{ background: 'rgba(132,204,22,0.05)', border: '1px solid rgba(132,204,22,0.3)', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                Current Plan: <span style={{ color: 'var(--lime)' }}>{myMembership.plan?.name}</span>
                <span className={`badge ${myMembership.status === 'active' ? 'badge-green' : 'badge-red'}`} style={{ marginLeft: '0.75rem' }}>
                  {myMembership.status}
                </span>
              </p>
              <p style={{ color: 'var(--gray)', fontSize: '0.875rem' }}>
                Valid: {new Date(myMembership.startDate).toLocaleDateString('en-IN')} →{' '}
                {new Date(myMembership.endDate).toLocaleDateString('en-IN')}
                {myMembership.status === 'active' && (
                  <span style={{ color: 'var(--lime)', marginLeft: '0.75rem' }}>({daysRemaining} days remaining)</span>
                )}
              </p>
              <p style={{ color: 'var(--amber)', fontSize: '0.8rem', marginTop: '0.4rem' }}>
                ⚠️ Demo mode — no real payment processed.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <RefreshCw size={14} style={{ color: 'var(--gray)' }} />
              <span style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>Choose a new plan to switch/renew</span>
            </div>
          </div>
        )}

        {/* Plans grid */}
        {loading ? (
          <div className="loading-container"><div className="spinner" /></div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {plans.map(plan => {
                const isCurrent = myMembership?.plan?._id === plan._id && myMembership?.status === 'active';
                return (
                  <div key={plan._id} className={`plan-card ${plan.isPopular ? 'popular' : ''}`}>
                    {plan.isPopular && <div className="plan-popular-badge">Most Popular</div>}
                    {isCurrent && (
                      <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'var(--green)', color: 'var(--white)', padding: '0.2rem 0.6rem', borderRadius: 100, fontSize: '0.7rem', fontWeight: 700 }}>
                        Current Plan
                      </div>
                    )}
                    <div style={{ paddingTop: (plan.isPopular || isCurrent) ? '1rem' : 0 }}>
                      <h3 style={{ textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>{plan.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem', marginBottom: '0.25rem' }}>
                        <span className="plan-price">₹{plan.price.toLocaleString()}</span>
                        <span style={{ color: 'var(--gray)' }}>/{plan.duration === 1 ? 'month' : `${plan.duration} months`}</span>
                      </div>
                      <p style={{ color: 'var(--gray)', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>{plan.description}</p>
                      <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.75rem' }}>
                        {plan.features?.map((f, i) => (
                          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--gray-light)' }}>
                            <Check size={15} style={{ color: 'var(--lime)', flexShrink: 0, marginTop: 2 }} /> {f}
                          </li>
                        ))}
                      </ul>
                      <button onClick={() => handleSubscribe(plan._id)}
                        className={`btn ${plan.isPopular ? 'btn-primary' : 'btn-outline'} btn-full`}
                        disabled={subscribing === plan._id}>
                        {subscribing === plan._id ? 'Processing...' : isCurrent ? <><RefreshCw size={14} /> Renew Plan</> : <>Choose {plan.name} <ArrowRight size={14} /></>}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem', textAlign: 'center' }}>
              <AlertCircle size={18} style={{ color: 'var(--amber)', display: 'inline-block', marginRight: '0.5rem', verticalAlign: 'middle' }} />
              <span style={{ color: 'var(--gray)', fontSize: '0.875rem' }}>
                This is a demonstration project. Prices shown are for display purposes only. No real payments are processed.
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MembershipPage;
