import { useEffect, useState, type FormEvent } from 'react';
import { Badge, Button, Card, Field, Input, Select, Spinner } from '@/components';
import { calcularEdad, formatDateTime, formatRut } from '@/utils';
import { usePerfilMutations } from '../hooks/usePerfilMutations';
import { useUsuarioActual } from '../hooks/useUsuarioActual';
import { PREVISIONES, type Prevision } from '../types';

export function PerfilPacienteForm() {
  const { data: usuario, isLoading } = useUsuarioActual();
  const { guardarPaciente } = usePerfilMutations();

  const [rut, setRut] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [prevision, setPrevision] = useState<Prevision | ''>('');
  const [telefono, setTelefono] = useState('');

  useEffect(() => {
    if (!usuario) return;
    setRut(usuario.perfilPaciente?.rut ? formatRut(usuario.perfilPaciente.rut) : '');
    setFechaNacimiento(usuario.perfilPaciente?.fechaNacimiento ?? '');
    setPrevision(usuario.perfilPaciente?.prevision ?? '');
    setTelefono(usuario.telefono ?? '');
  }, [usuario]);

  if (isLoading || !usuario) return <Spinner />;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!prevision) return;
    guardarPaciente.mutate({ rut, fechaNacimiento, prevision, telefono: telefono.trim() || undefined });
  };

  const completo = usuario.perfilPaciente?.completo ?? false;
  const edad = calcularEdad(usuario.perfilPaciente?.fechaNacimiento);

  return (
    <div className="grid grid--2">
      <Card
        title="Datos personales"
        subtitle="Necesarios para agendar y para la ficha clínica"
        actions={completo ? <Badge tone="success">Perfil completo</Badge> : <Badge tone="warning">Perfil incompleto</Badge>}
      >
        <form className="form" onSubmit={submit}>
          <Field label="RUT" htmlFor="rut" hint="Formato 12.345.678-5">
            <Input id="rut" value={rut} onChange={(e) => setRut(e.target.value)} onBlur={() => setRut(formatRut(rut))} required maxLength={12} />
          </Field>
          <Field label="Fecha de nacimiento" htmlFor="fnac">
            <Input id="fnac" type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} required />
          </Field>
          <Field label="Previsión" htmlFor="prev">
            <Select
              id="prev"
              value={prevision}
              placeholder="Selecciona tu previsión"
              options={PREVISIONES.map((p) => ({ value: p, label: p }))}
              onChange={(e) => setPrevision(e.target.value as Prevision | '')}
              required
            />
          </Field>
          <Field label="Teléfono" htmlFor="tel" hint="Opcional. Ej: +56 9 1234 5678">
            <Input id="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} maxLength={16} />
          </Field>
          <div className="form__actions">
            <Button type="submit" loading={guardarPaciente.isPending}>Guardar perfil</Button>
          </div>
        </form>
      </Card>

      <Card title="Mi cuenta">
        <dl className="dl">
          <dt>Nombre</dt><dd>{usuario.nombre}</dd>
          <dt>Email</dt><dd>{usuario.email}</dd>
          <dt>RUT</dt><dd>{formatRut(usuario.perfilPaciente?.rut)}</dd>
          <dt>Edad</dt><dd>{edad !== null ? `${edad} años` : '—'}</dd>
          <dt>Previsión</dt><dd>{usuario.perfilPaciente?.prevision ?? '—'}</dd>
          <dt>Paciente desde</dt><dd>{formatDateTime(usuario.creadoEn)}</dd>
        </dl>
      </Card>
    </div>
  );
}
