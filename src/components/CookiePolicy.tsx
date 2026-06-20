import { Cookie, Mail, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from './SEOHead';

const SITE_URL = 'https://creatorboostai.xyz';
const LAST_UPDATED = 'June 19, 2026';

export default function CookiePolicy() {
  return (
    <>
      <SEOHead
        title="Cookie Policy - CreatorBoost AI | How We Use Cookies"
        description="Learn how CreatorBoost AI uses cookies, including essential, analytics, and advertising cookies. Manage your cookie preferences and understand your rights."
        keywords="cookie policy, cookies, tracking technologies, Google Analytics cookies, AdSense cookies"
        canonicalUrl={`${SITE_URL}/cookie-policy`}
      />

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-semibold">
            <Cookie className="w-4 h-4" />
            Cookie Policy
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-primary/60">
            Cookie Policy
          </h1>
          <p className="text-ink/60 text-lg">Last updated: {LAST_UPDATED}</p>
        </div>

        {/* Introduction */}
        <section className="space-y-4">
          <p className="text-ink/70 leading-relaxed text-lg">
            This Cookie Policy explains how CreatorBoost AI ("we," "our," or "us") uses cookies and
            similar tracking technologies when you visit our website at creatorboostai.xyz. We are
            committed to being transparent about the technologies we use and giving you control over
            how they are employed.
          </p>
          <p className="text-ink/70 leading-relaxed">
            By using our website, you consent to the use of cookies as described in this policy. You
            can manage your cookie preferences at any time using the cookie consent banner or your
            browser settings.
          </p>
        </section>

        {/* What Are Cookies */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">What Are Cookies?</h2>
          <p className="text-ink/70 leading-relaxed">
            Cookies are small text files that are placed on your computer or mobile device when you
            visit a website. They are widely used to make websites work efficiently, provide a better
            user experience, and supply information to the owners of the site. Cookies can be
            "persistent" (remaining on your device until deleted) or "session-based" (deleted when you
            close your browser).
          </p>
          <p className="text-ink/70 leading-relaxed">
            Cookies can also be set by the website you are visiting ("first-party cookies") or by
            third-party services that appear on the page ("third-party cookies"). We use both types
            as described below.
          </p>
        </section>

        {/* How We Use Cookies */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">How We Use Cookies</h2>
          <p className="text-ink/70 leading-relaxed">
            We use cookies for the following purposes:
          </p>

          {/* Essential Cookies */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink">Essential Cookies</h3>
              <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full font-semibold">Always Active</span>
            </div>
            <p className="text-ink/70 leading-relaxed">
              These cookies are strictly necessary for the website to function. They enable core
              features such as security, network management, and cookie consent preferences. You cannot
              opt out of these cookies because the website would not work properly without them.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-2 text-gray-400">Cookie</th>
                    <th className="text-left py-2 text-gray-400">Purpose</th>
                    <th className="text-left py-2 text-gray-400">Duration</th>
                  </tr>
                </thead>
                <tbody className="text-ink/60">
                  <tr className="border-b border-slate-800">
                    <td className="py-2 font-mono text-xs">creatorboost_cookie_consent</td>
                    <td className="py-2">Stores your cookie consent preferences</td>
                    <td className="py-2">1 year</td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-2 font-mono text-xs">creatorboost_recently_used</td>
                    <td className="py-2">Remembers your recently used tools</td>
                    <td className="py-2">30 days</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">session_id</td>
                    <td className="py-2">Maintains your session state</td>
                    <td className="py-2">Session</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Analytics Cookies */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink">Analytics Cookies</h3>
              <span className="text-xs bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full font-semibold">Optional</span>
            </div>
            <p className="text-ink/70 leading-relaxed">
              We use Google Analytics (GA4) to understand how visitors interact with our website. These
              cookies collect information about how visitors use our site — which pages they visit most
              often, how long they spend on each page, and how they arrived at our site. All this
              information is aggregated and therefore anonymous.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-2 text-gray-400">Cookie</th>
                    <th className="text-left py-2 text-gray-400">Purpose</th>
                    <th className="text-left py-2 text-gray-400">Duration</th>
                  </tr>
                </thead>
                <tbody className="text-ink/60">
                  <tr className="border-b border-slate-800">
                    <td className="py-2 font-mono text-xs">_ga</td>
                    <td className="py-2">Distinguishes unique users</td>
                    <td className="py-2">2 years</td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-2 font-mono text-xs">_ga_*</td>
                    <td className="py-2">Maintains session state</td>
                    <td className="py-2">2 years</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">_gid</td>
                    <td className="py-2">Distinguishes unique users</td>
                    <td className="py-2">24 hours</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-ink/50 text-sm">
              Google's ability to use and share information is governed by the{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Privacy Policy</a>.
            </p>
          </div>

          {/* Advertising Cookies */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink">Advertising Cookies</h3>
              <span className="text-xs bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full font-semibold">Optional</span>
            </div>
            <p className="text-ink/70 leading-relaxed">
              We use Google AdSense to display advertisements on our website. AdSense uses cookies to
              serve ads based on your prior visits to our website and other websites. These cookies
              enable Google and its partners to serve ads based on your browsing history and interests.
              You can opt out of personalized advertising by visiting{' '}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Ads Settings</a>.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-2 text-gray-400">Cookie</th>
                    <th className="text-left py-2 text-gray-400">Purpose</th>
                    <th className="text-left py-2 text-gray-400">Duration</th>
                  </tr>
                </thead>
                <tbody className="text-ink/60">
                  <tr className="border-b border-slate-800">
                    <td className="py-2 font-mono text-xs">_gcl_au</td>
                    <td className="py-2">Google AdSense conversion tracking</td>
                    <td className="py-2">3 months</td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-2 font-mono text-xs">IDE</td>
                    <td className="py-2">DoubleClick ad targeting</td>
                    <td className="py-2">1 year</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">test_cookie</td>
                    <td className="py-2">Checks if browser supports cookies</td>
                    <td className="py-2">15 minutes</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-ink/50 text-sm">
              You can also opt out of personalized advertising from participating companies by visiting{' '}
              <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.aboutads.info</a>.
            </p>
          </div>
        </section>

        {/* Managing Cookies */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">Managing Your Cookie Preferences</h2>
          <p className="text-ink/70 leading-relaxed">
            You have several options for managing cookies:
          </p>
          <ul className="space-y-3 text-ink/70 leading-relaxed ml-6 list-disc">
            <li><strong>Cookie Consent Banner:</strong> When you first visit our site, a cookie consent banner appears allowing you to accept all, reject all, or customize your preferences. You can change your preferences at any time by clearing your browser's local storage for this site.</li>
            <li><strong>Browser Settings:</strong> Most web browsers allow you to control cookies through their settings. You can set your browser to refuse all cookies, accept all cookies, or notify you when a cookie is set. The following links provide instructions for popular browsers:
              <ul className="ml-6 mt-2 space-y-1 list-disc text-sm">
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Safari</a></li>
                <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Microsoft Edge</a></li>
              </ul>
            </li>
            <li><strong>Opt-Out Tools:</strong> For advertising cookies, visit{' '}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Ads Settings</a> or{' '}
              <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.aboutads.info</a>.
            </li>
          </ul>
          <p className="text-ink/70 leading-relaxed">
            Please note that disabling cookies may affect the functionality of certain features on our
            website. Essential cookies cannot be disabled as they are required for the site to function.
          </p>
        </section>

        {/* Third Party Cookies */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">Third-Party Cookies</h2>
          <p className="text-ink/70 leading-relaxed">
            In addition to our own cookies, we may also use various third-party cookies to report usage
            statistics and serve advertisements. These third parties include:
          </p>
          <ul className="space-y-2 text-ink/70 leading-relaxed ml-6 list-disc">
            <li><strong>Google Analytics</strong> — website traffic analysis</li>
            <li><strong>Google AdSense</strong> — advertising</li>
            <li><strong>Google Ad Manager</strong> — ad serving and management</li>
            <li><strong>Firebase</strong> — authentication services</li>
          </ul>
          <p className="text-ink/70 leading-relaxed">
            Each of these third parties has their own privacy policy governing their use of cookies and
            tracking technologies. We encourage you to review their respective privacy policies.
          </p>
        </section>

        {/* Changes */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">Changes to This Cookie Policy</h2>
          <p className="text-ink/70 leading-relaxed">
            We may update this Cookie Policy from time to time to reflect changes in technology,
            legislation, or our business operations. We will notify you of any material changes by
            posting the new policy on this page and updating the "Last Updated" date. We encourage you
            to review this page periodically.
          </p>
        </section>

        {/* Contact */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">Contact Us</h2>
          <p className="text-ink/70 leading-relaxed">
            If you have any questions about our use of cookies or other technologies, please contact us:
          </p>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex items-center gap-4">
            <div className="bg-primary rounded-xl p-3">
              <Mail className="w-6 h-6 text-black" />
            </div>
            <div>
              <h3 className="font-bold text-ink">Cookie Inquiries</h3>
              <a href="mailto:privacy@creatorboostai.xyz" className="text-primary hover:underline text-sm">
                privacy@creatorboostai.xyz
              </a>
            </div>
          </div>
        </section>

        {/* Footer Links */}
        <div className="border-t border-slate-800 pt-8 mt-12">
          <p className="text-ink/50 text-sm text-center">
            Related: <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link> · <Link to="/terms-of-service" className="text-primary hover:underline">Terms of Service</Link> · <Link to="/disclaimer" className="text-primary hover:underline">Disclaimer</Link>
          </p>
        </div>
      </div>
    </>
  );
}
