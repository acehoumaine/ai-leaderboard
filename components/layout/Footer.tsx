"use client";

import React from 'react';
import Link from 'next/link';
import { BeakerIcon } from '@heroicons/react/24/outline';

interface FooterProps {
  stats?: {
    totalModels: number;
    totalCompanies: number;
    lastUpdated: string;
  };
}

export const Footer: React.FC<FooterProps> = ({ stats }) => {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { href: '/', label: 'Leaderboard' },
    { href: '/methodology', label: 'Methodology' },
    { href: '/api-info', label: 'API' },
    { href: '/about', label: 'About' },
  ];

  return (
    <footer className="border-t border-gray-200 bg-white mt-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between gap-8">
          {/* Brand */}
          <div className="space-y-2 max-w-xs">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md">
                <BeakerIcon className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-900">AI Leaderboard</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Independent rankings based on standardized benchmarks.
              Data sourced from{' '}
              <a
                href="https://artificialanalysis.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Artificial Analysis
              </a>.
            </p>
            {stats && (
              <p className="text-xs text-gray-400">
                {stats.totalModels} models · {stats.totalCompanies} companies · updated {stats.lastUpdated}
              </p>
            )}
          </div>

          {/* Links */}
          <div className="flex gap-12">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Site</p>
              <ul className="space-y-1.5">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Legal</p>
              <ul className="space-y-1.5">
                <li>
                  <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            © {currentYear} AI Leaderboard. Built for fun.
          </p>
        </div>
      </div>
    </footer>
  );
};
