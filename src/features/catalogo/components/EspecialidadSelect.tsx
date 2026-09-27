import { Select } from '@/components';
import { useEspecialidades } from '../hooks/useEspecialidades';

interface Props {
  id?: string;
  value: number | '';
  onChange: (id: number | '') => void;
}

export function EspecialidadSelect({ id = 'especialidad', value, onChange }: Props) {
  const { data = [], isLoading } = useEspecialidades(true);
  return (
    <Select
      id={id}
      value={value}
      disabled={isLoading}
      placeholder={isLoading ? 'Cargando…' : 'Selecciona una especialidad'}
      options={data.map((e) => ({ value: e.id, label: e.nombre }))}
      onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')}
    />
  );
}
