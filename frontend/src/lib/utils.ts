import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string): string {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString?: string): string {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}

export function getSentimentBadge(sentiment?: string | null): {
  label: string;
  className: string;
  dotColor: string;
} {
  const normalized = (sentiment || "").toLowerCase();
  if (normalized.includes("positive") || normalized.includes("good")) {
    return {
      label: "Positive",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60",
      dotColor: "bg-emerald-500",
    };
  }
  if (normalized.includes("negative") || normalized.includes("bad") || normalized.includes("risk")) {
    return {
      label: "Negative",
      className: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/60",
      dotColor: "bg-rose-500",
    };
  }
  return {
    label: sentiment || "Neutral",
    className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60",
    dotColor: "bg-amber-500",
  };
}
