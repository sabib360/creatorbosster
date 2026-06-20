import { Link } from 'react-router-dom';

const categories = [
  {
    title: 'Image Tools',
    description: 'Compress, resize, crop, and convert images',
    icon: '🖼️',
    tools: [
      'Compress Image',
      'Resize Image',
      'Crop Image',
      'Rotate/Flip',
      'Passport Size',
      'Add Watermark'
    ],
    color: 'from-blue-500 to-blue-600',
    href: '/image-tools'
  },
  {
    title: 'PDF Tools',
    description: 'Merge, split, convert, and optimize PDFs',
    icon: '📄',
    tools: [
      'Merge PDF',
      'Split PDF',
      'PDF to Word',
      'Word to PDF',
      'Compress PDF',
      'PDF to Excel'
    ],
    color: 'from-purple-500 to-purple-600',
    href: '/pdf-tools'
  },
  {
    title: 'AI Tools',
    description: 'AI-powered content generation and analysis',
    icon: '🤖',
    tools: [
      'AI Writing Assistant',
      'AI Image Analysis',
      'AI Caption Writer',
      'AI Thumbnail Generator',
      'AI Summarizer',
      'AI Paraphraser'
    ],
    color: 'from-pink-500 to-pink-600',
    href: '/ai-tools'
  }
];

export function ToolCategories() {
  return (
    <section className="space-y-8">
      {categories.map((category, index) => (
        <div key={index} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center text-xl`}>
                {category.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-100">{category.title}</h3>
                <p className="text-gray-400 text-sm">{category.description}</p>
              </div>
            </div>
            <Link
              to={category.href}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1 transition-colors"
            >
              View All
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {category.tools.map((tool, toolIndex) => (
              <Link
                key={toolIndex}
                to={`${category.href}/${tool.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg
                           hover:bg-gray-800 hover:border-gray-700 border border-transparent
                           transition-all duration-200 group"
              >
                <span className="text-gray-300 group-hover:text-gray-100">{tool}</span>
                <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
