"use client";

import React, { useState } from "react";
import { supabase } from "../../../lib/supabase";

// Define the benchmark fields used in the form and in the database
const benchmarkFields = [
  { name: "speed", label: "Speed" },
  { name: "cost_efficiency", label: "Cost Efficiency" },
  { name: "coding", label: "Coding" },
  { name: "reasoning", label: "Reasoning" },
];

export default function AdminPage() {
  // Form state for all fields
  const [form, setForm] = useState({
    name: "",
    company: "",
    description: "",
    overall_intelligence: "",
    speed: "",
    cost_efficiency: "",
    coding: "",
    reasoning: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    // Validate required fields
    if (!form.name || !form.company || !form.overall_intelligence) {
      setError("Please fill in all required fields (name, company, overall intelligence).");
      setLoading(false);
      return;
    }
    // Prepare benchmark_scores JSON
    const benchmark_scores = {
      speed: form.speed ? parseFloat(form.speed) : null,
      cost_efficiency: form.cost_efficiency ? parseFloat(form.cost_efficiency) : null,
      coding: form.coding ? parseFloat(form.coding) : null,
      reasoning: form.reasoning ? parseFloat(form.reasoning) : null,
    };
    // Insert into Supabase
    const { error } = await supabase.from("ai_models").insert([
      {
        name: form.name,
        company: form.company,
        benchmark_scores,
        overall_intelligence: parseFloat(form.overall_intelligence),
        description: form.description,
      },
    ]);
    if (error) {
      setError(error.message);
    } else {
      setMessage("Model added successfully!");
      setForm({ name: "", company: "", description: "", overall_intelligence: "", speed: "", cost_efficiency: "", coding: "", reasoning: "" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 px-4 py-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">Admin: Add AI Model</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 flex flex-col gap-4">
        <label className="font-medium text-gray-700 dark:text-gray-200">
          Name<span className="text-red-500">*</span>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
          />
        </label>
        <label className="font-medium text-gray-700 dark:text-gray-200">
          Company<span className="text-red-500">*</span>
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
          />
        </label>
        <label className="font-medium text-gray-700 dark:text-gray-200">
          Overall Intelligence<span className="text-red-500">*</span>
          <input
            type="number"
            name="overall_intelligence"
            value={form.overall_intelligence}
            onChange={handleChange}
            min="0"
            max="100"
            step="0.01"
            className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
          />
        </label>
        {benchmarkFields.map((field) => (
          <label key={field.name} className="font-medium text-gray-700 dark:text-gray-200">
            {field.label}
            <input
              type="number"
              name={field.name}
              value={form[field.name as keyof typeof form]}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.01"
              className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </label>
        ))}
        <label className="font-medium text-gray-700 dark:text-gray-200">
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors disabled:opacity-60"
        >
          {loading ? "Adding..." : "Add Model"}
        </button>
        {message && <div className="text-green-600 dark:text-green-400 text-center mt-2">{message}</div>}
        {error && <div className="text-red-600 dark:text-red-400 text-center mt-2">{error}</div>}
      </form>
    </div>
  );
} 