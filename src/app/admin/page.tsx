"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

// Define the benchmark fields used in the form and in the database
const benchmarkFields = [
  { name: "speed", label: "Speed" },
  { name: "cost_efficiency", label: "Cost Efficiency" },
  { name: "coding", label: "Coding" },
  { name: "reasoning", label: "Reasoning" },
];

type AdminFormState = {
  name: string;
  company: string;
  description: string;
  overall_intelligence: string;
  speed: string;
  cost_efficiency: string;
  coding: string;
  reasoning: string;
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/admin-login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800">
        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
      </div>
    );
  }
  if (status === "unauthenticated") {
    return null;
  }

  // Form state for all fields
  const [form, setForm] = useState<AdminFormState>({
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
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Server-side validation for manual add
  const validateForm = (f: AdminFormState) => {
    if (!f.name.trim() || !f.company.trim() || !f.overall_intelligence.trim()) {
      return "Please fill in all required fields (name, company, overall intelligence).";
    }
    if (isNaN(Number(f.overall_intelligence)) || Number(f.overall_intelligence) < 0 || Number(f.overall_intelligence) > 100) {
      return "Overall Intelligence must be a number between 0 and 100.";
    }
    for (const field of benchmarkFields) {
      const val = f[field.name as keyof AdminFormState];
      if (val && (isNaN(Number(val)) || Number(val) < 0 || Number(val) > 100)) {
        return `${field.label} must be a number between 0 and 100.`;
      }
    }
    return null;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    const validationError = validateForm(form);
    if (validationError) {
      setError(validationError);
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
    try {
      const { error } = await supabase.from("ai_models").insert([
        {
          name: form.name.trim(),
          company: form.company.trim(),
          benchmark_scores,
          overall_intelligence: parseFloat(form.overall_intelligence),
          description: form.description.trim(),
        },
      ]);
      if (error) {
        setError(error.message);
      } else {
        setMessage("Model added successfully!");
        setForm({ name: "", company: "", description: "", overall_intelligence: "", speed: "", cost_efficiency: "", coding: "", reasoning: "" });
      }
    } catch (err: any) {
      setError("Unexpected error: " + (err.message || err));
    }
    setLoading(false);
  };

  // Sync data from Artificial Analysis
  const handleSync = async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch("/api/scrape-artificial-analysis", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sync failed");
      setSyncMessage(`Synced! Updated ${data.updated} of ${data.total} models.`);
    } catch (e: any) {
      setSyncMessage(e.message || "Sync failed");
    }
    setSyncing(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 px-4 py-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">Admin: Add AI Model</h1>
      <button
        onClick={handleSync}
        disabled={syncing}
        aria-label="Sync data from Artificial Analysis"
        className="mb-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors disabled:opacity-60 flex items-center gap-2"
      >
        {syncing && (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
        )}
        {syncing ? "Syncing..." : "Sync Data"}
      </button>
      {syncMessage && <div className={`mb-4 text-center ${syncMessage.startsWith('Synced!') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} aria-live="polite">{syncMessage}</div>}
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
              value={form[field.name as keyof AdminFormState]}
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
          aria-label="Add AI model to leaderboard"
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          {loading && (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
          )}
          {loading ? "Adding..." : "Add Model"}
        </button>
        {message && <div className="text-green-600 dark:text-green-400 text-center mt-2" aria-live="polite">{message}</div>}
        {error && <div className="text-red-600 dark:text-red-400 text-center mt-2" aria-live="polite">{error}</div>}
      </form>
    </div>
  );
} 