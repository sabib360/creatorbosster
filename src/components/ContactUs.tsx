import { useState, FormEvent } from 'react';
import { Mail, MapPin, MessageSquare, ExternalLink, AlertCircle, CheckCircle, Clock, Send, Globe, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from './SEOHead';
import { contactPageSchema, toolFAQSchema } from '../lib/schema';

const SITE_URL = 'https://creatorboostai.xyz';

const faqItems = [
  { q: 'How quickly will I get a response?', a: 'We typically respond within 24-48 hours during business days. For urgent issues, please include "URGENT" in your subject line.' },
  { q: 'Do you offer phone support?', a: 'We currently offer email-based support only. This allows us to provide more thorough responses and maintain a record of all communications.' },
  { q: 'Can I request a new tool?', a: 'Absolutely! We love hearing from our users. Describe the tool you need and the problem it would solve, and we will consider it for future development.' },
  { q: 'I found a bug. How do I report it?', a: 'Use the contact form below and select "Bug Report" as the subject. Please include the tool name, a description of the issue, and your browser/device info.' },
  { q: 'Do you accept guest posts?', a: 'We do not accept guest posts or sponsored content at this time. Our blog content is created exclusively by our team.' },
];

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-bot honeypot
  const [lastSubmit, setLastSubmit] = useState(0); // Rate limiting

  const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Honeypot check (bots fill this, humans don't)
    if (honeypot) return;

    // Rate limiting: max 1 submission per 30 seconds
    const now = Date.now();
    if (now - lastSubmit < 30000) {
      setError('Please wait 30 seconds before submitting again.');
      return;
    }

    if (!formData.name.trim()) { setError('Please enter your name.'); return; }
    if (!validateEmail(formData.email)) { setError('Please enter a valid email address.'); return; }
    if (!formData.message.trim()) { setError('Please enter a message.'); return; }
    if (formData.message.trim().length < 10) { setError('Message must be at least 10 characters.'); return; }

    setLastSubmit(now);
    setLoading(true);
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: 'YOUR_WEB3FORMS_ACCESS_KEY',
          name: formData.name,
          email: formData.email,
          subject: formData.subject || 'Contact Form Submission',
          message: formData.message,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setError('Something went wrong. Please try again or email us directly.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-ink placeholder-ink/30 focus:border-primary focus:outline-none transition-colors font-semibold';

  return (
    <>
      <SEOHead
        title="Contact Us - CreatorBoost AI | Get in Touch"
        description="Contact CreatorBoost AI for support, feedback, or business inquiries. We respond within 24-48 hours. Reach us via email, contact form, or social media."
        keywords="contact creatorboost AI, support, help, feedback, business inquiries"
        canonicalUrl={`${SITE_URL}/contact-us`}
        structuredData={[contactPageSchema(), toolFAQSchema(faqItems)].filter(Boolean)}
      />

      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-semibold">
            <MessageSquare className="w-4 h-4" />
            Get in Touch
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-primary/60">
            Contact Us
          </h1>
          <p className="text-ink/60 text-lg max-w-2xl mx-auto">
            Have a question, suggestion, or need help? We'd love to hear from you. Our team typically responds within 24-48 hours.
          </p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Mail, title: 'Email Us', desc: 'support@creatorboostai.xyz', sub: 'Response within 24-48 hours', href: 'mailto:support@creatorboostai.xyz' },
            { icon: Globe, title: 'Website', desc: SITE_URL, sub: 'Explore our tools', href: SITE_URL },
            { icon: ExternalLink, title: 'Social Media', desc: 'Follow us for updates', sub: '@creatorboostai', href: 'https://twitter.com/creatorboostai' },
          ].map((card) => (
            <a
              key={card.title}
              href={card.href}
              target={card.href.startsWith('http') ? '_blank' : undefined}
              rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 space-y-4 hover:border-primary/30 transition-colors group"
            >
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 w-fit group-hover:bg-primary/20 transition-colors">
                <card.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-ink">{card.title}</h3>
                <p className="text-primary text-sm">{card.desc}</p>
                <p className="text-ink/50 text-xs mt-1">{card.sub}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Contact Form */}
        <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-8 md:p-12 space-y-6">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">Send Us a Message</h2>

          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
              <h3 className="text-2xl font-bold text-ink">Message Sent!</h3>
              <p className="text-ink/60">Thank you for reaching out. We will get back to you within 24-48 hours.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-3 bg-primary hover:bg-primary/90 text-black font-semibold rounded-xl transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-ink mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-ink mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-ink mb-2">Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className={inputClass}
                >
                  <option value="">Select a subject...</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Privacy Concern">Privacy Concern</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-ink mb-2">Message *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us how we can help..."
                  rows={6}
                  className={`${inputClass} resize-none`}
                  required
                />
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Honeypot field - hidden from humans, catches bots */}
              <div className="absolute opacity-0 pointer-events-none h-0 w-0 overflow-hidden" aria-hidden="true">
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 disabled:bg-ink/20 text-black font-display font-black uppercase tracking-wider py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>

              <p className="text-ink/40 text-xs text-center">
                By submitting this form, you agree to our{' '}
                <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
              </p>
            </form>
          )}
        </div>

        {/* Response Time */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex items-center gap-4">
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-3">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-ink">Response Time</h3>
            <p className="text-ink/60 text-sm">We aim to respond to all inquiries within 24-48 hours during business days (Monday-Friday). Weekend inquiries will be answered on the next business day.</p>
          </div>
        </div>

        {/* FAQ */}
        <section className="space-y-6">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <details key={i} className="bg-slate-900/50 border border-slate-800 rounded-2xl group">
                <summary className="p-6 cursor-pointer font-semibold text-ink hover:text-primary transition list-none flex justify-between items-center">
                  {item.q}
                  <span className="text-ink/40 group-open:rotate-180 transition-transform ml-4">▾</span>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-ink/60 leading-relaxed">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Footer Links */}
        <div className="border-t border-slate-800 pt-8">
          <p className="text-ink/50 text-sm text-center">
            <Link to="/about" className="text-primary hover:underline">About Us</Link> · <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link> · <Link to="/terms-of-service" className="text-primary hover:underline">Terms of Service</Link>
          </p>
        </div>
      </div>
    </>
  );
}
