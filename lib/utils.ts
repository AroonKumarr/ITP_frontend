import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Shortens a string by keeping the start and end and replacing the middle with "…"
 * @param str string to shorten
 * @param startChars number of characters to keep at the start
 * @param endChars number of characters to keep at the end
 * @returns shortened string
 */
export function ellipsisMiddle(str: string, startChars: number, endChars: number) {
  if (!str) return "";
  if (str.length <= startChars + endChars) return str;
  return `${str.slice(0, startChars)}…${str.slice(str.length - endChars)}`;
}
