/**
 * Author Profile Component
 * Displays author information for E-E-A-T compliance.
 * Used on blog posts, editorial content, and about pages.
 */

import { ExternalLink, Mail, BookOpen, Award } from 'lucide-react';
import { SEO_CONFIG } from '../config/seo-config';

export interface Author {
  name: string;
  role: string;
  bio: string;
  avatar?: string;
  email?: string;
  socialLinks?: Array<{ platform: string; url: string }>;
  expertise?: string[];
  credentials?: string[];
}

const DEFAULT_AUTHOR: Author = {
  name: 'CreatorBoost AI Team',
  role: 'Content & Engineering Team',
  bio: 'The CreatorBoost AI team consists of content creators, developers, and SEO specialists who build and maintain free tools for creators worldwide. Our team combines expertise in web development, AI technology, and content creation to deliver high-quality, accessible tools.',
  email: SEO_CONFIG.contact.email,
  expertise: ['Content Creation', 'Web Development', 'AI Technology', 'SEO', 'Image Processing', 'PDF Tools'],
  credentials: ['50+ free tools built', '10,000+ active users', '4.8/5 user rating'],
};

interface AuthorProfileProps {
  author?: Author;
  variant?: 'compact' | 'full' | 'sidebar';
  showCredentials?: boolean;
}

export default function AuthorProfile({
  author = DEFAULT_AUTHOR,
  variant = 'compact',
  showCredentials = true,
}: AuthorProfileProps) {
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl">
        <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-primary">
            {author.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-white truncate">{author.name}</p>
          <p className="text-xs text-white/40">{author.role}</p>
        </div>
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-base font-bold text-primary">
              {author.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-white">{author.name}</p>
            <p className="text-xs text-white/40">{author.role}</p>
          </div>
        </div>
        <p className="text-xs text-white/50 leading-relaxed">{author.bio}</p>
        {showCredentials && author.expertise && (
          <div className="flex flex-wrap gap-1.5">
            {author.expertise.slice(0, 3).map((skill) => (
              <span key={skill} className="text-[10px] font-bold text-primary/60 bg-primary/5 px-2 py-0.5 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        )}
        {author.email && (
          <a
            href={`mailto:${author.email}`}
            className="flex items-center gap-2 text-xs text-white/40 hover:text-primary transition-colors"
          >
            <Mail className="w-3 h-3" /> Contact Author
          </a>
        )}
      </div>
    );
  }

  // Full variant
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 md:p-8 space-y-5">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center flex-shrink-0">
          <span className="text-xl font-bold text-primary">
            {author.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white">{author.name}</h3>
          <p className="text-sm text-primary">{author.role}</p>
          {author.email && (
            <a href={`mailto:${author.email}`} className="text-xs text-white/40 hover:text-primary transition-colors flex items-center gap-1 mt-1">
              <Mail className="w-3 h-3" /> {author.email}
            </a>
          )}
        </div>
      </div>

      <p className="text-sm text-white/50 leading-relaxed">{author.bio}</p>

      {showCredentials && author.expertise && author.expertise.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-white/60 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-3 h-3" /> Expertise
          </p>
          <div className="flex flex-wrap gap-1.5">
            {author.expertise.map((skill) => (
              <span key={skill} className="text-xs font-medium text-primary/70 bg-primary/5 border border-primary/10 px-2.5 py-1 rounded-lg">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {showCredentials && author.credentials && author.credentials.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-white/60 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3 h-3" /> Credentials
          </p>
          <ul className="space-y-1">
            {author.credentials.map((cred) => (
              <li key={cred} className="text-xs text-white/50 flex items-center gap-2">
                <span className="w-1 h-1 bg-primary rounded-full" />
                {cred}
              </li>
            ))}
          </ul>
        </div>
      )}

      {author.socialLinks && author.socialLinks.length > 0 && (
        <div className="flex gap-2 pt-2 border-t border-white/[0.06]">
          {author.socialLinks.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/40 hover:text-primary transition-colors flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" /> {link.platform}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Author schema for structured data
 */
export function authorSchema(author: Author = DEFAULT_AUTHOR) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: author.name,
    description: author.bio,
    url: SEO_CONFIG.siteUrl,
    ...(author.email ? { email: author.email } : {}),
    ...(author.socialLinks ? {
      sameAs: author.socialLinks.map(l => l.url),
    } : {}),
  };
}
