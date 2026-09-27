import { httpClient } from '@/services';
import type { Especialidad, EspecialidadPayload } from '../types';

const BASE = '/api/catalogo/especialidades';

export const especialidadesApi = {
  listar: async (soloActivas = true) =>
    (await httpClient.get<Especialidad[]>(BASE, { params: { soloActivas } })).data,
  crear: async (body: EspecialidadPayload) => (await httpClient.post<Especialidad>(BASE, body)).data,
  actualizar: async (id: number, body: EspecialidadPayload) =>
    (await httpClient.put<Especialidad>(`${BASE}/${id}`, body)).data,
  activar: async (id: number) => (await httpClient.patch<Especialidad>(`${BASE}/${id}/activar`)).data,
  desactivar: async (id: number) => {
    await httpClient.delete(`${BASE}/${id}`);
  },
};
