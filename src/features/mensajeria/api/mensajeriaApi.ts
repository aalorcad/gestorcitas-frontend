import { httpClient } from '@/services';
import type {
  Binding,
  Cola,
  ColaPayload,
  Exchange,
  ExchangePayload,
  PublicacionResultado,
  PublicarPayload,
  PurgaResultado,
} from '../types';

const BASE = '/api/admin/mensajeria';
const enc = encodeURIComponent;

export const mensajeriaApi = {
  // Colas
  listarColas: async () => (await httpClient.get<Cola[]>(`${BASE}/queues`)).data,
  crearCola: async (body: ColaPayload) => (await httpClient.post<Cola>(`${BASE}/queues`, body)).data,
  eliminarCola: async (nombre: string, soloSiVacia = false) => {
    await httpClient.delete(`${BASE}/queues/${enc(nombre)}`, { params: { soloSiVacia } });
  },
  purgarCola: async (nombre: string) =>
    (await httpClient.delete<PurgaResultado>(`${BASE}/queues/${enc(nombre)}/messages`)).data,

  // Exchanges
  listarExchanges: async () => (await httpClient.get<Exchange[]>(`${BASE}/exchanges`)).data,
  crearExchange: async (body: ExchangePayload) => (await httpClient.post<Exchange>(`${BASE}/exchanges`, body)).data,
  eliminarExchange: async (nombre: string) => {
    await httpClient.delete(`${BASE}/exchanges/${enc(nombre)}`);
  },

  // Bindings (axios codifica '#' y '*' en los query params)
  listarBindings: async () => (await httpClient.get<Binding[]>(`${BASE}/bindings`)).data,
  crearBinding: async (body: Binding) => (await httpClient.post<Binding>(`${BASE}/bindings`, body)).data,
  eliminarBinding: async (b: Binding) => {
    await httpClient.delete(`${BASE}/bindings`, { params: b });
  },

  // Mensaje de prueba
  publicar: async (body: PublicarPayload) =>
    (await httpClient.post<PublicacionResultado>(`${BASE}/messages`, body)).data,
};
