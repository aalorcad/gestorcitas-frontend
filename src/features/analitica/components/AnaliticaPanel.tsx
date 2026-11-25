import { Alert, Badge, Card, EmptyState, Spinner, StatTile } from '@/components';
import { formatDateTime, getErrorMessage } from '@/utils';
import { useResumenAnalitica, useUltimosEventos } from '../hooks/useAnalitica';
import type { Conteo } from '../types';

const TONO_TIPO: Record<string, 'info' | 'success' | 'warning' | 'danger'> = {
  CREADA: 'info',
  CONFIRMADA: 'success',
  ATENDIDA: 'success',
  CANCELADA: 'danger',
};

function Barras({ datos, total, tone }: { datos: Conteo[]; total: number; tone: string }) {
  if (!datos.length) return <EmptyState title="Sin datos todavía" description="Reserva una cita para generar eventos" />;
  return (
    <>
      {datos.map((d) => {
        const pct = total > 0 ? Math.round((d.total / total) * 100) : 0;
        return (
          <div className="bar" key={d.clave}>
            <div className="bar__head">
              <span>{d.clave}</span>
              <span className="muted">{d.total} · {pct}%</span>
            </div>
            <div className="bar__track">
              <div className={`bar__fill bar__fill--${tone}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </>
  );
}

/** Indicadores calculados por ms-analitica a partir del streaming de Kafka. */
export function AnaliticaPanel() {
  const { data, isLoading, error } = useResumenAnalitica();
  const eventos = useUltimosEventos(20);

  if (isLoading) return <Spinner />;
  if (error) return <Alert tone="error">{getErrorMessage(error)}</Alert>;
  if (!data) return null;

  const t = data.eventosPorTipo;
  const creadas = t.CREADA ?? 0;
  const totalPorRol = Object.values(data.usuarios.porRol).reduce((a, b) => a + b, 0);

  return (
    <>
      <div className="stats">
        <StatTile label="Eventos procesados" value={data.totalEventos} tone="primary" hint="Sin duplicados" />
        <StatTile label="Citas creadas" value={creadas} />
        <StatTile label="Confirmadas" value={t.CONFIRMADA ?? 0} tone="success" />
        <StatTile label="Atendidas" value={t.ATENDIDA ?? 0} tone="success" />
        <StatTile label="Canceladas" value={t.CANCELADA ?? 0} tone={(t.CANCELADA ?? 0) > 0 ? 'danger' : 'default'} />
        <StatTile label="Tasa de cancelación" value={`${data.tasaCancelacion}%`} tone="warning" hint="Canceladas / creadas" />
      </div>

      <div className="grid grid--2">
        <Card title="Reservas por especialidad" subtitle={`${creadas} citas creadas`}>
          <Barras datos={data.reservasPorEspecialidad} total={creadas} tone="info" />
        </Card>
        <Card title="Reservas por médico" subtitle={`${creadas} citas creadas`}>
          <Barras datos={data.reservasPorMedico} total={creadas} tone="success" />
        </Card>
        <Card title="Estado de usuarios" subtitle="Último estado de cada usuario (tópico compactado)">
          <div className="stats">
            <StatTile label="Usuarios" value={data.usuarios.total} />
            <StatTile label="Activos" value={data.usuarios.activos} tone="success" />
            <StatTile label="Inactivos" value={data.usuarios.inactivos} tone={data.usuarios.inactivos ? 'danger' : 'default'} />
          </div>
          <Barras datos={Object.entries(data.usuarios.porRol).map(([clave, total]) => ({ clave, total }))}
            total={totalPorRol} tone="warning" />
        </Card>
      </div>

      <Card title="Últimos eventos" subtitle={`Partición y offset de origen en Kafka · actualizado ${formatDateTime(data.generadoEn)}`}>
        {eventos.isLoading ? <Spinner /> : eventos.error ? <Alert tone="error">{getErrorMessage(eventos.error)}</Alert>
          : !eventos.data?.length ? <EmptyState title="Aún no llegan eventos" /> : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr><th>Ocurrido</th><th>Evento</th><th>Cita</th><th>Especialidad</th><th>Médico</th><th>Partición / offset</th></tr>
                </thead>
                <tbody>
                  {eventos.data.map((e) => (
                    <tr key={e.eventoId}>
                      <td className="nowrap">{formatDateTime(e.ocurridoEn)}</td>
                      <td><Badge tone={TONO_TIPO[e.tipo] ?? 'neutral'}>{e.tipo}</Badge></td>
                      <td>#{e.citaId}</td>
                      <td>{e.especialidadNombre ?? '—'}</td>
                      <td>{e.medicoNombre ?? '—'}</td>
                      <td className="nowrap">{e.particion} / {e.offset}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </Card>
    </>
  );
}
