import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  InformationCircleIcon,
  Cog6ToothIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Button } from '../ui/Button';

interface HeaderProps {
  currentPath?: string;
}

export const Header: React.FC<HeaderProps> = ({ currentPath = '/' }) => {
  const navItems = [
    { href: '/', icon: ChartBarIcon, label: 'Leaderboard', active: currentPath === '/' },
    { href: '/api-info', icon: InformationCircleIcon, label: 'API', active: currentPath === '/api-info' },
    { href: '/admin', icon: Cog6ToothIcon, label: 'Admin', active: currentPath === '/admin' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg"
            >
              <BeakerIcon className="h-6 w-6 text-white" />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                AI Leaderboard
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                Independent AI Model Rankings
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map(({ href, icon: Icon, label, active }) => (
              <Link key={href} href={href}>
                <Button
                  variant={active ? 'secondary' : 'ghost'}
                  size="sm"
                  leftIcon={<Icon className="h-4 w-4" />}
                  className={active ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : ''}
                >
                  {label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Theme Toggle */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <nav className="flex items-center justify-around py-2">
          {navItems.map(({ href, icon: Icon, label, active }) => (
            <Link key={href} href={href} className="flex-1">
              <button
                className={`w-full flex flex-col items-center space-y-1 py-2 px-1 text-xs font-medium transition-colors ${
                  active
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </button>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};