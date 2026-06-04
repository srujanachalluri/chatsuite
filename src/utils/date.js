// Helpers for grouping messages by day in chat views.

function toDate(ts) {
  if (!ts) return null;
  if (typeof ts.toDate === 'function') return ts.toDate();
  if (ts instanceof Date) return ts;
  return null;
}

// Stable key used to detect day boundaries between consecutive messages.
export function dayKey(ts) {
  const d = toDate(ts);
  return d ? d.toDateString() : null;
}

// Human label for a date separator: "Today", "Yesterday", or a full date.
export function dayLabel(ts) {
  const d = toDate(ts);
  if (!d) return '';

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';

  return d.toLocaleDateString([], {
    month: 'long',
    day: 'numeric',
    ...(d.getFullYear() !== today.getFullYear() ? { year: 'numeric' } : {}),
  });
}
