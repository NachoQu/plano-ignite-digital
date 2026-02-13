-- Seed 3 sample blog posts so the blog doesn't appear empty on first deploy

INSERT INTO blog_posts (slug, title_es, title_en, summary_es, summary_en, content_es, content_en, excerpt_es, excerpt_en, image_url, image_alt_es, image_alt_en, source_url, source_name, topic, related_service, cta_message_es, cta_message_en, published_at, reading_time_minutes, is_published) VALUES

-- Article 1: AI
(
  'como-la-ia-esta-transformando-las-pymes-en-2025',
  'Cómo la IA está transformando las PyMEs en 2025',
  'How AI is Transforming SMEs in 2025',
  'La inteligencia artificial ya no es exclusiva de grandes corporaciones. Descubrí cómo las PyMEs están usando IA para automatizar procesos, reducir costos y competir a otro nivel.',
  'Artificial intelligence is no longer exclusive to large corporations. Discover how SMEs are using AI to automate processes, reduce costs, and compete at a new level.',
  E'## La revolución silenciosa de la IA en los negocios pequeños\n\nDurante 2025, la inteligencia artificial dejó de ser una promesa futurista para convertirse en una herramienta cotidiana para miles de PyMEs alrededor del mundo. Desde chatbots que atienden clientes las 24 horas hasta sistemas que predicen la demanda de productos, la IA está democratizando capacidades que antes solo estaban al alcance de grandes empresas.\n\n### Casos de uso concretos\n\n- **Atención al cliente automatizada:** Chatbots con IA que resuelven el 70% de las consultas sin intervención humana.\n- **Análisis predictivo:** Herramientas que anticipan tendencias de ventas y optimizan inventarios.\n- **Generación de contenido:** IA que crea textos, imágenes y campañas de marketing en minutos.\n- **Automatización de procesos:** Flujos de trabajo inteligentes que eliminan tareas repetitivas.\n\n### El impacto en números\n\nSegún estudios recientes, las PyMEs que adoptan herramientas de IA reportan un **aumento del 35% en productividad** y una **reducción del 25% en costos operativos** durante el primer año de implementación.\n\n### ¿Qué significa esto para tu negocio?\n\nNo necesitás ser experto en tecnología para aprovechar la IA. Hoy existen plataformas no-code que permiten integrar inteligencia artificial en tu negocio sin escribir una sola línea de código.\n\nEn **Plano**, ayudamos a PyMEs y Startups a implementar soluciones de IA a través de herramientas no-code, creando automatizaciones y herramientas internas que transforman la operación diaria de tu empresa.',
  E'## The Silent Revolution of AI in Small Businesses\n\nDuring 2025, artificial intelligence went from being a futuristic promise to an everyday tool for thousands of SMEs worldwide. From chatbots that serve customers 24/7 to systems that predict product demand, AI is democratizing capabilities that were previously only available to large enterprises.\n\n### Concrete Use Cases\n\n- **Automated customer service:** AI chatbots that resolve 70% of queries without human intervention.\n- **Predictive analytics:** Tools that anticipate sales trends and optimize inventories.\n- **Content generation:** AI that creates texts, images, and marketing campaigns in minutes.\n- **Process automation:** Intelligent workflows that eliminate repetitive tasks.\n\n### The Impact in Numbers\n\nAccording to recent studies, SMEs that adopt AI tools report a **35% increase in productivity** and a **25% reduction in operational costs** during the first year of implementation.\n\n### What Does This Mean for Your Business?\n\nYou don''t need to be a tech expert to leverage AI. Today there are no-code platforms that allow you to integrate artificial intelligence into your business without writing a single line of code.\n\nAt **Plano**, we help SMEs and Startups implement AI solutions through no-code tools, creating automations and internal tools that transform your company''s daily operations.',
  'La IA ya no es solo para grandes empresas. Descubrí cómo las PyMEs están automatizando procesos y reduciendo costos con inteligencia artificial.',
  'AI is no longer just for big companies. Discover how SMEs are automating processes and reducing costs with artificial intelligence.',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop',
  'Ilustración de inteligencia artificial y automatización de negocios',
  'Illustration of artificial intelligence and business automation',
  'https://techcrunch.com',
  'TechCrunch',
  'ai',
  'tools',
  '¿Querés implementar IA en tu PyME sin complicaciones? En Plano creamos herramientas internas inteligentes con tecnología no-code.',
  'Want to implement AI in your SME without complications? At Plano we create intelligent internal tools with no-code technology.',
  NOW() - INTERVAL '2 days',
  4,
  true
),

