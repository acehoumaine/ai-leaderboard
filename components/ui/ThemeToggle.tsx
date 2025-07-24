import React from 'react';
import { motion } from 'framer-motion';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../lib/hooks/useTheme';
import { Button } from './Button';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { key: 'light', icon: SunIcon, label: 'Light' },
    { key: 'dark', icon: MoonIcon, label: 'Dark' },
    { key: 'system', icon: ComputerDesktopIcon, label: 'System' }
  ] as const;

  return (
    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      {themes.map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          onClick={() => setTheme(key)}
          className={`relative px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            theme === key
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
          aria-label={`Switch to ${label} theme`}
        >
          {theme === key && (
            <motion.div
              layoutId="theme-indicator"
              className="absolute inset-0 bg-white dark:bg-gray-700 rounded-md shadow-sm"
              initial={false}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <div className="relative flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export const SimpleThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: resolvedTheme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {resolvedTheme === 'dark' ? (
          <SunIcon className="h-4 w-4" />
        ) : (
          <MoonIcon className="h-4 w-4" />
        )}
      </motion.div>
    </Button>
  );
};