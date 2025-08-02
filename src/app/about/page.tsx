import React from 'react';
import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950">
      <Header currentPath="/about" />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-2xl flex flex-col items-center justify-center">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">About AI Leaderboard</h1>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 w-full space-y-4 border border-gray-100 dark:border-gray-800">
          <p className="text-gray-700 dark:text-gray-300">
            Hi! I'm <span className="font-semibold">Ayoub HOUMAINE</span>, a sales professional in the tech industry with an engineering background.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            If you want to chat, suggest improvements, or just say hi, you can find me on LinkedIn:
            <a
              href="https://www.linkedin.com/in/ayoub-houmaine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
            >
              ayoub-houmaine
            </a>
            . That's the best place to reach me.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            This site is built for fun and learning, and is not affiliated with any company or organization. All data is sourced from public benchmarks and community contributions.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Thanks for stopping by! 🚀
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
} 