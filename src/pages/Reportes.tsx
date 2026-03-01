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
  BarChart3,
  Clock,
  Zap,
  CheckCircle2,
  ArrowRight,
  Mail,
  MessageCircle,
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
    why: "Las ventas son el motor de la empresa. Sin saber exactamente cuánto se vende, a quién, y con qué margen, es imposible tomar decisiones correctas sobre precios, descuentos o dónde enfocar al equipo comercial.",
    lagging: [
      "Ventas totales del mes — cuánto dinero ingresó",
      "Margen bruto — cuánto queda después de los costos del producto",
      "Crecimiento vs. mismo mes del año anterior — si estamos mejor o peor",
      "Devoluciones y cancelaciones — qué porcentaje de ventas se cayó",
      "Ticket promedio — cuánto gasta en promedio cada cliente",
    ],
    leading: [
      "Forecast de ventas — proyección de cierre del mes en curso",
      "Pipeline calificado — oportunidades con alta probabilidad de cerrar",
      "Nuevas cuentas captadas — cuántos clientes nuevos ingresaron este mes",
      "Velocidad del ciclo de venta — cuántos días tarda cerrar un negocio",
      "Concentración de clientes — riesgo si el top 3 representa más del 40%",
    ],
  },
  {
    num: "02",
    icon: Truck,
    name: "Supply Chain y Logística",
    freq: "Semanal + Mensual",
    why: "Un producto que no llega a tiempo es una venta perdida y un cliente insatisfecho. Este reporte avisa antes de que haya quiebres de stock o retrasos graves que afecten las operaciones.",
    lagging: [
      "OTD (On Time Delivery) — porcentaje de pedidos entregados a tiempo",
      "Fill Rate — porcentaje de pedidos entregados completos",
      "Rotación de inventario — cuántas veces se renueva el stock por mes",
      "Costo de logística como % de ventas",
      "Quiebres de stock — productos que se quedaron sin inventario",
    ],
    leading: [
      "Días de cobertura de inventario — cuántos días más alcanza el stock actual",
      "Lead time de proveedores — si están entregando más lento que lo habitual",
      "Pedidos en tránsito retrasados — alerta temprana de problemas logísticos",
      "Cumplimiento de pronóstico de demanda — qué tan exacta fue la planificación",
      "Nivel de servicio proyectado para las próximas 2 semanas",
    ],
  },
  {
    num: "03",
    icon: DollarSign,
    name: "Finanzas y Control de Gestión",
    freq: "Mensual + Trimestral",
    why: "Las finanzas muestran la salud real de la empresa más allá de las ventas. Una empresa puede vender mucho y aun así perder dinero si sus costos, deudas o flujo de caja están mal manejados.",
    lagging: [
      "EBITDA — resultado operativo antes de impuestos e intereses",
      "Margen neto — ganancia real sobre el total de ingresos",
      "Capital de trabajo — capacidad de pagar deudas de corto plazo",
      "Flujo de caja operativo — dinero real que entró y salió",
      "Deuda sobre EBITDA — nivel de endeudamiento respecto a la capacidad de pago",
    ],
    leading: [
      "Proyección de caja a 90 días — si habrá problemas para pagar compromisos",
      "Variación de costos fijos — alerta si los gastos estructurales subieron",
      "Facturas vencidas por cobrar — riesgo de incobrabilidad",
      "Presupuesto ejecutado vs. planificado — si el gasto está bajo o sobre lo previsto",
      "Índice de liquidez corriente — capacidad inmediata de afrontar deudas",
    ],
  },
  {
    num: "04",
    icon: Megaphone,
    name: "Marketing y Performance Digital",
    freq: "Semanal + Mensual",
    why: "El marketing sin datos es dinero quemado. Este reporte permite saber exactamente qué campañas funcionan, cuánto cuesta conseguir cada cliente, y si la inversión está generando retorno real.",
    lagging: [
      "CAC (Costo de Adquisición de Cliente) — cuánto costó conseguir un cliente nuevo",
      "ROAS — por cada peso invertido en publicidad, cuánto en ventas se generó",
      "Leads generados por canal — cuántos contactos trajo cada medio",
      "Tasa de conversión de lead a cliente — qué porcentaje terminó comprando",
      "Costo por lead — eficiencia del gasto publicitario",
    ],
    leading: [
      "Alcance orgánico en redes — tendencia de visibilidad sin pauta pagada",
      "CTR de campañas activas — si los anuncios están siendo clickeados",
      "Posicionamiento SEO de palabras clave — visibilidad en buscadores",
      "Share of voice — qué tan presente está la marca vs. la competencia",
      "Engagement rate — nivel de interacción de la audiencia con el contenido",
    ],
  },
  {
    num: "05",
    icon: RefreshCw,
    name: "Clientes y Retención (Churn)",
    freq: "Mensual + Trimestral",
    why: "Conseguir un cliente nuevo cuesta 5 a 7 veces más que retener uno existente. Este reporte detecta los clientes que están a punto de irse antes de que se vayan, para poder actuar a tiempo.",
    lagging: [
      "Churn rate — porcentaje de clientes perdidos en el mes",
      "Tasa de retención — inverso del churn, mide la lealtad",
      "Lifetime Value (LTV) — valor económico total de un cliente promedio",
      "LTV/CAC ratio — si lo que vale un cliente justifica lo que cuesta conseguirlo",
      "Reactivaciones — clientes que volvieron a comprar después de un período inactivo",
    ],
    leading: [
      "Clientes en riesgo de fuga — segmentación temprana por patrones de comportamiento",
      "Frecuencia de compra por segmento — bajada en recurrencia como señal de alerta",
      "Tiempo sin actividad por cliente — cuántos días llevan sin comprar",
      "Tasa de apertura de emails — si los clientes están dejando de interactuar",
      "Net Promoter Score (NPS) — probabilidad futura de recomendar la marca",
    ],
  },
  {
    num: "06",
    icon: Star,
    name: "Satisfacción del Cliente y NPS",
    freq: "Mensual + Trimestral",
    why: "La experiencia del cliente es el activo invisible más valioso. Un cliente satisfecho recomienda. Uno insatisfecho lo cuenta 10 veces. Medir NPS y CSAT permite mejorar antes de perder clientes por razones evitables.",
    lagging: [
      "NPS (Net Promoter Score) — del 1 al 10, cuántos recomendarían la marca",
      "CSAT (Customer Satisfaction Score) — satisfacción puntual de interacciones",
      "CES (Customer Effort Score) — cuánto esfuerzo requirió resolver un problema",
      "Tiempo de respuesta promedio en soporte",
      "Tasa de resolución en primer contacto — problemas solucionados sin escalado",
    ],
    leading: [
      "Volumen de quejas o reclamos por categoría",
      "Menciones negativas en redes sociales",
      "Tasa de abandono en procesos de compra o atención",
      "Tickets sin resolver que superan el SLA",
      "Respuestas negativas en encuestas de pulso rápido",
    ],
  },
  {
    num: "07",
    icon: HeartPulse,
    name: "Salud Corporativa y Clima Interno",
    freq: "Mensual + Anual",
    why: "Una empresa con empleados desmotivados o estructuralmente enferma no puede crecer de forma sostenible. Este reporte detecta señales tempranas de deterioro interno que luego se convierten en rotación, productividad baja y costos altos.",
    lagging: [
      "Ausentismo — porcentaje de horas no trabajadas sobre el total",
      "Tasa de accidentes o incidentes laborales",
      "Presentismo — empleados presentes pero con baja productividad",
      "Costo de enfermedades laborales sobre nómina total",
      "Denuncias o conflictos internos registrados",
    ],
    leading: [
      "eNPS (Employee Net Promoter Score) — si los empleados recomendarían trabajar aquí",
      "Satisfacción en encuestas de clima — temperatura interna del equipo",
      "Rotación voluntaria — empleados que se van por decisión propia",
      "Participación en programas de bienestar",
      "Horas extra acumuladas — señal de sobrecarga o mala planificación",
    ],
  },
  {
    num: "08",
    icon: Leaf,
    name: "ESG y Sustentabilidad",
    freq: "Trimestral + Anual",
    why: "Los inversores, clientes y reguladores exigen cada vez más que las empresas midan su impacto ambiental y social. Tener estos reportes no solo es responsabilidad, es ventaja competitiva para acceder a financiamiento y mercados exigentes.",
    lagging: [
      "Emisiones de CO2 directas e indirectas (Scope 1, 2 y 3)",
      "Consumo de energía y porcentaje renovable",
      "Generación de residuos y tasa de reciclaje",
      "Consumo de agua por unidad producida",
      "Proveedores evaluados con criterios sociales y ambientales",
    ],
    leading: [
      "Progreso hacia metas de reducción de emisiones anuales",
      "Proyectos de eficiencia energética en ejecución",
      "Certificaciones ESG en proceso de obtención",
      "Riesgo regulatorio ambiental por mercado/operación",
      "Diversidad e inclusión en nuevas contrataciones",
    ],
  },
  {
    num: "09",
    icon: Map,
    name: "Expansión y Nuevos Mercados",
    freq: "Trimestral",
    why: "Crecer en un mercado nuevo sin datos es apostar a ciegas. Este reporte analiza el potencial real de nuevas geografías o segmentos, y mide si las apuestas de expansión están funcionando como se esperaba.",
    lagging: [
      "Revenue por región o canal nuevo — cuánto generó la expansión",
      "Participación de mercado por zona — market share ganado",
      "ROI de la inversión en cada mercado nuevo",
      "Costo de entrada vs. ingresos obtenidos en los primeros 6 meses",
      "Clientes activos en mercados nuevos vs. objetivo",
    ],
    leading: [
      "Tamaño del mercado potencial (TAM/SAM) por región objetivo",
      "Barreras regulatorias o legales identificadas",
      "Nivel de adaptación del producto al mercado local",
      "Pipeline de clientes en mercados no activos todavía",
      "Velocidad de penetración vs. benchmark de expansiones anteriores",
    ],
  },
  {
    num: "10",
    icon: Cog,
    name: "Manufactura y Eficiencia Operativa (OEE)",
    freq: "Tiempo real + Semanal",
    why: "En manufactura, el tiempo parado es dinero perdido. El OEE (Efectividad Global del Equipo) es el indicador global que mide cuánto del potencial productivo se está aprovechando realmente.",
    lagging: [
      "OEE (Overall Equipment Effectiveness) — % de capacidad productiva real vs. teórica",
      "Tasa de defectos — unidades con fallas sobre el total producido",
      "Downtime no planificado — horas de parada por fallas",
      "Costo de calidad (re-trabajo, desperdicios, garantías)",
      "Productividad por turno — unidades producidas por hora trabajada",
    ],
    leading: [
      "MTBF (Mean Time Between Failures) — tiempo promedio entre fallas de equipos",
      "Cumplimiento de mantenimiento preventivo programado",
      "Variabilidad del proceso — si los resultados son consistentes o erráticos",
      "Stock de repuestos críticos disponibles",
      "Temperatura y vibración de equipos clave (sensores IoT)",
    ],
  },
  {
    num: "11",
    icon: Lightbulb,
    name: "Innovación y Pipeline de Nuevos Productos",
    freq: "Mensual + Trimestral",
    why: "Las empresas que no innovan quedan obsoletas. Este reporte mide si la organización tiene un pipeline real de nuevos productos o mejoras, y si el dinero invertido en innovación está generando resultados concretos.",
    lagging: [
      "Revenue de productos lanzados en los últimos 24 meses — % sobre ventas totales",
      "Tiempo promedio de desarrollo de producto (time-to-market)",
      "Proyectos de I+D completados en el período",
      "ROI de proyectos de innovación cerrados",
      "Patentes o propiedad intelectual generada",
    ],
    leading: [
      "Pipeline activo de nuevos proyectos — cuántos en exploración, desarrollo y test",
      "Presupuesto de I+D ejecutado vs. planificado",
      "Proyectos en etapa piloto o MVP",
      "Ideas ingresadas al funnel de innovación este mes",
      "Tiempo en etapa de validación — si los proyectos avanzan o se traban",
    ],
  },
  {
    num: "12",
    icon: Shield,
    name: "Tecnología y Ciberseguridad",
    freq: "Mensual + Trimestral",
    why: "La tecnología sostiene cada proceso del negocio. Una falla crítica o un ataque informático puede paralizar operaciones durante días. Este reporte monitorea la salud del ecosistema tecnológico y los riesgos digitales.",
    lagging: [
      "Uptime de sistemas críticos — disponibilidad real de los sistemas productivos",
      "Incidentes de seguridad detectados y resueltos",
      "Tiempo de respuesta ante incidentes (MTTR)",
      "Porcentaje de sistemas con parches de seguridad al día",
      "Costo de incidentes tecnológicos en el período",
    ],
    leading: [
      "Vulnerabilidades críticas detectadas pendientes de parcheo",
      "Nivel de cumplimiento de políticas de seguridad por área",
      "Ratio de empleados capacitados en ciberseguridad",
      "Deuda técnica acumulada en sistemas core",
      "Antigüedad promedio de infraestructura crítica",
    ],
  },
  {
    num: "13",
    icon: Users,
    name: "Talento, RRHH y eNPS",
    freq: "Mensual + Trimestral",
    why: "El capital humano es el único activo que puede multiplicarse. Sin datos sobre el equipo, las decisiones de contratación, retención y desarrollo son pura intuición. Este reporte convierte los datos de personas en ventaja competitiva.",
    lagging: [
      "Rotación de personal — % de empleados que se fueron sobre el total",
      "Costo de rotación — tiempo y dinero para reemplazar una posición",
      "Tiempo de cobertura de vacantes — días promedio para cubrir un puesto",
      "Desempeño promedio por área — resultados en evaluaciones periódicas",
      "Inversión en capacitación por empleado",
    ],
    leading: [
      "eNPS (Employee NPS) — si los empleados recomendarían trabajar en la empresa",
      "Pipeline de talento interno — candidatos listos para ascender",
      "Riesgo de fuga por posición crítica — empleados clave con baja satisfacción",
      "Participación en encuestas de clima — temperatura del equipo",
      "Tiempo desde última capacitación por empleado",
    ],
  },
];

