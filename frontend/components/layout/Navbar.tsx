'use client';

import { useState } from 'react';
import { UserButton, SignInButton, useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { Menu, X, LayoutDashboard, History, List } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const { isSignedIn, isLoaded } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  const navLinks = [
    { name: 'Categories', href: '/categories', icon: List },
    { name: 'History', href: '/history', icon: History },
    { name: 'Summary', href: `/history/${today}`, icon: LayoutDashboard },
  ];

  return (
    <nav className="fixed top-0 w-full z-100 border-b border-white/5 bg-black">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-2 text-2xl font-black italic uppercase transition-all duration-500 tracking-tighter hover:tracking-normal"
        >
          <div className="flex items-center">
            <span className="bg-linear-to-r from-white via-white to-zinc-300 bg-clip-text text-transparent">
              Stark
            </span>
            <span className="text-red-600">Rep</span>
          </div>
        </Link>

        <div className="flex items-center gap-4 md:gap-8">
          {isLoaded && isSignedIn && (
            <>
              <nav className="hidden md:flex items-center gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-xs font-bold uppercase tracking-widest hover:text-[#ef4444] transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className="pl-4 border-l border-white/10 flex items-center gap-4">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: 'w-9 h-9 border border-[#ef4444]/50',
                    },
                  }}
                />

                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="md:hidden p-2 text-white hover:bg-zinc-900 rounded-lg transition-colors z-110"
                  aria-label="Toggle Menu"
                >
                  {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
              </div>
            </>
          )}

          {isLoaded && !isSignedIn && (
            <SignInButton mode="modal">
              <button className="bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs font-black uppercase px-6 py-2.5 rounded-sm transition-all tracking-widest active:scale-95">
                Login
              </button>
            </SignInButton>
          )}
        </div>
      </div>

      <div
        className={cn(
          'fixed inset-0 bg-black z-90 md:hidden transition-transform duration-300 ease-in-out h-screen',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col gap-2 pt-24 px-6">
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em] mb-4">
            Navigation
          </p>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between group py-6 border-b border-white/5"
            >
              <div className="flex items-center gap-4">
                <link.icon
                  className="text-red-600 group-hover:scale-110 transition-transform"
                  size={24}
                />
                <span className="text-3xl font-black uppercase italic tracking-tighter text-white group-hover:text-red-500 transition-colors">
                  {link.name}
                </span>
              </div>
              <div className="h-2 w-2 rounded-full bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
