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
  CheckCircle2,
  ArrowRight,
  Mail,
  BarChart3,
  LineChart,
  BookOpen,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const areas = [
  { icon: ShoppingCart, name: "Ventas" },
  { icon: DollarSign, name: "Finanzas" },
  { icon: Megaphone, name: "Marketing" },
  { icon: RefreshCw, name: "Clientes" },
  { icon: Truck, name: "Supply Chain" },
  { icon: Cog, name: "Manufactura" },
  { icon: Users, name: "Talento" },
  { icon: Shield, name: "Tecnología" },
  { icon: Lightbulb, name: "Innovación" },
  { icon: Leaf, name: "ESG" },
  { icon: Map, name: "Expansión" },
  { icon: HeartPulse, name: "Salud Corporativa" },
  { icon: Star, name: "Experiencia del Cliente" },
];

const correlations = [
  { cause: "Más churn", effect: "menos revenue", icon: TrendingDown },
  { cause: "Caída en entregas", effect: "baja en NPS", icon: TrendingDown },
  { cause: "Mejor eficiencia", effect: "mayor margen", icon: TrendingUp },
  { cause: "Bajo eNPS", effect: "mayor rotación", icon: TrendingDown },
];

const comparisonRows = [
  { label: "Inversión mensual", analyst: "$3.000 – $6.000 USD", plano: "Desde $600 USD" },
  { label: "Primer resultado", analyst: "3 a 6 meses", plano: "2 semanas" },
  { label: "Áreas cubiertas", analyst: "1 a 2", plano: "Hasta 13" },
  { label: "Riesgo de rotación", analyst: "Alto", plano: "Ninguno" },
  { label: "Escalabilidad", analyst: "Limitada", plano: "Inmediata" },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const Reportes = () => {
  const handleContactClick = () => {
    window.location.href = "mailto:igna.quantin@gmail.com?subject=Diagnóstico%20Plano%20Reportes";
  };

  return (
    <>
      <Navbar />

      {/* ====== 1 · HERO ====== */}
      <section className="pt-28 pb-20 md:pt-36 md:pb-28 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="container mx-auto px-6 relative">
          <ScrollAnimationWrapper animationType="fade-in">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-sm font-mono tracking-widest text-secondary mb-4 uppercase">
                Inteligencia de negocios como servicio
              </p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Datos claros.{" "}
                <span className="text-gradient-purple">Decisiones correctas.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
                Unificamos la información de tu empresa y la convertimos en reportes accionables.
              </p>
              <p className="text-base text-muted-foreground max-w-xl mx-auto mb-10">
                Sin analistas internos. Sin meses de implementación.
              </p>

              <div className="flex flex-wrap justify-center gap-8 md:gap-14 mb-10">
                {[
                  { icon: BarChart3, value: "13", label: "Áreas" },
                  { icon: TrendingUp, value: "+65", label: "KPIs" },
                  { icon: BookOpen, value: "M / T / A", label: "Frecuencia" },
                ].map((s) => (
                  <div key={s.label} className="text-center flex flex-col items-center">
                    <s.icon className="h-5 w-5 text-primary mb-2" />
                    <p className="text-2xl md:text-3xl font-bold text-foreground">
                      {s.value}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleContactClick}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
              >
                Solicitar diagnóstico
              </Button>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* ====== 2 · EL PROBLEMA ====== */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper animationType="fade-in">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm font-mono text-secondary mb-2 uppercase tracking-wider">
                01 — El problema
              </p>
              <h2 className="text-3xl md:text-5xl font-bold mb-8">
                Tenés datos.{" "}
                <span className="text-gradient-purple">Pero no visión.</span>
              </h2>
              <div className="space-y-5 text-muted-foreground leading-relaxed text-lg">
                <p>
                  La información está dispersa: Excel, ERP, CRM, archivos por área.
                </p>
                <p>
                  Nadie la unifica. Nadie la analiza con frecuencia.
                </p>
                <p className="text-foreground font-medium text-xl">
                  Las decisiones se toman por intuición.
                </p>
              </div>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* ====== 3 · LA SOLUCIÓN ====== */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper animationType="fade-in">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm font-mono text-secondary mb-2 uppercase tracking-wider">
                02 — La solución
              </p>
              <h2 className="text-3xl md:text-5xl font-bold mb-8">
                Convertimos datos dispersos en{" "}
                <span className="text-gradient-orange">decisiones claras.</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Nos conectamos a tus fuentes, limpiamos la información y la transformamos en:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {[
                  "Indicadores clave",
                  "Alertas tempranas",
                  "Correlaciones entre áreas",
                  "Reportes listos para dirección",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border"
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-foreground font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Los informes se entregan la primera semana de cada mes, según la frecuencia acordada.
              </p>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* ====== 4 · CÓMO FUNCIONA ====== */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper animationType="fade-in">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <p className="text-sm font-mono text-secondary mb-2 uppercase tracking-wider">
                03 — Proceso
              </p>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Simple. Rápido.{" "}
                <span className="text-gradient-purple">Sin fricción.</span>
              </h2>
            </div>
          </ScrollAnimationWrapper>

          <div className="max-w-3xl mx-auto">
            {[
              { num: "1", title: "Conectamos tus datos", desc: "Integramos tus fuentes existentes: ERPs, CRMs, planillas, APIs." },
              { num: "2", title: "Diseñamos el dashboard y los reportes", desc: "Adaptados a tu industria, tus KPIs y tu equipo de dirección." },
              { num: "3", title: "Recibís informes periódicos con insights accionables", desc: "Cada semana, mes, trimestre o año, según lo que necesites." },
            ].map((step, i) => (
              <ScrollAnimationWrapper key={step.num} animationType="fade-in" delay={i * 100}>
                <div className="flex items-start gap-5 mb-6">
                  <span className="shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold">
                    {step.num}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">{step.title}</h3>
                    <p className="text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* ====== 5 · COBERTURA ====== */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper animationType="fade-in">
            <div className="text-center mb-12">
              <p className="text-sm font-mono text-secondary mb-2 uppercase tracking-wider">
                04 — Cobertura
              </p>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                13 áreas estratégicas{" "}
                <span className="text-gradient-purple">del negocio</span>
              </h2>
            </div>
          </ScrollAnimationWrapper>

          <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
            {areas.map((area, i) => {
              const Icon = area.icon;
              return (
                <ScrollAnimationWrapper key={area.name} animationType="fade-in" delay={i * 40}>
                  <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border text-center card-hover">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground leading-tight">{area.name}</span>
                  </div>
                </ScrollAnimationWrapper>
              );
            })}
          </div>

          <ScrollAnimationWrapper animationType="fade-in" delay={200}>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-lg text-foreground font-medium mb-4">
                Más de 65 KPIs combinando:
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center gap-2 text-sm">
                  <TrendingDown className="h-4 w-4 text-secondary" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Resultados</strong> — lo que ya pasó
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Señales anticipadas</strong> — lo que está por pasar
                  </span>
                </div>
              </div>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* ====== 6 · DIFERENCIAL ====== */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper animationType="fade-in">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <p className="text-sm font-mono text-secondary mb-2 uppercase tracking-wider">
                05 — Diferencial
              </p>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                No es un dashboard.{" "}
                <span className="text-gradient-orange">Es inteligencia cruzada.</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Al medir todas las áreas en un mismo sistema detectamos relaciones invisibles:
              </p>
            </div>
          </ScrollAnimationWrapper>

          <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {correlations.map((c, i) => {
              const Icon = c.icon;
              return (
                <ScrollAnimationWrapper key={i} animationType="fade-in" delay={i * 80}>
                  <div className="flex items-center gap-4 p-5 rounded-xl bg-background border border-border">
                    <Icon className={`h-5 w-5 shrink-0 ${c.icon === TrendingUp ? 'text-primary' : 'text-secondary'}`} />
                    <p className="text-sm text-foreground">
                      <strong>{c.cause}</strong>{" "}
                      <span className="text-muted-foreground">= {c.effect}</span>
                    </p>
                  </div>
                </ScrollAnimationWrapper>
              );
            })}
          </div>

          <ScrollAnimationWrapper animationType="fade-in" delay={400}>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-muted-foreground">No mostramos números.</p>
              <p className="text-xl font-bold text-foreground mt-1">Mostramos impacto.</p>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* ====== 7 · FRECUENCIA DE ENTREGA ====== */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper animationType="fade-in">
            <div className="text-center mb-12">
              <p className="text-sm font-mono text-secondary mb-2 uppercase tracking-wider">
                06 — Cadencia
              </p>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Frecuencia de{" "}
                <span className="text-gradient-purple">entrega</span>
              </h2>
            </div>
          </ScrollAnimationWrapper>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: BarChart3,
                freq: "Mensual",
                desc: "Evaluación completa del desempeño operativo.",
              },
              {
                icon: LineChart,
                freq: "Trimestral",
                desc: "Análisis estratégico y tendencias.",
              },
              {
                icon: BookOpen,
                freq: "Anual",
                desc: "Balance integral y comparación histórica.",
              },
            ].map((f, i) => (
              <ScrollAnimationWrapper key={f.freq} animationType="fade-in" delay={i * 100}>
                <Card className="border border-border bg-card h-full text-center card-hover">
                  <CardContent className="pt-8 pb-6">
                    <f.icon className="h-8 w-8 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-foreground mb-2">{f.freq}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </CardContent>
                </Card>
              </ScrollAnimationWrapper>
            ))}
          </div>

          <ScrollAnimationWrapper animationType="fade-in" delay={300}>
            <p className="text-center text-sm text-muted-foreground mt-8 max-w-xl mx-auto">
              Todos los informes se entregan la primera semana del período correspondiente.
            </p>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* ====== 8 · PLANES ====== */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper animationType="fade-in">
            <div className="text-center mb-12">
              <p className="text-sm font-mono text-secondary mb-2 uppercase tracking-wider">
                07 — Inversión
              </p>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Tres planes, una{" "}
                <span className="text-gradient-orange">misma calidad</span>
              </h2>
            </div>
          </ScrollAnimationWrapper>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* STARTER */}
            <ScrollAnimationWrapper animationType="fade-in" delay={0}>
              <Card className="border border-border bg-background h-full flex flex-col">
                <CardHeader className="text-center pb-4">
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
                    Starter
                  </p>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-foreground">$600</span>
                    <span className="text-muted-foreground ml-1 text-sm">USD / mes</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-3 flex-1">
                    {[
                      "3 áreas a elección",
                      "~15 KPIs",
                      "Reporte mensual",
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={handleContactClick}
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
                    <span className="text-muted-foreground ml-1 text-sm">USD / mes</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-3 flex-1">
                    {[
                      "6 áreas incluidas",
                      "~35 KPIs",
                      "Reportes mensuales + análisis trimestral",
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={handleContactClick}
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
                    <span className="text-muted-foreground ml-1 text-sm">USD / mes</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-3 flex-1">
                    {[
                      "13 áreas completas",
                      "+65 KPIs",
                      "Reportes mensuales, trimestrales y anuales",
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={handleContactClick}
                    variant="outline"
                    className="w-full mt-8"
                  >
                    Comenzar
                  </Button>
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>

      {/* ====== 9 · CIERRE ====== */}
      <section className="py-20 md:py-28 bg-background relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="container mx-auto px-6 relative">
          <ScrollAnimationWrapper animationType="fade-in">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-8">
                Inteligencia operativa{" "}
                <span className="text-gradient-purple">sin estructura interna.</span>
              </h2>
              <div className="space-y-2 text-lg text-muted-foreground mb-10">
                <p>Sin contratar analistas.</p>
                <p>Sin meses de implementación.</p>
                <p>Sin herramientas complejas.</p>
              </div>
              <p className="text-xl md:text-2xl font-bold text-foreground mb-10">
                Datos claros. Decisiones correctas.
              </p>
              <Button
                onClick={handleContactClick}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
              >
                <Mail className="mr-2 h-4 w-4" />
                Hablar con un especialista
              </Button>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Reportes;
