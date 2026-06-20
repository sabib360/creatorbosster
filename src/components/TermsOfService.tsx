import { FileText, Mail, Shield, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from './SEOHead';

const SITE_URL = 'https://creatorboostai.xyz';
const LAST_UPDATED = 'June 19, 2026';

export default function TermsOfService() {
  return (
    <>
      <SEOHead
        title="Terms of Service - CreatorBoost AI | Usage Terms & Conditions"
        description="Read CreatorBoost AI's terms of service. Learn about acceptable use, intellectual property rights, limitation of liability, and dispute resolution."
        keywords="terms of service, terms and conditions, creatorboost AI terms, usage policy"
        canonicalUrl={`${SITE_URL}/terms-of-service`}
      />

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-semibold">
            <FileText className="w-4 h-4" />
            Terms of Service
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-primary/60">
            Terms of Service
          </h1>
          <p className="text-ink/60 text-lg">Last updated: {LAST_UPDATED}</p>
        </div>

        {/* Introduction */}
        <section className="space-y-4">
          <p className="text-ink/70 leading-relaxed text-lg">
            Welcome to CreatorBoost AI. These Terms of Service ("Terms") govern your access to and use
            of the website creatorboostai.xyz and all associated tools, features, and services (collectively,
            the "Service") operated by CreatorBoost AI ("we," "our," or "us"). By accessing or using our
            Service, you agree to be bound by these Terms. If you disagree with any part of these Terms,
            you may not access the Service.
          </p>
        </section>

        {/* Table of Contents */}
        <nav className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-ink mb-4">Table of Contents</h2>
          <ul className="space-y-2 text-sm">
            {[
              'Acceptance of Terms',
              'Description of Service',
              'Eligibility',
              'User Accounts',
              'Acceptable Use Policy',
              'Intellectual Property Rights',
              'User-Generated Content',
              'Disclaimers and Limitation of Liability',
              'Indemnification',
              'Termination',
              'Third-Party Links and Services',
              'Governing Law and Dispute Resolution',
              'Severability',
              'Changes to These Terms',
              'Contact Information',
            ].map((item, i) => (
              <li key={i}>
                <a href={`#tos-section-${i}`} className="text-primary hover:underline">{i + 1}. {item}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Section 1 */}
        <section id="tos-section-0" className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">1. Acceptance of Terms</h2>
          <p className="text-ink/70 leading-relaxed">
            By accessing or using CreatorBoost AI, you confirm that you have read, understood, and agree
            to be bound by these Terms and our <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
            If you are using the Service on behalf of an organization, you represent and warrant that you
            have the authority to bind that organization to these Terms, and "you" refers to both you
            individually and that organization.
          </p>
          <p className="text-ink/70 leading-relaxed">
            We reserve the right to modify these Terms at any time. Changes will be effective immediately
            upon posting to the website. Your continued use of the Service after any changes constitutes
            acceptance of the modified Terms. We encourage you to review this page periodically.
          </p>
        </section>

        {/* Section 2 */}
        <section id="tos-section-1" className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">2. Description of Service</h2>
          <p className="text-ink/70 leading-relaxed">
            CreatorBoost AI provides a comprehensive suite of free, browser-based tools designed for
            content creators, developers, and everyday users. Our Service includes, but is not limited to:
          </p>
          <ul className="space-y-2 text-ink/70 leading-relaxed ml-6 list-disc">
            <li><strong>Image Tools:</strong> Compress, resize, crop, rotate, convert, and enhance images</li>
            <li><strong>PDF Tools:</strong> Merge, split, compress, convert, and edit PDF documents</li>
            <li><strong>AI Tools:</strong> AI-powered content generation, image analysis, background removal, and summarization</li>
            <li><strong>Finance Tools:</strong> Loan calculators, budget planners, tax calculators, and currency converters</li>
            <li><strong>Social Media Tools:</strong> Hashtag generators, content idea generators, caption writers, and analytics</li>
            <li><strong>Developer Tools:</strong> JSON formatters, base64 encoders, regex testers, and more</li>
          </ul>
          <p className="text-ink/70 leading-relaxed">
            Most tools process data entirely in your browser — your files and content are not uploaded
            to our servers. The Service is provided "as is" and "as available" without warranties of any
            kind, either express or implied.
          </p>
        </section>

        {/* Section 3 */}
        <section id="tos-section-2" className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">3. Eligibility</h2>
          <p className="text-ink/70 leading-relaxed">
            You must be at least 13 years old (or 16 in the European Economic Area) to use our Service.
            By using the Service, you represent and warrant that you meet these age requirements and have
            the legal capacity to enter into these Terms. If you are under the applicable age, you may
            only use the Service with the involvement and consent of a parent or legal guardian.
          </p>
        </section>

        {/* Section 4 */}
        <section id="tos-section-3" className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">4. User Accounts</h2>
          <p className="text-ink/70 leading-relaxed">
            Certain features of the Service may require you to create an account. When creating an account,
            you agree to:
          </p>
          <ul className="space-y-2 text-ink/70 leading-relaxed ml-6 list-disc">
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain the security of your password and account</li>
            <li>Promptly update your account information if it changes</li>
            <li>Accept responsibility for all activities that occur under your account</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
          </ul>
          <p className="text-ink/70 leading-relaxed">
            We reserve the right to suspend or terminate accounts that violate these Terms or that we
            reasonably believe have been compromised.
          </p>
        </section>

        {/* Section 5 */}
        <section id="tos-section-4" className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">5. Acceptable Use Policy</h2>
          <p className="text-ink/70 leading-relaxed">
            You agree to use the Service only for lawful purposes and in accordance with these Terms.
            You agree not to:
          </p>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <ul className="space-y-3 text-ink/70 leading-relaxed ml-6 list-disc">
              <li>Use the Service for any illegal purpose or in violation of any local, state, national, or international law</li>
              <li>Upload or transmit malicious code, viruses, worms, or any other harmful software</li>
              <li>Attempt to gain unauthorized access to any portion of the Service, other accounts, or computer systems connected to the Service</li>
              <li>Interfere with or disrupt the Service, servers, or networks connected to the Service</li>
              <li>Use automated systems, bots, scrapers, or similar tools to access the Service without written permission</li>
              <li>Use the Service to send unsolicited communications (spam)</li>
              <li>Impersonate any person or entity, or misrepresent your affiliation with any person or entity</li>
              <li>Use the Service to process content that infringes on intellectual property rights of others</li>
              <li>Attempt to reverse engineer, decompile, or disassemble any portion of the Service</li>
              <li>Use the Service to build a competing product or service</li>
            </ul>
          </div>
          <p className="text-ink/70 leading-relaxed">
            We reserve the right to investigate and take appropriate action against anyone who, in our
            sole discretion, violates this Acceptable Use Policy, including removing content, suspending
            access, or terminating accounts.
          </p>
        </section>

        {/* Section 6 */}
        <section id="tos-section-5" className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">6. Intellectual Property Rights</h2>
          <p className="text-ink/70 leading-relaxed">
            The Service and its original content, features, functionality, and underlying technology are
            owned by CreatorBoost AI and are protected by international copyright, trademark, patent, trade
            secret, and other intellectual property or proprietary rights laws.
          </p>
          <p className="text-ink/70 leading-relaxed">
            You are granted a limited, non-exclusive, non-transferable, revocable license to access and
            use the Service for personal, non-commercial purposes. This license does not include any right
            to:
          </p>
          <ul className="space-y-2 text-ink/70 leading-relaxed ml-6 list-disc">
            <li>Modify, copy, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, or sell any information, software, products, or services obtained from the Service</li>
            <li>Use any data mining, robots, spiders, or similar data gathering or extraction tools</li>
            <li>Download (other than page caching) any portion of the Service or any information contained therein</li>
          </ul>
          <p className="text-ink/70 leading-relaxed">
            Our trademarks, trade names, logos, and brand features may not be used in connection with any
            product or service without our prior written consent.
          </p>
        </section>

        {/* Section 7 */}
        <section id="tos-section-6" className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">7. User-Generated Content</h2>
          <p className="text-ink/70 leading-relaxed">
            When you use our tools, you may upload files, enter text, or submit content ("User Content").
            You retain all rights to your User Content. We do not claim ownership over any User Content
            you submit through the Service.
          </p>
          <p className="text-ink/70 leading-relaxed">
            For browser-based tools, your User Content is processed entirely in your browser and is never
            transmitted to our servers. You are solely responsible for the content you process using our
            tools and for ensuring that your use of such content complies with applicable laws.
          </p>
          <p className="text-ink/70 leading-relaxed">
            By submitting content through tools that involve server processing (such as AI-powered features),
            you grant us a limited, non-exclusive license to process that content solely for the purpose of
            providing the requested service. We do not use your content for any other purpose.
          </p>
        </section>

        {/* Section 8 */}
        <section id="tos-section-7" className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">8. Disclaimers and Limitation of Liability</h2>

          <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-3xl p-8 md:p-12 space-y-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold text-ink">Important Disclaimers</h3>
            </div>
            <p className="text-ink/70 leading-relaxed">
              <strong>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
              EITHER EXPRESS OR IMPLIED.</strong> We do not warrant that the Service will be uninterrupted,
              error-free, or secure, or that any defects will be corrected. We make no representations or
              warranties about the accuracy, reliability, completeness, or timeliness of the Service,
              content, or results obtained from using the Service.
            </p>
          </div>

          <p className="text-ink/70 leading-relaxed">
            To the maximum extent permitted by applicable law, CreatorBoost AI shall not be liable for any
            indirect, incidental, special, consequential, or punitive damages, including but not limited to
            loss of profits, data, use, goodwill, or other intangible losses, resulting from:
          </p>
          <ul className="space-y-2 text-ink/70 leading-relaxed ml-6 list-disc">
            <li>Your access to or use of or inability to access or use the Service</li>
            <li>Any conduct or content of any third party on the Service</li>
            <li>Any content obtained from the Service</li>
            <li>Unauthorized access, use, or alteration of your transmissions or content</li>
          </ul>
          <p className="text-ink/70 leading-relaxed">
            In no event shall our total aggregate liability exceed the greater of one hundred dollars
            (USD $100.00) or the amount you have paid us in the past six months for the Service giving
            rise to the claim.
          </p>
        </section>

        {/* Section 9 */}
        <section id="tos-section-8" className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">9. Indemnification</h2>
          <p className="text-ink/70 leading-relaxed">
            You agree to defend, indemnify, and hold harmless CreatorBoost AI, its affiliates, licensors,
            and service providers, and its and their respective officers, directors, employees, contractors,
            agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities,
            damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys'
            fees) arising out of or relating to your violation of these Terms or your use of the Service.
          </p>
        </section>

        {/* Section 10 */}
        <section id="tos-section-9" className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">10. Termination</h2>
          <p className="text-ink/70 leading-relaxed">
            We may terminate or suspend your access to the Service immediately, without prior notice or
            liability, for any reason whatsoever, including without limitation if you breach these Terms.
            Upon termination, your right to use the Service will cease immediately.
          </p>
          <p className="text-ink/70 leading-relaxed">
            You may terminate your use of the Service at any time by simply discontinuing use. If you have
            an account, you may request account deletion by contacting us at{' '}
            <a href="mailto:support@creatorboostai.xyz" className="text-primary hover:underline">
              support@creatorboostai.xyz
            </a>.
          </p>
          <p className="text-ink/70 leading-relaxed">
            All provisions of these Terms which by their nature should survive termination shall survive,
            including, without limitation, ownership provisions, warranty disclaimers, indemnity, and
            limitations of liability.
          </p>
        </section>

        {/* Section 11 */}
        <section id="tos-section-10" className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">11. Third-Party Links and Services</h2>
          <p className="text-ink/70 leading-relaxed">
            The Service may contain links to third-party websites, services, or content that are not owned
            or controlled by CreatorBoost AI. We have no control over, and assume no responsibility for,
            the content, privacy policies, or practices of any third-party sites or services. We strongly
            advise you to read the terms and conditions and privacy policy of any third-party site that
            you visit.
          </p>
        </section>

        {/* Section 12 */}
        <section id="tos-section-11" className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">12. Governing Law and Dispute Resolution</h2>
          <p className="text-ink/70 leading-relaxed">
            These Terms shall be governed by and construed in accordance with the laws of the United States,
            without regard to its conflict of law provisions. Any disputes arising from or relating to these
            Terms or the Service shall be resolved through the following process:
          </p>
          <ul className="space-y-3 text-ink/70 leading-relaxed ml-6 list-decimal">
            <li><strong>Informal Resolution:</strong> Before filing any formal action, you agree to contact us and attempt to resolve the dispute informally by sending a written notice to{' '}
              <a href="mailto:legal@creatorboostai.xyz" className="text-primary hover:underline">legal@creatorboostai.xyz</a>.
              We will attempt to resolve the dispute within 30 days of receiving your notice.
            </li>
            <li><strong>Mediation:</strong> If informal resolution fails, the parties agree to submit the dispute to non-binding mediation before pursuing any other remedy.</li>
            <li><strong>Binding Arbitration:</strong> If mediation fails, any remaining dispute shall be resolved by binding arbitration in accordance with the rules of the American Arbitration Association.</li>
          </ul>
          <p className="text-ink/70 leading-relaxed">
            Notwithstanding the foregoing, we may seek injunctive or other equitable relief in any court
            of competent jurisdiction to prevent the actual or threatened infringement or misappropriation
            of our intellectual property rights.
          </p>
        </section>

        {/* Section 13 */}
        <section id="tos-section-12" className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">13. Severability</h2>
          <p className="text-ink/70 leading-relaxed">
            If any provision of these Terms is held to be unenforceable or invalid, such provision will be
            modified to the minimum extent necessary to make it enforceable, and the remaining provisions
            shall remain in full force and effect. The invalidity of any provision shall not affect the
            validity of the remaining provisions.
          </p>
        </section>

        {/* Section 14 */}
        <section id="tos-section-13" className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">14. Changes to These Terms</h2>
          <p className="text-ink/70 leading-relaxed">
            We reserve the right to modify or replace these Terms at any time at our sole discretion.
            If a revision is material, we will try to provide at least 30 days' notice prior to any new
            terms taking effect. What constitutes a material change will be determined at our sole
            discretion. By continuing to access or use our Service after those revisions become effective,
            you agree to be bound by the revised terms.
          </p>
        </section>

        {/* Section 15 */}
        <section id="tos-section-14" className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">15. Contact Information</h2>
          <p className="text-ink/70 leading-relaxed">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex items-center gap-4">
            <div className="bg-primary rounded-xl p-3">
              <Mail className="w-6 h-6 text-black" />
            </div>
            <div>
              <h3 className="font-bold text-ink">Legal Inquiries</h3>
              <a href="mailto:legal@creatorboostai.xyz" className="text-primary hover:underline text-sm">
                legal@creatorboostai.xyz
              </a>
            </div>
          </div>
        </section>

        {/* Footer Links */}
        <div className="border-t border-slate-800 pt-8 mt-12">
          <p className="text-ink/50 text-sm text-center">
            Related: <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link> · <Link to="/cookie-policy" className="text-primary hover:underline">Cookie Policy</Link> · <Link to="/disclaimer" className="text-primary hover:underline">Disclaimer</Link>
          </p>
        </div>
      </div>
    </>
  );
}
