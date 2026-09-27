import { PerfilPacienteForm } from '@/features/usuarios';
import { PageHeader } from '../../layouts/PageHeader';

export function PacientePerfilPage() {
  return (
    <>
      <PageHeader title="Mi perfil" description="Tus datos personales y de previsión" />
      <PerfilPacienteForm />
    </>
  );
}
