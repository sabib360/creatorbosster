import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Eraser, Eye, Bot } from 'lucide-react';

const tools = [
  { name: 'PDF Summarizer', path: '/tools/pdf-summarizer', description: 'AI-powered PDF content extraction and summarization', icon: FileText },
  { name: 'Background Remover', path: '/tools/background-remover', description: 'Automatically remove image backgrounds with AI', icon: Eraser },
  { name: 'Image Analyzer', path: '/tools/image-analyzer', description: 'Intelligent image description and metadata extraction', icon: Eye },
  { name: 'AI Assistant', path: '/tools/ai-assistant', description: 'General-purpose AI chat for task assistance', icon: Bot },
];

export default function AITools() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter text-ink">
          AI Tools
        </h1>
        <p className="text-xl text-ink/60 max-w-2xl mx-auto">
          Leverage Google Gemini AI for intelligent document and image processing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={tool.path}
              className="group block p-8 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-tertiary/50 transition-all duration-300"
            >
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-tertiary/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-tertiary/20 transition-colors">
                  <tool.icon className="w-8 h-8 text-tertiary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-ink group-hover:text-tertiary transition-colors">
                      {tool.name}
                    </h3>
                    <ArrowRight className="w-6 h-6 text-ink/40 group-hover:text-tertiary group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-base text-ink/60 mt-3">{tool.description}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* AI Features Info */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-12 p-8 bg-gradient-to-r from-tertiary/10 via-tertiary/5 to-transparent border border-tertiary/20 rounded-3xl"
      >
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-tight text-ink">
            Powered by Google Gemini AI
          </h2>
          <p className="text-ink/60 max-w-2xl mx-auto">
            Our AI tools use Google's advanced Gemini 1.5/2.0 models to provide intelligent processing capabilities. 
            All AI processing is done securely through the Gemini API.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}