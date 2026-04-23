
Objetivo: hacer que el Home vuelva a renderizar aunque la configuración pública del backend no llegue al bundle, y evitar que cualquier ruta interna vuelva a tirar abajo toda la app.

1. Blindar el cliente compartido del backend
- Reemplazar la inicialización “siempre al importar” de `src/integrations/supabase/client.ts` por una inicialización segura.
- El cliente debe:
  - leer `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` cuando existan
  - tener fallback con valores públicos seguros del proyecto si el preview no inyecta esas variables
  - exponer un flag tipo `isBackendConfigured` / `backendConfigError` para que la UI pueda decidir qué renderizar
- Resultado: desaparece el crash global `supabaseUrl is required`.

2. Evitar imports eager de páginas que dependen del backend
- Convertir en lazy imports las rutas que hoy arrastran el cliente al bundle principal:
  - `Blog`
  - `BlogPost`
  - `Login`
  - `Facturacion`
  - `Prospeccion`
  - `ArcaTester`
- En `src/App.tsx`, envolver esas rutas en `Suspense`.
- Resultado: entrar a `/` no ejecuta código de autenticación, blog o testing antes de tiempo.

3. Aislar el bloque del blog dentro del Home
- `src/pages/Index.tsx` hoy importa `BlogPreview`, y `BlogPreview` usa hooks que pegan al backend.
- Pasar `BlogPreview` a carga diferida o agregar un wrapper que solo lo monte cuando la configuración pública esté disponible.
- Si no hay backend disponible, mostrar fallback liviano:
  - ocultar la sección
  - o renderizar un estado neutro sin consulta
- Resultado: el Home puede cargar incluso si el blog no puede consultar datos.

4. Hacer que los hooks del blog fallen de forma controlada
- Ajustar `src/hooks/useBlogPosts.ts` para no ejecutar queries cuando `isBackendConfigured` sea false.
- Devolver estados vacíos/controlados en vez de lanzar excepción desde el import chain.
- Resultado: `Blog`, `BlogPost` y `BlogPreview` dejan de ser puntos de quiebre del arranque.

5. Proteger páginas privadas y formularios con mensajes claros
- En `Login`, `Facturacion`, `Prospeccion` y cualquier pantalla que use backend al renderizar:
  - mostrar un mensaje explícito de configuración si el backend público no está disponible
  - evitar llamadas inmediatas a `auth` / `functions` / `from(...)` sin config válida
- Resultado: si falla la config, se ve una pantalla entendible en lugar de un error minificado.

6. Mantener compatibilidad con el resto del proyecto
- Conservar el cliente compartido como única fuente de acceso al backend.
- No volver a introducir `createClient(...)` manual en componentes.
- Mantener `Facturacion.tsx` alineado con el mismo origen de URL/key pública que use el cliente compartido.

Validación final
- `/` renderiza sin pantalla en blanco.
- La sección Blog del Home no rompe el render, aun si no puede consultar.
- `/blog`, `/login`, `/facturacion`, `/prospeccion` y `/arca-test` dejan de romper el bundle principal.
- Si falta configuración, la app muestra estados controlados en vez de `supabaseUrl is required`.

Detalles técnicos
- Archivos a tocar:
  - `src/integrations/supabase/client.ts`
  - `src/App.tsx`
  - `src/pages/Index.tsx`
  - `src/components/BlogPreview.tsx`
  - `src/hooks/useBlogPosts.ts`
  - `src/pages/Login.tsx`
  - `src/pages/Facturacion.tsx`
  - `src/pages/Prospeccion.tsx`
- Causa raíz más probable en el código actual:
  - `client.ts` crea el cliente en el nivel del módulo
  - `App.tsx` importa varias páginas con backend de forma directa
  - `Index.tsx` importa `BlogPreview`, que también termina importando el cliente
  - si el preview no inyecta las variables públicas, toda la app cae antes de elegir la ruta
