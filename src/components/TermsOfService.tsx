import { FileText } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Terms of Service
        </h1>
        <p className="text-ink/60 text-lg">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="space-y-8 text-ink/80">
        <section>
          <h2 className="text-2xl font-display font-black uppercase tracking-wider mb-4 text-ink">1. Agreement to Terms</h2>
          <p className="text-lg leading-relaxed">
            By accessing and using Creator Booster AI ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service. These Terms of Service may be modified at any time without notice. Your continued use of the Service following any modification constitutes your acceptance of such modifications.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-display font-black uppercase tracking-wider mb-4 text-ink">2. Use License</h2>
          <p className="text-lg leading-relaxed mb-4">
            Permission is granted to temporarily download one copy of materials (information or software) on Creator Booster AI's site for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="space-y-3 text-lg">
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span>Modify or copy the materials</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span>Use the materials for any commercial purpose or for any public display</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span>Attempt to decompile or reverse engineer any software contained on Creator Booster AI</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span>Remove any copyright or other proprietary notations from the materials</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span>Transfer the materials to another person or "mirror" the materials on any other server</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span>Use the materials for spam, abuse, harassment, or illegal purposes</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-display font-black uppercase tracking-wider mb-4 text-ink">3. AI-Generated Content</h2>
          <div className="space-y-4 text-lg">
            <p>
              <strong>Ownership:</strong> You retain ownership of content you input into Creator Booster AI. AI-generated outputs are provided for your use and modification. We claim no ownership of generated content.
            </p>
            <p>
              <strong>Responsibility:</strong> You are responsible for ensuring that YouTube titles, descriptions, and thumbnails generated comply with YouTube's Community Guidelines, Copyright Policy, and Terms of Service. Creator Booster AI provides tools but does not guarantee compliance.
            </p>
            <p>
              <strong>Copyright:</strong> Do not use Creator Booster AI to generate content that infringes on third-party copyrights, trademarks, or intellectual property rights.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-display font-black uppercase tracking-wider mb-4 text-ink">4. Credits & Payments</h2>
          <div className="space-y-4 text-lg">
            <p>
              <strong>Free Tier:</strong> Creator Booster AI provides 3 free credits daily. Daily credits reset every 24 hours. Unused credits do not roll over to the next day.
            </p>
            <p>
              <strong>Premium Plans:</strong> Paid premium plans come with specific credit amounts and pricing. Purchased credits are non-refundable except where required by law. Premium subscriptions are subject to recurring billing.
            </p>
            <p>
              <strong>Refund Policy:</strong> We do not offer refunds for credits once purchased. If you believe you've been incorrectly charged, contact support within 30 days of the transaction.
            </p>
            <p>
              <strong>Payment Processing:</strong> We use third-party payment processors. Your payment information is not stored on our servers and is processed through secure payment gateways.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-display font-black uppercase tracking-wider mb-4 text-ink">5. User Accounts</h2>
          <div className="space-y-4 text-lg">
            <p>
              If you create an account on Creator Booster AI, you are responsible for maintaining the confidentiality of your password and account information. You agree to accept responsibility for all activities that occur under your account.
            </p>
            <p>
              You must provide accurate, complete, and current account information. You agree to update information as needed to keep it accurate and current.
            </p>
            <p>
              We reserve the right to suspend or terminate accounts that violate these Terms of Service or engage in prohibited conduct.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-display font-black uppercase tracking-wider mb-4 text-ink">6. Prohibited Conduct</h2>
          <p className="text-lg leading-relaxed mb-4">
            You agree not to use Creator Booster AI for:
          </p>
          <ul className="space-y-3 text-lg">
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span>Generating content that violates YouTube's Community Guidelines</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span>Creating deceptive or fraudulent content</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span>Spam, harassment, or abusive behavior</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span>Infringement of copyrights, trademarks, or intellectual property</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span>Illegal activities</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">•</span>
              <span>Attempting to gain unauthorized access to the Service</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-display font-black uppercase tracking-wider mb-4 text-ink">7. Disclaimers</h2>
          <div className="space-y-4 text-lg">
            <p>
              <strong>As-Is Basis:</strong> Creator Booster AI is provided on an "as-is" and "as available" basis. We make no warranties, expressed or implied, regarding the Service.
            </p>
            <p>
              <strong>No Guarantees:</strong> We do not guarantee that AI-generated content will increase your YouTube views, rankings, or engagement. Results vary based on content quality, audience, and YouTube algorithm changes.
            </p>
            <p>
              <strong>Third-Party Services:</strong> Creator Booster AI uses Google's Gemini API and Firebase services. We are not responsible for third-party service outages or disruptions.
            </p>
            <p>
              <strong>Accuracy:</strong> While we strive for accuracy, AI-generated content may contain errors. Always review and edit generated content before use.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-display font-black uppercase tracking-wider mb-4 text-ink">8. Limitation of Liability</h2>
          <p className="text-lg leading-relaxed">
            In no event shall Creator Booster AI, its owners, operators, or affiliates be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use Creator Booster AI, even if Creator Booster AI or an authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-display font-black uppercase tracking-wider mb-4 text-ink">9. Modifications to Service</h2>
          <p className="text-lg leading-relaxed">
            Creator Booster AI may modify or discontinue services (or any part thereof) with or without notice. Creator Booster AI shall not be liable for any modification, suspension, or discontinuance of the Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-display font-black uppercase tracking-wider mb-4 text-ink">10. Governing Law</h2>
          <p className="text-lg leading-relaxed">
            These Terms of Service and the use of Creator Booster AI are governed by and construed in accordance with the laws of the jurisdiction in which the Service is operated, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-display font-black uppercase tracking-wider mb-4 text-ink">11. Contact Information</h2>
          <div className="space-y-3 text-lg">
            <p>
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="flex gap-3 items-center p-4 bg-primary/10 border border-primary/30 rounded-xl">
              <FileText className="w-5 h-5 text-primary flex-shrink-0" />
              <a href="mailto:support@creatorboostai.xyz" className="text-primary hover:underline font-semibold break-all">
                support@creatorboostai.xyz
              </a>
            </div>
          </div>
        </section>

        <section className="pt-4 border-t-2 border-slate-800">
          <p className="text-sm text-ink/50 italic">
            By using Creator Booster AI, you acknowledge that you have read, understood, and agree to be bound by all the terms and conditions contained in this Terms of Service.
          </p>
        </section>
      </div>
    </div>
  );
}
