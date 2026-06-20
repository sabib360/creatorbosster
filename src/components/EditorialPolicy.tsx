import { Mail, BookOpen, CheckCircle, Brain, Eye, Shield, Users, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from './SEOHead';

const SITE_URL = 'https://creatorboostai.xyz';
const LAST_UPDATED = 'June 19, 2026';

export default function EditorialPolicy() {
  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Editorial Policy - CreatorBoost AI',
    description: 'Learn about CreatorBoost AI editorial standards, content creation process, AI usage policy, and quality assurance.',
    url: `${SITE_URL}/editorial-policy`,
    publisher: { '@type': 'Organization', name: 'CreatorBoost AI', url: SITE_URL },
  };

  return (
    <>
      <SEOHead
        title="Editorial Policy - CreatorBoost AI | Content Standards & Quality"
        description="Read CreatorBoost AI editorial policy. Our content creation process, human review, AI usage, fact-checking, and quality standards."
        keywords="editorial policy, content standards, quality assurance, creatorboost AI editorial"
        canonicalUrl={`${SITE_URL}/editorial-policy`}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-semibold">
            <BookOpen className="w-4 h-4" /> Editorial Policy
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-primary/60">
            Editorial Policy
          </h1>
          <p className="text-ink/60 text-lg">Last updated: {LAST_UPDATED}</p>
        </div>

        {/* Introduction */}
        <section className="space-y-4">
          <p className="text-ink/70 leading-relaxed text-lg">
            CreatorBoost AI is committed to providing accurate, helpful, and trustworthy content to our users.
            This Editorial Policy outlines the standards and processes we follow to ensure the quality and
            integrity of all content published on our website, including blog articles, tool descriptions,
            tutorials, and educational resources.
          </p>
        </section>

        {/* Content Creation Process */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">1. Content Creation Process</h2>
          <p className="text-ink/70 leading-relaxed">
            Every piece of content on CreatorBoost AI goes through a structured creation process designed
            to ensure accuracy, relevance, and value for our users:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { step: '1', title: 'Research', desc: 'Our team conducts thorough research on the topic, consulting multiple authoritative sources and current data.', icon: Eye },
              { step: '2', title: 'Drafting', desc: 'Content is written by our editorial team or generated with AI assistance, then reviewed for accuracy and completeness.', icon: FileText },
              { step: '3', title: 'Review', desc: 'Every article undergoes human editorial review for factual accuracy, grammar, readability, and alignment with our standards.', icon: CheckCircle },
              { step: '4', title: 'Publication', desc: 'After final approval, content is published with proper attribution, dates, and metadata.', icon: Shield },
            ].map((item) => (
              <div key={item.step} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{item.step}</span>
                  </div>
                  <h3 className="font-bold text-ink">{item.title}</h3>
                </div>
                <p className="text-ink/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Human Review */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">2. Human Review Process</h2>
          <p className="text-ink/70 leading-relaxed">
            All content published on CreatorBoost AI undergoes human editorial review before publication.
            Our review process includes:
          </p>
          <ul className="space-y-3 text-ink/70 leading-relaxed ml-6 list-disc">
            <li><strong>Factual accuracy:</strong> All claims, statistics, and recommendations are verified against authoritative sources.</li>
            <li><strong>Technical accuracy:</strong> Tool descriptions and tutorials are tested by our team to ensure instructions are correct and complete.</li>
            <li><strong>Grammar and readability:</strong> Content is reviewed for clarity, proper grammar, and accessible language.</li>
            <li><strong>SEO optimization:</strong> Content is reviewed for proper keyword usage, meta tags, and search visibility.</li>
            <li><strong>User value:</strong> Content is evaluated for practical usefulness and relevance to our audience.</li>
            <li><strong>Brand consistency:</strong> Content aligns with our brand voice, values, and editorial standards.</li>
          </ul>
        </section>

        {/* AI Usage Policy */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">3. AI Usage Policy</h2>
          <p className="text-ink/70 leading-relaxed">
            CreatorBoost AI uses artificial intelligence tools as part of our content creation workflow.
            We believe in transparency about how AI is used in our content:
          </p>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <Brain className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-ink text-sm">What We Use AI For</h4>
                <p className="text-ink/60 text-sm mt-1">AI assists with initial drafting, content ideation, SEO optimization suggestions, and data analysis. AI-generated content is always reviewed and edited by human editors.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-ink text-sm">Human Oversight</h4>
                <p className="text-ink/60 text-sm mt-1">No content is published without human review. Our editorial team verifies accuracy, adds original insights, and ensures content meets our quality standards.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-ink text-sm">Transparency</h4>
                <p className="text-ink/60 text-sm mt-1">When AI tools are significantly used in content creation, we disclose this to our readers. We believe in honest, transparent communication about our processes.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Fact Checking */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">4. Fact-Checking Standards</h2>
          <p className="text-ink/70 leading-relaxed">
            Accuracy is fundamental to our editorial standards. Our fact-checking process includes:
          </p>
          <ul className="space-y-3 text-ink/70 leading-relaxed ml-6 list-disc">
            <li><strong>Primary sources:</strong> We prioritize original research, official documentation, and first-party data.</li>
            <li><strong>Cross-referencing:</strong> Claims are verified against multiple independent sources when possible.</li>
            <li><strong>Expert consultation:</strong> For technical topics, we consult with industry experts and practitioners.</li>
            <li><strong>Regular updates:</strong> Published content is reviewed periodically and updated to reflect current information.</li>
            <li><strong>Corrections:</strong> If errors are identified, we correct them promptly and note the correction date.</li>
          </ul>
        </section>

        {/* Quality Standards */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">5. Quality Standards</h2>
          <p className="text-ink/70 leading-relaxed">
            All content on CreatorBoost AI must meet these quality standards:
          </p>
          <div className="space-y-3">
            {[
              { title: 'Originality', desc: 'Content must be original and not plagiarized. We do not copy content from other sources.' },
              { title: 'Accuracy', desc: 'All information must be factually accurate and verifiable. We cite sources where appropriate.' },
              { title: 'Usefulness', desc: 'Content must provide practical value to our audience. Every article should help readers accomplish something.' },
              { title: 'Clarity', desc: 'Content must be written in clear, accessible language that our audience can understand.' },
              { title: 'Completeness', desc: 'Topics must be covered thoroughly. We aim for comprehensive coverage rather than surface-level treatment.' },
              { title: 'Timeliness', desc: 'Content must be current and regularly updated to reflect the latest information and trends.' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-ink text-sm">{item.title}</h4>
                  <p className="text-ink/60 text-sm mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Corrections */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">6. Corrections and Updates</h2>
          <p className="text-ink/70 leading-relaxed">
            We are committed to accuracy and transparency. If you identify an error in our content:
          </p>
          <ul className="space-y-3 text-ink/70 leading-relaxed ml-6 list-disc">
            <li>Contact us at <a href="mailto:editorial@creatorboostai.xyz" className="text-primary hover:underline">editorial@creatorboostai.xyz</a> with the specific error and source.</li>
            <li>We will review the claim within 48 hours.</li>
            <li>If an error is confirmed, we will correct the content promptly and add an update note.</li>
            <li>For factual disputes, we may consult additional sources before making changes.</li>
          </ul>
        </section>

        {/* Contact */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">7. Contact Us</h2>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex items-center gap-4">
            <div className="bg-primary rounded-xl p-3">
              <Mail className="w-6 h-6 text-black" />
            </div>
            <div>
              <h3 className="font-bold text-ink">Editorial Inquiries</h3>
              <a href="mailto:editorial@creatorboostai.xyz" className="text-primary hover:underline text-sm">editorial@creatorboostai.xyz</a>
              <p className="text-ink/50 text-xs mt-1">For content corrections, suggestions, and editorial questions</p>
            </div>
          </div>
        </section>

        {/* Footer Links */}
        <div className="border-t border-slate-800 pt-8">
          <p className="text-ink/50 text-sm text-center">
            Related: <Link to="/about" className="text-primary hover:underline">About Us</Link> · <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link> · <Link to="/contact-us" className="text-primary hover:underline">Contact Us</Link>
          </p>
        </div>
      </div>
    </>
  );
}
