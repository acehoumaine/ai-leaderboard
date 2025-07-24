import React from 'react';
import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950">
      <Header currentPath="/terms" />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-2xl flex flex-col items-center justify-center">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">Terms of Service</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            By using AI Leaderboard, you agree to the following terms:
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 w-full space-y-4 border border-gray-100 dark:border-gray-800">
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li>The information provided is for general informational purposes only.</li>
            <li>We do our best to ensure accuracy, but cannot guarantee it at all times.</li>
            <li>Use of this site is at your own risk. We are not liable for any damages or losses.</li>
            <li>We may update these terms at any time without notice.</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300">
            If you have questions about these terms, please contact us.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
} 