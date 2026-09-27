import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, Field, Input } from '@/components';
import logo from '@/assets/logo.svg';
import { signUpEnabled } from '@/services';
import { useAuth } from '../hooks/useAuth';

/**
 * Registro de pacientes.
 *  - Con Microsoft Entra External ID (VITE_ENTRA_SIGNUP=true): abre el flujo de usuario
 *    "Registrarse e iniciar sesión" de Entra (prompt=create), que crea la cuenta en el tenant.
 *  - Con un tenant workforce: el autoregistro no existe; se informa y la cuenta la crea un administrador.
 */
export function RegistroCard() {
  const { signUp, isLoading } = useAuth();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [enviado, setEnviado] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (signUpEnabled) {
      void signUp();
      return;
    }
    setEnviado(true);
  };

  return (
    <div className="login-card">
      <img src={logo} alt="" width={56} height={56} />
      <h1>Crear cuenta de paciente</h1>
      {enviado ? (
        <Alert tone="info">
          El registro de cuentas no está habilitado en este entorno. Requiere Microsoft Entra External ID,
          que la suscripción disponible no permite crear. Pide tu cuenta a un administrador; no se guardó
          ningún dato.
        </Alert>
      ) : (
        <p>Completa tus datos para crear tu cuenta.</p>
      )}
      <form onSubmit={onSubmit} className="registro-form">
        <Field label="Nombre completo" htmlFor="reg-nombre">
          <Input id="reg-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required maxLength={120} />
        </Field>
        <Field label="Correo electrónico" htmlFor="reg-email">
          <Input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Field>
        <Field label="Contraseña" htmlFor="reg-password" hint="Mínimo 8 caracteres">
          <Input id="reg-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                 required minLength={8} autoComplete="new-password" />
        </Field>
        <Button type="submit" loading={isLoading} className="login-card__btn">Crear cuenta</Button>
      </form>
      <small><Link to="/login">¿Ya tienes cuenta? Inicia sesión</Link></small>
    </div>
  );
}
