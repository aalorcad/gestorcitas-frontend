import type { ReactNode } from 'react';
import { EmptyState } from '@/components';
import { formatDateTime } from '@/utils';
import type { Cita } from '../types';
import { CitaEstadoBadge } from './CitaEstadoBadge';

type Columna = 'paciente' | 'medico' | 'especialidad' | 'motivo' | 'observaciones';

interface Props {
  citas: Cita[];
  columnas: Columna[];
  acciones?: (cita: Cita) => ReactNode;
  vacio?: string;
}

/** Tabla de citas reutilizada por las vistas de Paciente, Médico y Admin. */
export function CitasTable({ citas, columnas, acciones, vacio = 'No hay citas para mostrar' }: Props) {
  if (!citas.length) return <EmptyState title={vacio} />;
  const has = (c: Columna) => columnas.includes(c);

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Fecha y hora</th>
            {has('paciente') && <th>Paciente</th>}
            {has('medico') && <th>Médico</th>}
            {has('especialidad') && <th>Especialidad</th>}
            {has('motivo') && <th>Motivo</th>}
            {has('observaciones') && <th>Observaciones</th>}
            <th>Estado</th>
            {acciones && <th />}
          </tr>
        </thead>
        <tbody>
          {citas.map((c) => (
            <tr key={c.id}>
              <td className="nowrap">{formatDateTime(c.fechaHora)}</td>
              {has('paciente') && (
                <td>
                  {c.pacienteNombre}
                  {c.pacienteEmail && <div className="muted small">{c.pacienteEmail}</div>}
                </td>
              )}
              {has('medico') && <td>{c.medicoNombre}</td>}
              {has('especialidad') && <td>{c.especialidadNombre}</td>}
              {has('motivo') && <td className="muted">{c.motivo || '—'}</td>}
              {has('observaciones') && <td className="muted">{c.observaciones || '—'}</td>}
              <td><CitaEstadoBadge estado={c.estado} /></td>
              {acciones && <td className="table__actions">{acciones(c)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
