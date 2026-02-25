# Development Workflow

**Repo:** [github.com/ManuSchonhoff/Propiedades-argentinas](https://github.com/ManuSchonhoff/Propiedades-argentinas)

## Branching Strategy

```
main ────── Production (auto-deploy en Vercel)
  └── feature/* ── PRs con Preview Deployments
```

### Ramas
| Rama | Propósito | Deploy |
|------|-----------|--------|
| `main` | Producción estable | Auto-deploy a Vercel Production |
| `feature/*` | Nuevas features | Preview URL por cada PR |
| `fix/*` | Bugfixes | Preview URL por cada PR |

## Flujo de Trabajo

### 1. Crear Feature Branch
```bash
git checkout -b feature/nombre-de-la-feature
# ... hacé tus cambios ...
git add .
git commit -m "feat: descripción del cambio"
git push -u origin feature/nombre-de-la-feature
```

### 2. Crear Pull Request
- Ir a GitHub → Pull Requests → New
- Base: `main` ← Compare: `feature/nombre-de-la-feature`
- Agregar descripción de los cambios
- **Vercel generará automáticamente una Preview URL** en los comentarios del PR

### 3. Review con Preview
- Vercel publica una URL de preview para cada PR
- Compartir la URL con el equipo para testing
- La URL se actualiza con cada push al branch

### 4. Merge a Producción
- Aprobar el PR en GitHub
- Click "Merge pull request"
- Vercel auto-deploya a producción

## Codex / ChatGPT Integration

### Setup
1. Ir a [chatgpt.com](https://chatgpt.com) → Codex
2. Conectar tu repo de GitHub
3. Codex puede:
   - Leer el código del repo
   - Crear PRs con cambios sugeridos
   - Revisar PRs existentes

### Flujo con Codex
1. **Pedir un cambio**: Describí qué querés en Codex
2. **Codex crea un PR**: Con los cambios propuestos
3. **Preview automático**: Vercel genera URL para testear
4. **Revisar y mergear**: Si los cambios están bien, merge a main

### Ejemplo de Prompt para Codex
```
Agregá un filtro de precio con slider en /propiedades.
Usá las clases CSS existentes, no cambies el diseño.
```

## Environment Variables

### Local (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### Vercel
Configurar en: Project Settings → Environment Variables
- Agregar las mismas variables para **Production** y **Preview**

## Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Build de producción (verificar antes de push)
npm run build

# Verificar lint
npm run lint
```
