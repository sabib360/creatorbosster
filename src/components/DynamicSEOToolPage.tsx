/**
 * Dynamic SEO Page Component
 * Renders different variants of the same tool for programmatic SEO
 * Routes: /tools/age-calculator, /tools/age-calculator-from-birthday, etc.
 */

import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

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

  // Get tool info (for future extension; currently only used for existence checks)
  const tool = getTool(variant.toolId);


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


  return (
    <>
      <Helmet>
        <title>{variant.title}</title>
        <meta name="description" content={variant.description} />
        <meta name="keywords" content={variant.keywords.join(', ')} />
        <meta property="og:title" content={variant.title} />
        <meta property="og:description" content={variant.description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={variant.title} />
        <meta name="twitter:description" content={variant.description} />
        <link rel="canonical" href={`https://creatorboost.ai${variant.path}`} />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* SEO H1 - Important for ranking */}
        <h1 className="sr-only">{variant.h1}</h1>

        {/* Tool Component */}
        {renderToolComponent()}

        {/* Additional SEO Content */}
        {variant.longDescription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 max-w-4xl mx-auto px-4"
          >
            <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">About This Tool</h2>
                <p className="text-gray-300 leading-relaxed">{variant.longDescription}</p>
              </div>

              {/* FAQ Section */}
              {variant.faq && variant.faq.length > 0 && (
                <div className="border-t border-slate-700 pt-6">
                  <h3 className="text-xl font-bold text-white mb-4">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                    {variant.faq.map((item, index) => (
                      <details key={index} className="cursor-pointer group">
                        <summary className="font-semibold text-white hover:text-primary transition">
                          {item.q}
                        </summary>
                        <p className="text-gray-400 mt-2 text-sm leading-relaxed">{item.a}</p>
                      </details>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Tools */}
              {variant.internalLinks && variant.internalLinks.length > 0 && (
                <div className="border-t border-slate-700 pt-6">
                  <h3 className="text-xl font-bold text-white mb-4">Related Tools</h3>
                  <div className="flex flex-wrap gap-2">
                    {variant.internalLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.path}
                        className="px-4 py-2 bg-slate-700/50 hover:bg-primary/20 border border-slate-600 text-gray-300 hover:text-primary rounded-lg transition"
                      >
                        {link.text}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </>
  );
}
