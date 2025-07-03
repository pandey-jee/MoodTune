import { Music } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <Music className="text-white h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">MoodSync</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#journal" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">
              Journal
            </a>
            <a href="#insights" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">
              Insights
            </a>
            <a href="#playlists" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">
              My Playlists
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
              <span className="text-slate-600 text-sm">👤</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
