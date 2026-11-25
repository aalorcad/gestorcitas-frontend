import { httpClient } from '@/services';
import type { EventoCita, ResumenAnalitica } from '../types';

const BASE = '/api/analitica';

export const analiticaApi = {
  resumen: async () => (await httpClient.get<ResumenAnalitica>(`${BASE}/resumen`)).data,
  ultimosEventos: async (limite = 20) =>
    (await httpClient.get<EventoCita[]>(`${BASE}/eventos`, { params: { limite } })).data,
};