-- Article 2: No-Code
(
  'top-herramientas-no-code-para-lanzar-tu-startup',
  'Top herramientas no-code para lanzar tu Startup en semanas',
  'Top No-Code Tools to Launch Your Startup in Weeks',
  'El ecosistema no-code creció exponencialmente. Conocé las herramientas que permiten crear apps, webs y automatizaciones sin programar.',
  'The no-code ecosystem has grown exponentially. Learn about the tools that allow you to create apps, websites, and automations without coding.',
  E'## El auge del movimiento no-code\n\nEl movimiento no-code está revolucionando la forma en que las startups construyen productos digitales. Ya no es necesario un equipo de desarrolladores para crear una aplicación funcional: con las herramientas adecuadas, podés lanzar tu MVP en semanas en lugar de meses.\n\n### Las herramientas más destacadas de 2025\n\n#### Para crear aplicaciones web\n- **Lovable:** La plataforma que permite crear aplicaciones web completas con inteligencia artificial. Ideal para MVPs y proyectos rápidos.\n- **Bubble:** Constructor visual de aplicaciones web con lógica de backend completa.\n- **Webflow:** Diseño web profesional con CMS integrado y hosting.\n\n#### Para automatizaciones\n- **Make (Integromat):** Conecta cientos de aplicaciones y automatiza flujos de trabajo complejos.\n- **Zapier:** Automatizaciones simples entre apps con una interfaz intuitiva.\n\n#### Para bases de datos\n- **Airtable:** Base de datos visual que funciona como una hoja de cálculo potenciada.\n- **Supabase:** Backend completo con base de datos, autenticación y APIs automáticas.\n\n### ¿Por qué elegir no-code?\n\n1. **Velocidad:** Lanzá tu producto 5x más rápido que con desarrollo tradicional.\n2. **Costo:** Reducí los costos de desarrollo hasta un 70%.\n3. **Iteración:** Modificá y mejorá tu producto en tiempo real sin depender de programadores.\n4. **Foco:** Concentrate en tu negocio, no en la tecnología.\n\n### La visión de Plano\n\nEn **Plano** somos especialistas en el ecosistema no-code. Combinamos herramientas como Lovable, Bubble, Webflow y Make para crear soluciones digitales completas: desde landing pages hasta ERPs internos, pasando por MVPs listos para validar con usuarios reales.',
  E'## The Rise of the No-Code Movement\n\nThe no-code movement is revolutionizing how startups build digital products. A team of developers is no longer necessary to create a functional application: with the right tools, you can launch your MVP in weeks instead of months.\n\n### The Most Notable Tools of 2025\n\n#### For building web applications\n- **Lovable:** The platform that allows you to create complete web applications with artificial intelligence. Ideal for MVPs and quick projects.\n- **Bubble:** Visual web application builder with complete backend logic.\n- **Webflow:** Professional web design with integrated CMS and hosting.\n\n#### For automations\n- **Make (Integromat):** Connects hundreds of applications and automates complex workflows.\n- **Zapier:** Simple automations between apps with an intuitive interface.\n\n#### For databases\n- **Airtable:** Visual database that works like a powered spreadsheet.\n- **Supabase:** Complete backend with database, authentication, and automatic APIs.\n\n### Why Choose No-Code?\n\n1. **Speed:** Launch your product 5x faster than with traditional development.\n2. **Cost:** Reduce development costs by up to 70%.\n3. **Iteration:** Modify and improve your product in real-time without depending on programmers.\n4. **Focus:** Concentrate on your business, not on technology.\n\n### Plano''s Vision\n\nAt **Plano**, we are specialists in the no-code ecosystem. We combine tools like Lovable, Bubble, Webflow, and Make to create complete digital solutions: from landing pages to internal ERPs, including MVPs ready to validate with real users.',
  'El ecosistema no-code explotó en 2025. Conocé las mejores herramientas para crear apps, webs y automatizaciones sin programar.',
  'The no-code ecosystem exploded in 2025. Discover the best tools to create apps, websites, and automations without coding.',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
  'Herramientas no-code y desarrollo visual de aplicaciones',
  'No-code tools and visual application development',
  'https://www.producthunt.com',
  'Product Hunt',
  'nocode',
  'mvp',
  '¿Tenés una idea de negocio y querés lanzarla rápido? En Plano creamos MVPs con herramientas no-code en semanas.',
  'Have a business idea and want to launch it fast? At Plano we create MVPs with no-code tools in weeks.',
  NOW() - INTERVAL '1 day',
  5,
  true
),

