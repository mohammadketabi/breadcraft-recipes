/**
 * Converts a human-readable time string to total minutes.
 * Handles: "45 min", "1 hour", "1h 30m", "1.5 hours", "90 minutes", "90"
 * Returns null if unparseable.
 */
export function parseTimeToMinutes(timeStr) {
  if (!timeStr) return null;
  const s = timeStr.toLowerCase().trim();
  let total = 0;

  const hourMatch = s.match(/(\d+(?:\.\d+)?)\s*h/);
  const minMatch  = s.match(/(\d+)\s*m/);

  if (hourMatch) total += Math.round(parseFloat(hourMatch[1]) * 60);
  if (minMatch)  total += parseInt(minMatch[1], 10);

  // Plain number with no unit → assume minutes
  if (!hourMatch && !minMatch) {
    const numMatch = s.match(/^\d+$/);
    if (numMatch) total = parseInt(numMatch[0], 10);
  }

  return total > 0 ? total : null;
}
