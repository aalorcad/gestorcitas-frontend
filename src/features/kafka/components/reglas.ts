/** Mismas reglas que valida ms-kafka-admin (la validación definitiva es la del backend). */
export const PATRON_TOPICO = /^[a-zA-Z0-9._-]+$/;

/** Configuraciones que acepta ms-kafka-admin (app.admin.configuraciones-permitidas). */
export const CONFIGURACIONES = [
  'retention.ms',
  'retention.bytes',
  'cleanup.policy',
  'delete.retention.ms',
  'min.insync.replicas',
  'segment.ms',
  'max.message.bytes',
  'min.cleanable.dirty.ratio',
] as const;

export function errorNombreTopico(nombre: string): string | undefined {
  if (!nombre.trim()) return 'El nombre es obligatorio';
  if (nombre.length > 249) return 'Máximo 249 caracteres';
  if (!PATRON_TOPICO.test(nombre)) return "Solo letras, números, '.', '_' y '-'";
  return undefined;
}

export function errorEntero(valor: string, min: number, max: number): string | undefined {
  const n = Number(valor);
  if (!valor.trim() || !Number.isInteger(n)) return 'Debe ser un número entero';
  if (n < min || n > max) return `Debe estar entre ${min} y ${max}`;
  return undefined;
}

/** 604800000 -> "7 d"; 3600000 -> "1 h" (solo para mostrar retenciones). */
export function duracionLegible(ms: string | undefined): string | undefined {
  if (!ms || !/^\d+$/.test(ms)) return undefined;
  const n = Number(ms);
  if (n % 86_400_000 === 0) return `${n / 86_400_000} d`;
  if (n % 3_600_000 === 0) return `${n / 3_600_000} h`;
  if (n % 60_000 === 0) return `${n / 60_000} min`;
  return undefined;
}
