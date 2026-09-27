import { Link } from 'react-router-dom';
import { Alert } from '@/components';
import { useUsuarioActual } from '../hooks/useUsuarioActual';

/** Aviso al paciente cuando le faltan datos obligatorios para reservar. */
export function PerfilIncompletoAlert() {
  const { data } = useUsuarioActual();
  if (!data?.perfilPaciente || data.perfilPaciente.completo) return null;
  return (
    <Alert tone="info">
      Para reservar debes completar tu perfil (RUT, fecha de nacimiento y previsión).{' '}
      <Link className="link" to="/paciente/perfil">Completar ahora →</Link>
    </Alert>
  );
}
