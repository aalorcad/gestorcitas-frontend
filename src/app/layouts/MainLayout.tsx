import { NavLink, Outlet } from 'react-router-dom';
import { UserMenu, useAuth } from '@/features/auth';
import logo from '@/assets/logo.svg';
import { NAV_SECTIONS } from './navigation';
import { Toaster } from './Toaster';

const link = ({ isActive }: { isActive: boolean }) => (isActive ? 'side__link side__link--active' : 'side__link');

export function MainLayout() {
  const { hasRole } = useAuth();
  const secciones = NAV_SECTIONS.filter((s) => hasRole(s.rol));

  return (
    <div className="shell">
      <header className="topbar">
        <NavLink to="/" className="brand">
          <img src={logo} alt="" width={28} height={28} />
          <span>Gestor de Citas</span>
        </NavLink>
        <UserMenu />
      </header>
      <div className="body">
        <aside className="side">
          {secciones.map((s) => (
            <nav key={s.rol} className="side__section" aria-label={s.titulo}>
              <p className="side__title">{s.titulo}</p>
              {s.items.map((it) => (
                <NavLink key={it.to} to={it.to} end={it.end} className={link}>
                  {it.label}
                </NavLink>
              ))}
            </nav>
          ))}
          <nav className="side__section" aria-label="Cuenta">
            <p className="side__title">Cuenta</p>
            <NavLink to="/sesion" className={link}>Sesión y token</NavLink>
          </nav>
        </aside>
        <main className="content">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  );
}
