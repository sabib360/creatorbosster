import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Combine, Scissors, Trash2, RotateCw, FileText, Minimize2, Image, FileInput } from 'lucide-react';
import SEOHead, { categorySEOData } from './SEOHead';

const tools = [
  { name: 'Merge PDF', path: '/tools/pdf-merger', description: 'Combine multiple PDFs into one document', icon: Combine },
  { name: 'Split PDF', path: '/tools/pdf-splitter', description: 'Extract pages from PDF files', icon: Scissors },
  { name: 'Remove Pages', path: '/tools/pdf-remover', description: 'Delete specific pages from PDF', icon: Trash2 },
  { name: 'Rotate PDF', path: '/tools/pdf-rotator', description: 'Change PDF page orientation', icon: RotateCw },
  { name: 'PDF Converter', path: '/tools/pdf-converter', description: 'Convert Word, Excel, PPT to PDF and vice versa', icon: FileText },
  { name: 'Compress PDF', path: '/tools/pdf-compressor', description: 'Reduce PDF file size', icon: Minimize2 },
  { name: 'PDF to JPG', path: '/tools/pdf-to-jpg', description: 'Convert PDF pages to images', icon: Image },
  { name: 'JPG to PDF', path: '/tools/jpg-to-pdf', description: 'Convert images to PDF document', icon: FileInput },
];

export default function PDFTools() {
  return (
    <>
      <SEOHead 
        title={categorySEOData['pdf-tools'].title}
        description={categorySEOData['pdf-tools'].description}
        keywords={categorySEOData['pdf-tools'].keywords}
        canonicalUrl="https://creatorboostai.xyz/pdf-tools"
        structuredData={categorySEOData['pdf-tools'].structuredData}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter text-ink">
          PDF Tools
        </h1>
        <p className="text-xl text-ink/60 max-w-2xl mx-auto">
          Merge, split, convert, compress, and organize your PDF files - all processed locally.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={tool.path}
              className="group block p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-secondary/50 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-colors">
                  <tool.icon className="w-6 h-6 text-secondary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-ink group-hover:text-secondary transition-colors">
                      {tool.name}
                    </h3>
                    <ArrowRight className="w-5 h-5 text-ink/40 group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-sm text-ink/60 mt-2">{tool.description}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
    </>
  );
}