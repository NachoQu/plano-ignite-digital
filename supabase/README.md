# Supabase Setup - Blog de Noticias Tech

## 1. Crear proyecto Supabase

1. Ir a [supabase.com](https://supabase.com) y crear cuenta/proyecto
2. Copiar **Project URL** y **anon/public key** del dashboard
3. Crear archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

## 2. Ejecutar migraciones

En el SQL Editor de Supabase, ejecutar en orden:

1. `migrations/001_create_blog_tables.sql` - Crea la tabla `blog_posts` con RLS
2. `migrations/002_seed_sample_posts.sql` - Inserta 3 artículos de ejemplo

## 3. Crear bucket de Storage

En Supabase Dashboard > Storage:

1. Crear bucket llamado `blog-images`
2. Marcar como **Public**
3. En Policies, agregar una policy de SELECT público:
   - Name: `Public read access`
   - Target roles: `anon`
   - Operation: `SELECT`

## 4. Deploy Edge Function

### Instalar Supabase CLI

```bash
npm install -g supabase
```

### Login y link al proyecto

```bash
supabase login
supabase link --project-ref tu-project-ref
```

### Configurar secrets

```bash
supabase secrets set GNEWS_API_KEY=tu-gnews-key
supabase secrets set OPENAI_API_KEY=tu-openai-key
supabase secrets set SUPABASE_URL=https://tu-proyecto.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

### Deploy

```bash
supabase functions deploy generate-blog-posts
```

### Test manual

```bash
curl -X POST https://tu-proyecto.supabase.co/functions/v1/generate-blog-posts \
  -H "Authorization: Bearer tu-anon-key" \
  -H "Content-Type: application/json" \
  -d '{"topic": "ai"}'
```

## 5. Configurar Cron (automatización)

### Opción A: pg_cron en Supabase (recomendado)

Ejecutar en SQL Editor:

```sql
-- Habilitar extensión pg_cron
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Programar L/Mi/V a las 08:00 UTC (05:00 Argentina)
SELECT cron.schedule(
  'generate-blog-monday',
  '0 8 * * 1',
  $$SELECT net.http_post(
    url := 'https://tu-proyecto.supabase.co/functions/v1/generate-blog-posts',
    headers := '{"Authorization": "Bearer tu-service-role-key", "Content-Type": "application/json"}'::jsonb,
    body := '{"topic": "ai"}'::jsonb
  )$$
);

SELECT cron.schedule(
  'generate-blog-wednesday',
  '0 8 * * 3',
  $$SELECT net.http_post(
    url := 'https://tu-proyecto.supabase.co/functions/v1/generate-blog-posts',
    headers := '{"Authorization": "Bearer tu-service-role-key", "Content-Type": "application/json"}'::jsonb,
    body := '{"topic": "nocode"}'::jsonb
  )$$
);

SELECT cron.schedule(
  'generate-blog-friday',
  '0 8 * * 5',
  $$SELECT net.http_post(
    url := 'https://tu-proyecto.supabase.co/functions/v1/generate-blog-posts',
    headers := '{"Authorization": "Bearer tu-service-role-key", "Content-Type": "application/json"}'::jsonb,
    body := '{"topic": "webdev"}'::jsonb
  )$$
);
```

### Opción B: Cron externo (cron-job.org)

1. Ir a [cron-job.org](https://cron-job.org) (gratis)
2. Crear 3 cron jobs que hagan POST a la Edge Function URL
3. Schedule: Lunes/Miércoles/Viernes a las 08:00 UTC

## 6. Obtener API Key de GNews (gratis)

1. Ir a [gnews.io](https://gnews.io)
2. Crear cuenta gratuita
3. Copiar el API key
4. Tier gratuito: 100 requests/día (más que suficiente)

## Costos estimados mensuales

- **Supabase:** Gratis (Free tier)
- **GNews API:** Gratis (100 req/día)
- **OpenAI GPT-4o-mini:** ~$2-3/mes (12 artículos/mes)
- **DALL-E 3:** ~$1-2/mes (12 imágenes/mes)
- **Total:** ~$3-5/mes
