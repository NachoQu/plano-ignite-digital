import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ScrollAnimationWrapper } from "@/components/ScrollAnimationWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingCart,
  Truck,
  DollarSign,
  Megaphone,
  RefreshCw,
  Star,
  HeartPulse,
  Leaf,
  Map,
  Cog,
  Lightbulb,
  Shield,
  Users,
  TrendingDown,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Clock,
  Zap,
  CheckCircle2,
  ArrowRight,
  Mail,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const areas = [
  {
    num: "01",
    icon: ShoppingCart,
    name: "Ventas y Revenue",
    freq: "Semanal + Mensual",
    why: "Sin visibilidad real sobre márgenes, canales y tickets promedio, las decisiones comerciales se basan en intuición. Este módulo centraliza lo esencial para vender mejor.",
    lagging: [
      "Facturación total del período",
      "Margen bruto por línea de producto",
      "Crecimiento interanual",
      "Devoluciones y cancelaciones",
      "Ticket promedio por cliente",
    ],
    leading: [
      "Forecast de cierre mensual",
      "Pipeline calificado",
      "Nuevas cuentas captadas",
      "Velocidad del ciclo de venta",
      "Concentración de cartera (top 3 clientes)",
    ],
  },
  {
    num: "02",
    icon: Truck,
    name: "Supply Chain y Logística",
    freq: "Semanal + Mensual",
    why: "Un pedido que llega tarde es un cliente que no vuelve. Este módulo anticipa quiebres de stock y retrasos antes de que impacten en la operación.",
    lagging: [
      "OTD — entregas a tiempo",
      "Fill Rate — pedidos completos",
      "Rotación de inventario",
      "Costo logístico como % de facturación",
      "Quiebres de stock registrados",
    ],
    leading: [
      "Días de cobertura de inventario",
      "Lead time de proveedores (tendencia)",
      "Pedidos en tránsito con demora",
      "Precisión del forecast de demanda",
      "Nivel de servicio proyectado a 14 días",
    ],
  },
  {
    num: "03",
    icon: DollarSign,
    name: "Finanzas y Control de Gestión",
    freq: "Mensual + Trimestral",
    why: "Facturar mucho no garantiza rentabilidad. Este módulo muestra la salud financiera real: flujo de caja, márgenes netos y capacidad de pago.",
    lagging: [
      "EBITDA",
      "Margen neto sobre ingresos",
      "Capital de trabajo",
      "Flujo de caja operativo",
      "Ratio deuda / EBITDA",
    ],
    leading: [
      "Proyección de caja a 90 días",
      "Variación de costos fijos",
      "Cuentas por cobrar vencidas",
      "Presupuesto ejecutado vs. planificado",
      "Índice de liquidez corriente",
    ],
  },
  {
    num: "04",
    icon: Megaphone,
    name: "Marketing y Performance",
    freq: "Semanal + Mensual",
    why: "Invertir sin medir es perder presupuesto. Este módulo conecta cada peso invertido con resultados concretos: leads, conversiones y retorno real.",
    lagging: [
      "CAC — costo por cliente adquirido",
      "ROAS — retorno publicitario",
      "Leads por canal",
      "Tasa de conversión lead → cliente",
      "Costo por lead",
    ],
    leading: [
      "Alcance orgánico (tendencia)",
      "CTR de campañas activas",
      "Posicionamiento SEO",
      "Share of voice vs. competencia",
      "Engagement rate",
    ],
  },
  {
    num: "05",
    icon: RefreshCw,
    name: "Retención y Churn",
    freq: "Mensual + Trimestral",
    why: "Retener cuesta 5x menos que adquirir. Este módulo identifica clientes en riesgo de fuga antes de que se vayan.",
    lagging: [
      "Churn rate mensual",
      "Tasa de retención",
      "Lifetime Value (LTV)",
      "Ratio LTV / CAC",
      "Reactivaciones del período",
    ],
    leading: [
      "Segmentación de clientes en riesgo",
      "Frecuencia de compra por segmento",
      "Días sin actividad por cuenta",
      "Apertura de comunicaciones",
      "Net Promoter Score (NPS)",
    ],
  },
  {
    num: "06",
    icon: Star,
    name: "Experiencia del Cliente",
    freq: "Mensual + Trimestral",
    why: "Un cliente satisfecho recomienda. Uno insatisfecho lo cuenta 10 veces. Medir NPS y CSAT permite mejorar antes de perder cuentas por razones evitables.",
    lagging: [
      "NPS — lealtad y recomendación",
      "CSAT — satisfacción puntual",
      "CES — esfuerzo del cliente",
      "Tiempo de respuesta en soporte",
      "Resolución en primer contacto",
    ],
    leading: [
      "Volumen de quejas por categoría",
      "Menciones negativas en redes",
      "Abandono en procesos de compra",
      "Tickets fuera de SLA",
      "Pulsos rápidos de satisfacción",
    ],
  },
  {
    num: "07",
    icon: HeartPulse,
    name: "Salud Corporativa",
    freq: "Mensual + Anual",
    why: "Equipos desmotivados frenan el crecimiento. Este módulo detecta señales tempranas de deterioro interno que impactan productividad y costos.",
    lagging: [
      "Ausentismo",
      "Incidentes laborales",
      "Presentismo (presencia sin productividad)",
      "Costo de enfermedades sobre nómina",
      "Conflictos internos registrados",
    ],
    leading: [
      "eNPS — recomendación interna",
      "Clima laboral (encuestas)",
      "Rotación voluntaria",
      "Participación en bienestar",
      "Horas extra acumuladas",
    ],
  },
  {
    num: "08",
    icon: Leaf,
    name: "ESG y Sustentabilidad",
    freq: "Trimestral + Anual",
    why: "Inversores, clientes y reguladores exigen métricas de impacto. Reportar ESG no es solo responsabilidad: es ventaja competitiva para acceder a mejores condiciones.",
    lagging: [
      "Emisiones CO₂ (Scope 1, 2, 3)",
      "Consumo energético y % renovable",
      "Generación de residuos y reciclaje",
      "Consumo de agua por unidad",
      "Proveedores evaluados (criterios ESG)",
    ],
    leading: [
      "Progreso en metas de reducción",
      "Proyectos de eficiencia en curso",
      "Certificaciones en trámite",
      "Riesgo regulatorio ambiental",
      "Diversidad en nuevas contrataciones",
    ],
  },
  {
    num: "09",
    icon: Map,
    name: "Expansión y Nuevos Mercados",
    freq: "Trimestral",
    why: "Crecer sin datos es apostar a ciegas. Este módulo mide el potencial real de nuevas geografías y si la inversión en expansión está rindiendo.",
    lagging: [
      "Revenue por región o canal nuevo",
      "Market share por zona",
      "ROI de cada mercado nuevo",
      "Costo de entrada vs. ingresos (6 meses)",
      "Clientes activos vs. objetivo",
    ],
    leading: [
      "TAM / SAM por región objetivo",
      "Barreras regulatorias identificadas",
      "Adaptación del producto al mercado local",
      "Pipeline en mercados no activos",
      "Velocidad de penetración vs. benchmark",
    ],
  },
  {
    num: "10",
    icon: Cog,
    name: "Manufactura y OEE",
    freq: "Tiempo real + Semanal",
    why: "Tiempo parado es margen perdido. El OEE mide cuánto del potencial productivo se aprovecha realmente.",
    lagging: [
      "OEE — efectividad global del equipo",
      "Tasa de defectos",
      "Downtime no planificado",
      "Costo de calidad (re-trabajo, scrap)",
      "Productividad por turno",
    ],
    leading: [
      "MTBF — tiempo entre fallas",
      "Cumplimiento de mantenimiento preventivo",
      "Variabilidad del proceso",
      "Stock de repuestos críticos",
      "Sensores IoT (temperatura, vibración)",
    ],
  },
  {
    num: "11",
    icon: Lightbulb,
    name: "Innovación y Nuevos Productos",
    freq: "Mensual + Trimestral",
    why: "Las organizaciones que no innovan quedan obsoletas. Este módulo mide si hay un pipeline real de desarrollo y si la inversión en I+D genera retorno.",
    lagging: [
      "Revenue de productos < 24 meses (% sobre total)",
      "Time-to-market promedio",
      "Proyectos de I+D completados",
      "ROI de innovación",
      "Propiedad intelectual generada",
    ],
    leading: [
      "Pipeline activo (exploración → desarrollo → test)",
      "Presupuesto I+D ejecutado vs. plan",
      "Proyectos en etapa piloto o MVP",
      "Ideas ingresadas al funnel",
      "Tiempo en validación (velocidad de avance)",
    ],
  },
  {
    num: "12",
    icon: Shield,
    name: "Tecnología y Ciberseguridad",
    freq: "Mensual + Trimestral",
    why: "Una falla crítica o un ataque puede paralizar operaciones. Este módulo monitorea la salud del ecosistema tecnológico y los riesgos digitales.",
    lagging: [
      "Uptime de sistemas críticos",
      "Incidentes de seguridad resueltos",
      "MTTR — tiempo de respuesta",
      "Sistemas con parches al día (%)",
      "Costo de incidentes tecnológicos",
    ],
    leading: [
      "Vulnerabilidades críticas pendientes",
      "Cumplimiento de políticas por área",
      "Personal capacitado en ciberseguridad (%)",
      "Deuda técnica en sistemas core",
      "Antigüedad de infraestructura crítica",
    ],
  },
  {
    num: "13",
    icon: Users,
    name: "Talento y Capital Humano",
    freq: "Mensual + Trimestral",
    why: "El equipo es el único activo que se multiplica. Sin métricas de personas, las decisiones de contratación y retención son pura intuición.",
    lagging: [
      "Rotación de personal",
      "Costo de reemplazo por posición",
      "Tiempo de cobertura de vacantes",
      "Desempeño promedio por área",
      "Inversión en capacitación per cápita",
    ],
    leading: [
      "eNPS — recomendación como empleador",
      "Pipeline de talento interno",
      "Riesgo de fuga en posiciones clave",
      "Participación en encuestas de clima",
      "Última capacitación por colaborador",
    ],
  },
];

