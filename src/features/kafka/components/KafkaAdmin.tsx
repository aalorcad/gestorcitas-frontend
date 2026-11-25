import { useState } from 'react';
import { Alert, Badge, Button, Card, EmptyState, Spinner, StatTile, Tabs } from '@/components';
import { useDisclosure } from '@/hooks';
import { getErrorMessage } from '@/utils';
import { useCluster, useGrupos, useKafkaMutations, useTopicos } from '../hooks/useKafka';
import { GrupoDetalleModal } from './GrupoDetalleModal';
import { TopicoDetalleModal } from './TopicoDetalleModal';
import { TopicoFormModal } from './TopicoFormModal';

type Vista = 'cluster' | 'topicos' | 'grupos';

export function KafkaAdmin() {
  const [vista, setVista] = useState<Vista>('cluster');
  return (
    <>
      <Tabs<Vista>
        value={vista}
        onChange={setVista}
        items={[
          { value: 'cluster', label: 'Clúster' },
          { value: 'topicos', label: 'Tópicos' },
          { value: 'grupos', label: 'Grupos de consumidores' },
        ]}
      />
      <div style={{ marginTop: 16 }}>
        {vista === 'cluster' && <ClusterTab />}
        {vista === 'topicos' && <TopicosTab />}
        {vista === 'grupos' && <GruposTab />}
      </div>
    </>
  );
}

function ClusterTab() {
  const { data, isLoading, error } = useCluster();
  if (isLoading) return <Spinner />;
  if (error) return <Alert tone="error">{getErrorMessage(error)}</Alert>;
  if (!data) return null;
  return (
    <>
      <div className="stats">
        <StatTile label="Brokers disponibles" value={data.totalBrokers} tone={data.totalBrokers >= 3 ? 'success' : 'danger'}
          hint="El clúster tiene 3 brokers" />
        <StatTile label="Controlador" value={data.controlador ? `Broker ${data.controlador.id}` : '—'} tone="primary" />
      </div>
      <Card title="Brokers" subtitle={`Clúster ${data.clusterId}`}>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>ID</th><th>Host</th><th>Puerto</th><th>Rol</th></tr></thead>
            <tbody>
              {data.brokers.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td className="nowrap">{b.host}</td>
                  <td>{b.puerto}</td>
                  <td>{data.controlador?.id === b.id ? <Badge tone="info">Controlador</Badge> : 'Broker'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

function TopicosTab() {
  const { data = [], isLoading, error } = useTopicos();
  const { data: cluster } = useCluster();
  const { eliminarTopico } = useKafkaMutations();
  const modal = useDisclosure();
  const [detalle, setDetalle] = useState<string | null>(null);

  return (
    <Card title="Tópicos" subtitle="Los tópicos de GestorCitas están protegidos: no se pueden eliminar"
      actions={<Button onClick={modal.open}>+ Nuevo tópico</Button>}>
      {isLoading ? <Spinner /> : error ? <Alert tone="error">{getErrorMessage(error)}</Alert> : !data.length ? <EmptyState title="No hay tópicos" /> : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Nombre</th><th>Particiones</th><th>Replicación</th><th>Tipo</th><th /></tr></thead>
            <tbody>
              {data.map((t) => (
                <tr key={t.nombre}>
                  <td className="nowrap">{t.nombre}</td>
                  <td>{t.particiones}</td>
                  <td>{t.factorReplicacion}</td>
                  <td>
                    {t.nombre.endsWith('.DLT') ? <Badge tone="warning">DLT</Badge>
                      : t.protegido ? <Badge tone="info">Sistema</Badge>
                      : <Badge>Personalizado</Badge>}
                  </td>
                  <td className="table__actions">
                    <Button size="sm" variant="secondary" onClick={() => setDetalle(t.nombre)}>Detalle</Button>
                    {!t.protegido && (
                      <Button size="sm" variant="danger"
                        loading={eliminarTopico.isPending && eliminarTopico.variables === t.nombre}
                        onClick={() => window.confirm(`¿Eliminar el tópico ${t.nombre} y todos sus registros?`) && eliminarTopico.mutate(t.nombre)}>
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
      <TopicoFormModal open={modal.isOpen} onClose={modal.close} maxReplicacion={cluster?.totalBrokers ?? 3} />
      <TopicoDetalleModal nombre={detalle} onClose={() => setDetalle(null)} />
    </Card>
  );
}

function GruposTab() {
  const { data = [], isLoading, error } = useGrupos();
  const { eliminarGrupo } = useKafkaMutations();
  const [detalle, setDetalle] = useState<string | null>(null);

  return (
    <Card title="Grupos de consumidores" subtitle="Cada grupo lee todos los eventos y avanza su propio offset">
      {isLoading ? <Spinner /> : error ? <Alert tone="error">{getErrorMessage(error)}</Alert> : !data.length ? <EmptyState title="No hay grupos" /> : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Grupo</th><th>Estado</th><th /></tr></thead>
            <tbody>
              {data.map((g) => (
                <tr key={g.grupo}>
                  <td className="nowrap">{g.grupo}</td>
                  <td><Badge tone={g.estado === 'STABLE' ? 'success' : g.estado === 'EMPTY' ? 'neutral' : 'warning'}>{g.estado}</Badge></td>
                  <td className="table__actions">
                    <Button size="sm" variant="secondary" onClick={() => setDetalle(g.grupo)}>Detalle y lag</Button>
                    {g.estado === 'EMPTY' && (
                      <Button size="sm" variant="danger"
                        loading={eliminarGrupo.isPending && eliminarGrupo.variables === g.grupo}
                        onClick={() => window.confirm(`¿Eliminar el grupo ${g.grupo} y sus offsets?`) && eliminarGrupo.mutate(g.grupo)}>
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
      <GrupoDetalleModal grupo={detalle} onClose={() => setDetalle(null)} />
    </Card>
  );
}
