import { httpClient } from '@/services';
import type { Perfil } from '../types';

export const perfilApi = {
  obtener: async (): Promise<Perfil> => (await httpClient.get<Perfil>('/api/me')).data,
};
