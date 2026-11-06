// The backend supplies location activity, not foreground online presence.
export const MAP_ACTIVITY_WINDOW_MS = 60 * 60 * 1000;
export function recentMapRows(rows = [], now = Date.now()) {
  return rows.filter(row => {
    const timestamp = row.updated_at ? Date.parse(row.updated_at) : NaN;
    const age = now - timestamp;
    return Number.isFinite(timestamp) && age >= 0 && age <= MAP_ACTIVITY_WINDOW_MS;
  });
}
