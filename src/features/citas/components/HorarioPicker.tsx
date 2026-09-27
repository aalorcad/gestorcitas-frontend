import { EmptyState, Spinner } from '@/components';
import { cn, formatTime } from '@/utils';
import { useDisponibilidad } from '../hooks/useCitasQueries';

interface Props {
  medicoId: number | null;
  fecha: string;
  value: string | null;
  onChange: (fechaHora: string) => void;
}

/** Bloques horarios libres del médico en la fecha elegida (calculados por ms-citas). */
export function HorarioPicker({ medicoId, fecha, value, onChange }: Props) {
  const { data, isLoading } = useDisponibilidad(medicoId, fecha);

  if (medicoId === null) return <p className="muted">Selecciona un médico para ver sus horarios.</p>;
  if (isLoading) return <Spinner label="Consultando disponibilidad…" />;
  if (!data?.horariosDisponibles.length) {
    return <EmptyState title="Sin horarios disponibles" description="Prueba con otra fecha (lunes a viernes, 08:00–18:00)." />;
  }

  return (
    <div className="slot-grid">
      {data.horariosDisponibles.map((h) => (
        <button
          type="button"
          key={h}
          className={cn('slot', value === h && 'slot--active')}
          onClick={() => onChange(h)}
        >
          {formatTime(h)}
        </button>
      ))}
    </div>
  );
}
