import { Mail, Shield, FileText, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from './SEOHead';

const SITE_URL = 'https://creatorboostai.xyz';
const LAST_UPDATED = 'June 19, 2026';

export default function DMCA() {
  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'DMCA Policy - CreatorBoost AI',
    description: 'CreatorBoost AI DMCA policy and copyright infringement reporting process.',
    url: `${SITE_URL}/dmca`,
    publisher: { '@type': 'Organization', name: 'CreatorBoost AI', url: SITE_URL },
  };

  return (
    <>
      <SEOHead
        title="DMCA Policy - CreatorBoost AI | Copyright Infringement Policy"
        description="Read CreatorBoost AI's DMCA policy. Learn how to report copyright infringement, submit takedown requests, and file counter-notifications."
        keywords="dmca policy, copyright infringement, dmca notice, takedown request, creatorboost AI dmca"
        canonicalUrl={`${SITE_URL}/dmca`}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-semibold">
            <Shield className="w-4 h-4" /> DMCA Policy
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-primary/60">
            DMCA Policy
          </h1>
          <p className="text-ink/60 text-lg">Last updated: {LAST_UPDATED}</p>
        </div>

        {/* Introduction */}
        <section className="space-y-4">
          <p className="text-ink/70 leading-relaxed text-lg">
            CreatorBoost AI ("we," "our," or "us") respects the intellectual property rights of others and expects
            users of our website and tools to do the same. In accordance with the Digital Millennium Copyright Act
            of 1998 ("DMCA"), we will respond expeditiously to claims of copyright infringement that are reported
            to our designated copyright agent.
          </p>
          <p className="text-ink/70 leading-relaxed">
            This DMCA Policy outlines the process for reporting copyright infringement, filing counter-notifications,
            and how we handle such claims. We are committed to protecting the rights of copyright holders while
            ensuring that legitimate uses of copyrighted material are not impeded.
          </p>
        </section>

        {/* Copyright Infringement Policy */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">1. Copyright Infringement Policy</h2>
          <p className="text-ink/70 leading-relaxed">
            CreatorBoost AI operates as a platform providing free online tools for content creators. We do not
            host, store, or distribute user-generated content on our servers. All file processing happens
            directly in the user's browser, meaning we have no access to the content processed through our tools.
          </p>
          <p className="text-ink/70 leading-relaxed">
            Despite this technical architecture, we take copyright infringement claims seriously. If you believe
            that content accessible through our website infringes your copyright, please follow the DMCA notice
            procedure outlined below.
          </p>
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
            <p className="text-ink/70 leading-relaxed text-sm">
              <strong>Important:</strong> Because our tools process files locally in the user's browser, we do not
              have access to or control over the files users choose to process. DMCA takedown requests should be
              directed to the website or platform where the infringing content is actually hosted.
            </p>
          </div>
        </section>

        {/* DMCA Notice Requirements */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">2. DMCA Notice Requirements</h2>
          <p className="text-ink/70 leading-relaxed">
            To file a valid DMCA takedown notice, your written communication must include the following elements
            as required by Section 512(c)(3) of the DMCA:
          </p>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
            {[
              { num: 'A', text: 'A physical or electronic signature of the copyright owner or a person authorized to act on their behalf.' },
              { num: 'B', text: 'Identification of the copyrighted work claimed to have been infringed, or if multiple works are covered by a single notification, a representative list of such works.' },
              { num: 'C', text: 'Identification of the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed or access to which is to be disabled, and information reasonably sufficient to permit us to locate the material.' },
              { num: 'D', text: 'Contact information for the complaining party, including name, address, telephone number, and email address.' },
              { num: 'E', text: 'A statement that the complaining party has a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.' },
              { num: 'F', text: 'A statement that the information in the notification is accurate, and under penalty of perjury, that the complaining party is authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.' },
            ].map((item) => (
              <div key={item.num} className="flex items-start gap-3">
                <span className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary">{item.num}</span>
                <p className="text-ink/70 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How to Submit a Complaint */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">3. How to Submit a DMCA Complaint</h2>
          <p className="text-ink/70 leading-relaxed">
            DMCA takedown notices must be sent to our designated copyright agent via email. We will respond
            to valid DMCA notices within 24-48 hours during business days.
          </p>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-ink">Designated Copyright Agent</h3>
            <div className="space-y-2">
              <p className="text-ink/70 text-sm"><strong>Email:</strong> <a href="mailto:dmca@creatorboostai.xyz" className="text-primary hover:underline">dmca@creatorboostai.xyz</a></p>
              <p className="text-ink/70 text-sm"><strong>Subject Line:</strong> DMCA Takedown Request - [Copyrighted Work Title]</p>
              <p className="text-ink/70 text-sm"><strong>Response Time:</strong> Within 24-48 hours for valid notices</p>
            </div>
          </div>
          <p className="text-ink/70 leading-relaxed">
            Please include all required information as outlined in Section 512(c)(3) of the DMCA. Incomplete
            notices may delay processing. We will acknowledge receipt of your notice and take appropriate action
            as required by law.
          </p>
        </section>

        {/* Counter Notification */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">4. Counter Notification Process</h2>
          <p className="text-ink/70 leading-relaxed">
            If you believe that your content was removed or disabled by mistake or misidentification, you may
            file a counter notification with us. Your counter notification must include:
          </p>
          <ul className="space-y-3 text-ink/70 leading-relaxed ml-6 list-disc">
            <li>Your physical or electronic signature</li>
            <li>Identification of the material that was removed or to which access was disabled and the location at which the material appeared before it was removed or disabled</li>
            <li>A statement under penalty of perjury that you have a good faith belief that the material was removed or disabled as a result of mistake or misidentification</li>
            <li>Your name, address, and telephone number, and a statement that you consent to the jurisdiction of the federal court in your district and that you will accept service of process from the person who provided notification of the alleged infringement</li>
          </ul>
          <p className="text-ink/70 leading-relaxed">
            Counter notifications should be sent to the same email address as DMCA notices. Upon receipt of a
            valid counter notification, we will forward it to the original complainant. The original complainant
            has 10-14 business days to file a court action. If no court action is filed, we may restore the
            removed content.
          </p>
        </section>

        {/* Repeat Infringers */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">5. Repeat Infringers</h2>
          <p className="text-ink/70 leading-relaxed">
            In accordance with the DMCA and other applicable law, we have adopted a policy of terminating,
            in appropriate circumstances, users who are deemed to be repeat infringers. We may also, at our
            sole discretion, limit access to the service and/or terminate the accounts of any users who
            infringe any intellectual property rights of others, whether or not there is any repeat infringement.
          </p>
        </section>

        {/* Contact */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">6. Contact Information</h2>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex items-center gap-4">
            <div className="bg-primary rounded-xl p-3">
              <Mail className="w-6 h-6 text-black" />
            </div>
            <div>
              <h3 className="font-bold text-ink">DMCA Inquiries</h3>
              <a href="mailto:dmca@creatorboostai.xyz" className="text-primary hover:underline text-sm">dmca@creatorboostai.xyz</a>
              <p className="text-ink/50 text-xs mt-1">We respond to valid DMCA notices within 24-48 hours</p>
            </div>
          </div>
        </section>

        {/* Footer Links */}
        <div className="border-t border-slate-800 pt-8">
          <p className="text-ink/50 text-sm text-center">
            Related: <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link> · <Link to="/terms-of-service" className="text-primary hover:underline">Terms of Service</Link> · <Link to="/disclaimer" className="text-primary hover:underline">Disclaimer</Link>
          </p>
        </div>
      </div>
    </>
  );
}
