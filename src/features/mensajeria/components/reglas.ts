/** Mismas reglas que valida ms-rabbit-admin (la validación definitiva es la del backend). */
export const PATRON_NOMBRE = /^(?!amq\.)[A-Za-z0-9][A-Za-z0-9._:-]*$/;
export const PATRON_ROUTING_KEY = /^[A-Za-z0-9._:*#-]*$/;

export function errorNombre(nombre: string): string | undefined {
  if (!nombre.trim()) return 'El nombre es obligatorio';
  if (nombre.length > 255) return 'Máximo 255 caracteres';
  if (!PATRON_NOMBRE.test(nombre)) return "Solo letras, números, '.', '_', ':' y '-'; no puede empezar con 'amq.'";
  return undefined;
}

export function errorRoutingKey(rk: string): string | undefined {
  if (rk.length > 255) return 'Máximo 255 caracteres';
  if (!PATRON_ROUTING_KEY.test(rk)) return "Solo letras, números, '.', '_', ':', '-', '*' y '#'";
  return undefined;
}
