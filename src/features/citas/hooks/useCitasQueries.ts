import { useQuery } from '@tanstack/react-query';
import { citasApi } from '../api/citasApi';
import type { EstadoCita } from '../types';

export const citasKeys = {
  all: ['citas'] as const,
  mias: ['citas', 'mias'] as const,
  agenda: (fecha?: string) => ['citas', 'agenda', fecha ?? 'todas'] as const,
  todas: (estado?: EstadoCita) => ['citas', 'todas', estado ?? 'todos'] as const,
  disponibilidad: (medicoId: number | null, fecha: string) => ['citas', 'disponibilidad', medicoId, fecha] as const,
};

export function useMisCitas() {
  return useQuery({ queryKey: citasKeys.mias, queryFn: citasApi.misCitas });
}

export function useAgenda(fecha?: string) {
  return useQuery({ queryKey: citasKeys.agenda(fecha), queryFn: () => citasApi.agenda(fecha) });
}

export function useTodasCitas(estado?: EstadoCita) {
  return useQuery({ queryKey: citasKeys.todas(estado), queryFn: () => citasApi.todas(estado) });
}

export function useDisponibilidad(medicoId: number | null, fecha: string) {
  return useQuery({
    queryKey: citasKeys.disponibilidad(medicoId, fecha),
    queryFn: () => citasApi.disponibilidad(medicoId as number, fecha),
    enabled: medicoId !== null && !!fecha,
  });
}