-- Article 3: Web Development
(
  'tendencias-diseno-web-que-aumentan-conversiones',
  'Tendencias de diseño web que aumentan conversiones en 2025',
  'Web Design Trends That Increase Conversions in 2025',
  'El diseño web evoluciona constantemente. Descubrí las tendencias que están generando más leads y ventas para las empresas este año.',
  'Web design is constantly evolving. Discover the trends that are generating more leads and sales for businesses this year.',
  E'## Diseño web orientado a resultados\n\nEn 2025, el diseño web ya no se trata solo de estética: se trata de resultados. Las empresas que priorizan la experiencia de usuario y las mejores prácticas de conversión están viendo un impacto directo en sus ventas.\n\n### Las tendencias que dominan este año\n\n#### 1. Diseño oscuro (Dark Mode)\nEl modo oscuro no es solo una tendencia estética: reduce la fatiga visual y aumenta el tiempo de permanencia en el sitio. Estudios muestran que los sitios con dark mode tienen un **12% más de engagement** en promedio.\n\n#### 2. Microinteracciones\nAnimaciones sutiles que guían al usuario y mejoran la experiencia. Desde botones que cambian al hacer hover hasta transiciones suaves entre secciones, las microinteracciones hacen que tu sitio se sienta premium.\n\n#### 3. Velocidad como prioridad\nGoogle premia los sitios rápidos. Con Core Web Vitals como factor de ranking, cada milisegundo cuenta. Las tecnologías modernas como Vite y frameworks optimizados permiten tiempos de carga menores a 2 segundos.\n\n#### 4. CTAs estratégicos\nEl posicionamiento y diseño de los llamados a la acción (CTAs) puede aumentar las conversiones hasta un **40%**. La clave: mensajes claros, colores contrastantes y ubicación estratégica.\n\n#### 5. Contenido visual de alta calidad\nImágenes y videos profesionales generan un **94% más de vistas** que el contenido sin elementos visuales. La inversión en contenido visual se paga sola.\n\n### ¿Tu web está a la altura?\n\nEn **Plano** diseñamos sitios web que no solo se ven bien, sino que convierten visitas en clientes reales. Cada proyecto que entregamos está optimizado para SEO, velocidad y conversiones, utilizando las últimas tendencias de diseño que realmente generan resultados.',
  E'## Results-Oriented Web Design\n\nIn 2025, web design is no longer just about aesthetics: it''s about results. Companies that prioritize user experience and conversion best practices are seeing a direct impact on their sales.\n\n### The Trends Dominating This Year\n\n#### 1. Dark Mode Design\nDark mode is not just an aesthetic trend: it reduces eye strain and increases time spent on site. Studies show that sites with dark mode have **12% more engagement** on average.\n\n#### 2. Micro-interactions\nSubtle animations that guide the user and improve the experience. From buttons that change on hover to smooth transitions between sections, micro-interactions make your site feel premium.\n\n#### 3. Speed as a Priority\nGoogle rewards fast sites. With Core Web Vitals as a ranking factor, every millisecond counts. Modern technologies like Vite and optimized frameworks allow load times under 2 seconds.\n\n#### 4. Strategic CTAs\nThe positioning and design of calls to action (CTAs) can increase conversions by up to **40%**. The key: clear messages, contrasting colors, and strategic placement.\n\n#### 5. High-Quality Visual Content\nProfessional images and videos generate **94% more views** than content without visual elements. The investment in visual content pays for itself.\n\n### Is Your Website Up to Par?\n\nAt **Plano**, we design websites that not only look good but convert visits into real clients. Every project we deliver is optimized for SEO, speed, and conversions, using the latest design trends that actually generate results.',
  'El diseño web en 2025 se trata de resultados. Conocé las tendencias que están generando más ventas y leads para las empresas.',
  'Web design in 2025 is all about results. Learn about the trends generating more sales and leads for businesses.',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
  'Tendencias de diseño web moderno y conversiones',
  'Modern web design trends and conversions',
  'https://www.smashingmagazine.com',
  'Smashing Magazine',
  'webdev',
  'web',
  '¿Tu web no genera los resultados que esperás? En Plano creamos sitios que convierten visitas en clientes reales.',
  'Is your website not generating the results you expect? At Plano we create sites that convert visits into real clients.',
  NOW(),
  4,
  true
);
