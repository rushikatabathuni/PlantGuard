import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDiseaseName(disease: string): string {
  return disease
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function getConfidenceLevel(confidence: number): string {
  if (confidence >= 0.9) return "Very High"
  if (confidence >= 0.7) return "High"
  if (confidence >= 0.5) return "Medium"
  return "Low"
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.9) return "text-green-600"
  if (confidence >= 0.7) return "text-emerald-600"
  if (confidence >= 0.5) return "text-yellow-600"
  return "text-red-600"
}
