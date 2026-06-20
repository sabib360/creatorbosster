import { Mail, Shield, Globe, Eye, Trash2, Download, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from './SEOHead';

const SITE_URL = 'https://creatorboostai.xyz';
const LAST_UPDATED = 'June 19, 2026';

export default function PrivacyPolicy() {
  return (
    <>
      <SEOHead
        title="Privacy Policy - CreatorBoost AI | GDPR & CCPA Compliant"
        description="Read CreatorBoost AI's comprehensive privacy policy. Learn what data we collect, how we use it, your rights under GDPR and CCPA, and our data retention practices."
        keywords="privacy policy, GDPR, CCPA, data protection, creatorboost AI privacy"
        canonicalUrl={`${SITE_URL}/privacy-policy`}
      />

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-semibold">
            <Shield className="w-4 h-4" />
            Privacy Policy
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-primary/60">
            Privacy Policy
          </h1>
          <p className="text-ink/60 text-lg">Last updated: {LAST_UPDATED}</p>
        </div>

        {/* Introduction */}
        <section className="space-y-4">
          <p className="text-ink/70 leading-relaxed text-lg">
            CreatorBoost AI ("we," "our," or "us") operates the website creatorboostai.xyz (the "Service").
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when
            you visit our website and use our tools. We are committed to protecting your personal data and
            respecting your privacy rights under applicable data protection laws, including the General Data
            Protection Regulation (GDPR) for European users and the California Consumer Privacy Act (CCPA)
            for California residents.
          </p>
          <p className="text-ink/70 leading-relaxed">
            By accessing or using our Service, you agree to the collection and use of information in
            accordance with this policy. If you do not agree with the terms of this policy, please do
            not access the Service. We encourage you to read this policy carefully and contact us if
            you have any questions.
          </p>
        </section>

        {/* Table of Contents */}
        <nav className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-ink mb-4">Table of Contents</h2>
          <ul className="space-y-2 text-sm">
            {[
              'Information We Collect',
              'How We Use Your Information',
              'Cookies and Tracking Technologies',
              'Third-Party Services',
              'Data Sharing and Disclosure',
              'Data Retention',
              'Your Rights Under GDPR',
              'Your Rights Under CCPA',
              'International Data Transfers',
              "Children's Privacy",
              'Data Security',
              'Changes to This Policy',
              'Contact Us',
            ].map((item, i) => (
              <li key={i}>
                <a href={`#section-${i}`} className="text-primary hover:underline">{i + 1}. {item}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Section 1 */}
        <section id="section-0" className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">1. Information We Collect</h2>
          <p className="text-ink/70 leading-relaxed">
            We collect information to provide and improve our Service. The types of information we collect fall into two categories:
          </p>

          <h3 className="text-xl font-bold text-ink mt-6">Personal Information</h3>
          <p className="text-ink/70 leading-relaxed">
            When you voluntarily provide it to us, we may collect personal information such as your name,
            email address, and any other information you choose to provide through our contact forms, account
            registration, or support requests. This information is only collected when you explicitly submit
            it — we do not require account creation to use most of our tools.
          </p>

          <h3 className="text-xl font-bold text-ink mt-6">Automatically Collected Information</h3>
          <p className="text-ink/70 leading-relaxed">
            When you visit our website, we automatically collect certain information about your device and
            your visit. This includes your IP address, browser type and version, operating system, referral
            source, pages visited, time and date of visit, time spent on pages, and other diagnostic data.
            This information is collected through server logs, cookies, and similar tracking technologies.
          </p>

          <h3 className="text-xl font-bold text-ink mt-6">User-Generated Content</h3>
          <p className="text-ink/70 leading-relaxed">
            When you use our tools (such as image compressors, PDF editors, or AI generators), you may
            upload files, enter text, or submit other content. Important: All processing of user-generated
            content happens directly in your browser. Your files and data are never uploaded to our servers
            unless a tool explicitly states otherwise. We have no access to, and do not store, the content
            you process using our browser-based tools.
          </p>
        </section>

        {/* Section 2 */}
        <section id="section-1" className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">2. How We Use Your Information</h2>
          <p className="text-ink/70 leading-relaxed">
            We use the information we collect for the following purposes:
          </p>
          <ul className="space-y-3 text-ink/70 leading-relaxed ml-6 list-disc">
            <li><strong>To provide and maintain our Service</strong> — including monitoring usage, detecting technical issues, and ensuring the website functions correctly.</li>
            <li><strong>To improve our Service</strong> — we analyze aggregated, anonymized usage data to understand how visitors interact with our tools and website, helping us prioritize features and fix problems.</li>
            <li><strong>To communicate with you</strong> — when you contact us via email or our contact form, we use your information to respond to your inquiry and provide support.</li>
            <li><strong>To send periodic emails</strong> — only if you have opted in to our mailing list. You can unsubscribe at any time by clicking the unsubscribe link in any email.</li>
            <li><strong>To display advertisements</strong> — we use Google AdSense to display advertisements. Google uses cookies to serve ads based on your prior visits to our website and other websites.</li>
            <li><strong>To comply with legal obligations</strong> — we may retain and disclose your information as required by law, regulation, or legal process.</li>
          </ul>
          <p className="text-ink/70 leading-relaxed">
            We will not use your personal data for purposes beyond those listed here without first
            obtaining your consent, except where we have a legal basis to do so.
          </p>
        </section>

        {/* Section 3 */}
        <section id="section-2" className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">3. Cookies and Tracking Technologies</h2>
          <p className="text-ink/70 leading-relaxed">
            Cookies are small text files stored on your device when you visit a website. We use cookies and
            similar tracking technologies to enhance your experience and gather information about usage.
          </p>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-ink">Essential Cookies</h3>
            <p className="text-ink/70 leading-relaxed">
              These cookies are necessary for the website to function. They enable core features such as
              security, network management, and account access. You cannot opt out of these cookies as the
              website would not function properly without them.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-ink">Analytics Cookies (Google Analytics)</h3>
            <p className="text-ink/70 leading-relaxed">
              We use Google Analytics (GA4) to understand how visitors interact with our website. Google
              Analytics uses cookies to collect information such as how often users visit the site, what
              pages they visit, and what other sites they used prior to coming to our site. Google Analytics
              only collects the IP address assigned to you on the date you visit our site — we do not
              collect your name, email address, or other personal information through Google Analytics.
              Google's ability to use and share information is governed by the Google Analytics Terms of
              Use and the Google Privacy Policy.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-ink">Advertising Cookies (Google AdSense)</h3>
            <p className="text-ink/70 leading-relaxed">
              Google AdSense uses cookies to serve ads based on your browsing history. Google's DoubleClick
              cookie enables it and its partners to serve ads based on your visits to our site and/or other
              sites on the internet. You can opt out of personalized advertising by visiting{' '}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Google Ads Settings
              </a>. Alternatively, you can opt out of some third-party vendors' use of cookies for
              personalized advertising by visiting{' '}
              <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                www.aboutads.info
              </a>.
            </p>
          </div>

          <p className="text-ink/70 leading-relaxed">
            You can control and/or delete cookies through your browser settings. Most browsers allow you
            to refuse or accept cookies, delete existing cookies, and set preferences for certain websites.
            Please note that disabling cookies may affect the functionality of certain features on our site.
          </p>
        </section>

        {/* Section 4 */}
        <section id="section-3" className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">4. Third-Party Services</h2>
          <p className="text-ink/70 leading-relaxed">
            We use the following third-party services that may collect information from you:
          </p>
          <ul className="space-y-3 text-ink/70 leading-relaxed ml-6 list-disc">
            <li><strong>Google Analytics</strong> — website traffic analysis. Google's privacy policy: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">policies.google.com/privacy</a></li>
            <li><strong>Google AdSense</strong> — advertising. Google's advertising policies: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">policies.google.com/technologies/ads</a></li>
            <li><strong>Firebase</strong> — authentication and analytics (provided by Google). Firebase privacy policy: <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">firebase.google.com/support/privacy</a></li>
            <li><strong>Google Gemini API</strong> — AI-powered tool features. Google's AI privacy policy: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">policies.google.com/privacy</a></li>
            <li><strong>Vercel</strong> — website hosting and analytics. Vercel's privacy policy: <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">vercel.com/legal/privacy-policy</a></li>
          </ul>
          <p className="text-ink/70 leading-relaxed">
            These third-party service providers have their own privacy policies governing the use of your
            information. We encourage you to review their privacy policies. We are not responsible for the
            practices of these third-party services.
          </p>
        </section>

        {/* Section 5 */}
        <section id="section-4" className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">5. Data Sharing and Disclosure</h2>
          <p className="text-ink/70 leading-relaxed">
            We do not sell, trade, or rent your personal information to third parties. We may share
            aggregated, non-personally-identifying information publicly and with our partners. For example,
            we may share aggregated information about website traffic patterns.
          </p>
          <p className="text-ink/70 leading-relaxed">
            We may disclose your personal information in the following circumstances:
          </p>
          <ul className="space-y-3 text-ink/70 leading-relaxed ml-6 list-disc">
            <li>When required by law, regulation, or legal process</li>
            <li>To protect the rights, property, or safety of CreatorBoost AI, our users, or the public</li>
            <li>In connection with a merger, acquisition, or sale of all or a portion of our assets</li>
            <li>With your explicit consent</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section id="section-5" className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">6. Data Retention</h2>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-ink">How Long We Keep Your Data</h3>
            </div>
            <p className="text-ink/70 leading-relaxed">
              We retain your personal information only for as long as necessary to fulfill the purposes
              outlined in this policy. Specifically:
            </p>
            <ul className="space-y-2 text-ink/70 leading-relaxed ml-6 list-disc">
              <li><strong>Contact form submissions:</strong> Retained for up to 12 months to allow us to follow up on inquiries.</li>
              <li><strong>Server logs:</strong> Automatically deleted after 90 days.</li>
              <li><strong>Analytics data:</strong> Retained for 26 months in Google Analytics (configurable by us).</li>
              <li><strong>Advertising data:</strong> Google AdSense retains data according to its own retention policies.</li>
              <li><strong>Account data:</strong> If you create an account, data is retained until you request deletion.</li>
            </ul>
            <p className="text-ink/70 leading-relaxed">
              When data is no longer needed, it is securely deleted or anonymized so that it can no
              longer be associated with you.
            </p>
          </div>
        </section>

        {/* Section 7 */}
        <section id="section-6" className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">7. Your Rights Under GDPR</h2>
          <p className="text-ink/70 leading-relaxed">
            If you are located in the European Economic Area (EEA), the United Kingdom, or Switzerland,
            you have the following rights under the General Data Protection Regulation (GDPR):
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Eye, title: 'Right of Access', desc: 'You can request a copy of the personal data we hold about you.' },
              { icon: Trash2, title: 'Right to Erasure', desc: 'You can request that we delete your personal data.' },
              { icon: Download, title: 'Right to Data Portability', desc: 'You can request your data in a structured, machine-readable format.' },
              { icon: AlertCircle, title: 'Right to Rectification', desc: 'You can request correction of inaccurate personal data.' },
            ].map((right, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <right.icon className="w-4 h-4 text-primary" />
                  <h4 className="font-bold text-ink text-sm">{right.title}</h4>
                </div>
                <p className="text-ink/60 text-sm leading-relaxed">{right.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-ink/70 leading-relaxed">
            To exercise any of these rights, please contact us at{' '}
            <a href="mailto:privacy@creatorboostai.xyz" className="text-primary hover:underline">privacy@creatorboostai.xyz</a>.
            We will respond to your request within 30 days. You also have the right to lodge a complaint
            with your local data protection authority.
          </p>
        </section>

        {/* Section 8 */}
        <section id="section-7" className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">8. Your Rights Under CCPA</h2>
          <p className="text-ink/70 leading-relaxed">
            If you are a California resident, the California Consumer Privacy Act (CCPA) provides you
            with additional rights regarding your personal information:
          </p>
          <ul className="space-y-3 text-ink/70 leading-relaxed ml-6 list-disc">
            <li><strong>Right to Know:</strong> You have the right to request that we disclose the categories and specific pieces of personal information we have collected about you.</li>
            <li><strong>Right to Delete:</strong> You have the right to request the deletion of your personal information, subject to certain exceptions.</li>
            <li><strong>Right to Opt-Out:</strong> You have the right to opt out of the sale of your personal information. We do not sell your personal information.</li>
            <li><strong>Non-Discrimination:</strong> We will not discriminate against you for exercising any of your CCPA rights.</li>
          </ul>
          <p className="text-ink/70 leading-relaxed">
            To exercise your CCPA rights, please contact us at{' '}
            <a href="mailto:privacy@creatorboostai.xyz" className="text-primary hover:underline">privacy@creatorboostai.xyz</a>.
            We will verify your identity before processing your request and respond within 45 days.
          </p>
        </section>

        {/* Section 9 */}
        <section id="section-8" className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">9. International Data Transfers</h2>
          <p className="text-ink/70 leading-relaxed">
            Your information may be transferred to and processed in countries other than your country of
            residence. These countries may have different data protection laws than your jurisdiction. When
            we transfer personal data internationally, we ensure appropriate safeguards are in place,
            including Standard Contractual Clauses approved by the European Commission where required.
          </p>
          <p className="text-ink/70 leading-relaxed">
            Our primary servers are located in the United States, hosted by Vercel. By using our Service,
            you consent to the transfer of your information to the United States and other countries where
            our service providers operate.
          </p>
        </section>

        {/* Section 10 */}
        <section id="section-9" className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">10. Children's Privacy</h2>
          <p className="text-ink/70 leading-relaxed">
            Our Service is not intended for children under 13 years of age (or 16 in the EEA). We do not
            knowingly collect personal information from children. If you are a parent or guardian and
            believe your child has provided us with personal information, please contact us immediately.
            If we become aware that we have collected personal data from a child without verification of
            parental consent, we will take steps to delete that information from our servers.
          </p>
        </section>

        {/* Section 11 */}
        <section id="section-10" className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">11. Data Security</h2>
          <p className="text-ink/70 leading-relaxed">
            We implement appropriate technical and organizational security measures to protect your personal
            information against unauthorized access, alteration, disclosure, or destruction. These measures
            include:
          </p>
          <ul className="space-y-2 text-ink/70 leading-relaxed ml-6 list-disc">
            <li>SSL/TLS encryption for all data transmitted between your browser and our servers</li>
            <li>Regular security assessments and updates</li>
            <li>Access controls and authentication for administrative systems</li>
            <li>Secure hosting infrastructure provided by Vercel</li>
          </ul>
          <p className="text-ink/70 leading-relaxed">
            However, no method of transmission over the Internet or electronic storage is 100% secure.
            While we strive to protect your information, we cannot guarantee its absolute security.
          </p>
        </section>

        {/* Section 12 */}
        <section id="section-11" className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">12. Changes to This Policy</h2>
          <p className="text-ink/70 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any changes by
            posting the new policy on this page and updating the "Last Updated" date at the top. We
            encourage you to review this policy periodically. Your continued use of the Service after
            any modifications constitutes acceptance of the updated policy.
          </p>
        </section>

        {/* Section 13 */}
        <section id="section-12" className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">13. Contact Us</h2>
          <p className="text-ink/70 leading-relaxed">
            If you have any questions about this Privacy Policy, your data, or your rights, please
            contact us:
          </p>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex items-center gap-4">
            <div className="bg-primary rounded-xl p-3">
              <Mail className="w-6 h-6 text-black" />
            </div>
            <div>
              <h3 className="font-bold text-ink">Privacy Inquiries</h3>
              <a href="mailto:privacy@creatorboostai.xyz" className="text-primary hover:underline text-sm">
                privacy@creatorboostai.xyz
              </a>
              <p className="text-ink/50 text-xs mt-1">We respond within 30 days</p>
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex items-center gap-4">
            <div className="bg-primary rounded-xl p-3">
              <Globe className="w-6 h-6 text-black" />
            </div>
            <div>
              <h3 className="font-bold text-ink">Website</h3>
              <a href={SITE_URL} className="text-primary hover:underline text-sm">{SITE_URL}</a>
            </div>
          </div>
        </section>

        {/* Footer Links */}
        <div className="border-t border-slate-800 pt-8 mt-12">
          <p className="text-ink/50 text-sm text-center">
            Related: <Link to="/terms-of-service" className="text-primary hover:underline">Terms of Service</Link> · <Link to="/cookie-policy" className="text-primary hover:underline">Cookie Policy</Link> · <Link to="/disclaimer" className="text-primary hover:underline">Disclaimer</Link>
          </p>
        </div>
      </div>
    </>
  );
}
