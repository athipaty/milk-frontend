export function timeAgo(date) {
  const diffMs = Date.now() - new Date(date);
  const mins = Math.floor(diffMs / 60000);

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;

  const h = Math.floor(mins / 60);
  return `${h}h ago`;
}
