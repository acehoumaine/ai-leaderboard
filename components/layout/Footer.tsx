"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  HeartIcon,
  GlobeAltIcon,
  ChartBarIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

interface FooterProps {
  stats?: {
    totalModels: number;
    totalCompanies: number;
    lastUpdated: string;
  };
}

export const Footer: React.FC<FooterProps> = ({ stats }) => {
  const currentYear = new Date().getFullYear();

  const links = [
    { href: '/', label: 'Leaderboard' },
    { href: '/api-info', label: 'API Documentation' },
    { href: '/about', label: 'About' },
    { href: '/methodology', label: 'Methodology' }
  ];

  const externalLinks = [
    { href: 'https://artificialanalysis.ai/', label: 'Artificial Analysis', description: 'Primary data source' },
    { href: 'https://lmarena.com/', label: 'LM Arena', description: 'Community benchmarks' }
  ];

  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <BeakerIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                AI Leaderboard
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Independent rankings and analysis of AI models based on comprehensive benchmarks and real-world performance metrics.
            </p>
            {stats && (
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <ChartBarIcon className="h-4 w-4 mr-2" />
                  {stats.totalModels} models from {stats.totalCompanies} companies
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <GlobeAltIcon className="h-4 w-4 mr-2" />
                  Last updated {stats.lastUpdated}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
              Navigation
            </h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Data Sources */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
              Data Sources
            </h3>
            <ul className="space-y-3">
              {externalLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <div className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {link.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      {link.description}
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Attribution */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
              Attribution
            </h3>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <p>
                Data provided by{' '}
                <a
                  href="https://artificialanalysis.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Artificial Analysis
                </a>
              </p>
              <p>Built for fun</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} AI Leaderboard. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
              <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};