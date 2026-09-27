import { useState } from 'react';
import { Alert, Badge, Button, Card, EmptyState, Input, Spinner, Tabs } from '@/components';
import { useDebounce, useDisclosure } from '@/hooks';
import { AppRole } from '@/types';
import { formatDateTime, formatRut, getErrorMessage } from '@/utils';
import { useAdminUsuarioMutations, useUsuariosAdmin } from '../hooks/useAdminUsuarios';
import { useUsuarioActual } from '../hooks/useUsuarioActual';
import type { Usuario } from '../types';
import { EditarMedicoModal } from './EditarMedicoModal';
import { RegistrarMedicoModal } from './RegistrarMedicoModal';

type Filtro = 'todos' | AppRole;

const TABS: Array<{ value: Filtro; label: string }> = [
  { value: 'todos', label: 'Todos' },
  { value: AppRole.Paciente, label: 'Pacientes' },
  { value: AppRole.Medico, label: 'Médicos' },
  { value: AppRole.Admin, label: 'Administradores' },
];

function Detalle({ u }: { u: Usuario }) {
  return (
    <div className="small">
      {u.perfilPaciente && (
        <div>
          RUT {formatRut(u.perfilPaciente.rut)} · {u.perfilPaciente.prevision ?? 'sin previsión'}{' '}
          {!u.perfilPaciente.completo && <Badge tone="warning">incompleto</Badge>}
        </div>
      )}
      {u.perfilMedico && (
        <div>
          {u.perfilMedico.especialidadNombre ?? <Badge tone="warning">sin especialidad</Badge>}
          {u.perfilMedico.registroProfesional && ` · ${u.perfilMedico.registroProfesional}`}
        </div>
      )}
      <div className="muted">
        {u.vinculadoEntraId ? `Último acceso: ${u.ultimoAcceso ? formatDateTime(u.ultimoAcceso) : '—'}` : 'Pendiente de primer inicio de sesión'}
      </div>
    </div>
  );
}

export function UsuariosAdmin() {
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [busqueda, setBusqueda] = useState('');
  const q = useDebounce(busqueda.trim(), 300);
  const { data = [], isLoading, error } = useUsuariosAdmin(filtro === 'todos' ? undefined : filtro, q || undefined);
  const { data: yo } = useUsuarioActual();
  const { toggleActivo } = useAdminUsuarioMutations();
  const registrar = useDisclosure();
  const [editando, setEditando] = useState<Usuario | null>(null);

  return (
    <Card
      title="Usuarios"
      subtitle="Pacientes, médicos y administradores sincronizados desde Entra ID"
      actions={<Button onClick={registrar.open}>+ Registrar médico</Button>}
    >
      <Tabs<Filtro> value={filtro} onChange={setFiltro} items={TABS} />
      <Input
        className="search"
        placeholder="Buscar por nombre o email…"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        aria-label="Buscar usuarios"
      />

      {isLoading ? (
        <Spinner />
      ) : error ? (
        <Alert tone="error">{getErrorMessage(error)}</Alert>
      ) : !data.length ? (
        <EmptyState title="No hay usuarios para este filtro" />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Usuario</th><th>Roles</th><th>Detalle</th><th>Estado</th><th /></tr>
            </thead>
            <tbody>
              {data.map((u) => {
                const esYo = yo?.id === u.id;
                return (
                  <tr key={u.id}>
                    <td>
                      <strong>{u.nombre}</strong> {esYo && <Badge tone="info">tú</Badge>}
                      <div className="muted small">{u.email}</div>
                    </td>
                    <td>
                      <div className="badges">
                        {u.roles.length ? u.roles.map((r) => <Badge key={r} tone="info">{r}</Badge>) : <Badge>Sin rol</Badge>}
                      </div>
                    </td>
                    <td><Detalle u={u} /></td>
                    <td>{u.activo ? <Badge tone="success">Activo</Badge> : <Badge tone="danger">Inactivo</Badge>}</td>
                    <td className="table__actions">
                      {u.roles.includes(AppRole.Medico) && (
                        <Button size="sm" variant="secondary" onClick={() => setEditando(u)}>Editar médico</Button>
                      )}
                      {!esYo && (
                        <Button
                          size="sm"
                          variant={u.activo ? 'danger' : 'secondary'}
                          loading={toggleActivo.isPending && toggleActivo.variables?.id === u.id}
                          onClick={() => toggleActivo.mutate({ id: u.id, activo: u.activo })}
                        >
                          {u.activo ? 'Desactivar' : 'Activar'}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <RegistrarMedicoModal open={registrar.isOpen} onClose={registrar.close} />
      <EditarMedicoModal usuario={editando} onClose={() => setEditando(null)} />
    </Card>
  );
}
