import { Mail } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Privacy Policy
        </h1>
        <p className="text-ink/60 text-lg">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="space-y-8 text-ink/80">
        <section>
          <h2 className="text-2xl font-display font-black uppercase tracking-wider mb-4 text-ink">Introduction</h2>
          <p className="text-lg leading-relaxed">
            At <strong>Creator Booster AI</strong>, accessible from <span className="text-primary font-semibold">creatorboostai.xyz</span>, one of our main priorities is the privacy of our visitors and users. This Privacy Policy document contains information about the types of data we collect and record, and how we use it to provide and improve our AI-powered YouTube content generation services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-display font-black uppercase tracking-wider mb-4 text-ink">Information We Collect</h2>
          <ul className="space-y-3 text-lg">
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span><strong>Account Information:</strong> Email address, display name, profile picture, and authentication credentials. This is securely stored in Firebase Authentication.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span><strong>AI Generation Data:</strong> Video titles, descriptions, thumbnail ideas, and competitor analysis queries that you input. These prompts are sent to Google's Gemini API for processing.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span><strong>Usage History:</strong> Records of generated content, timestamps, and generation metadata stored in Firestore database.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span><strong>Credits & Transactions:</strong> Daily credit usage, payment records, subscription status, and transaction history for billing purposes.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span><strong>Log Files & Analytics:</strong> Browser type, IP address, pages visited, time spent, and access timestamps for system monitoring and improvement.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span><strong>Cookies & Tracking:</strong> We use cookies through Google AdSense and Firebase Analytics to understand user behavior and serve relevant advertisements.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span><strong>Contact Information:</strong> If you reach out to us, we collect your name, email, subject, and message for support purposes.</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-display font-black uppercase tracking-wider mb-4 text-ink">How We Use Your Information</h2>
          <ul className="space-y-3 text-lg">
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span><strong>Core Service Delivery:</strong> Processing your requests to generate YouTube titles, descriptions, and thumbnail ideas using AI technology</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span><strong>Account Management:</strong> Creating and maintaining user accounts, managing authentication, and enabling login functionality</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span><strong>Credits System:</strong> Tracking daily credit usage, applying credit limits, and managing credit purchases/refunds</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span><strong>Payment Processing:</strong> Processing subscription payments and maintaining transaction records for invoicing and compliance</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span><strong>Service Improvement:</strong> Analyzing usage patterns, identifying popular features, and optimizing the platform based on user behavior</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span><strong>Security & Fraud Prevention:</strong> Detecting unusual account activity, preventing unauthorized access, and protecting against abuse</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span><strong>Advertising:</strong> Personalizing advertisements through Google AdSense based on your interests and browsing habits</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span><strong>Customer Support:</strong> Responding to inquiries, resolving issues, and providing technical assistance</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span><strong>Communication:</strong> Sending important notifications about account changes, service updates, or policy changes</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-display font-black uppercase tracking-wider mb-4 text-ink">Third-Party Services</h2>
          <p className="text-lg leading-relaxed mb-4">
            Our website uses third-party services to enhance functionality:
          </p>
          <ul className="space-y-3 text-lg">
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span><strong>Google AdSense:</strong> We display targeted advertisements. Google AdSense may use cookies and other tracking technologies. Visit <a href="https://myaccount.google.com/data-and-privacy" className="text-primary hover:underline">Google's privacy page</a> for more information.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span><strong>Google Gemini AI:</strong> We use Google's Gemini AI API to generate content. Your prompts are transmitted to Google's servers. Review Google's data practices at <a href="https://ai.google.dev" className="text-primary hover:underline">ai.google.dev</a>.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span><strong>Firebase:</strong> We use Google Firebase for authentication and data storage.</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-display font-black uppercase tracking-wider mb-4 text-ink">Data Security</h2>
          <p className="text-lg leading-relaxed mb-4">
            We implement appropriate technical and organizational measures to protect your personal information:
          </p>
          <ul className="space-y-3 text-lg">
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span><strong>End-to-End Encryption:</strong> Your data is encrypted both in transit (HTTPS/TLS) and at rest in our databases</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span><strong>Firebase Security:</strong> We use Google Firebase with enterprise-grade security protocols, two-factor authentication, and access controls</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span><strong>Access Control:</strong> Only authorized personnel can access user data for operational and support purposes</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span><strong>Regular Security Audits:</strong> We conduct regular security assessments and vulnerability testing to identify and fix security issues</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span><strong>Compliance Standards:</strong> We adhere to industry best practices and comply with international data protection regulations</span>
            </li>
          </ul>
          <p className="text-lg leading-relaxed mt-4 text-ink/70">
            However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security. Please report any security concerns immediately to support@creatorboostai.xyz.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-display font-black uppercase tracking-wider mb-4 text-ink">Data Retention</h2>
          <ul className="space-y-3 text-lg">
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span><strong>Account Data:</strong> Retained while your account is active. Upon account deletion, data is removed within 30 days.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span><strong>Generation History:</strong> Stored in your account indefinitely for reference and future use.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span><strong>Log Files:</strong> Automatically deleted after 90 days for security and compliance purposes.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span><strong>Payment Records:</strong> Retained for 7 years as required by tax and financial regulations.</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-display font-black uppercase tracking-wider mb-4 text-ink">Content Ownership & Usage</h2>
          <p className="text-lg leading-relaxed mb-4">
            <strong>You own the generated content.</strong> Any titles, descriptions, or ideas generated by Creator Booster AI are yours to use freely. We do not claim ownership of the content you generate. However, we may use anonymized, aggregated data to improve our AI models and demonstrate usage patterns (without identifying you).
          </p>
          <p className="text-lg leading-relaxed">
            We do not store or republish your generated content. It exists only for your reference in your account history.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-display font-black uppercase tracking-wider mb-4 text-ink">Your Privacy Rights</h2>
          <ul className="space-y-3 text-lg">
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span><strong>Right to Access:</strong> You can request access to all personal data we hold about you</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span><strong>Right to Correction:</strong> You can update or correct inaccurate personal information at any time in your account settings</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span><strong>Right to Deletion:</strong> You can request deletion of your account and associated data. We will remove it within 30 days (except where required by law)</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span><strong>Right to Data Portability:</strong> You can request a copy of your data in a commonly used format</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span><strong>Right to Opt-Out of Marketing:</strong> You can unsubscribe from promotional emails at any time</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span><strong>Right to Opt-Out of Personalized Ads:</strong> You can disable personalized advertising through Google AdSense settings</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span><strong>Cookie Control:</strong> You can disable cookies in your browser settings, though this may affect functionality</span>
            </li>
          </ul>
          <p className="text-lg leading-relaxed mt-6 text-ink/70">
            To exercise any of these rights, please contact us at <a href="mailto:support@creatorboostai.xyz" className="text-primary font-semibold hover:underline">support@creatorboostai.xyz</a>. We will respond to your request within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-display font-black uppercase tracking-wider mb-4 text-ink">Policy Updates & Changes</h2>
          <p className="text-lg leading-relaxed mb-4">
            We may update this Privacy Policy periodically to reflect changes in our practices, technology, legal requirements, or other factors. We will:
          </p>
          <ul className="space-y-3 text-lg">
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span>Post any updates on this page with a new "Last updated" date</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span>For significant changes, notify you via email or prominently display a notice on our website</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span>Give you 30 days to review the changes and opt-out if you disagree</span>
            </li>
          </ul>
          <p className="text-lg leading-relaxed mt-4 text-ink/70">
            Your continued use of Creator Booster AI after policy changes constitutes your acceptance of the updated Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-display font-black uppercase tracking-wider mb-4 text-ink">Privacy Contact Information</h2>
          <p className="text-lg leading-relaxed mb-6">
            If you have concerns about our privacy practices, questions about this Privacy Policy, or wish to exercise your privacy rights, please contact us:
          </p>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6 text-black fill-black" />
            </div>
            <div>
              <div className="text-sm font-black text-ink/60 uppercase tracking-wider">Privacy Inquiries</div>
              <a href="mailto:support@creatorboostai.xyz" className="text-lg font-black text-primary hover:underline">
                support@creatorboostai.xyz
              </a>
            </div>
          </div>
          <p className="text-lg leading-relaxed mt-6 text-ink/70">
            We typically respond to privacy-related inquiries within 48 business hours. If you're unsatisfied with our response, you may have the right to lodge a complaint with your local data protection authority.
          </p>
        </section>
      </div>
    </div>
  );
}