const correlations = [
  {
    origin: "OTD (Logística)",
    impact: "NPS (Experiencia)",
    relation:
      "Cada 5% de caída en entregas a tiempo reduce el NPS en ~3 puntos.",
  },
  {
    origin: "Churn (Retención)",
    impact: "Revenue (Ventas)",
    relation:
      "+1% de churn equivale a –4% de facturación anual en modelos recurrentes.",
  },
  {
    origin: "OEE (Manufactura)",
    impact: "Margen Bruto (Finanzas)",
    relation:
      "Cada 1% de mejora en OEE reduce el costo de producción entre 0,3% y 0,8%.",
  },
  {
    origin: "eNPS (Talento)",
    impact: "Ausentismo (Salud)",
    relation:
      "Equipos con eNPS alto registran 30–40% menos ausentismo.",
  },
  {
    origin: "ESG Score",
    impact: "Costo de Capital",
    relation:
      "Buena calificación ESG reduce tasas de crédito hasta 1,5 puntos.",
  },
  {
    origin: "NPS (Experiencia)",
    impact: "Churn (Retención)",
    relation:
      "NPS < 30 predice el doble de fuga en los 90 días siguientes.",
  },
  {
    origin: "Pipeline I+D",
    impact: "Market Share",
    relation:
      "+15% de revenue en productos nuevos = 2x más crecimiento vs. promedio sectorial.",
  },
];

