/**
 * Dynamic SEO Page Component
 * Renders different variants of the same tool for programmatic SEO
 * Routes: /tools/age-calculator, /tools/age-calculator-from-birthday, etc.
 */

import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';

// Import all tools
import AgeCalculator from './tools/AgeCalculator';
import ImageCompressor from './tools/ImageCompressor';
import PDFCompressor from './tools/PDFCompressor';
import JSONFormatter from './tools/JSONFormatter';
import Base64EncoderDecoder from './tools/Base64EncoderDecoder';
import PDFToWord from './tools/PDFToWord';
import YouTubeDownloader from './tools/YouTubeDownloader';

// Import SEO variants
import { getSEOPageVariants, AGE_CALCULATOR_VARIANTS, IMAGE_COMPRESSOR_VARIANTS, PDF_COMPRESSOR_VARIANTS } from '../config/programmatic-seo';
import { getTool } from '../config/tools-registry';
import SEOHead from './SEOHead';
import Breadcrumb from './Breadcrumb';
import { toolSoftwareSchema, toolFAQSchema } from '../lib/schema';
import { SEO_CONFIG } from '../config/seo-config';

const SITE_URL = SEO_CONFIG.siteUrl;

export default function DynamicSEOToolPage() {
  const { toolPath } = useParams<{ toolPath: string }>();

  if (!toolPath) {
    return <Navigate to="/" />;
  }

  // Find the SEO variant
  const allVariants = [
    ...AGE_CALCULATOR_VARIANTS,
    ...IMAGE_COMPRESSOR_VARIANTS,
    ...PDF_COMPRESSOR_VARIANTS,
  ];

  const variant = allVariants.find((v) => v.path === `/tools/${toolPath}`);

  if (!variant) {
    return <Navigate to="/" />;
  }

  const tool = getTool(variant.toolId);
  const canonicalUrl = `${SITE_URL}${variant.path}`;

  // Render the appropriate tool component based on toolId
  const toolComponentMap: Record<string, React.ReactNode> = {
    'age-calculator': <AgeCalculator />,
    'image-compressor': <ImageCompressor />,
    'pdf-compressor': <PDFCompressor />,
    'json-formatter': <JSONFormatter />,
    'base64-encoder-decoder': <Base64EncoderDecoder />,
    'pdf-to-word': <PDFToWord />,
    'youtube-video-downloader': <YouTubeDownloader />,
  };

  const renderToolComponent = () => {
    return toolComponentMap[variant.toolId] ?? <div className="text-white">Tool not found</div>;
  };

  const schemas = [
    tool ? toolSoftwareSchema(tool, canonicalUrl) : null,
    variant.faq && variant.faq.length > 0 ? toolFAQSchema(variant.faq) : null,
  ].filter(Boolean);

  return (
    <>
      <SEOHead
        title={variant.title}
        description={variant.description}
        keywords={variant.keywords.join(', ')}
        canonicalUrl={canonicalUrl}
        structuredData={schemas}
      />

      <div className="max-w-4xl mx-auto">
        <Breadcrumb
          items={[
            { name: 'Tools', path: '/' },
            { name: variant.h1 || variant.title, path: variant.path },
          ]}
          className="mb-6"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* SEO H1 - Important for ranking */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-black tracking-tight text-white mb-3">
            {variant.h1 || variant.title}
          </h1>

          {/* Tool Component */}
          <div className="mt-8">
            {renderToolComponent()}
          </div>

          {/* Additional SEO Content */}
          {variant.longDescription && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12"
            >
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-black tracking-tight text-white mb-4">About This Tool</h2>
                  <p className="text-sm text-white/50 leading-relaxed">{variant.longDescription}</p>
                </div>

                {/* FAQ Section */}
                {variant.faq && variant.faq.length > 0 && (
                  <div className="border-t border-white/[0.06] pt-6">
                    <h2 className="text-xl sm:text-2xl font-display font-black tracking-tight text-white mb-4">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                      {variant.faq.map((item, index) => (
                        <details key={index} className="cursor-pointer group">
                          <summary className="text-sm font-bold text-white hover:text-primary transition p-3 bg-white/[0.03] rounded-xl">
                            {item.q}
                          </summary>
                          <p className="text-xs text-white/50 mt-2 ml-3 leading-relaxed">{item.a}</p>
                        </details>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related Tools */}
                {variant.internalLinks && variant.internalLinks.length > 0 && (
                  <div className="border-t border-white/[0.06] pt-6">
                    <h2 className="text-xl sm:text-2xl font-display font-black tracking-tight text-white mb-4">Related Tools</h2>
                    <div className="flex flex-wrap gap-2">
                      {variant.internalLinks.map((link, index) => (
                        <Link
                          key={index}
                          to={link.path}
                          className="px-4 py-2 bg-white/[0.04] hover:bg-primary/20 border border-white/[0.06] text-white/60 hover:text-primary rounded-lg transition text-sm"
                        >
                          {link.text}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
}
