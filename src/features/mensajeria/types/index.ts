// Contratos de ms-rabbit-admin (expuesto por el BFF en /api/admin/mensajeria)

export type TipoExchange = 'direct' | 'topic' | 'fanout' | 'headers';

export interface Cola {
  nombre: string;
  mensajes: number | null;
  consumidores: number | null;
  durable: boolean | null;
  autoDelete: boolean | null;
  argumentos: Record<string, unknown> | null;
  protegida: boolean;
}

export interface ColaPayload {
  nombre: string;
  durable?: boolean;
  autoDelete?: boolean;
  ttlMs?: number;
  maxMensajes?: number;
  deadLetterExchange?: string;
  deadLetterRoutingKey?: string;
}

export interface Exchange {
  nombre: string;
  tipo: TipoExchange;
  durable: boolean | null;
  autoDelete: boolean | null;
  protegido: boolean;
}

export interface ExchangePayload {
  nombre: string;
  tipo: TipoExchange;
  durable?: boolean;
}

export interface Binding {
  exchange: string;
  cola: string;
  routingKey: string;
}

export interface PublicarPayload {
  exchange: string;
  routingKey: string;
  payload: unknown;
}

export interface PublicacionResultado {
  mensajeId: string;
  exchange: string;
  routingKey: string;
  enrutable: boolean;
}

export interface PurgaResultado {
  cola: string;
  mensajesEliminados: number;
}
