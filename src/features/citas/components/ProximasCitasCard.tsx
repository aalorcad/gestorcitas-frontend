import { Link } from 'react-router-dom';
import { Card, EmptyState, Spinner } from '@/components';
import { formatDateTime } from '@/utils';
import { useMisCitas } from '../hooks/useCitasQueries';
import { CitaEstadoBadge } from './CitaEstadoBadge';

/** Próximas citas activas del paciente (inicio del portal Paciente). */
export function ProximasCitasCard() {
  const { data = [], isLoading } = useMisCitas();
  const ahora = Date.now();
  const proximas = data
    .filter((c) => (c.estado === 'PENDIENTE' || c.estado === 'CONFIRMADA') && new Date(c.fechaHora).getTime() > ahora)
    .sort((a, b) => a.fechaHora.localeCompare(b.fechaHora))
    .slice(0, 3);

  return (
    <Card title="Próximas citas" actions={<Link className="link" to="/paciente/mis-citas">Ver todas →</Link>}>
      {isLoading ? (
        <Spinner />
      ) : !proximas.length ? (
        <EmptyState title="No tienes citas próximas" action={<Link className="link" to="/paciente/reservar">Reservar una cita →</Link>} />
      ) : (
        <ul className="list">
          {proximas.map((c) => (
            <li key={c.id} className="list__item">
              <div>
                <strong>{formatDateTime(c.fechaHora)}</strong>
                <div className="muted small">{c.medicoNombre} · {c.especialidadNombre}</div>
              </div>
              <CitaEstadoBadge estado={c.estado} />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
