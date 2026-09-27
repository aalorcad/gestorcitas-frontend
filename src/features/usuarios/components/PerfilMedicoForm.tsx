import { useEffect, useState, type FormEvent } from 'react';
import { Alert, Badge, Button, Card, Field, Input, Spinner, Textarea } from '@/components';
import { usePerfilMutations } from '../hooks/usePerfilMutations';
import { useUsuarioActual } from '../hooks/useUsuarioActual';

export function PerfilMedicoForm() {
  const { data: usuario, isLoading } = useUsuarioActual();
  const { guardarMedico } = usePerfilMutations();
  const [telefono, setTelefono] = useState('');
  const [biografia, setBiografia] = useState('');

  useEffect(() => {
    if (!usuario) return;
    setTelefono(usuario.telefono ?? '');
    setBiografia(usuario.perfilMedico?.biografia ?? '');
  }, [usuario]);

  if (isLoading || !usuario) return <Spinner />;
  const perfil = usuario.perfilMedico;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    guardarMedico.mutate({ telefono: telefono.trim() || undefined, biografia: biografia.trim() || undefined });
  };

  return (
    <div className="grid grid--2">
      <Card title="Datos profesionales" subtitle="Administrados por la clínica">
        {!perfil?.especialidadAsignada && (
          <Alert tone="info">
            Aún no tienes especialidad asignada, por lo que no apareces para reserva. Un administrador debe completarla.
          </Alert>
        )}
        <dl className="dl">
          <dt>Nombre</dt><dd>{usuario.nombre}</dd>
          <dt>Email</dt><dd>{usuario.email}</dd>
          <dt>Especialidad</dt>
          <dd>{perfil?.especialidadNombre ? <Badge tone="info">{perfil.especialidadNombre}</Badge> : '—'}</dd>
          <dt>Registro (SIS)</dt><dd>{perfil?.registroProfesional ?? '—'}</dd>
          <dt>Estado</dt>
          <dd>{perfil?.especialidadAsignada ? <Badge tone="success">Disponible para reservas</Badge> : <Badge tone="warning">Pendiente</Badge>}</dd>
        </dl>
      </Card>

      <Card title="Información de contacto" subtitle="Tus pacientes verán tu presentación al reservar">
        <form className="form" onSubmit={submit}>
          <Field label="Teléfono" htmlFor="med-tel" hint="Ej: +56 9 1234 5678">
            <Input id="med-tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} maxLength={16} />
          </Field>
          <Field label="Presentación" htmlFor="med-bio">
            <Textarea id="med-bio" rows={5} maxLength={500} value={biografia} onChange={(e) => setBiografia(e.target.value)} />
          </Field>
          <div className="form__actions">
            <Button type="submit" loading={guardarMedico.isPending}>Guardar</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
