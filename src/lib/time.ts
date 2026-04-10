/**
 * Utility function to convert a date string or timestamp into a relative "time ago" string.
 * Example: "JUST NOW", "2M AGO", "5H AGO", "3 DAYS AGO"
 */
export function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "JUST NOW";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}M AGO`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}H AGO`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} DAYS AGO`;

  return date.toLocaleDateString([], { month: 'short', day: 'numeric' }).toUpperCase();
}

/**
 * Categorize dates for grouping in lists.
 */
export function getDateCategory(dateString: string): "TODAY" | "YESTERDAY" | "EARLIER" {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "TODAY";
  if (date.toDateString() === yesterday.toDateString()) return "YESTERDAY";
  return "EARLIER";
}
