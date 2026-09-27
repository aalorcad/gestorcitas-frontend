import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, EmptyState, Field, Input, Spinner, Textarea } from '@/components';
import { EspecialidadSelect, useEspecialidades } from '@/features/catalogo';
import { MedicoPicker, useUsuarioActual } from '@/features/usuarios';
import { formatCLP, todayIsoDate } from '@/utils';
import { useCitaMutations } from '../hooks/useCitaMutations';
import { HorarioPicker } from './HorarioPicker';

/** Flujo de reserva del Paciente: especialidad → médico → fecha → bloque horario → motivo. */
export function ReservaForm() {
  const navigate = useNavigate();
  const { reservar } = useCitaMutations();
  const { data: usuario, isLoading: cargandoUsuario } = useUsuarioActual();
  const { data: especialidades = [] } = useEspecialidades(true);

  const [especialidadId, setEspecialidadId] = useState<number | ''>('');
  const [medicoId, setMedicoId] = useState<number | null>(null);
  const [fecha, setFecha] = useState(todayIsoDate());
  const [fechaHora, setFechaHora] = useState<string | null>(null);
  const [motivo, setMotivo] = useState('');

  const onEspecialidad = (id: number | '') => {
    setEspecialidadId(id);
    setMedicoId(null);
    setFechaHora(null);
  };

  const especialidad = especialidades.find((e) => e.id === especialidadId);

  if (cargandoUsuario) return <Spinner />;
  if (usuario?.perfilPaciente && !usuario.perfilPaciente.completo) {
    return (
      <EmptyState
        title="Completa tu perfil para reservar"
        description="Necesitamos tu RUT, fecha de nacimiento y previsión."
        action={<Button onClick={() => navigate('/paciente/perfil')}>Ir a mi perfil</Button>}
      />
    );
  }

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (medicoId === null || !fechaHora) return;
    reservar.mutate(
      { medicoId, fechaHora, motivo: motivo.trim() || undefined },
      { onSuccess: () => navigate('/paciente/mis-citas') },
    );
  };

  return (
    <form onSubmit={submit} className="stack">
      <Card title="1. Especialidad y médico">
        <Field label="Especialidad" htmlFor="especialidad">
          <EspecialidadSelect value={especialidadId} onChange={onEspecialidad} />
        </Field>
        {especialidad && (
          <p className="muted small">
            Valor consulta: <strong>{formatCLP(especialidad.valorConsulta)}</strong>
            {especialidad.descripcion && ` · ${especialidad.descripcion}`}
          </p>
        )}
        <MedicoPicker
          especialidadId={especialidadId}
          value={medicoId}
          onChange={(id) => {
            setMedicoId(id);
            setFechaHora(null);
          }}
        />
      </Card>

      <Card title="2. Fecha y horario">
        <Field label="Fecha" htmlFor="fecha">
          <Input
            id="fecha"
            type="date"
            min={todayIsoDate()}
            value={fecha}
            onChange={(e) => {
              setFecha(e.target.value);
              setFechaHora(null);
            }}
          />
        </Field>
        <HorarioPicker medicoId={medicoId} fecha={fecha} value={fechaHora} onChange={setFechaHora} />
      </Card>

      <Card title="3. Motivo de la consulta">
        <Field label="Motivo (opcional)" htmlFor="motivo">
          <Textarea id="motivo" rows={3} maxLength={255} value={motivo} onChange={(e) => setMotivo(e.target.value)} />
        </Field>
        <div className="form__actions">
          <Button type="submit" disabled={medicoId === null || !fechaHora} loading={reservar.isPending}>
            Reservar cita
          </Button>
        </div>
      </Card>
    </form>
  );
}
