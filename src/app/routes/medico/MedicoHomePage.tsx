import { Alert } from '@/components';
import { AgendaHoyCard } from '@/features/citas';
import { useUsuarioActual } from '@/features/usuarios';
import { PageHeader } from '../../layouts/PageHeader';

export function MedicoHomePage() {
  const { data: usuario } = useUsuarioActual();
  const perfil = usuario?.perfilMedico;
  return (
    <>
      <PageHeader
        title={`Hola, ${usuario?.nombre ?? ''}`}
        description={perfil?.especialidadNombre ? `Portal médico · ${perfil.especialidadNombre}` : 'Portal médico'}
      />
      {perfil && !perfil.especialidadAsignada && (
        <Alert tone="info">Aún no tienes especialidad asignada; los pacientes no pueden reservar contigo todavía.</Alert>
      )}
      <AgendaHoyCard />
    </>
  );
}
