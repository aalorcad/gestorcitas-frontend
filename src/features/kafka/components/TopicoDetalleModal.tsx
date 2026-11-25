import { useEffect, useState, type FormEvent } from 'react';
import { Alert, Badge, Button, Field, Input, Modal, Select, Spinner } from '@/components';
import { getErrorMessage } from '@/utils';
import { useKafkaMutations, useTopico } from '../hooks/useKafka';
import { CONFIGURACIONES, duracionLegible, errorEntero } from './reglas';

interface Props {
  nombre: string | null;
  onClose: () => void;
}

/** Particiones (líder, réplicas, ISR, offsets), configuración propia y acciones sobre el tópico. */
export function TopicoDetalleModal({ nombre, onClose }: Props) {
  const { data, isLoading, error } = useTopico(nombre);
  const { actualizarConfiguracion, aumentarParticiones } = useKafkaMutations();
  const [clave, setClave] = useState<string>(CONFIGURACIONES[0]);
  const [valor, setValor] = useState('');
  const [total, setTotal] = useState('');
  const [enviadoTotal, setEnviadoTotal] = useState(false);

  useEffect(() => {
    setClave(CONFIGURACIONES[0]);
    setValor('');
    setTotal('');
    setEnviadoTotal(false);
  }, [nombre]);

  const actuales = data?.particiones.length ?? 0;
  const errTotal = errorEntero(total, actuales + 1, 50);

  const guardarConfig = (e: FormEvent) => {
    e.preventDefault();
    if (!nombre) return;
    actualizarConfiguracion.mutate({ nombre, configuracion: { [clave]: valor.trim() } }, { onSuccess: () => setValor('') });
  };

  const aumentar = (e: FormEvent) => {
    e.preventDefault();
    setEnviadoTotal(true);
    if (!nombre || errTotal) return;
    aumentarParticiones.mutate({ nombre, total: Number(total) }, { onSuccess: () => { setTotal(''); setEnviadoTotal(false); } });
  };

  return (
    <Modal open={!!nombre} onClose={onClose} title={nombre ?? ''}>
      {isLoading ? <Spinner /> : error ? <Alert tone="error">{getErrorMessage(error)}</Alert> : data && (
        <div className="form">
          <p className="muted">
            {data.particiones.length} particiones · replicación {data.factorReplicacion} · ~{data.registros} registros retenidos{' '}
            {data.protegido && <Badge tone="info">Sistema</Badge>}
          </p>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr><th>Partición</th><th>Líder</th><th>Réplicas</th><th>ISR</th><th>Offsets</th></tr>
              </thead>
              <tbody>
                {data.particiones.map((p) => (
                  <tr key={p.particion}>
                    <td>{p.particion}</td>
                    <td>{p.lider ?? <Badge tone="danger">sin líder</Badge>}</td>
                    <td>{p.replicas.join(', ')}</td>
                    <td>
                      {p.isr.length < p.replicas.length
                        ? <Badge tone="warning">{p.isr.join(', ') || '—'}</Badge>
                        : p.isr.join(', ')}
                    </td>
                    <td className="nowrap">{p.offsetInicial} → {p.offsetFinal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <strong>Configuración propia</strong>
            {Object.keys(data.configuracion).length === 0 ? <p className="muted">Usa los valores del broker</p> : (
              <ul>
                {Object.entries(data.configuracion).map(([k, v]) => (
                  <li key={k}><code>{k}</code> = {v}{duracionLegible(v) && k.endsWith('.ms') ? ` (${duracionLegible(v)})` : ''}</li>
                ))}
              </ul>
            )}
          </div>

          <form onSubmit={guardarConfig} className="form">
            <Field label="Modificar configuración" htmlFor="cfg-clave" hint="Valor vacío = volver al valor del broker">
              <Select id="cfg-clave" value={clave} onChange={(e) => setClave(e.target.value)}
                options={CONFIGURACIONES.map((c) => ({ value: c, label: c }))} />
            </Field>
            <Input aria-label="Nuevo valor" placeholder="Nuevo valor, ej: 86400000" value={valor} onChange={(e) => setValor(e.target.value)} />
            <Button type="submit" variant="secondary" loading={actualizarConfiguracion.isPending}>Guardar configuración</Button>
          </form>

          {!data.protegido && (
            <form onSubmit={aumentar} className="form" noValidate>
              <Field label="Aumentar particiones" htmlFor="part-total" hint="Kafka solo permite aumentarlas"
                error={enviadoTotal ? errTotal : undefined}>
                <Input id="part-total" type="number" min={actuales + 1} max={50} value={total}
                  placeholder={`Nuevo total (> ${actuales})`} onChange={(e) => setTotal(e.target.value)} />
              </Field>
              <Button type="submit" variant="secondary" loading={aumentarParticiones.isPending}>Aumentar</Button>
            </form>
          )}
        </div>
      )}
    </Modal>
  );
}
