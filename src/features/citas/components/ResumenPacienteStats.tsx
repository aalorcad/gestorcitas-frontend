import { StatTile } from '@/components';
import { useMisCitas } from '../hooks/useCitasQueries';

export function ResumenPacienteStats() {
  const { data = [] } = useMisCitas();
  const activas = data.filter((c) => c.estado === 'PENDIENTE' || c.estado === 'CONFIRMADA').length;
  const atendidas = data.filter((c) => c.estado === 'ATENDIDA').length;
  return (
    <div className="stats">
      <StatTile label="Citas activas" value={activas} tone="primary" />
      <StatTile label="Atenciones realizadas" value={atendidas} tone="success" />
      <StatTile label="Total de citas" value={data.length} />
    </div>
  );
}
