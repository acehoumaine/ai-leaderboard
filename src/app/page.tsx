"use client";

import React, { useState } from "react";

const categories = ["All", "Coding", "Writing", "Reasoning", "Multimodal"];

const models = [
  { name: "GPT-4o", company: "OpenAI", score: 99, category: "Multimodal" },
  { name: "Claude 3 Opus", company: "Anthropic", score: 97, category: "Reasoning" },
  { name: "Gemini 1.5 Pro", company: "Google", score: 95, category: "Multimodal" },
  { name: "Llama 3 70B", company: "Meta", score: 92, category: "Reasoning" },
  { name: "Mistral Large", company: "Mistral AI", score: 89, category: "Reasoning" },
  { name: "GPT-4 Turbo", company: "OpenAI", score: 88, category: "Writing" },
  { name: "Claude 3 Sonnet", company: "Anthropic", score: 87, category: "Writing" },
  { name: "Gemini 1.0 Ultra", company: "Google", score: 85, category: "Coding" },
  { name: "Llama 2 70B", company: "Meta", score: 83, category: "Coding" },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredModels =
    selectedCategory === "All"
      ? models
      : models.filter((model) => model.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white drop-shadow-sm">
        AI Model Leaderboard
      </h1>
      <div className="mb-6 flex flex-wrap gap-3 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400
              ${selectedCategory === cat
                ? "bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:text-white"
                : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-blue-900"}
            `}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="py-4 px-6 text-sm font-semibold tracking-wide">#</th>
              <th className="py-4 px-6 text-sm font-semibold tracking-wide">Model Name</th>
              <th className="py-4 px-6 text-sm font-semibold tracking-wide">Company</th>
              <th className="py-4 px-6 text-sm font-semibold tracking-wide">Category</th>
              <th className="py-4 px-6 text-sm font-semibold tracking-wide text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {filteredModels.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 px-6 text-center text-gray-500 dark:text-gray-400">
                  No models found in this category.
                </td>
              </tr>
            ) : (
              filteredModels.map((model, idx) => (
                <tr
                  key={model.name}
                  className={
                    idx % 2 === 0
                      ? "bg-white dark:bg-gray-900"
                      : "bg-gray-50 dark:bg-gray-800"
                  }
                >
                  <td className="py-4 px-6 font-mono text-gray-500 dark:text-gray-400">{idx + 1}</td>
                  <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">{model.name}</td>
                  <td className="py-4 px-6 text-gray-700 dark:text-gray-300">{model.company}</td>
                  <td className="py-4 px-6 text-gray-700 dark:text-gray-300">{model.category}</td>
                  <td className="py-4 px-6 text-right font-bold text-blue-600 dark:text-blue-400">{model.score}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <footer className="mt-10 text-xs text-gray-500 dark:text-gray-400 text-center">
        &copy; {new Date().getFullYear()} AI Leaderboard. All rights reserved.
      </footer>
    </div>
  );
}
