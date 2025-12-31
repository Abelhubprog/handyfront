import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { View } from '../types';

export const PublicLayout = ({ children, setView }: { children?: React.ReactNode, setView: (v: View) => void }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-serif font-bold text-xl">H</span>
            </div>
            <span className="font-semibold tracking-tight text-lg">HandyWriterz</span>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500">
            <a href="#" className="hover:text-zinc-900 transition-colors">Services</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">How it Works</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Pricing</a>
            <a href="#" onClick={() => setView('article')} className="hover:text-zinc-900 transition-colors">Blog</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setView('portal-dashboard')}>Log in</Button>
            <Button size="sm" onClick={() => setView('portal-dashboard')}>Get Started</Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-zinc-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-zinc-100 p-4 shadow-xl flex flex-col gap-4 animate-in slide-in-from-top-2">
            <a href="#" className="text-sm font-medium p-2 hover:bg-zinc-50 rounded-lg">Services</a>
            <a href="#" className="text-sm font-medium p-2 hover:bg-zinc-50 rounded-lg">How it Works</a>
            <a href="#" className="text-sm font-medium p-2 hover:bg-zinc-50 rounded-lg">Pricing</a>
            <Button className="w-full justify-center" onClick={() => {
                setIsMobileMenuOpen(false);
                setView('portal-dashboard');
            }}>Log In</Button>
          </div>
        )}
      </header>
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
};
