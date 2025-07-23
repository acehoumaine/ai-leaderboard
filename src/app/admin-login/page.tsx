"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

export default function AdminLogin() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (status === "authenticated") {
      router.replace("/admin");
    }
  }, [status, router]);

  React.useEffect(() => {
    if (searchParams.get("error")) {
      setError("Invalid credentials");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
      callbackUrl: "/admin",
    });
    if (res?.error) {
      setError("Invalid credentials");
    } else {
      router.replace("/admin");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 px-4 py-12">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">Admin Login</h1>
        <label className="font-medium text-gray-700 dark:text-gray-200">
          Username
          <input
            type="text"
            name="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
            autoFocus
          />
        </label>
        <label className="font-medium text-gray-700 dark:text-gray-200">
          Password
          <input
            type="password"
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          {loading && (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
          )}
          {loading ? "Signing in..." : "Sign In"}
        </button>
        {error && <div className="text-red-600 dark:text-red-400 text-center mt-2" aria-live="polite">{error}</div>}
      </form>
    </div>
  );
}
