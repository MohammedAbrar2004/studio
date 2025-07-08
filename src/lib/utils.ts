import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const copyToClipboard = async (text: string) => {
  if (!navigator.clipboard) {
    // Fallback for older browsers
    return Promise.reject('Clipboard API not available');
  }
  return navigator.clipboard.writeText(text);
};

export const downloadFile = (content: string, filename: string, mimeType: string = 'text/plain') => {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
