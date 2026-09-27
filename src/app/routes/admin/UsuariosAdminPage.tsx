import { UsuariosAdmin } from '@/features/usuarios';
import { PageHeader } from '../../layouts/PageHeader';

export function UsuariosAdminPage() {
  return (
    <>
      <PageHeader title="Gestión de usuarios" description="Activa o desactiva cuentas y administra los datos profesionales de los médicos" />
      <UsuariosAdmin />
    </>
  );
}
