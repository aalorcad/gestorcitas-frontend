import { useEffect, useState, type FormEvent } from 'react';
import { Alert, Badge, Button, Field, Input, Modal, Select, Spinner } from '@/components';
import { getErrorMessage } from '@/utils';
import { useGrupo, useKafkaMutations, useTopicos } from '../hooks/useKafka';
import type { EstrategiaReinicio } from '../types';

interface Props {
  grupo: string | null;
  onClose: () => void;
}

const ESTRATEGIAS: Array<{ value: EstrategiaReinicio; label: string }> = [
  { value: 'EARLIEST', label: 'EARLIEST: reprocesar desde el inicio' },
  { value: 'LATEST', label: 'LATEST: saltar lo pendiente' },
  { value: 'OFFSET', label: 'OFFSET: a un offset exacto' },
];

/** Miembros, particiones asignadas y lag del grupo, con reinicio de offsets. */
export function GrupoDetalleModal({ grupo, onClose }: Props) {
  const { data, isLoading, error } = useGrupo(grupo);
  const { data: topicos = [] } = useTopicos();
  const { reiniciarOffsets } = useKafkaMutations();
  const [topico, setTopico] = useState('');
  const [estrategia, setEstrategia] = useState<EstrategiaReinicio>('EARLIEST');
  const [offset, setOffset] = useState('');

  useEffect(() => {
    setTopico('');
    setEstrategia('EARLIEST');
    setOffset('');
  }, [grupo]);

  const activo = (data?.miembros.length ?? 0) > 0;
  const errOffset = estrategia === 'OFFSET' && !/^\d+$/.test(offset) ? 'Indica un offset (entero ≥ 0)' : undefined;

  const reiniciar = (e: FormEvent) => {
    e.preventDefault();
    if (!grupo || !topico || errOffset) return;
    if (!window.confirm(`¿Mover los offsets de ${grupo} en ${topico} (${estrategia})?`)) return;
    reiniciarOffsets.mutate({
      grupo,
      body: { topico, estrategia, offset: estrategia === 'OFFSET' ? Number(offset) : undefined },
    });
  };

  return (
    <Modal open={!!grupo} onClose={onClose} title={`Grupo ${grupo ?? ''}`}>
      {isLoading ? <Spinner /> : error ? <Alert tone="error">{getErrorMessage(error)}</Alert> : data && (
        <div className="form">
          <p className="muted">
            Estado <Badge tone={data.estado === 'STABLE' ? 'success' : 'warning'}>{data.estado}</Badge> · coordinador broker {data.coordinador ?? '—'} ·
            lag total {data.lagTotal > 0 ? <Badge tone="warning">{data.lagTotal}</Badge> : <Badge tone="success">0</Badge>}
          </p>

          <div>
            <strong>Consumidores activos ({data.miembros.length})</strong>
            {!data.miembros.length ? <p className="muted">Ninguno: el grupo está detenido</p> : (
              <ul>
                {data.miembros.map((m) => (
                  <li key={m.consumerId}><code>{m.clientId}</code> ({m.host}): {m.asignaciones.join(', ') || 'sin particiones'}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Tópico</th><th>Partición</th><th>Confirmado</th><th>Final</th><th>Lag</th></tr></thead>
              <tbody>
                {data.lag.map((l) => (
                  <tr key={`${l.topico}-${l.particion}`}>
                    <td className="nowrap">{l.topico}</td>
                    <td>{l.particion}</td>
                    <td>{l.offsetConfirmado}</td>
                    <td>{l.offsetFinal}</td>
                    <td>{l.lag > 0 ? <Badge tone="warning">{l.lag}</Badge> : 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <form onSubmit={reiniciar} className="form" noValidate>
            <strong>Reiniciar offsets</strong>
            {activo && <Alert tone="info">Kafka solo permite mover offsets de un grupo sin consumidores activos: detén sus instancias primero.</Alert>}
            <Field label="Tópico" htmlFor="r-topico">
              <Select id="r-topico" value={topico} onChange={(e) => setTopico(e.target.value)} placeholder="Selecciona…"
                options={topicos.map((t) => ({ value: t.nombre, label: t.nombre }))} />
            </Field>
            <Field label="Estrategia" htmlFor="r-estrategia">
              <Select id="r-estrategia" value={estrategia} onChange={(e) => setEstrategia(e.target.value as EstrategiaReinicio)}
                options={ESTRATEGIAS} />
            </Field>
            {estrategia === 'OFFSET' && (
              <Field label="Offset" htmlFor="r-offset" error={errOffset}>
                <Input id="r-offset" type="number" min={0} value={offset} onChange={(e) => setOffset(e.target.value)} />
              </Field>
            )}
            <Button type="submit" variant="secondary" disabled={!topico || !!errOffset} loading={reiniciarOffsets.isPending}>
              Reiniciar offsets
            </Button>
          </form>
        </div>
      )}
    </Modal>
  );
}
