# Nuevo Parket — Autenticación y Esquema (FASE 1)

## Pasos para ejecutar localmente

1. Renombra `.env.example` a `.env` y configura el parámetro `DATABASE_URL` y `AUTH_SECRET`:
```bash
cp .env.example .env
```
(Para generar un `AUTH_SECRET`, usa `npx auth secret` o corre `openssl rand -base64 32`)

2. Aplica el esquema de Prisma en tu base de datos PostgreSQL:
```bash
npx prisma db push
```

3. Ejecuta el Seed para popular los 4 usuarios (slots) y 5 productos de ejemplo:
```bash
npm run db:seed
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

Las credenciales por defecto son:
- **Admin**: `admin@np.com` / `admin123`
- **Vendedor Quilmes**: `quilmes@np.com` / `vend123`
- **Vendedor La Plata**: `laplata@np.com` / `vend123`
- **Vendedor Gonnet**: `gonnet@np.com` / `vend123`
