# Propiedades Argentinas — Next.js + Supabase

[![GitHub](https://img.shields.io/badge/GitHub-Repo-blue)](https://github.com/ManuSchonhoff/Propiedades-argentinas)

Plataforma inmobiliaria argentina con Next.js 14 App Router, TypeScript y Supabase (Auth + Postgres + Storage).

## Quick Start

```bash
npm install
```

### 1. Crear proyecto Supabase

1. Ir a [supabase.com](https://supabase.com) → New Project
2. Copiar **Project URL** y **anon public key** desde Settings → API

### 2. Variables de entorno

```bash
cp .env.local.example .env.local
```

Editar `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
MP_ACCESS_TOKEN=TEST-xxxx
MP_WEBHOOK_SECRET=xxxx
APP_BASE_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ADMIN_SECRET=change-me
```

### 3. Ejecutar SQL

En Supabase Dashboard → SQL Editor:

1. Pegar y ejecutar `supabase/schema.sql` (tablas + RLS + seed)
2. Pegar y ejecutar `supabase/migration-1b.sql` (auth + owner + storage)
3. Pegar y ejecutar `supabase/migration-1c.sql` (profiles + updated_at)
4. Pegar y ejecutar `supabase/migration-2-monetization.sql` (plans + boosts + webhooks)

### 4. Configurar Auth

En Supabase → Authentication → Settings:
- Habilitar Email auth (viene habilitado por defecto)

### 5. MercadoPago (sandbox)

1. Crear app en [mercadopago.com.ar/developers](https://www.mercadopago.com.ar/developers)
2. Copiar `TEST-ACCESS_TOKEN` → `MP_ACCESS_TOKEN`
3. Copiar webhook secret → `MP_WEBHOOK_SECRET`
4. Ejecutar setup de planes:
```bash
curl -X POST http://localhost:3000/api/admin/mp/create-plans \
  -H "x-admin-secret: dev-secret"
```

### 6. Correr

```bash
npm run dev
# → http://localhost:3000
```

## Rutas

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | Pública | Home + hero + buscador + featured + footer |
| `/propiedades` | Pública | Listado con filtros + boost ranking |
| `/propiedades/[id]` | Pública | Detalle + WhatsApp + lightbox + contacto |
| `/explorar` | Pública | Modo Reel — scroll inmersivo |
| `/nosotros` | Pública | Sobre nosotros + misión |
| `/pricing` | Pública | **Planes de suscripción** |
| `/login` | Pública | Login (Supabase Auth) |
| `/registro` | Pública | Crear cuenta |
| `/dashboard` | Autenticada | Panel: gestionar propiedades + boost |
| `/dashboard/[id]/editar` | Autenticada | Editar propiedad |
| `/dashboard/billing` | Autenticada | **Estado del plan** |
| `/publicar` | Autenticada | Publicar propiedad (wizard 3 pasos) |

## API Routes

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/leads` | POST | Crear lead (contacto) |
| `/api/listings/[id]/toggle` | POST | Activar ↔ Pausar listing |
| `/api/listings/[id]/delete` | POST | Eliminar listing |
| `/api/listings/[id]/update` | PUT | Actualizar listing |
| `/api/billing/subscribe` | POST | **Crear suscripción MP** |
| `/api/boosts/create-preference` | POST | **Checkout Pro para boost** |
| `/api/mercadopago/webhook` | POST | **Webhook MP** |
| `/api/admin/mp/create-plans` | POST | **Setup planes en MP (admin)** |

## Deploy

### Vercel
1. Importar repo de GitHub en [vercel.com](https://vercel.com)
2. Framework: Next.js (auto-detect)
3. Agregar Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `MP_ACCESS_TOKEN`
   - `MP_WEBHOOK_SECRET`
   - `APP_BASE_URL` (tu dominio de producción)
   - `ADMIN_SECRET` (para admin endpoints)
4. Cada commit a `main` → deploy a producción
5. Cada PR → Preview URL automática

### Dev Workflow
Ver [docs/dev-workflow.md](docs/dev-workflow.md) para branching, PRs, y Codex.
