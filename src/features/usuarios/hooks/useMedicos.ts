import { useQuery } from '@tanstack/react-query';
import { usuariosApi } from '../api/usuariosApi';
import { usuariosKeys } from './useUsuarioActual';

/** Médicos disponibles para reservar (activos y con especialidad asignada). */
export function useMedicos(especialidadId?: number, enabled = true) {
  return useQuery({
    queryKey: usuariosKeys.medicos(especialidadId),
    queryFn: () => usuariosApi.medicos(especialidadId),
    enabled,
  });
}
