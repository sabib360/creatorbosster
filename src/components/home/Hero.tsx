import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 }
};

export function Hero() {
  return (
    <section className="relative text-center py-12 sm:py-16">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent rounded-3xl" />
      <motion.div variants={itemVariants} className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20">
          <Sparkles className="w-8 h-8 text-white fill-white" />
        </div>
      </motion.div>
      <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white mb-4">
        CreatorBoost AI
      </motion.h1>
      <motion.p variants={itemVariants} className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
        All-in-one toolkit for creators. Process images, PDFs, and leverage AI — all in your browser.
      </motion.p>
    </section>
  );
}