const correlations = [
  {
    origin: "OTD (Logística)",
    impact: "NPS (Satisfacción)",
    relation:
      "Si los pedidos llegan tarde, el NPS baja 3 puntos en promedio por cada 5% de caída en OTD.",
  },
  {
    origin: "Churn Rate (Clientes)",
    impact: "Revenue (Ventas)",
    relation:
      "1% de aumento en churn equivale a -4% de revenue anual en modelos de suscripción o recurrencia.",
  },
  {
    origin: "OEE (Manufactura)",
    impact: "Margen Bruto (Finanzas)",
    relation:
      "Cada 1% de mejora en OEE reduce el costo de producción entre 0.3% y 0.8%.",
  },
  {
    origin: "eNPS (Talento)",
    impact: "Ausentismo (Salud)",
    relation:
      "Empresas con eNPS alto tienen 30-40% menos ausentismo. Empleados comprometidos no faltan.",
  },
  {
    origin: "ESG Score",
    impact: "Costo de capital (Finanzas)",
    relation:
      "Empresas con buena calificación ESG acceden a crédito con tasas hasta 1.5 puntos más bajas.",
  },
  {
    origin: "Satisfacción (NPS)",
    impact: "Churn (Clientes)",
    relation:
      "Un NPS por debajo de 30 predice el doble de tasa de churn en los 90 días siguientes.",
  },
  {
    origin: "Pipeline I+D (Innovación)",
    impact: "Market Share (Ventas)",
    relation:
      "Empresas con 15%+ de revenue en productos nuevos crecen 2x más rápido que el promedio del sector.",
  },
];

