import { Mail, MapPin, Facebook, Send } from 'lucide-react';
import { useState } from 'react';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just show success message
    // In production, you'd send this to your backend or email service
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Contact Us
        </h1>
        <p className="text-ink/60 text-lg">
          Have questions or suggestions? We'd love to hear from you. Get in touch with our team.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {/* Email Card */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:border-slate-700 transition-colors">
          <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mb-6">
            <Mail className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-lg font-display font-black uppercase tracking-wider mb-2 text-ink">Email</h3>
          <p className="text-ink/60 mb-4">Send us your message anytime</p>
          <a 
            href="mailto:support@creatorboostai.xyz"
            className="text-primary font-black hover:text-primary/80 transition-colors inline-flex items-center gap-2"
          >
            support@creatorboostai.xyz
            <Send className="w-4 h-4" />
          </a>
        </div>

        {/* Location Card */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:border-slate-700 transition-colors">
          <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mb-6">
            <MapPin className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-lg font-display font-black uppercase tracking-wider mb-2 text-ink">Website</h3>
          <p className="text-ink/60 mb-4">Visit our main website</p>
          <a 
            href="https://www.creatorboostai.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-black hover:text-primary/80 transition-colors"
          >
            www.creatorboostai.xyz
          </a>
        </div>

        {/* Social Media Card */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:border-slate-700 transition-colors">
          <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mb-6">
            <Facebook className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-lg font-display font-black uppercase tracking-wider mb-2 text-ink">Facebook</h3>
          <p className="text-ink/60 mb-4">Follow us on social media</p>
          <a 
            href="https://www.facebook.com/profile.php?id=61572335704389"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-black hover:text-primary/80 transition-colors"
          >
            Follow Page
          </a>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-8 md:p-12">
        <h2 className="text-2xl font-display font-black uppercase tracking-wider mb-8 text-ink">Send us a Message</h2>
        
        {submitted ? (
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-black fill-black" />
            </div>
            <h3 className="text-xl font-display font-black text-primary mb-2 uppercase">Message Sent!</h3>
            <p className="text-ink/60">Thank you for your message. We'll get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-display font-black uppercase tracking-wider text-ink/80 mb-3">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-ink placeholder-ink/30 focus:border-primary focus:outline-none transition-colors font-semibold"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-display font-black uppercase tracking-wider text-ink/80 mb-3">
                  Your Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-ink placeholder-ink/30 focus:border-primary focus:outline-none transition-colors font-semibold"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-display font-black uppercase tracking-wider text-ink/80 mb-3">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-ink placeholder-ink/30 focus:border-primary focus:outline-none transition-colors font-semibold"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label className="block text-sm font-display font-black uppercase tracking-wider text-ink/80 mb-3">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-ink placeholder-ink/30 focus:border-primary focus:outline-none transition-colors font-semibold resize-none"
                placeholder="Tell us your message..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-black font-display font-black uppercase tracking-wider py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg shadow-primary/20 hover:shadow-primary/40"
            >
              <Send className="w-5 h-5 fill-black group-hover:translate-x-1 transition-transform" />
              Send Message
            </button>
          </form>
        )}
      </div>

      {/* Support Tips */}
      <div className="mt-16 bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-3xl p-8 md:p-12">
        <h2 className="text-2xl font-display font-black uppercase tracking-wider mb-6 text-ink">Tips for Better Support</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-display font-black uppercase tracking-wider mb-3 text-primary">For Bug Reports</h3>
            <ul className="space-y-2 text-ink/70 text-sm">
              <li>• Include your browser and OS version</li>
              <li>• Describe exact steps to reproduce</li>
              <li>• Include error messages if any</li>
              <li>• Attach screenshots when helpful</li>
            </ul>
          </div>
          <div>
            <h3 className="font-display font-black uppercase tracking-wider mb-3 text-primary">For Account Issues</h3>
            <ul className="space-y-2 text-ink/70 text-sm">
              <li>• Provide your account email</li>
              <li>• Describe what happened step-by-step</li>
              <li>• Include any error codes</li>
              <li>• Note when the issue started</li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-display font-black uppercase tracking-wider mb-8 text-ink">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-display font-black uppercase tracking-wider text-ink mb-2">How quickly will you respond?</h3>
            <p className="text-ink/60">We typically respond to all inquiries within 24-48 hours during business days. For urgent issues, please mark your email as "URGENT" in the subject line.</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-display font-black uppercase tracking-wider text-ink mb-2">What are your business hours?</h3>
            <p className="text-ink/60">We provide support 7 days a week. Our support team responds to emails during business hours (Monday-Friday, 9 AM - 6 PM UTC), with some weekend coverage available.</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-display font-black uppercase tracking-wider text-ink mb-2">Can I report a bug or feature request?</h3>
            <p className="text-ink/60">Absolutely! Please describe the issue in detail, including your browser type, operating system, and steps to reproduce the problem. Feature requests are also welcome. Send them to support@creatorboostai.xyz</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-display font-black uppercase tracking-wider text-ink mb-2">Do you offer refunds?</h3>
            <p className="text-ink/60">Yes, we offer a 7-day money-back guarantee for new subscriptions. If you're unsatisfied for any reason, contact our support team and we'll process your refund promptly.</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-display font-black uppercase tracking-wider text-ink mb-2">How can I provide feedback?</h3>
            <p className="text-ink/60">We value your feedback! You can use the contact form above, email us directly, or reach out on our Facebook page. All suggestions help us improve Creator Booster AI.</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-display font-black uppercase tracking-wider text-ink mb-2">What if I forget my password?</h3>
            <p className="text-ink/60">You can reset your password on the login page. Click "Forgot Password" and follow the instructions to reset it via email. If you don't receive the email, check your spam folder or contact support.</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-display font-black uppercase tracking-wider text-ink mb-2">Is my data safe?</h3>
            <p className="text-ink/60">Yes! We use industry-leading security practices including HTTPS encryption, Firebase security, and regular security audits. Your data is never shared with third parties except as described in our Privacy Policy.</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-display font-black uppercase tracking-wider text-ink mb-2">Can I delete my account?</h3>
            <p className="text-ink/60">Yes, you can delete your account anytime from your account settings. This will remove all your personal data from our servers (except records required by law for 7 years). Your generated content will also be deleted.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
