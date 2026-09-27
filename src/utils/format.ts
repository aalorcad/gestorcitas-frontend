/** 25000 -> "$25.000" */
export function formatCLP(valor: number | null | undefined): string {
  if (valor === null || valor === undefined) return '—';
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(valor);
}

/** Edad en años a partir de "yyyy-MM-dd". */
export function calcularEdad(fechaIso: string | null | undefined): number | null {
  if (!fechaIso) return null;
  const nac = new Date(`${fechaIso}T00:00:00`);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
  return edad;
}

/** "123456785" / "12.345.678-5" -> "12.345.678-5" (solo formato visual). */
export function formatRut(rut: string | null | undefined): string {
  if (!rut) return '—';
  const limpio = rut.replace(/[^0-9kK]/g, '').toUpperCase();
  if (limpio.length < 2) return rut;
  const cuerpo = limpio.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${cuerpo}-${limpio.slice(-1)}`;
}
