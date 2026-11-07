'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { Menu, X, Sun, Moon, FileText, LayoutGrid, Home, Sparkles } from 'lucide-react';

const navItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'My Resumes', href: '/my-resumes', icon: LayoutGrid },
  { label: 'Builder', href: '/resume-builder', icon: FileText },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement?.classList?.add('dark');
    } else {
      document.documentElement?.classList?.remove('dark');
    }
  }, [dark]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-card/90 backdrop-blur-xl border-b border-border shadow-card'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-16 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 hover-lift">
          <AppLogo size={36} />
          <span className="font-bold text-xl tracking-tight text-foreground hidden sm:block">
            ResumeForge
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems?.map((item) => {
            const isActive = pathname === item?.href || (item?.href !== '/' && pathname?.startsWith(item?.href));
            return (
              <Link
                key={`nav-${item?.href}`}
                href={item?.href}
                className={`nav-link flex items-center gap-1.5 ${isActive ? 'nav-link-active' : ''}`}
              >
                <item.icon size={15} />
                {item?.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDark(!dark)}
            className="btn-ghost p-2 rounded-lg"
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link href="/resume-builder" className="hidden sm:flex btn-primary gap-1.5">
            <Sparkles size={15} />
            Build Resume
          </Link>

          <button
            className="md:hidden btn-ghost p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-card border-t border-border animate-slide-down">
          <nav className="max-w-screen-2xl mx-auto px-6 py-4 flex flex-col gap-1">
            {navItems?.map((item) => {
              const isActive = pathname === item?.href || (item?.href !== '/' && pathname?.startsWith(item?.href));
              return (
                <Link
                  key={`mobile-nav-${item?.href}`}
                  href={item?.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive ? 'bg-secondary text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <item.icon size={16} />
                  {item?.label}
                </Link>
              );
            })}
            <Link
              href="/resume-builder"
              onClick={() => setMenuOpen(false)}
              className="btn-primary mt-2 justify-center"
            >
              <Sparkles size={15} />
              Build Resume
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}