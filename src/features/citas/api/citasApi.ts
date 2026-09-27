import { httpClient } from '@/services';
import type { Cita, CrearCitaPayload, Disponibilidad, EstadoCita } from '../types';

const BASE = '/api/citas';

export const citasApi = {
  reservar: async (body: CrearCitaPayload) => (await httpClient.post<Cita>(BASE, body)).data,
  misCitas: async () => (await httpClient.get<Cita[]>(`${BASE}/mias`)).data,
  cancelar: async (id: number) => (await httpClient.patch<Cita>(`${BASE}/${id}/cancelar`)).data,
  agenda: async (fecha?: string) =>
    (await httpClient.get<Cita[]>(`${BASE}/agenda`, { params: fecha ? { fecha } : {} })).data,
  confirmar: async (id: number) => (await httpClient.patch<Cita>(`${BASE}/${id}/confirmar`)).data,
  atender: async (id: number, observaciones?: string) =>
    (await httpClient.patch<Cita>(`${BASE}/${id}/atender`, { observaciones })).data,
  todas: async (estado?: EstadoCita) =>
    (await httpClient.get<Cita[]>(BASE, { params: estado ? { estado } : {} })).data,
  disponibilidad: async (medicoId: number, fecha: string) =>
    (await httpClient.get<Disponibilidad>(`${BASE}/disponibilidad`, { params: { medicoId, fecha } })).data,
};
