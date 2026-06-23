export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-gray-950 border-b border-gray-800" style={{ WebkitBackdropFilter: 'none', backdropFilter: 'none' }}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              CreatorBoost AI
            </h1>
          </div>
        </div>

        <p className="text-center text-gray-400 mt-4 text-sm md:text-base">
          All-in-one toolkit for creators. Process images, PDFs, and leverage AI — all in your browser.
        </p>
      </div>
    </header>
  );
}
