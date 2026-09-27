import { EmptyState, Spinner } from '@/components';
import { cn } from '@/utils';
import { useMedicos } from '../hooks/useMedicos';

interface Props {
  especialidadId: number | '';
  value: number | null;
  onChange: (medicoId: number) => void;
}

/** Médicos disponibles (ms-usuarios) de una especialidad, seleccionables. */
export function MedicoPicker({ especialidadId, value, onChange }: Props) {
  const { data = [], isLoading } = useMedicos(especialidadId || undefined, especialidadId !== '');

  if (especialidadId === '') return <p className="muted">Primero elige una especialidad.</p>;
  if (isLoading) return <Spinner label="Buscando médicos…" />;
  if (!data.length) return <EmptyState title="Sin médicos disponibles" description="No hay médicos activos en esta especialidad." />;

  return (
    <div className="choice-grid">
      {data.map((m) => (
        <button
          type="button"
          key={m.id}
          className={cn('choice', value === m.id && 'choice--active')}
          onClick={() => onChange(m.id)}
        >
          <strong>{m.nombre}</strong>
          <span>{m.especialidadNombre} · {m.registroProfesional}</span>
          {m.biografia && <span className="choice__bio">{m.biografia}</span>}
        </button>
      ))}
    </div>
  );
}
