

# Configurar OpenAI y GNews para generacion automatica de blog posts

## Resumen

El proyecto ya tiene toda la logica de la edge function `generate-blog-posts` implementada. Solo falta:
1. Configurar los secrets (API keys) necesarios
2. Registrar la edge function en el archivo de configuracion
3. Crear el bucket de storage para las imagenes generadas

## Pasos

### 1. Configurar secrets necesarios
Se necesitan dos API keys externas:
- **OPENAI_API_KEY**: Para generar el contenido del blog con GPT-4o-mini y las imagenes con DALL-E 3. Se obtiene en [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **GNEWS_API_KEY**: Para buscar noticias tech como base de los articulos. Se obtiene gratis en [gnews.io](https://gnews.io) (100 requests/dia)

### 2. Registrar la edge function en config.toml
Agregar la configuracion de `generate-blog-posts` con `verify_jwt = false` para poder invocarla desde cron jobs.

### 3. Crear bucket de storage
Crear el bucket `blog-images` para almacenar las imagenes generadas por DALL-E.

### 4. Agregar CORS headers a la edge function
La edge function actual no tiene headers CORS, lo cual puede causar problemas si se la invoca desde el frontend.

## Detalle tecnico

- La edge function `generate-blog-posts/index.ts` ya existe y usa `_shared/openai.ts`, `_shared/gnews.ts` y `_shared/supabase-admin.ts`
- Genera contenido bilingue (ES/EN) usando GPT-4o-mini
- Genera imagenes con DALL-E 3 (con fallback a Unsplash)
- Sube imagenes al bucket `blog-images`
- Inserta posts en la tabla `blog_posts`

### Archivos a modificar
- `supabase/config.toml` - Registrar la edge function
- `supabase/functions/generate-blog-posts/index.ts` - Agregar CORS headers

### Secrets a configurar
- `OPENAI_API_KEY`
- `GNEWS_API_KEY`

### Migracion SQL
- Crear bucket `blog-images` con acceso publico de lectura

