# ---------- 1) Build de React (Vite) ----------
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund

COPY . .

# Valores públicos de Entra ID (no son secretos). Se inyectan desde docker-compose.
ARG VITE_ENTRA_CLIENT_ID
ARG VITE_ENTRA_TENANT_ID
ARG VITE_API_SCOPE=api://gestorcitas-api/access_as_user
# Vacío = el frontend usa su propio dominio para la API y el redirect de login
ARG VITE_API_BASE_URL=
ENV VITE_ENTRA_CLIENT_ID=$VITE_ENTRA_CLIENT_ID \
    VITE_ENTRA_TENANT_ID=$VITE_ENTRA_TENANT_ID \
    VITE_API_SCOPE=$VITE_API_SCOPE \
    VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npx vite build

# ---------- 2) Servidor estático ----------
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
