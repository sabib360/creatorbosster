import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Image as ImageIcon, FileText, Bot,
  Calculator, Hash, BookOpen, X, Sparkles, LogIn, LogOut, User
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard, path: '/' },
  { id: 'image-tools', label: 'Image Tools', icon: ImageIcon, path: '/image-tools' },
  { id: 'pdf-tools', label: 'PDF Tools', icon: FileText, path: '/pdf-tools' },
  { id: 'ai-tools', label: 'AI Tools', icon: Bot, path: '/ai-tools' },
  { id: 'finance-tools', label: 'Finance Tools', icon: Calculator, path: '/finance-tools' },
  { id: 'social-media-tools', label: 'Social Media', icon: Hash, path: '/social-media-tools' },
  { id: 'how-to-use', label: 'How to Use', icon: BookOpen, path: '/how-to-use' },
] as const;

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, login, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[60] lg:hidden backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-gray-950/95 backdrop-blur-xl border-r border-gray-800/60 z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        aria-label="Sidebar navigation"
      >
        {/* Logo */}
        <div className="px-5 py-5 flex items-center gap-3 border-b border-gray-800/50">
          <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="font-display font-bold text-base tracking-tight text-white truncate">CreatorBoost AI</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-hide" role="navigation" aria-label="Main navigation">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-2 px-3 pt-1">Menu</div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.id}
                to={item.path}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group ${isActive ? 'bg-blue-500/10 text-blue-400 font-medium border border-blue-500/20' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
              >
                <item.icon className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${isActive ? 'text-blue-400' : 'text-gray-600 group-hover:text-gray-400'}`} />
                <span className="truncate">{item.label}</span>
                {isActive && (
                  <motion.div layoutId="active-nav" className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 mt-auto border-t border-gray-800/50">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {profile?.photoURL ? (
                  <img src={profile.photoURL} alt={profile.displayName || 'User'} className="w-9 h-9 rounded-lg border border-gray-800 object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
                    <User className="w-4 h-4 text-gray-500" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate text-white">{profile?.displayName || 'User'}</div>
                  <div className="text-[10px] font-medium text-blue-400/80">{profile?.role || 'User'}</div>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-gray-500 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all"
                aria-label="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-all"
              aria-label="Login"
            >
              <LogIn className="w-4 h-4" />
              Login
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Toggle Button (exported for Header use) */}
      <button
        className="lg:hidden fixed top-3 left-3 z-[80] p-2 bg-gray-900 border border-gray-800 rounded-lg"
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation menu"
        id="sidebar-toggle"
        style={{ display: 'none' }}
      />
    </>
  );
}
