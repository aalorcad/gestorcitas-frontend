import { Badge, type BadgeTone } from '@/components';
import type { EstadoCita } from '../types';

const TONOS: Record<EstadoCita, BadgeTone> = {
  PENDIENTE: 'warning',
  CONFIRMADA: 'info',
  ATENDIDA: 'success',
  CANCELADA: 'danger',
};

export function CitaEstadoBadge({ estado }: { estado: EstadoCita }) {
  return <Badge tone={TONOS[estado]}>{estado}</Badge>;
}
