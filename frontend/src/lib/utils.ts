import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string | null): string {
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

export function formatDateTime(dateString?: string | null): string {
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
      className: "bg-[#FAF4E8] text-[#9A6F27] border-[#C9953E]/30",
      dotColor: "bg-[#C9953E]",
    };
  }
  if (normalized.includes("negative") || normalized.includes("bad") || normalized.includes("risk")) {
    return {
      label: "Negative",
      className: "bg-[#F7EDED] text-[#7A171C] border-[#7A171C]/20",
      dotColor: "bg-[#7A171C]",
    };
  }
  return {
    label: sentiment || "Neutral",
    className: "bg-[#FAF8F4] text-[#6F6A65] border-[#E8E1D8]",
    dotColor: "bg-[#A39D97]",
  };
}
