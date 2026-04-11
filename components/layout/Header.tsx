"use client";

import React from 'react';
import Link from 'next/link';
import { BeakerIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  currentPath?: string;
}

export const Header: React.FC<HeaderProps> = ({ currentPath = '/' }) => {
  const navItems = [
    { href: '/', label: 'Leaderboard', active: currentPath === '/' },
    { href: '/methodology', label: 'Methodology', active: currentPath === '/methodology' },
    { href: '/api-info', label: 'API', active: currentPath === '/api-info' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-sm">
              <BeakerIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">
              AI Leaderboard
            </span>
          </Link>

          <nav className="flex items-center space-x-1">
            {navItems.map(({ href, label, active }) => (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  active
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};