const frequencies = [
  {
    freq: "Tiempo real",
    areas: "Manufactura · Sistemas críticos",
    purpose: "Alertas inmediatas ante fallas o desvíos de producción",
  },
  {
    freq: "Semanal",
    areas: "Ventas · Supply Chain · Marketing",
    purpose: "Seguimiento del ritmo operativo para correcciones ágiles",
  },
  {
    freq: "Mensual",
    areas: "Finanzas · Clientes · NPS · Salud · Talento",
    purpose: "Evaluación de resultados y tendencias del período completo",
  },
  {
    freq: "Trimestral",
    areas: "ESG · Expansión · Innovación · Tecnología",
    purpose: "Revisión estratégica de iniciativas de mediano plazo",
  },
  {
    freq: "Anual",
    areas: "ESG · Salud Corporativa · Benchmarks",
    purpose: "Balance integral y comparación histórica",
  },
];

const glossary = [
  { term: "KPI", def: "Indicador clave de rendimiento. Mide qué tan bien funciona algo importante para el negocio." },
  { term: "Rezagado", def: "Muestra lo que ya pasó. Es el resultado final (ej: facturación del mes cerrado)." },
  { term: "Anticipado", def: "Señal temprana de lo que está por pasar (ej: pipeline para el próximo mes)." },
  { term: "Dashboard", def: "Tablero visual e interactivo donde se ven los indicadores en tiempo real." },
  { term: "Churn", def: "Porcentaje de clientes que dejaron de comprar en un período determinado." },
  { term: "NPS", def: "Net Promoter Score. Mide cuánto recomendarían tus clientes tu marca, del 1 al 10." },
  { term: "OEE", def: "Overall Equipment Effectiveness. Qué porcentaje de la capacidad productiva se aprovecha." },
  { term: "EBITDA", def: "Ganancia operativa antes de impuestos, intereses y depreciaciones." },
  { term: "CAC", def: "Costo de adquisición de cliente. Cuánto cuesta conseguir un nuevo comprador." },
  { term: "LTV", def: "Lifetime Value. Cuánto genera un cliente durante toda su relación con la marca." },
  { term: "OTD", def: "On Time Delivery. Porcentaje de pedidos entregados en fecha prometida." },
  { term: "eNPS", def: "Employee NPS. Cuánto recomendarían los colaboradores trabajar en la organización." },
  { term: "ESG", def: "Environmental, Social & Governance. Marco de impacto ambiental, social y de gobernanza." },
  { term: "ROI", def: "Retorno sobre la inversión. Por cada peso invertido, cuántos pesos de retorno." },
  { term: "Pipeline", def: "Embudo de oportunidades: negocios en proceso (ventas) o proyectos en desarrollo (innovación)." },
];

