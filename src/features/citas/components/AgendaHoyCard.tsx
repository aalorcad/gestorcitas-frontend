import { Link } from 'react-router-dom';
import { Card, EmptyState, Spinner, StatTile } from '@/components';
import { formatTime, todayIsoDate } from '@/utils';
import { useAgenda } from '../hooks/useCitasQueries';
import { CitaEstadoBadge } from './CitaEstadoBadge';

/** Resumen del día para el portal Médico. */
export function AgendaHoyCard() {
  const { data = [], isLoading } = useAgenda(todayIsoDate());
  const activas = data.filter((c) => c.estado !== 'CANCELADA');
  const pendientes = data.filter((c) => c.estado === 'PENDIENTE').length;
  const atendidas = data.filter((c) => c.estado === 'ATENDIDA').length;

  return (
    <>
      <div className="stats">
        <StatTile label="Citas de hoy" value={activas.length} tone="primary" />
        <StatTile label="Por confirmar" value={pendientes} tone="warning" />
        <StatTile label="Atendidas hoy" value={atendidas} tone="success" />
      </div>
      <Card title="Pacientes de hoy" actions={<Link className="link" to="/medico/agenda">Abrir agenda →</Link>}>
        {isLoading ? (
          <Spinner />
        ) : !activas.length ? (
          <EmptyState title="No tienes pacientes agendados para hoy" />
        ) : (
          <ul className="list">
            {activas.map((c) => (
              <li key={c.id} className="list__item">
                <div>
                  <strong>{formatTime(c.fechaHora)}</strong> · {c.pacienteNombre}
                  {c.motivo && <div className="muted small">{c.motivo}</div>}
                </div>
                <CitaEstadoBadge estado={c.estado} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
