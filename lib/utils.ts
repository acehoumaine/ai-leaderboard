import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number | undefined | null, decimals = 1): string {
  if (value === undefined || value === null || isNaN(value)) {
    return "N/A";
  }
  return Number(value).toFixed(decimals);
}

export function formatPercentage(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) {
    return "N/A";
  }
  return `${(value * 100).toFixed(1)}%`;
}

export function formatCurrency(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) {
    return "N/A";
  }
  return `$${value.toFixed(3)}`;
}

export function formatSpeed(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) {
    return "N/A";
  }
  return `${value.toFixed(1)} tok/s`;
}

export function formatLatency(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) {
    return "N/A";
  }
  return `${value.toFixed(1)}s`;
}

export function formatRelativeTime(date: string | undefined | null): string {
  if (!date) return "Unknown";
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return "Unknown";
  }
}

export function getScoreColor(score: number | undefined | null, max = 100): string {
  if (score === undefined || score === null || isNaN(score)) {
    return "text-gray-400";
  }

  const percentage = (score / max) * 100;
  if (percentage >= 90) return "text-emerald-600";
  if (percentage >= 80) return "text-green-600";
  if (percentage >= 70) return "text-blue-600";
  if (percentage >= 60) return "text-yellow-600";
  if (percentage >= 50) return "text-orange-600";
  return "text-red-600";
}

export function getScoreBadgeColor(score: number | undefined | null, max = 100): string {
  if (score === undefined || score === null || isNaN(score)) {
    return "bg-gray-100 text-gray-600";
  }

  const percentage = (score / max) * 100;
  if (percentage >= 90) return "bg-emerald-100 text-emerald-800";
  if (percentage >= 80) return "bg-green-100 text-green-800";
  if (percentage >= 70) return "bg-blue-100 text-blue-800";
  if (percentage >= 60) return "bg-yellow-100 text-yellow-800";
  if (percentage >= 50) return "bg-orange-100 text-orange-800";
  return "bg-red-100 text-red-800";
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  
  // Fallback for older browsers
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
  return Promise.resolve();
}

export function getCompanyColor(company: string): string {
  const colors: Record<string, string> = {
    "OpenAI": "bg-green-100 text-green-800",
    "Anthropic": "bg-orange-100 text-orange-800",
    "Google": "bg-blue-100 text-blue-800",
    "Meta": "bg-blue-100 text-blue-800",
    "Microsoft": "bg-cyan-100 text-cyan-800",
    "Mistral": "bg-purple-100 text-purple-800",
    "Cohere": "bg-indigo-100 text-indigo-800",
    "xAI": "bg-gray-100 text-gray-800",
    "DeepSeek": "bg-teal-100 text-teal-800",
    "Z AI": "bg-slate-100 text-slate-800",
  };

  return colors[company] || "bg-gray-100 text-gray-800";
}