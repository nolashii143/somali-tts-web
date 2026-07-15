export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatDuration(ms?: number) {
  if (!ms) return "—";
  return `${(ms / 1000).toFixed(1)}s`;
}
