// Safe date conversion helpers
export function toDateSafe(value) {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  if (typeof value === 'number') return new Date(value);
  if (typeof value === 'string') {
    const d = new Date(value);
    return isNaN(d.getTime()) ? new Date() : d;
  }
  if (typeof value.toDate === 'function') {
    try {
      const d = value.toDate();
      if (d instanceof Date && !isNaN(d.getTime())) return d;
    } catch (e) {
      // fallthrough
    }
  }
  // Fallback
  return new Date();
}

export function toNumberSafe(value) {
  const d = toDateSafe(value);
  return d.getTime();
}