const frequencies = [
  {
    freq: "Tiempo real",
    areas: "Manufactura, Sistemas críticos",
    purpose: "Alertas inmediatas ante fallas o desvíos de producción",
  },
  {
    freq: "Semanal",
    areas: "Ventas, Supply Chain, Marketing",
    purpose: "Seguimiento del ritmo del negocio para correcciones rápidas",
  },
  {
    freq: "Mensual",
    areas: "Finanzas, Clientes, NPS, Salud, Talento",
    purpose: "Evaluación de resultados y tendencias del mes completo",
  },
  {
    freq: "Trimestral",
    areas: "ESG, Expansión, Innovación, Tecnología",
    purpose: "Revisión estratégica de proyectos de largo plazo",
  },
  {
    freq: "Anual",
    areas: "ESG, Salud Corporativa, Benchmarks",
    purpose: "Balance anual completo y comparación histórica",
  },
];

const glossary = [
  { term: "KPI", def: "Indicador Clave de Rendimiento. Es un número que mide qué tan bien (o mal) está funcionando algo importante para el negocio." },
  { term: "Indicador rezagado", def: "Muestra lo que ya pasó. Es el resultado final. Ejemplo: ventas del mes cerrado." },
  { term: "Indicador anticipado", def: "Muestra lo que está por pasar. Es una señal temprana. Ejemplo: pipeline de ventas para el mes que viene." },
  { term: "Dashboard", def: "Tablero visual e interactivo donde se ven todos los indicadores en tiempo real, como el panel de un auto." },
  { term: "Churn", def: "El porcentaje de clientes que se fueron o dejaron de comprar en un período determinado." },
  { term: "NPS", def: "Net Promoter Score. Una pregunta simple: del 1 al 10, ¿cuánto recomendarías esta empresa? Mide lealtad." },
  { term: "OEE", def: "Overall Equipment Effectiveness. Mide qué porcentaje de la capacidad productiva real se está aprovechando en manufactura." },
  { term: "EBITDA", def: "Ganancia operativa de la empresa antes de descontar impuestos, intereses y depreciaciones. Muestra la rentabilidad real del negocio." },
  { term: "CAC", def: "Costo de Adquisición de Cliente. Cuánto dinero se gastó en marketing y ventas para conseguir un nuevo cliente." },
  { term: "LTV", def: "Lifetime Value. Cuánto dinero genera un cliente promedio durante toda su relación con la empresa." },
  { term: "OTD", def: "On Time Delivery. Porcentaje de pedidos que llegaron al cliente en la fecha prometida." },
  { term: "eNPS", def: "Employee Net Promoter Score. Lo mismo que el NPS pero aplicado a los empleados: cuánto recomendarían trabajar en la empresa." },
  { term: "ESG", def: "Environmental, Social and Governance. Marco que mide el impacto ambiental, social y de gobernanza de una empresa." },
  { term: "ROI", def: "Return on Investment. Por cada peso invertido, cuántos pesos de retorno se obtuvieron." },
  { term: "Pipeline", def: "Embudo de oportunidades. En ventas, son los negocios en proceso. En innovación, los proyectos en desarrollo." },
];

