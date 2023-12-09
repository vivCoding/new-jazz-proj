// who tf cares abt time zones
export function normalizeDate(d: Date) {
  return new Date(d.toISOString().substring(0, 10))
}
