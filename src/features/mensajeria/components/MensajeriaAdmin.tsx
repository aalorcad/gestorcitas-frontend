import { useState } from 'react';
import { Badge, Button, Card, EmptyState, Spinner, Tabs } from '@/components';
import { useDisclosure } from '@/hooks';
import { useBindings, useColas, useExchanges, useMensajeriaMutations } from '../hooks/useMensajeria';
import type { Binding } from '../types';
import { BindingFormModal } from './BindingFormModal';
import { ColaFormModal } from './ColaFormModal';
import { ExchangeFormModal } from './ExchangeFormModal';
import { PublicarMensajeCard } from './PublicarMensajeCard';

type Vista = 'colas' | 'exchanges' | 'bindings' | 'probar';

const esDlq = (nombre: string) => nombre.endsWith('.dlq');

export function MensajeriaAdmin() {
  const [vista, setVista] = useState<Vista>('colas');
  return (
    <>
      <Tabs<Vista>
        value={vista}
        onChange={setVista}
        items={[
          { value: 'colas', label: 'Colas' },
          { value: 'exchanges', label: 'Exchanges' },
          { value: 'bindings', label: 'Bindings' },
          { value: 'probar', label: 'Probar mensaje' },
        ]}
      />
      <div style={{ marginTop: 16 }}>
        {vista === 'colas' && <ColasTab />}
        {vista === 'exchanges' && <ExchangesTab />}
        {vista === 'bindings' && <BindingsTab />}
        {vista === 'probar' && <PublicarMensajeCard />}
      </div>
    </>
  );
}

function ColasTab() {
  const { data = [], isLoading } = useColas();
  const { eliminarCola, purgarCola } = useMensajeriaMutations();
  const modal = useDisclosure();

  return (
    <Card title="Colas" subtitle="Incluye colas de reintento (.retry) y dead letter queues (.dlq)"
      actions={<Button onClick={modal.open}>+ Nueva cola</Button>}>
      {isLoading ? <Spinner /> : !data.length ? <EmptyState title="No hay colas" /> : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Nombre</th><th>Mensajes</th><th>Consumidores</th><th>Tipo</th><th /></tr>
            </thead>
            <tbody>
              {data.map((c) => (
                <tr key={c.nombre}>
                  <td className="nowrap">{c.nombre}</td>
                  <td>
                    {esDlq(c.nombre) && (c.mensajes ?? 0) > 0
                      ? <Badge tone="danger">{c.mensajes}</Badge>
                      : c.mensajes ?? '—'}
                  </td>
                  <td>{c.consumidores ?? '—'}</td>
                  <td>
                    {esDlq(c.nombre) ? <Badge tone="warning">DLQ</Badge>
                      : c.protegida ? <Badge tone="info">Sistema</Badge>
                      : <Badge>Personalizada</Badge>}
                  </td>
                  <td className="table__actions">
                    <Button size="sm" variant="secondary" disabled={!c.mensajes}
                      loading={purgarCola.isPending && purgarCola.variables === c.nombre}
                      onClick={() => window.confirm(`¿Vaciar la cola ${c.nombre}?`) && purgarCola.mutate(c.nombre)}>
                      Vaciar
                    </Button>
                    {!c.protegida && (
                      <Button size="sm" variant="danger"
                        loading={eliminarCola.isPending && eliminarCola.variables === c.nombre}
                        onClick={() => window.confirm(`¿Eliminar la cola ${c.nombre}?`) && eliminarCola.mutate(c.nombre)}>
                        Eliminar
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ColaFormModal open={modal.isOpen} onClose={modal.close} />
    </Card>
  );
}

function ExchangesTab() {
  const { data = [], isLoading } = useExchanges();
  const { eliminarExchange } = useMensajeriaMutations();
  const modal = useDisclosure();

  return (
    <Card title="Exchanges" actions={<Button onClick={modal.open}>+ Nuevo exchange</Button>}>
      {isLoading ? <Spinner /> : !data.length ? <EmptyState title="No hay exchanges" /> : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Nombre</th><th>Tipo</th><th>Origen</th><th /></tr></thead>
            <tbody>
              {data.map((x) => (
                <tr key={x.nombre}>
                  <td className="nowrap">{x.nombre}</td>
                  <td><Badge tone="info">{x.tipo}</Badge></td>
                  <td>{x.protegido ? <Badge tone="info">Sistema</Badge> : <Badge>Personalizado</Badge>}</td>
                  <td className="table__actions">
                    {!x.protegido && (
                      <Button size="sm" variant="danger"
                        loading={eliminarExchange.isPending && eliminarExchange.variables === x.nombre}
                        onClick={() => window.confirm(`¿Eliminar el exchange ${x.nombre}?`) && eliminarExchange.mutate(x.nombre)}>
                        Eliminar
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ExchangeFormModal open={modal.isOpen} onClose={modal.close} />
    </Card>
  );
}

function BindingsTab() {
  const { data = [], isLoading } = useBindings();
  const { data: colas = [] } = useColas();
  const { eliminarBinding } = useMensajeriaMutations();
  const modal = useDisclosure();
  const protegida = (nombre: string) => colas.find((c) => c.nombre === nombre)?.protegida ?? false;
  const mismo = (a?: Binding, b?: Binding) =>
    !!a && !!b && a.exchange === b.exchange && a.cola === b.cola && a.routingKey === b.routingKey;

  return (
    <Card title="Bindings" subtitle="Enlaces exchange → cola" actions={<Button onClick={modal.open}>+ Nuevo binding</Button>}>
      {isLoading ? <Spinner /> : !data.length ? <EmptyState title="No hay bindings" /> : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Exchange</th><th>Routing key</th><th>Cola</th><th /></tr></thead>
            <tbody>
              {data.map((b) => (
                <tr key={`${b.exchange}|${b.routingKey}|${b.cola}`}>
                  <td className="nowrap">{b.exchange}</td>
                  <td><code>{b.routingKey || '""'}</code></td>
                  <td className="nowrap">{b.cola}</td>
                  <td className="table__actions">
                    {!protegida(b.cola) && (
                      <Button size="sm" variant="danger"
                        loading={eliminarBinding.isPending && mismo(eliminarBinding.variables, b)}
                        onClick={() => window.confirm('¿Eliminar este binding?') && eliminarBinding.mutate(b)}>
                        Eliminar
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <BindingFormModal open={modal.isOpen} onClose={modal.close} />
    </Card>
  );
}
