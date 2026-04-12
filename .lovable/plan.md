

## Plan: Dashboard de Prospección de Clientes con Firecrawl

### Resumen
Crear un dashboard privado (protegido con login) que permita buscar y guardar potenciales clientes por nicho usando Firecrawl para scraping. Se almacenarán: nombre, ciudad, teléfono (con link a WhatsApp), email y nicho.

### Paso 1: Conectar Firecrawl
- Usar `standard_connectors--connect` para vincular Firecrawl al proyecto (necesario para el scraping web)

### Paso 2: Crear tabla `leads` en la base de datos
```sql
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  whatsapp_link text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  niche text NOT NULL DEFAULT '',
  source_url text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own leads" ON public.leads
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```

### Paso 3: Crear Edge Function `firecrawl-scrape`
- Edge function que recibe una URL o query de búsqueda
- Usa Firecrawl para scraping/search de páginas
- Extrae nombre, ciudad, teléfono y email del contenido scrapeado usando parsing
- Devuelve los datos estructurados al frontend

### Paso 4: Crear página `/prospeccion`
- Protegida con `useAuth` (redirige a login si no hay sesión)
- **Sección de búsqueda**: input para URL o término + selector de nicho (ej: "restaurantes", "inmobiliarias", "talleres", etc.)
- **Resultados del scraping**: tabla con los datos extraídos (nombre, ciudad, teléfono, email)
- **Acción de guardar**: botón para guardar cada lead en la tabla `leads`
- **Lista de leads guardados**: tabla con filtro por nicho, con links directos a WhatsApp y email
- **Acciones rápidas**: botones para contactar por WhatsApp o email directamente

### Paso 5: Agregar ruta en App.tsx
- Agregar `/prospeccion` como ruta protegida

### Detalles Técnicos
- Se usará Lovable AI (Gemini) dentro de la edge function para extraer datos estructurados (nombre, teléfono, email, ciudad) del markdown scrapeado por Firecrawl
- La tabla `leads` tiene RLS para que solo el usuario autenticado vea sus propios leads
- El link de WhatsApp se genera automáticamente: `https://wa.me/{phone}`

