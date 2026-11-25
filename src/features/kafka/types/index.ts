// Contratos de ms-kafka-admin (expuesto por el BFF en /api/admin/kafka)

export interface Broker {
  id: number;
  host: string;
  puerto: number;
  rack: string | null;
}

export interface Cluster {
  clusterId: string;
  controlador: Broker | null;
  totalBrokers: number;
  brokers: Broker[];
}

export interface TopicoResumen {
  nombre: string;
  particiones: number;
  factorReplicacion: number;
  protegido: boolean;
}

export interface Particion {
  particion: number;
  lider: number | null;
  replicas: number[];
  isr: number[];
  offsetInicial: number;
  offsetFinal: number;
}

export interface TopicoDetalle {
  nombre: string;
  protegido: boolean;
  factorReplicacion: number;
  particiones: Particion[];
  configuracion: Record<string, string>;
  registros: number;
}

export interface CrearTopicoPayload {
  nombre: string;
  particiones: number;
  factorReplicacion: number;
  configuracion?: Record<string, string>;
}

export interface GrupoResumen {
  grupo: string;
  estado: string;
}

export interface Miembro {
  consumerId: string;
  clientId: string;
  host: string;
  asignaciones: string[];
}

export interface Lag {
  topico: string;
  particion: number;
  offsetConfirmado: number;
  offsetFinal: number;
  lag: number;
}

export interface GrupoDetalle {
  grupo: string;
  estado: string;
  coordinador: number | null;
  miembros: Miembro[];
  lag: Lag[];
  lagTotal: number;
}

export type EstrategiaReinicio = 'EARLIEST' | 'LATEST' | 'OFFSET';

export interface ReiniciarOffsetsPayload {
  topico: string;
  estrategia: EstrategiaReinicio;
  offset?: number;
}

export interface ReinicioOffsets {
  grupo: string;
  topico: string;
  estrategia: EstrategiaReinicio;
  nuevosOffsets: Record<string, number>;
}