const comparisonRows = [
  { label: "Inversión mensual", analyst: "$3.000 – $6.000 USD", plano: "Desde $600 USD" },
  { label: "Primer resultado", analyst: "3 a 6 meses", plano: "2 semanas" },
  { label: "Áreas cubiertas", analyst: "1 a 2", plano: "Hasta 13" },
  { label: "Riesgo de rotación", analyst: "Alto", plano: "Ninguno" },
  { label: "Escalabilidad", analyst: "Limitada", plano: "Inmediata" },
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

const AreaCard = ({ area, index }: { area: (typeof areas)[number]; index: number }) => {
  const [open, setOpen] = useState(false);
  const Icon = area.icon;

  return (
    <ScrollAnimationWrapper animationType="fade-in" delay={index * 60}>
      <Card className="border-0 shadow-lg bg-background overflow-hidden">
        <button
          onClick={() => setOpen(!open)}
          className="w-full text-left"
        >
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="p-3 rounded-xl bg-primary/10 shrink-0">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-mono text-secondary mb-1">
                {area.num}
              </p>
              <CardTitle className="text-lg font-bold leading-tight">
                {area.name}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                <Clock className="inline h-3 w-3 mr-1" />
                {area.freq}
              </p>
            </div>
            <div className="shrink-0 text-muted-foreground">
              {open ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </div>
          </CardHeader>
        </button>

        {open && (
          <CardContent className="pt-0 pb-6 space-y-5 animate-fade-in">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {area.why}
            </p>

            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-secondary" />
                <span className="text-foreground">Rezagados</span>
                <span className="text-xs font-normal text-muted-foreground">
                  — qué pasó
                </span>
              </h4>
              <ul className="space-y-2">
                {area.lagging.map((item, i) => (
                  <li
                    key={i}
                    className="text-sm text-muted-foreground pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[9px] before:h-1.5 before:w-1.5 before:rounded-full before:bg-secondary"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-foreground">Anticipados</span>
                <span className="text-xs font-normal text-muted-foreground">
                  — qué va a pasar
                </span>
              </h4>
              <ul className="space-y-2">
                {area.leading.map((item, i) => (
                  <li
                    key={i}
                    className="text-sm text-muted-foreground pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[9px] before:h-1.5 before:w-1.5 before:rounded-full before:bg-primary"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        )}
      </Card>
    </ScrollAnimationWrapper>
  );
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const Reportes = () => {
  const handlePilotClick = () => {
    window.location.href = "mailto:igna.quantin@gmail.com?subject=PILOTO%20PLANO";
  };

  return (
    <>
      <Navbar />

      {/* ====== HERO ====== */}
      <section className="pt-28 pb-20 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="container mx-auto px-6 relative">
          <ScrollAnimationWrapper animationType="fade-in">
            <div className="text-center max-w-4xl mx-auto">
              <p className="text-sm font-mono tracking-widest text-secondary mb-4 uppercase">
                Inteligencia de negocios como servicio
              </p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Datos claros.{" "}
                <span className="text-gradient-purple">Decisiones correctas.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                Unificamos la información de tu operación en reportes visuales y periódicos. Sin analistas propios, sin meses de implementación.
              </p>

              <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-10">
                {[
                  { value: "13", label: "Áreas" },
                  { value: "+65", label: "KPIs" },
                  { value: "5", label: "Frecuencias" },
                  { value: "3", label: "Planes" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-3xl md:text-4xl font-bold text-primary">
                      {s.value}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              <Button
                onClick={handlePilotClick}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
              >
                <Mail className="mr-2 h-4 w-4" />
                Aplicar al programa piloto
              </Button>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* ====== SECTION 1 — QUÉ RESOLVEMOS ====== */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper animationType="fade-in">
            <div className="max-w-4xl mx-auto">
              <p className="text-sm font-mono text-secondary mb-2 uppercase tracking-wider">
                01 — El problema
              </p>
              <h2 className="text-3xl md:text-5xl font-bold mb-8">
                De datos dispersos a{" "}
                <span className="text-gradient-purple">visión integral</span>
              </h2>
              <div className="space-y-5 text-muted-foreground leading-relaxed text-lg">
                <p>
                  La mayoría de las organizaciones tienen datos. El problema es que están dispersos: en planillas, en el ERP, en el CRM, en archivos de cada área. Nadie los unifica, nadie los analiza con frecuencia, y las decisiones se toman por intuición.
                </p>
                <p className="text-foreground font-medium">
                  Nosotros resolvemos exactamente eso.
                </p>
                <p>
                  Conectamos las fuentes, limpiamos la información y la convertimos en indicadores accionables. El equipo directivo recibe cada semana o cada mes un reporte listo para leer, con alertas tempranas e insights para actuar antes de que los problemas escalen.
                </p>
              </div>
            </div>
          </ScrollAnimationWrapper>

          {/* Cómo funciona */}
          <ScrollAnimationWrapper animationType="fade-in" delay={200}>
            <div className="max-w-4xl mx-auto mt-16">
              <h3 className="text-2xl font-bold mb-8">
                Proceso de implementación
              </h3>
              <div className="grid gap-4">
                {[
                  "Conexión con fuentes de datos (archivos, sistemas, APIs)",
                  "Limpieza y unificación de la información",
                  "Diseño del dashboard y templates de reporte",
                  "Entrega del primer informe completo en 2 semanas",
                  "Envío automático según la frecuencia acordada",
                ].map((step, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-xl bg-background border border-border"
                  >
                    <span className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </span>
                    <p className="text-muted-foreground">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollAnimationWrapper>

          {/* Comparison table */}
          <ScrollAnimationWrapper animationType="fade-in" delay={300}>
            <div className="max-w-4xl mx-auto mt-16">
              <h3 className="text-2xl font-bold mb-8">
                Servicio externo vs.{" "}
                <span className="text-gradient-orange">
                  analista interno
                </span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-3 pr-4 text-sm text-muted-foreground font-medium">
                        Criterio
                      </th>
                      <th className="py-3 px-4 text-sm text-muted-foreground font-medium">
                        Analista interno
                      </th>
                      <th className="py-3 pl-4 text-sm font-medium text-primary">
                        Plano
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row) => (
                      <tr key={row.label} className="border-b border-border/50">
                        <td className="py-4 pr-4 text-sm font-medium text-foreground">
                          {row.label}
                        </td>
                        <td className="py-4 px-4 text-sm text-muted-foreground">
                          {row.analyst}
                        </td>
                        <td className="py-4 pl-4 text-sm text-primary font-medium">
                          {row.plano}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* ====== SECTION 2 — LAS 13 ÁREAS ====== */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper animationType="fade-in">
            <div className="text-center mb-4">
              <p className="text-sm font-mono text-secondary mb-2 uppercase tracking-wider">
                02 — Cobertura
              </p>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                13 áreas.{" "}
                <span className="text-gradient-purple">+65 indicadores.</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-4">
                Cada módulo combina dos tipos de métricas:
              </p>
              <div className="flex flex-wrap justify-center gap-6 mb-12">
                <div className="flex items-center gap-2 text-sm">
                  <TrendingDown className="h-4 w-4 text-secondary" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Rezagados:</strong> lo que ya pasó
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Anticipados:</strong> lo que está por pasar
                  </span>
                </div>
              </div>
            </div>
          </ScrollAnimationWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {areas.map((area, i) => (
              <AreaCard key={area.num} area={area} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ====== SECTION 3 — CORRELACIONES ====== */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper animationType="fade-in">
            <div className="text-center mb-12">
              <p className="text-sm font-mono text-secondary mb-2 uppercase tracking-wider">
                03 — Visión cruzada
              </p>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Correlaciones que{" "}
                <span className="text-gradient-orange">
                  solo un sistema unificado detecta
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Al medir todo en un mismo lugar, aparecen relaciones entre métricas que de otra forma pasarían desapercibidas.
              </p>
            </div>
          </ScrollAnimationWrapper>

          <div className="max-w-5xl mx-auto grid gap-4">
            {correlations.map((c, i) => (
              <ScrollAnimationWrapper key={i} animationType="fade-in" delay={i * 80}>
                <div className="flex flex-col md:flex-row md:items-center gap-4 p-5 rounded-xl bg-background border border-border">
                  <div className="shrink-0 flex items-center gap-3 md:w-72">
                    <span className="text-sm font-semibold text-secondary whitespace-nowrap">
                      {c.origin}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm font-semibold text-primary whitespace-nowrap">
                      {c.impact}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {c.relation}
                  </p>
                </div>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* ====== SECTION 4 — FRECUENCIAS ====== */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper animationType="fade-in">
            <div className="text-center mb-12">
              <p className="text-sm font-mono text-secondary mb-2 uppercase tracking-wider">
                04 — Cadencia
              </p>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                La frecuencia justa para{" "}
                <span className="text-gradient-purple">cada decisión</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Ni demasiado frecuente ni demasiado tarde. Cada área tiene el ritmo de seguimiento que necesita.
              </p>
            </div>
          </ScrollAnimationWrapper>

          <div className="max-w-4xl mx-auto grid gap-4">
            {frequencies.map((f, i) => (
              <ScrollAnimationWrapper key={i} animationType="fade-in" delay={i * 100}>
                <div className="flex flex-col md:flex-row md:items-center gap-4 p-5 rounded-xl bg-card border border-border">
                  <div className="shrink-0 md:w-32">
                    <span className="text-sm font-bold text-primary">
                      {f.freq}
                    </span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-foreground">{f.areas}</p>
                    <p className="text-sm text-muted-foreground">{f.purpose}</p>
                  </div>
                </div>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* ====== SECTION 5 — PLANES ====== */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper animationType="fade-in">
            <div className="text-center mb-12">
              <p className="text-sm font-mono text-secondary mb-2 uppercase tracking-wider">
                05 — Inversión
              </p>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Tres planes, una{" "}
                <span className="text-gradient-orange">misma calidad</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Diseñados para organizaciones en diferentes etapas de madurez analítica. Todos incluyen setup inicial, dashboard interactivo y soporte continuo.
              </p>
            </div>
          </ScrollAnimationWrapper>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* STARTER */}
            <ScrollAnimationWrapper animationType="fade-in" delay={0}>
              <Card className="border border-border bg-background h-full flex flex-col">
                <CardHeader className="text-center pb-4">
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
                    Starter
                  </p>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-foreground">$600</span>
                    <span className="text-muted-foreground ml-1">USD / mes</span>
                  </div>
                  <p className="text-sm text-secondary font-medium">
                    3 áreas a elección
                  </p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground mb-6">
                    Para quienes quieren empezar a tomar decisiones basadas en datos sin una gran inversión inicial.
                  </p>
                  <ul className="space-y-3 flex-1">
                    {[
                      "3 módulos de negocio a elección",
                      "~15 KPIs (rezagados + anticipados)",
                      "Dashboard interactivo HTML",
                      "Informe mensual en PDF",
                      "Setup en 2 semanas",
                      "Soporte por email",
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={handlePilotClick}
                    variant="outline"
                    className="w-full mt-8"
                  >
                    Comenzar
                  </Button>
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>

            {/* GROWTH */}
            <ScrollAnimationWrapper animationType="fade-in" delay={100}>
              <Card className="border-2 border-primary bg-background h-full flex flex-col relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                  Recomendado
                </div>
                <CardHeader className="text-center pb-4 pt-8">
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
                    Growth
                  </p>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-foreground">$800</span>
                    <span className="text-muted-foreground ml-1">USD / mes</span>
                  </div>
                  <p className="text-sm text-secondary font-medium">
                    6 áreas incluidas
                  </p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground mb-6">
                    Para operaciones en crecimiento que necesitan visibilidad frecuente sobre las áreas clave.
                  </p>
                  <ul className="space-y-3 flex-1">
                    {[
                      "Todo lo del plan Starter",
                      "6 módulos de negocio incluidos",
                      "~35 KPIs con correlaciones cruzadas",
                      "Informes semanales + mensuales",
                      "Alertas automáticas por desvío",
                      "Reunión mensual de revisión",
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={handlePilotClick}
                    className="w-full mt-8 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Comenzar
                  </Button>
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>

            {/* ENTERPRISE */}
            <ScrollAnimationWrapper animationType="fade-in" delay={200}>
              <Card className="border border-border bg-background h-full flex flex-col">
                <CardHeader className="text-center pb-4">
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
                    Enterprise
                  </p>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-foreground">$1.000</span>
                    <span className="text-muted-foreground ml-1">USD / mes</span>
                  </div>
                  <p className="text-sm text-secondary font-medium">
                    13 áreas + personalización
                  </p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground mb-6">
                    Cobertura completa. Para quienes buscan inteligencia operativa total y un socio estratégico en analítica.
                  </p>
                  <ul className="space-y-3 flex-1">
                    {[
                      "Los 13 módulos cubiertos",
                      "+65 KPIs con correlaciones cruzadas",
                      "Todas las frecuencias de entrega",
                      "Integración con sistemas existentes (ERP / CRM)",
                      "Analista dedicado y reuniones semanales",
                      "Informes custom a demanda",
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={handlePilotClick}
                    variant="outline"
                    className="w-full mt-8"
                  >
                    Comenzar
                  </Button>
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>
          </div>

          <ScrollAnimationWrapper animationType="fade-in" delay={300}>
            <p className="text-center text-sm text-muted-foreground mt-8 max-w-2xl mx-auto">
              <strong className="text-foreground">Setup inicial:</strong>{" "}
              Fee único de $500 a $2.000 USD. Incluye mapeo de fuentes, configuración del dashboard y entrega del primer informe.
            </p>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* ====== SECTION 6 — PROGRAMA PILOTO ====== */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper animationType="fade-in">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-sm font-mono text-secondary mb-2 uppercase tracking-wider">
                06 — Primeros pasos
              </p>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Programa{" "}
                <span className="text-gradient-purple">Piloto</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-10">
                Seleccionamos{" "}
                <strong className="text-foreground">5 organizaciones</strong> para trabajar con datos reales y co-crear el servicio.
              </p>
            </div>
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper animationType="fade-in" delay={100}>
            <div className="max-w-3xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {[
                  "Primer mes al 50% del plan elegido",
                  "Acceso prioritario a nuevas funcionalidades",
                  "Participación en la co-creación del roadmap",
                  "Caso de éxito co-branding",
                ].map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border"
                  >
                    <Zap className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">{benefit}</p>
                  </div>
                ))}
              </div>

              <div className="bg-card border border-border rounded-xl p-6 mb-10">
                <h4 className="font-semibold text-foreground mb-3">Requisitos mínimos</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Operaciones activas, datos disponibles en al menos 1 área, y disposición para dedicar 2 horas al onboarding inicial.
                </p>
              </div>

              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Escribinos con el asunto: <strong className="text-foreground">PILOTO PLANO</strong>
                </p>
                <Button
                  onClick={handlePilotClick}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  igna.quantin@gmail.com
                </Button>
              </div>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* ====== SECTION 7 — GLOSARIO ====== */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper animationType="fade-in">
            <div className="text-center mb-12">
              <p className="text-sm font-mono text-secondary mb-2 uppercase tracking-wider">
                07 — Referencia
              </p>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Glosario{" "}
                <span className="text-gradient-orange">ejecutivo</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Definiciones breves de los términos más usados en este documento.
              </p>
            </div>
          </ScrollAnimationWrapper>

          <div className="max-w-4xl mx-auto grid gap-3">
            {glossary.map((g, i) => (
              <ScrollAnimationWrapper key={g.term} animationType="fade-in" delay={i * 40}>
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 p-4 rounded-xl bg-background border border-border">
                  <span className="shrink-0 sm:w-44 text-sm font-bold text-primary">
                    {g.term}
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {g.def}
                  </p>
                </div>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* ====== FOOTER CTA ====== */}
      <section className="py-16 bg-background border-t border-border">
        <div className="container mx-auto px-6 text-center">
          <ScrollAnimationWrapper animationType="fade-in">
            <p className="text-lg font-medium text-foreground mb-2">
              Datos claros. Decisiones correctas.
            </p>
            <p className="text-sm text-muted-foreground mb-1">
              igna.quantin@gmail.com
            </p>
            <p className="text-xs text-muted-foreground">
              2025 — Todos los derechos reservados
            </p>
          </ScrollAnimationWrapper>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Reportes;
