const LOCALE = 'es-CL';

/** "2026-09-29T10:00:00" -> "mar 29-09-2026, 10:00" */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(LOCALE, {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** "2026-09-29T10:00:00" -> "10:00" */
export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(LOCALE, { hour: '2-digit', minute: '2-digit' });
}

/** Fecha local en formato yyyy-MM-dd (para <input type="date"> y query params). */
export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayIsoDate(): string {
  return toIsoDate(new Date());
}
