"use client";

import Link from "next/link";

export default function ApiInfoPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 px-4 py-12">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 max-w-lg w-full flex flex-col items-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-gray-900 dark:text-white">API & Data Sources</h1>
        <p className="mb-4 text-gray-700 dark:text-gray-200 text-center text-sm sm:text-base">
          This leaderboard aggregates data from independent sources to help you compare AI models with confidence.<br />
          We thank <a href="https://artificialanalysis.ai/" target="_blank" rel="noopener noreferrer" className="underline text-blue-600 dark:text-blue-400">Artificial Analysis</a> and <a href="https://lmarena.com/" target="_blank" rel="noopener noreferrer" className="underline text-blue-600 dark:text-blue-400">LM Arena</a> for their valuable contributions.
        </p>
        <div className="mb-4 text-gray-700 dark:text-gray-200 text-center text-sm sm:text-base">
          <strong>Public API coming soon!</strong>
        </div>
        <Link href="/" className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition-colors shadow text-center text-xs sm:text-sm">Back to Leaderboard</Link>
      </div>
    </div>
  );
} 