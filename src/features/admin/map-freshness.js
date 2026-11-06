// Activity is based on the last location update, not foreground presence.
export const MAP_WINDOWS = [15, 30, 60, 120, 360, 720, 1440, 10080, 43200, 0];
export function mapWindowMinutes(value) {
  const minutes = Number(value);
  return MAP_WINDOWS.includes(minutes) ? minutes : 60;
}
export function recentMapRows(rows = [], now = Date.now(), minutes = 60) {
  const window = mapWindowMinutes(minutes);
  return rows.filter(row => {
    const timestamp = row.updated_at ? Date.parse(row.updated_at) : NaN;
    const age = now - timestamp;
    return Number.isFinite(timestamp) && age >= 0 && (window === 0 || age <= window * 60000);
  });
}
