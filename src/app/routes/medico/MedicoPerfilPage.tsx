import { PerfilMedicoForm } from '@/features/usuarios';
import { PageHeader } from '../../layouts/PageHeader';

export function MedicoPerfilPage() {
  return (
    <>
      <PageHeader title="Mi perfil profesional" />
      <PerfilMedicoForm />
    </>
  );
}
