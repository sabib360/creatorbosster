import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/home/Hero';
import { Stats } from '@/components/home/Stats';
import { ToolCategories } from '@/components/home/ToolCategories';
import { FeatureGrid } from '@/components/home/FeatureGrid';
import { SearchBar } from '@/components/home/SearchBar';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <Sidebar />

      <div className="lg:ml-64">
        <Header />

        <main className="container mx-auto px-4 py-8 space-y-12">
          {/* Hero Section */}
          <Hero />

          {/* Search Bar */}
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search tools..."
          />

          {/* Main Description */}
          <section className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Your Complete Creator Toolkit
            </h2>
            <div className="prose prose-invert max-w-none space-y-4 text-gray-300">
              <p>
                CreatorBoost AI is a comprehensive, browser-based platform designed to help content creators,
                digital professionals, and everyday users accomplish essential tasks with powerful, easy-to-use tools.
              </p>
              <p>
                Our platform combines cutting-edge AI technology with practical utility tools to deliver results
                without requiring downloads, installations, or complicated software. All processing happens
                securely in your browser.
              </p>
              <p>
                From image optimization and PDF manipulation to AI-powered content analysis and financial
                calculations, CreatorBoost AI offers 50+ tools organized across six main categories.
              </p>
            </div>
          </section>

          {/* Stats Section */}
          <Stats />

          {/* Tool Categories */}
          <ToolCategories />

          {/* Features Grid */}
          <FeatureGrid />
        </main>

        <Footer />
      </div>
    </div>
  );
}
