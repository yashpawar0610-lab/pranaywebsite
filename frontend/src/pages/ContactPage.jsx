import { useState } from 'react';
import { contactAPI } from '../services/api';
import { useToast } from '../components/Toast';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

const ContactPage = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const validate = () => {
    if (!form.name.trim()) return 'Name is required.';
    if (!form.email) return 'Email is required.';
    if (!form.subject.trim()) return 'Subject is required.';
    if (form.message.trim().length < 10) return 'Message must be at least 10 characters.';
    return null;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      const res = await contactAPI.submit(form);
      setSubmitted(true);
      toast(res.data.message, 'success');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message.');
    } finally { setLoading(false); }
  };

  const contactInfo = [
    { icon: MapPin, label: 'Address', value: '123 Fitness Street, Mumbai, Maharashtra 400001 (Demo Address)' },
    { icon: Phone, label: 'Phone', value: '+91 98765 43210 (Demo Number)' },
    { icon: Mail, label: 'Email', value: 'info@fitzonepro.com (Demo Email)' },
    { icon: Clock, label: 'Hours', value: 'Mon–Sat: 5 AM – 11 PM | Sun: 6 AM – 10 PM' },
  ];

  return (
    <div style={{ paddingTop: 70 }}>
      <div style={{ background: 'linear-gradient(135deg, var(--dark) 0%, var(--dark2) 100%)', borderBottom: '1px solid var(--border)', padding: '4rem 0 3rem', textAlign: 'center' }}>
        <div className="container">
          <h1 className="section-title">Get In <span className="text-lime">Touch</span></h1>
          <p className="section-subtitle mt-2">Have questions? We're here to help you start your fitness journey.</p>
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3rem' }}>
          {/* Info */}
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Contact Information</h2>
            <p style={{ color: 'var(--gray)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.7 }}>
              This is a demonstration project. Contact details shown below are for illustration purposes only.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {contactInfo.map(({ icon: Icon, label, value }) => (
                <div key={label} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 42, height: 42, background: 'rgba(132,204,22,0.1)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={18} color="var(--lime)" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.2rem' }}>{label}</p>
                    <p style={{ color: 'var(--gray)', fontSize: '0.875rem', lineHeight: 1.6 }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Quick Links</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[['Programs', '/programs'], ['Membership', '/membership'], ['Trainers', '/trainers']].map(([label, to]) => (
                  <a key={to} href={to} style={{ color: 'var(--lime)', fontSize: '0.875rem' }}>→ {label}</a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div style={{ background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <CheckCircle size={56} color="var(--green)" style={{ margin: '0 auto 1.25rem' }} />
                <h2 style={{ marginBottom: '0.75rem' }}>Message Sent!</h2>
                <p style={{ color: 'var(--gray)', marginBottom: '1.5rem' }}>Thank you for reaching out. We'll get back to you soon.</p>
                <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                  className="btn btn-outline">Send Another Message</button>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Send us a Message</h2>
                {error && <div className="alert alert-error">{error}</div>}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="c-name">Full Name *</label>
                      <input id="c-name" name="name" type="text" className="form-control" placeholder="Your name" value={form.name} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="c-email">Email *</label>
                      <input id="c-email" name="email" type="email" className="form-control" placeholder="you@example.com" value={form.email} onChange={handleChange} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="c-phone">Phone (optional)</label>
                      <input id="c-phone" name="phone" type="tel" className="form-control" placeholder="9876543210" value={form.phone} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="c-subject">Subject *</label>
                      <input id="c-subject" name="subject" type="text" className="form-control" placeholder="How can we help?" value={form.subject} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="c-message">Message *</label>
                    <textarea id="c-message" name="message" rows={5} className="form-control"
                      placeholder="Tell us about your fitness goals, questions, or concerns..." value={form.message} onChange={handleChange} />
                  </div>
                  <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                    {loading ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Sending...</> : <><Send size={16} /> Send Message</>}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
