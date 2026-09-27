import { useState } from 'react';
import { Alert, Button, Card, Select, Spinner } from '@/components';
import { getErrorMessage } from '@/utils';
import { useCitaMutations } from '../hooks/useCitaMutations';
import { useTodasCitas } from '../hooks/useCitasQueries';
import { ESTADOS_CITA, type EstadoCita } from '../types';
import { CitasTable } from './CitasTable';

export function CitasAdmin() {
  const [estado, setEstado] = useState<EstadoCita | ''>('');
  const { data = [], isLoading, error } = useTodasCitas(estado || undefined);
  const { cancelar } = useCitaMutations();

  return (
    <Card
      title="Todas las citas"
      subtitle={`${data.length} resultado(s)`}
      actions={
        <Select
          aria-label="Filtrar por estado"
          value={estado}
          placeholder="Todos los estados"
          options={ESTADOS_CITA.map((e) => ({ value: e, label: e }))}
          onChange={(e) => setEstado(e.target.value as EstadoCita | '')}
        />
      }
    >
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <Alert tone="error">{getErrorMessage(error)}</Alert>
      ) : (
        <CitasTable
          citas={data}
          columnas={['paciente', 'medico', 'especialidad', 'motivo']}
          acciones={(c) =>
            (c.estado === 'PENDIENTE' || c.estado === 'CONFIRMADA') && (
              <Button
                size="sm"
                variant="danger"
                loading={cancelar.isPending && cancelar.variables === c.id}
                onClick={() => cancelar.mutate(c.id)}
              >
                Cancelar
              </Button>
            )
          }
        />
      )}
    </Card>
  );
}
