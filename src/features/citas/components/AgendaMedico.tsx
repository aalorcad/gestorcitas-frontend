import { useState } from 'react';
import { Alert, Button, Card, Input, Spinner } from '@/components';
import { getErrorMessage, todayIsoDate } from '@/utils';
import { useCitaMutations } from '../hooks/useCitaMutations';
import { useAgenda } from '../hooks/useCitasQueries';
import type { Cita } from '../types';
import { AtenderCitaModal } from './AtenderCitaModal';
import { CitasTable } from './CitasTable';

export function AgendaMedico() {
  const [fecha, setFecha] = useState<string>(todayIsoDate());
  const { data = [], isLoading, error } = useAgenda(fecha || undefined);
  const { confirmar } = useCitaMutations();
  const [atendiendo, setAtendiendo] = useState<Cita | null>(null);

  return (
    <Card
      title="Mi agenda"
      subtitle="Citas asignadas a tu cuenta"
      actions={
        <div className="inline">
          <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} aria-label="Fecha" />
          <Button variant="ghost" size="sm" onClick={() => setFecha('')}>Ver todas</Button>
        </div>
      }
    >
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <Alert tone="error">{getErrorMessage(error)}</Alert>
      ) : (
        <CitasTable
          citas={data}
          columnas={['paciente', 'motivo', 'observaciones']}
          vacio="No tienes citas para esta fecha"
          acciones={(c) => (
            <>
              {c.estado === 'PENDIENTE' && (
                <Button
                  size="sm"
                  variant="secondary"
                  loading={confirmar.isPending && confirmar.variables === c.id}
                  onClick={() => confirmar.mutate(c.id)}
                >
                  Confirmar
                </Button>
              )}
              {(c.estado === 'PENDIENTE' || c.estado === 'CONFIRMADA') && (
                <Button size="sm" onClick={() => setAtendiendo(c)}>Atender</Button>
              )}
            </>
          )}
        />
      )}
      <AtenderCitaModal cita={atendiendo} onClose={() => setAtendiendo(null)} />
    </Card>
  );
}
