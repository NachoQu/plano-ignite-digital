
Objetivo: eliminar el error `supabaseUrl is required` para que el Home vuelva a cargar y dejar una sola forma segura de inicializar el backend en frontend.

1. Unificar la inicialización del cliente
- Reemplazar cualquier `createClient(...)` manual en componentes por el cliente compartido de `src/integrations/supabase/client.ts`.
- En particular, actualizar `src/components/ArcaTester.tsx`, que hoy crea un cliente propio en el nivel del módulo usando `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
- Esto evita que una ruta interna de testing rompa toda la app apenas se importa `App.tsx`.

2. Eliminar la dependencia de `VITE_SUPABASE_ANON_KEY` en frontend
- Estandarizar todo el proyecto en `VITE_SUPABASE_URL` + `VITE_SUPABASE_PUBLISHABLE_KEY`.
- Revisar llamadas directas como la de `src/pages/Facturacion.tsx` para que usen las mismas variables esperadas por el proyecto.
- Resultado: no habrá mezcla entre `ANON_KEY` y `PUBLISHABLE_KEY`, que hoy es una fuente clara de fallos.

3. Evitar fallos globales por imports eager
- Cambiar la ruta de testing (`/arca-test`) para que no ejecute lógica sensible al cargar el bundle principal.
- La opción preferida es importar `ArcaTester` de forma diferida o encapsular cualquier acceso al backend dentro del componente, no en el tope del archivo.
- Así, aunque esa pantalla tenga un problema, el Home (`/`) no queda en blanco.

4. Agregar una validación explícita de configuración
- Incorporar un guard simple antes de crear o usar el cliente para detectar si faltan variables públicas.
- En vez de un crash minificado en consola, mostrar un error claro de configuración en desarrollo/preview.
- Esto hará mucho más rápido diagnosticar si el problema vuelve a ser de entorno y no de código.

5. Verificar la configuración administrada del backend
- Si después del refactor las variables siguen llegando vacías en preview, refrescar la conexión de Lovable Cloud para regenerar la configuración pública del proyecto.
- No se deben hardcodear URL ni keys en el código.

6. Validación final
- Confirmar que `/` renderiza correctamente.
- Confirmar que `/login`, `/facturacion` y `/prospeccion` siguen iniciando sesión y llamando funciones sin romper.
- Confirmar que `/arca-test` funciona de forma aislada y ya no puede derribar toda la app.

Detalles técnicos
- Archivos a tocar:
  - `src/components/ArcaTester.tsx`
  - `src/App.tsx`
  - `src/pages/Facturacion.tsx`
  - opcionalmente una pequeña utilidad de validación para envs públicas
- Causa probable detectada en el código actual:
  - `ArcaTester.tsx` crea un cliente manual con `VITE_SUPABASE_ANON_KEY`.
  - `App.tsx` importa `ArcaTester` de forma directa, por lo que ese código se evalúa aunque el usuario esté en `/`.
  - El proyecto ya tiene un cliente central en `src/integrations/supabase/client.ts`, así que ese patrón manual está duplicando riesgo innecesario.