const comparisonRows = [
  { label: "Costo mensual", analyst: "$3.000 - $6.000 USD", plano: "Desde $600 USD" },
  { label: "Tiempo hasta primer resultado", analyst: "3 a 6 meses", plano: "2 semanas" },
  { label: "Cobertura de áreas", analyst: "1 a 2 áreas", plano: "Hasta 13 áreas" },
  { label: "Riesgo de rotación", analyst: "Alto", plano: "Sin riesgo" },
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
                ÁREA {area.num}
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

            {/* Lagging */}
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-secondary" />
                Indicadores Rezagados
                <span className="text-xs font-normal text-muted-foreground">
                  (qué pasó)
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

            {/* Leading */}
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Indicadores Anticipados
                <span className="text-xs font-normal text-muted-foreground">
                  (qué va a pasar)
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
        {/* Decorative gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="container mx-auto px-6 relative">
          <ScrollAnimationWrapper animationType="fade-in">
            <div className="text-center max-w-4xl mx-auto">
              <p className="text-sm font-mono tracking-widest text-secondary mb-4 uppercase">
                Plan de Servicio — Documento Oficial
              </p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Reportes inteligentes para{" "}
                <span className="text-gradient-purple">decisiones correctas</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
                Unificamos los datos de las principales áreas de tu empresa y los
                convertimos en reportes visuales, claros y periódicos. Sin
                analistas propios, sin meses de implementación, sin herramientas
                costosas.
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-10">
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

      {/* ====== SECTION 1 — QUÉ ES PLANO ====== */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper animationType="fade-in">
            <div className="max-w-4xl mx-auto">
              <p className="text-sm font-mono text-secondary mb-2 uppercase tracking-wider">
                01
              </p>
              <h2 className="text-3xl md:text-5xl font-bold mb-8">
                Qué es Plano y{" "}
                <span className="text-gradient-purple">qué problema resuelve</span>
              </h2>
              <div className="space-y-5 text-muted-foreground leading-relaxed text-lg">
                <p>
                  La mayoría de las empresas tienen datos. El problema es que esos
                  datos están dispersos: en planillas de Excel, en el ERP, en el
                  CRM, en archivos de cada área. Nadie los unifica, nadie los
                  analiza con frecuencia, y las decisiones se toman por intuición.
                </p>
                <p>
                  <strong className="text-foreground">
                    Plano resuelve exactamente eso.
                  </strong>
                </p>
                <p>
                  Somos un servicio de inteligencia de negocios que unifica los
                  datos de las principales áreas de una empresa y los convierte en
                  reportes visuales, claros y periódicos. Sin necesidad de
                  contratar analistas propios, sin meses de implementación, sin
                  herramientas costosas.
                </p>
                <p>
                  El resultado: el equipo directivo recibe cada semana o cada mes
                  un reporte listo para leer, con los indicadores clave de cada
                  área, las alertas tempranas y los insights para actuar antes de
                  que los problemas escalen.
                </p>
              </div>
            </div>
          </ScrollAnimationWrapper>

          {/* Cómo funciona */}
          <ScrollAnimationWrapper animationType="fade-in" delay={200}>
            <div className="max-w-4xl mx-auto mt-16">
              <h3 className="text-2xl font-bold mb-8">
                Cómo funciona en la práctica
              </h3>
              <div className="grid gap-4">
                {[
                  "Nos conectamos con las fuentes de datos del cliente (archivos, sistemas, APIs)",
                  "Unificamos y limpiamos la información",
                  "Construimos el dashboard y los templates de reporte",
                  "Entregamos el primer reporte completo en un plazo de 2 semanas",
                  "A partir de ahí, los reportes se entregan automáticamente según la frecuencia pactada",
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
                Por qué usar Plano y{" "}
                <span className="text-gradient-orange">
                  no contratar un analista
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
                        <td className="py-4 pr-4 text-sm font-medium">
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
                02
              </p>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Las 13 áreas del negocio y{" "}
                <span className="text-gradient-purple">sus indicadores</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-4">
                Cada área tiene dos tipos de indicadores:
              </p>
              <div className="flex flex-wrap justify-center gap-6 mb-12">
                <div className="flex items-center gap-2 text-sm">
                  <TrendingDown className="h-4 w-4 text-secondary" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Rezagados:</strong> lo que
                    YA pasó
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Anticipados:</strong> lo
                    que ESTÁ POR PASAR
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
                03
              </p>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Correlaciones entre áreas —{" "}
                <span className="text-gradient-orange">
                  la ventaja del sistema unificado
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Al medir todas las áreas en un sistema unificado, detectamos
                relaciones entre indicadores que de otra forma nunca se verían.
                Si se mejora el indicador A, se sabe que impactará en el
                indicador B.
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
                04
              </p>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Frecuencias de{" "}
                <span className="text-gradient-purple">reporte</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                No todos los datos necesitan verse todos los días, pero tampoco
                conviene esperar un trimestre para detectar un problema.
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
                    <p className="text-sm font-medium">{f.areas}</p>
                    <p className="text-sm text-muted-foreground">{f.purpose}</p>
                  </div>
                </div>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* ====== SECTION 5 — PLANES Y PRECIOS ====== */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper animationType="fade-in">
            <div className="text-center mb-12">
              <p className="text-sm font-mono text-secondary mb-2 uppercase tracking-wider">
                05
              </p>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Planes y{" "}
                <span className="text-gradient-orange">precios</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                3 planes diseñados para empresas en diferentes etapas de madurez en
                datos. Todos incluyen setup inicial, dashboard interactivo y soporte
                continuo.
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
                    Ideal para empresas que quieren empezar a tomar decisiones
                    basadas en datos sin una gran inversión inicial.
                  </p>
                  <ul className="space-y-3 flex-1">
                    {[
                      "3 áreas de negocio a elección",
                      "~15 KPIs (rezagados + anticipados)",
                      "Dashboard interactivo HTML",
                      "Reporte mensual en PDF",
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
                    Empezar
                  </Button>
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>

            {/* GROWTH */}
            <ScrollAnimationWrapper animationType="fade-in" delay={100}>
              <Card className="border-2 border-primary bg-background h-full flex flex-col relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                  Popular
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
                    Para empresas en crecimiento que necesitan visibilidad sobre las
                    áreas clave del negocio con mayor frecuencia.
                  </p>
                  <ul className="space-y-3 flex-1">
                    {[
                      "Todo lo del plan Starter",
                      "6 áreas de negocio incluidas",
                      "~35 KPIs con correlaciones entre áreas",
                      "Reportes semanales + mensuales",
                      "Alertas automáticas por desvío de KPI",
                      "Reunión mensual de revisión de resultados",
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
                    Empezar
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
                    13 áreas + customización
                  </p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground mb-6">
                    Cobertura total del negocio. Para empresas que quieren
                    inteligencia operativa completa y un socio estratégico en datos.
                  </p>
                  <ul className="space-y-3 flex-1">
                    {[
                      "Las 13 áreas del negocio cubiertas",
                      "+65 KPIs con correlaciones cruzadas",
                      "Todas las frecuencias de reporte",
                      "Integración con sistemas existentes (ERP/CRM)",
                      "Analista dedicado y reuniones semanales",
                      "Reportes custom por solicitud del cliente",
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
                    Empezar
                  </Button>
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>
          </div>

          <ScrollAnimationWrapper animationType="fade-in" delay={300}>
            <p className="text-center text-sm text-muted-foreground mt-8 max-w-2xl mx-auto">
              <strong className="text-foreground">Nota sobre el setup inicial:</strong>{" "}
              Se cobra un fee único de $500 a $2.000 USD al inicio del contrato. Incluye
              mapeo de fuentes de datos, configuración del dashboard, y entrega del
              primer reporte completo.
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
                06
              </p>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Cómo empezar —{" "}
                <span className="text-gradient-purple">Programa Piloto</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-10">
                Estamos seleccionando{" "}
                <strong className="text-foreground">5 empresas piloto</strong> para
                trabajar con datos reales.
              </p>
            </div>
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper animationType="fade-in" delay={100}>
            <div className="max-w-3xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {[
                  "Primer mes al 50% del precio del plan elegido",
                  "Acceso prioritario a nuevas funcionalidades",
                  "Participación en la co-creación del roadmap del servicio",
                  "Caso de éxito co-branding para visibilidad mutua",
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
                <h4 className="font-semibold mb-3">Requisitos mínimos</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Empresa con operaciones activas, datos disponibles en al menos 1
                  área, y disposición para dedicar 2 horas al proceso de onboarding
                  inicial.
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
                07
              </p>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Glosario de{" "}
                <span className="text-gradient-orange">términos clave</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Referencia rápida de los conceptos más usados en este documento.
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
            <p className="text-lg text-muted-foreground mb-2">
              "Reportes inteligentes para decisiones correctas"
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
