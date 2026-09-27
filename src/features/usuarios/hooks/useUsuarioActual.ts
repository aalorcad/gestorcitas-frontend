import { useQuery } from '@tanstack/react-query';
import { usuariosApi } from '../api/usuariosApi';

export const usuariosKeys = {
  all: ['usuarios'] as const,
  actual: ['usuarios', 'actual'] as const,
  medicos: (especialidadId?: number) => ['usuarios', 'medicos', especialidadId ?? 'todos'] as const,
  admin: (rol?: string, q?: string) => ['usuarios', 'admin', rol ?? 'todos', q ?? ''] as const,
  dashboard: ['usuarios', 'dashboard'] as const,
};

/**
 * Usuario de negocio (ms-usuarios) del usuario autenticado.
 * La primera consulta lo sincroniza con su identidad de Entra ID (alta automática).
 */
export function useUsuarioActual() {
  return useQuery({
    queryKey: usuariosKeys.actual,
    queryFn: usuariosApi.sincronizar,
    staleTime: 5 * 60_000,
  });
}
