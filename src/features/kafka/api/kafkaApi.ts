import { httpClient } from '@/services';
import type {
  Cluster,
  CrearTopicoPayload,
  GrupoDetalle,
  GrupoResumen,
  ReiniciarOffsetsPayload,
  ReinicioOffsets,
  TopicoDetalle,
  TopicoResumen,
} from '../types';

const BASE = '/api/admin/kafka';
const enc = encodeURIComponent;

export const kafkaApi = {
  cluster: async () => (await httpClient.get<Cluster>(`${BASE}/cluster`)).data,

  // Tópicos
  listarTopicos: async () => (await httpClient.get<TopicoResumen[]>(`${BASE}/topics`)).data,
  obtenerTopico: async (nombre: string) => (await httpClient.get<TopicoDetalle>(`${BASE}/topics/${enc(nombre)}`)).data,
  crearTopico: async (body: CrearTopicoPayload) => (await httpClient.post<TopicoDetalle>(`${BASE}/topics`, body)).data,
  actualizarConfiguracion: async (nombre: string, configuracion: Record<string, string>) =>
    (await httpClient.patch<TopicoDetalle>(`${BASE}/topics/${enc(nombre)}/config`, { configuracion })).data,
  aumentarParticiones: async (nombre: string, total: number) =>
    (await httpClient.post<TopicoDetalle>(`${BASE}/topics/${enc(nombre)}/partitions`, { total })).data,
  eliminarTopico: async (nombre: string) => {
    await httpClient.delete(`${BASE}/topics/${enc(nombre)}`);
  },

  // Grupos de consumidores
  listarGrupos: async () => (await httpClient.get<GrupoResumen[]>(`${BASE}/consumer-groups`)).data,
  obtenerGrupo: async (grupo: string) => (await httpClient.get<GrupoDetalle>(`${BASE}/consumer-groups/${enc(grupo)}`)).data,
  reiniciarOffsets: async (grupo: string, body: ReiniciarOffsetsPayload) =>
    (await httpClient.post<ReinicioOffsets>(`${BASE}/consumer-groups/${enc(grupo)}/reset-offsets`, body)).data,
  eliminarGrupo: async (grupo: string) => {
    await httpClient.delete(`${BASE}/consumer-groups/${enc(grupo)}`);
  },
};
