const stats = [
  {
    label: 'Content Pieces',
    value: '50K+',
    description: 'Titles, descriptions, thumbnails',
    icon: '📄',
    color: 'from-blue-500 to-blue-600'
  },
  {
    label: 'Active Users',
    value: '10K+',
    description: 'Growing every month',
    icon: '👥',
    color: 'from-purple-500 to-purple-600'
  },
  {
    label: 'Views Influenced',
    value: '500M+',
    description: 'Content optimized with our tools',
    icon: '👁️',
    color: 'from-cyan-500 to-cyan-600'
  },
  {
    label: 'User Rating',
    value: '4.8/5',
    description: 'Based on 1000+ reviews',
    icon: '⭐',
    color: 'from-yellow-500 to-orange-500'
  }
];

export function Stats() {
  return (
    <section className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
      <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Trusted by Creators Worldwide
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center
                       hover:border-gray-600 hover:shadow-lg transition-all duration-300
                       hover:-translate-y-1"
          >
            <div className="text-4xl mb-3 inline-block">{stat.icon}</div>
            <div className={`text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {stat.value}
            </div>
            <div className="text-gray-200 font-semibold mb-1">{stat.label}</div>
            <div className="text-gray-500 text-sm">{stat.description}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
