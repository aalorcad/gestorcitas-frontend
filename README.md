# gestorcitas-frontend

Frontend de **GestorCitaCloudNative**: React 18 + Vite + TypeScript, con login **OAuth 2.0 / OpenID Connect** en
Microsoft Entra ID (MSAL). Todas las llamadas van al backend a través de **AWS API Gateway** con `Authorization: Bearer <JWT>`.

| Repositorio | Contenido |
|---|---|
| **gestorcitas-frontend** (este) | React + MSAL |
| [gestorcitas-backend](https://github.com/aalorcad/gestorcitas-backend) | BFF y microservicios Spring Boot |
| [gestorcitas-rabbitmq](https://github.com/aalorcad/gestorcitas-rabbitmq) | Clúster RabbitMQ de 2 nodos |
| [gestorcitas-kafka](https://github.com/aalorcad/gestorcitas-kafka) | Clúster Kafka: 3 Zookeeper + 3 brokers + Kafka UI |

## Portales por rol

| Rol (App Role de Entra ID) | Ruta | Pantallas |
|---|---|---|
| Paciente | `/paciente` | Inicio, Mi perfil, Reservar cita, Mis citas |
| Medico | `/medico` | Inicio, Mi agenda (confirmar y atender), Mi perfil |
| Admin | `/admin` | Panel, Usuarios, Especialidades, Citas, **Mensajería** (RabbitMQ), **Streaming (Kafka)**, **Analítica** |
| Todos | `/sesion` | Claims del token validados por el BFF |

**EP5 (streaming):**
- **Streaming (Kafka)**: brokers y controlador del clúster; tópicos con particiones, réplicas (líder, ISR), offsets y configuración
  (retención); creación de tópicos y aumento de particiones; grupos de consumidores con su lag por partición y reinicio de offsets.
  Consume `/api/admin/kafka/**` (ms-kafka-admin).
- **Analítica**: indicadores calculados en tiempo real por ms-analitica a partir de los eventos de Kafka
  (reservas por especialidad y por médico, tasa de cancelación, estado de usuarios, últimos eventos con partición y offset).
  Se actualiza sola cada 5 segundos. Consume `/api/analitica/**`.

## Seguridad

- `@azure/msal-react`: login y logout con Entra ID; el token se pide con el scope `access_as_user` de la API.
- Guards en cadena (`src/app/router.tsx`): **AuthGuard** (sesión) → **UsuarioGate** (usuario sincronizado y activo) → **RoleGuard** (rol del portal).
- Cliente HTTP (`src/services`) con interceptor que adjunta el JWT a cada llamada.

## Estructura

```
src/
├── app/            router, layouts (menú por rol), providers, routes/{paciente,medico,admin}/
├── components/ui/  componentes visuales sin lógica de negocio
├── features/       auth · usuarios · catalogo · citas · mensajeria · kafka · analitica
│                   (cada una con api/, hooks/ (React Query), components/ y types/)
├── hooks/  services/  stores/  types/  utils/
```

## Ejecutar

**Desarrollo** (Node 20+):
```bash
cp .env.example .env     # Client ID y Tenant ID del SPA, scope de la API, VITE_API_BASE_URL=http://localhost:8080
npm install
npm run dev              # http://localhost:5173
npm run typecheck
```

**AWS (EC2-C `gestorcitas-front`)**: nginx sirve el build y API Gateway lo publica por HTTPS (`GET /` y `GET /{proxy+}`).
```bash
cp .env.example .env     # VITE_API_BASE_URL vacío: usa el mismo dominio de API Gateway
docker compose up -d --build
```
En Entra ID, la App Registration del SPA debe tener como Redirect URI la URL de API Gateway (y `/login`).
