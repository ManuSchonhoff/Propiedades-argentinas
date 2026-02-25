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
```

### 3. Ejecutar SQL

En Supabase Dashboard → SQL Editor:

1. Pegar y ejecutar `supabase/schema.sql` (tablas + RLS + seed)
2. Pegar y ejecutar `supabase/migration-1b.sql` (auth + owner + storage)
3. Pegar y ejecutar `supabase/migration-1c.sql` (profiles + updated_at)

### 4. Configurar Auth

En Supabase → Authentication → Settings:
- Habilitar Email auth (viene habilitado por defecto)
- En "Email Templates" podés personalizar el mail de confirmación

### 5. Correr

```bash
npm run dev
# → http://localhost:3000
```

## Rutas

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | Pública | Home + hero + buscador + featured + footer |
| `/propiedades` | Pública | Listado con filtros (op, loc, type, price) |
| `/propiedades/[id]` | Pública | Detalle + WhatsApp + lightbox + contacto |
| `/explorar` | Pública | Modo Reel — scroll inmersivo |
| `/nosotros` | Pública | Sobre nosotros + misión |
| `/login` | Pública | Login (Supabase Auth) |
| `/registro` | Pública | Crear cuenta |
| `/dashboard` | Autenticada | Panel: gestionar propiedades |
| `/dashboard/[id]/editar` | Autenticada | Editar propiedad |
| `/publicar` | Autenticada | Publicar nueva propiedad (wizard 3 pasos) |

## API Routes

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/leads` | POST | Crear lead (contacto) |
| `/api/listings/[id]/toggle` | POST | Activar ↔ Pausar listing |
| `/api/listings/[id]/delete` | POST | Eliminar listing |
| `/api/listings/[id]/update` | PUT | Actualizar listing |

## Deploy

### Vercel
1. Importar repo de GitHub en [vercel.com](https://vercel.com)
2. Framework: Next.js (auto-detect)
3. Agregar Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Cada commit a `main` → deploy a producción
5. Cada PR → Preview URL automática

### Dev Workflow
Ver [docs/dev-workflow.md](docs/dev-workflow.md) para branching, PRs, y Codex.

## Validar

1. Registrarte en `/registro` → confirmar email
2. Loguearte en `/login` → ir a `/dashboard`
3. Publicar propiedad en `/publicar` (3 pasos) → aparece en dashboard
4. Verificar que aparece en `/propiedades` (si status = active)
5. Modo Reel en `/explorar` → scroll vertical entre propiedades
6. En el detalle, enviar consulta → verificar en Supabase → leads
