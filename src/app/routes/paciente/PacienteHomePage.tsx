import { Link } from 'react-router-dom';
import { Card } from '@/components';
import { ProximasCitasCard, ResumenPacienteStats } from '@/features/citas';
import { PerfilIncompletoAlert, useUsuarioActual } from '@/features/usuarios';
import { PageHeader } from '../../layouts/PageHeader';

export function PacienteHomePage() {
  const { data: usuario } = useUsuarioActual();
  return (
    <>
      <PageHeader title={`Hola, ${usuario?.nombre ?? ''}`} description="Portal del paciente" />
      <PerfilIncompletoAlert />
      <ResumenPacienteStats />
      <div className="grid grid--2">
        <ProximasCitasCard />
        <Card title="¿Necesitas una hora?">
          <p>Elige especialidad, médico y un bloque disponible de lunes a viernes entre 08:00 y 18:00.</p>
          <Link className="link" to="/paciente/reservar">Reservar una cita →</Link>
        </Card>
      </div>
    </>
  );
}
