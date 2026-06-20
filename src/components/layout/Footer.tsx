import { useNavigate } from 'react-router-dom';
import { User, Shield, FileText, Settings, AlertCircle, Mail } from 'lucide-react';

const footerLinks = [
  { id: 'about', label: 'About Us', icon: User, path: '/about' },
  { id: 'privacy-policy', label: 'Privacy Policy', icon: Shield, path: '/privacy-policy' },
  { id: 'terms-of-service', label: 'Terms of Service', icon: FileText, path: '/terms-of-service' },
  { id: 'cookie-policy', label: 'Cookie Policy', icon: Settings, path: '/cookie-policy' },
  { id: 'disclaimer', label: 'Disclaimer', icon: AlertCircle, path: '/disclaimer' },
  { id: 'contact-us', label: 'Contact Us', icon: Mail, path: '/contact-us' },
] as const;

export function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="mt-16 pt-8 border-t border-gray-800/50 pb-8">
      <div className="flex flex-wrap justify-center gap-6">
        {footerLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => {
              navigate(link.path);
              window.scrollTo(0, 0);
            }}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
          >
            <link.icon className="w-4 h-4" />
            {link.label}
          </button>
        ))}
      </div>
    </footer>
  );
}
