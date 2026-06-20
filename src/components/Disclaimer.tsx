import { AlertTriangle, Mail, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from './SEOHead';

const SITE_URL = 'https://creatorboostai.xyz';
const LAST_UPDATED = 'June 19, 2026';

export default function Disclaimer() {
  return (
    <>
      <SEOHead
        title="Disclaimer - CreatorBoost AI | Tool Accuracy & User Responsibility"
        description="Read CreatorBoost AI's disclaimer regarding tool accuracy, no guarantee of results, user responsibility, and third-party content limitations."
        keywords="disclaimer, tool accuracy, user responsibility, creatorboost AI disclaimer"
        canonicalUrl={`${SITE_URL}/disclaimer`}
      />

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-semibold">
            <AlertTriangle className="w-4 h-4" />
            Disclaimer
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-primary/60">
            Disclaimer
          </h1>
          <p className="text-ink/60 text-lg">Last updated: {LAST_UPDATED}</p>
        </div>

        {/* Introduction */}
        <section className="space-y-4">
          <p className="text-ink/70 leading-relaxed text-lg">
            The information and tools provided on CreatorBoost AI (creatorboostai.xyz) are offered on an
            "as is" and "as available" basis. This Disclaimer page outlines the limitations of our
            service, your responsibilities as a user, and the extent of our liability. By accessing or
            using our website and tools, you acknowledge and agree to the terms set forth in this
            Disclaimer.
          </p>
        </section>

        {/* Section 1: Tool Accuracy */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">1. Tool Accuracy and Reliability</h2>
          <p className="text-ink/70 leading-relaxed">
            While we strive to provide accurate, reliable, and up-to-date tools and information, we make
            no representations or warranties of any kind about the completeness, accuracy, reliability,
            suitability, or availability of the tools, information, or related graphics contained on this
            website. The tools are provided for general informational and utility purposes only.
          </p>

          <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-3xl p-8 space-y-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold text-ink">No Guarantee of Accuracy</h3>
            </div>
            <p className="text-ink/70 leading-relaxed">
              Specific limitations apply to different tool categories:
            </p>
            <ul className="space-y-2 text-ink/70 leading-relaxed ml-6 list-disc">
              <li><strong>AI-Powered Tools:</strong> AI-generated content, analysis, and suggestions are produced by machine learning models and may contain errors, inaccuracies, or biases. AI outputs should always be reviewed and verified by a human before use in any professional or critical context.</li>
              <li><strong>Financial Calculators:</strong> Calculations provided are estimates based on standard formulas and should not be considered professional financial advice. Actual results may vary based on individual circumstances, market conditions, and specific terms. Always consult a qualified financial advisor.</li>
              <li><strong>Image and PDF Tools:</strong> Processing results may vary depending on input quality, file format, and browser capabilities. We do not guarantee specific compression ratios, conversion accuracy, or output quality.</li>
              <li><strong>SEO and Marketing Tools:</strong> SEO scores, keyword suggestions, and marketing recommendations are based on general best practices and should not be taken as professional SEO advice. Search engine algorithms change frequently and vary by platform.</li>
            </ul>
          </div>
        </section>

        {/* Section 2: No Guarantee of Results */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">2. No Guarantee of Results</h2>
          <p className="text-ink/70 leading-relaxed">
            We do not guarantee any specific results from the use of our tools. This includes, but is
            not limited to:
          </p>
          <ul className="space-y-3 text-ink/70 leading-relaxed ml-6 list-disc">
            <li>Specific file size reductions when using image or PDF compression tools</li>
            <li>Improved search engine rankings from using SEO tools or recommendations</li>
            <li>Increased engagement, views, or revenue from using social media tools</li>
            <li>Accuracy of financial calculations or projections</li>
            <li>Quality or suitability of AI-generated content for any particular purpose</li>
            <li>Compatibility of output files with specific software or platforms</li>
            <li>Uninterrupted or error-free operation of the website or tools</li>
          </ul>
          <p className="text-ink/70 leading-relaxed">
            Any reliance you place on the information or outputs provided by our tools is strictly at
            your own risk. We encourage users to verify results independently and consult with
            professionals when making important decisions based on our tools' outputs.
          </p>
        </section>

        {/* Section 3: User Responsibility */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">3. User Responsibility</h2>
          <p className="text-ink/70 leading-relaxed">
            As a user of CreatorBoost AI, you are responsible for:
          </p>
          <ul className="space-y-3 text-ink/70 leading-relaxed ml-6 list-disc">
            <li><strong>Content You Process:</strong> You are solely responsible for the content you upload, process, or generate using our tools. Ensure you have the legal right to use and modify any content you submit. Do not use our tools to process content that infringes on the intellectual property rights of others.</li>
            <li><strong>Output Verification:</strong> You are responsible for verifying the accuracy and suitability of any output produced by our tools before using it for any purpose, especially in professional, legal, financial, or medical contexts.</li>
            <li><strong>Backup of Data:</strong> While most of our tools process data in your browser, you should always maintain backups of important files. We are not responsible for any data loss that may occur during or after using our tools.</li>
            <li><strong>Compliance with Laws:</strong> You are responsible for ensuring that your use of our tools complies with all applicable local, state, national, and international laws and regulations.</li>
            <li><strong>Account Security:</strong> If you create an account, you are responsible for maintaining the confidentiality of your credentials and for all activities that occur under your account.</li>
          </ul>
        </section>

        {/* Section 4: Third-Party Content */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">4. Third-Party Content and Links</h2>
          <p className="text-ink/70 leading-relaxed">
            Our website may contain links to third-party websites, services, or content that are not
            owned or controlled by CreatorBoost AI. We have no control over and assume no responsibility
            for the content, privacy policies, or practices of any third-party sites or services. The
            inclusion of any links does not necessarily imply a recommendation or endorsement of the views
            expressed within them.
          </p>
          <p className="text-ink/70 leading-relaxed">
            Advertisements displayed on our website are served by third-party advertising networks
            (including Google AdSense). We do not endorse the products or services advertised and are not
            responsible for any claims made in advertisements.
          </p>
        </section>

        {/* Section 5: AI Disclaimer */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">5. AI-Generated Content Disclaimer</h2>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
            <p className="text-ink/70 leading-relaxed">
              Our AI-powered tools use artificial intelligence and machine learning models to generate
              content, analyze images, summarize documents, and provide recommendations. You should be
              aware of the following:
            </p>
            <ul className="space-y-2 text-ink/70 leading-relaxed ml-6 list-disc">
              <li>AI-generated content may contain factual errors, logical inconsistencies, or biased information</li>
              <li>AI models have knowledge cutoff dates and may not reflect the most current information</li>
              <li>AI-generated content should not be treated as professional advice (medical, legal, financial, or otherwise)</li>
              <li>You should always review and verify AI outputs before relying on them for important decisions</li>
              <li>AI tools may produce different results for similar inputs due to the probabilistic nature of language models</li>
              <li>We do not claim ownership of AI-generated content — you are responsible for how you use it</li>
            </ul>
          </div>
        </section>

        {/* Section 6: Financial Disclaimer */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">6. Financial Disclaimer</h2>
          <p className="text-ink/70 leading-relaxed">
            The financial calculators and tools provided on CreatorBoost AI are designed for educational
            and informational purposes only. They are not intended to be a substitute for professional
            financial advice. The calculations are based on standard formulas and assumptions that may
            not apply to your specific situation.
          </p>
          <p className="text-ink/70 leading-relaxed">
            Before making any financial decisions, including but not limited to taking out loans, making
            investments, or planning your budget, you should consult with a qualified financial advisor
            who can consider your individual circumstances, goals, and risk tolerance.
          </p>
        </section>

        {/* Section 7: Limitation of Liability */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">7. Limitation of Liability</h2>
          <p className="text-ink/70 leading-relaxed">
            To the maximum extent permitted by applicable law, CreatorBoost AI, its officers, directors,
            employees, and agents shall not be liable for any direct, indirect, incidental, special,
            consequential, or punitive damages arising out of or in connection with your use of this
            website or any tools, including but not limited to:
          </p>
          <ul className="space-y-2 text-ink/70 leading-relaxed ml-6 list-disc">
            <li>Loss of data, revenue, profits, or business opportunities</li>
            <li>Damages resulting from errors, inaccuracies, or omissions in tool outputs</li>
            <li>Damages resulting from unauthorized access to or alteration of your data</li>
            <li>Damages resulting from third-party actions, content, or services</li>
            <li>Any decisions made or actions taken based on information or tools provided on this site</li>
          </ul>
          <p className="text-ink/70 leading-relaxed">
            In no event shall our total aggregate liability exceed the greater of one hundred dollars
            (USD $100.00) or the amount you have paid us in the past twelve months.
          </p>
        </section>

        {/* Section 8: Professional Advice */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">8. Not Professional Advice</h2>
          <p className="text-ink/70 leading-relaxed">
            The content and tools on this website do not constitute professional advice of any kind,
            including but not limited to:
          </p>
          <ul className="space-y-2 text-ink/70 leading-relaxed ml-6 list-disc">
            <li>Legal advice</li>
            <li>Medical advice</li>
            <li>Financial or investment advice</li>
            <li>Tax advice</li>
            <li>Professional design or branding advice</li>
            <li>Professional SEO or marketing consulting</li>
          </ul>
          <p className="text-ink/70 leading-relaxed">
            Always seek the advice of a qualified professional with any questions you may have regarding
            a particular subject. Never disregard professional advice or delay in seeking it because of
            something you have read or used on this website.
          </p>
        </section>

        {/* Section 9: Changes */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">9. Changes to This Disclaimer</h2>
          <p className="text-ink/70 leading-relaxed">
            We reserve the right to modify this Disclaimer at any time. Changes will be effective
            immediately upon posting to the website. Your continued use of the Service after any
            modifications constitutes acceptance of the updated Disclaimer. We encourage you to review
            this page periodically.
          </p>
        </section>

        {/* Section 10: Contact */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">10. Contact Us</h2>
          <p className="text-ink/70 leading-relaxed">
            If you have any questions about this Disclaimer, please contact us:
          </p>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex items-center gap-4">
            <div className="bg-primary rounded-xl p-3">
              <Mail className="w-6 h-6 text-black" />
            </div>
            <div>
              <h3 className="font-bold text-ink">General Inquiries</h3>
              <a href="mailto:support@creatorboostai.xyz" className="text-primary hover:underline text-sm">
                support@creatorboostai.xyz
              </a>
            </div>
          </div>
        </section>

        {/* Footer Links */}
        <div className="border-t border-slate-800 pt-8 mt-12">
          <p className="text-ink/50 text-sm text-center">
            Related: <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link> · <Link to="/terms-of-service" className="text-primary hover:underline">Terms of Service</Link> · <Link to="/cookie-policy" className="text-primary hover:underline">Cookie Policy</Link>
          </p>
        </div>
      </div>
    </>
  );
}
