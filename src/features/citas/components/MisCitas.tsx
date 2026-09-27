import { Alert, Button, Card, Spinner } from '@/components';
import { getErrorMessage } from '@/utils';
import { useCitaMutations } from '../hooks/useCitaMutations';
import { useMisCitas } from '../hooks/useCitasQueries';
import { CitasTable } from './CitasTable';

export function MisCitas() {
  const { data = [], isLoading, error } = useMisCitas();
  const { cancelar } = useCitaMutations();

  return (
    <Card title="Mis citas" subtitle="Puedes cancelar citas pendientes o confirmadas que aún no ocurren">
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <Alert tone="error">{getErrorMessage(error)}</Alert>
      ) : (
        <CitasTable
          citas={data}
          columnas={['medico', 'especialidad', 'motivo', 'observaciones']}
          vacio="Aún no tienes citas reservadas"
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
