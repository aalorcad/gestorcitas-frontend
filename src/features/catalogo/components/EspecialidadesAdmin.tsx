import { useState } from 'react';
import { Badge, Button, Card, EmptyState, Spinner } from '@/components';
import { useDisclosure } from '@/hooks';
import { formatCLP } from '@/utils';
import { useCatalogoMutations } from '../hooks/useCatalogoMutations';
import { useEspecialidades } from '../hooks/useEspecialidades';
import type { Especialidad } from '../types';
import { EspecialidadFormModal } from './EspecialidadFormModal';

export function EspecialidadesAdmin() {
  const { data = [], isLoading } = useEspecialidades(false);
  const { toggleEspecialidad } = useCatalogoMutations();
  const modal = useDisclosure();
  const [editando, setEditando] = useState<Especialidad | null>(null);

  const abrir = (e: Especialidad | null) => {
    setEditando(e);
    modal.open();
  };

  return (
    <Card title="Especialidades" actions={<Button onClick={() => abrir(null)}>+ Nueva especialidad</Button>}>
      {isLoading ? (
        <Spinner />
      ) : !data.length ? (
        <EmptyState title="Aún no hay especialidades" />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Nombre</th><th>Descripción</th><th>Valor consulta</th><th>Estado</th><th /></tr>
            </thead>
            <tbody>
              {data.map((e) => (
                <tr key={e.id}>
                  <td>{e.nombre}</td>
                  <td className="muted">{e.descripcion ?? '—'}</td>
                  <td className="nowrap">{formatCLP(e.valorConsulta)}</td>
                  <td>{e.activa ? <Badge tone="success">Activa</Badge> : <Badge>Inactiva</Badge>}</td>
                  <td className="table__actions">
                    <Button size="sm" variant="secondary" onClick={() => abrir(e)}>Editar</Button>
                    <Button
                      size="sm"
                      variant={e.activa ? 'danger' : 'secondary'}
                      loading={toggleEspecialidad.isPending && toggleEspecialidad.variables?.id === e.id}
                      onClick={() => toggleEspecialidad.mutate({ id: e.id, activa: e.activa })}
                    >
                      {e.activa ? 'Desactivar' : 'Activar'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <EspecialidadFormModal open={modal.isOpen} onClose={modal.close} especialidad={editando} />
    </Card>
  );
}
