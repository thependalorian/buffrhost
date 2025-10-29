'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

/**
 * Navigation Component
 * 
 * Fixed navigation header with scroll effects and mobile menu
 * Location: components/landing/Navigation.tsx
 * Features: Scroll detection, mobile responsive, brand logo
 */

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, onClick, className = '' }) => (
  <a
    href={href}
    onClick={onClick}
    className={`text-nude-700 hover:text-nude-600 font-medium transition-colors ${className}`}
  >
    {children}
  </a>
);

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className = '' }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-medium transition-colors ${className}`}
  >
    {children}
  </button>
);

interface NavigationProps {
  onStartTrial: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onStartTrial }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-lg shadow-luxury-soft"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-nude-600 to-nude-700 rounded-xl flex items-center justify-center shadow-luxury-soft">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <span className="text-2xl font-display font-bold text-nude-900">
              Buffr Host
            </span>
          </a>
          <div className="hidden md:flex items-center space-x-10">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/hotels">Hotels</NavLink>
            <NavLink href="/restaurants">Restaurants</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/contact">Contact</NavLink>
            <NavLink href="/privacy">Privacy</NavLink>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Button
              onClick={onStartTrial}
              className="bg-nude-600 hover:bg-nude-700 text-white px-6 py-2 rounded-full shadow-luxury-soft hover:shadow-luxury-medium transition-all duration-300"
            >
              Start 3-Month Free Trial
            </Button>
          </div>
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-nude-700 hover:text-nude-600"
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-white rounded-2xl shadow-luxury-soft p-6 border border-nude-100">
            <NavLink href="/" onClick={() => setIsMenuOpen(false)} className="block py-3 text-lg">
              Home
            </NavLink>
            <NavLink href="/hotels" onClick={() => setIsMenuOpen(false)} className="block py-3 text-lg">
              Hotels
            </NavLink>
            <NavLink href="/restaurants" onClick={() => setIsMenuOpen(false)} className="block py-3 text-lg">
              Restaurants
            </NavLink>
            <NavLink href="/about" onClick={() => setIsMenuOpen(false)} className="block py-3 text-lg">
              About
            </NavLink>
            <NavLink href="/contact" onClick={() => setIsMenuOpen(false)} className="block py-3 text-lg">
              Contact
            </NavLink>
            <NavLink href="/privacy" onClick={() => setIsMenuOpen(false)} className="block py-3 text-lg">
              Privacy
            </NavLink>
            <div className="pt-4 mt-4 border-t border-nude-200">
              <Button
                onClick={() => {
                  onStartTrial();
                  setIsMenuOpen(false);
                }}
                className="w-full bg-nude-600 hover:bg-nude-700 text-white rounded-full"
              >
                Start 3-Month Free Trial
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
