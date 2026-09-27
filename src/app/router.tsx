import { createBrowserRouter } from 'react-router-dom';
import { AuthGuard, RoleGuard } from '@/features/auth';
import { UsuarioGate } from '@/features/usuarios';
import { AppRole } from '@/types';
import { MainLayout } from './layouts/MainLayout';
import { HomeRedirect } from './routes/HomeRedirect';
import { LoginPage } from './routes/LoginPage';
import { NotFoundPage } from './routes/NotFoundPage';
import { RegistroPage } from './routes/RegistroPage';
import { SesionPage } from './routes/SesionPage';
import { UnauthorizedPage } from './routes/UnauthorizedPage';
import { PacienteHomePage } from './routes/paciente/PacienteHomePage';
import { PacientePerfilPage } from './routes/paciente/PacientePerfilPage';
import { ReservarCitaPage } from './routes/paciente/ReservarCitaPage';
import { MisCitasPage } from './routes/paciente/MisCitasPage';
import { MedicoHomePage } from './routes/medico/MedicoHomePage';
import { AgendaPage } from './routes/medico/AgendaPage';
import { MedicoPerfilPage } from './routes/medico/MedicoPerfilPage';
import { AdminDashboardPage } from './routes/admin/AdminDashboardPage';
import { UsuariosAdminPage } from './routes/admin/UsuariosAdminPage';
import { CatalogoAdminPage } from './routes/admin/CatalogoAdminPage';
import { CitasAdminPage } from './routes/admin/CitasAdminPage';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/registro', element: <RegistroPage /> },
  {
    // Guard 1: sesión iniciada en Entra ID
    element: <AuthGuard />,
    children: [
      {
        // Guard 2: usuario sincronizado y activo en ms-usuarios
        element: <UsuarioGate />,
        children: [
          {
            element: <MainLayout />,
            children: [
              { index: true, element: <HomeRedirect /> },
              { path: 'sesion', element: <SesionPage /> },
              { path: 'no-autorizado', element: <UnauthorizedPage /> },
              {
                // Guard 3: rol — Portal Paciente
                path: 'paciente',
                element: <RoleGuard roles={[AppRole.Paciente]} />,
                children: [
                  { index: true, element: <PacienteHomePage /> },
                  { path: 'perfil', element: <PacientePerfilPage /> },
                  { path: 'reservar', element: <ReservarCitaPage /> },
                  { path: 'mis-citas', element: <MisCitasPage /> },
                ],
              },
              {
                // Portal Médico
                path: 'medico',
                element: <RoleGuard roles={[AppRole.Medico]} />,
                children: [
                  { index: true, element: <MedicoHomePage /> },
                  { path: 'agenda', element: <AgendaPage /> },
                  { path: 'perfil', element: <MedicoPerfilPage /> },
                ],
              },
              {
                // Portal Administrador
                path: 'admin',
                element: <RoleGuard roles={[AppRole.Admin]} />,
                children: [
                  { index: true, element: <AdminDashboardPage /> },
                  { path: 'usuarios', element: <UsuariosAdminPage /> },
                  { path: 'catalogo', element: <CatalogoAdminPage /> },
                  { path: 'citas', element: <CitasAdminPage /> },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
