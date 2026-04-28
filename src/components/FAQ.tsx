import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ScrollAnimationWrapper } from "@/components/ScrollAnimationWrapper";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "¿Cuánto cuesta hacer una página web o app web?",
    answer:
      "Depende del alcance. Una landing page parte desde $300 USD, un sitio corporativo completo desde $500 USD y una app web a medida (ERP, reservas, dashboard) desde $800 USD. Trabajamos con presupuestos claros y sin sorpresas. Consultanos y en 24 hs te enviamos una propuesta.",
  },
  {
    question: "¿En cuánto tiempo tienen lista mi web o aplicación?",
    answer:
      "Una landing page: 1–2 semanas. Un sitio corporativo: 2–4 semanas. Una app web o herramienta interna: 4–8 semanas. En todos los casos trabajamos con sprints semanales para que veas el avance en tiempo real y puedas dar feedback antes de cada entrega.",
  },
  {
    question: "¿Qué diferencia hay entre una página web y una app web?",
    answer:
      "Una página web muestra información de tu empresa: servicios, contacto, portfolio. Una app web es una aplicación en el navegador que gestiona datos: un sistema de turnos, un ERP, un panel de ventas o un CRM. En Plano hacemos las dos cosas, y muchas veces una PyME necesita ambas.",
  },
  {
    question: "¿Trabajan con empresas de todo el país o solo de Buenos Aires?",
    answer:
      "100% remoto. Trabajamos con PyMEs y Startups de todo Argentina: Buenos Aires, Mendoza, Córdoba, Santa Fe y más. Nos coordinamos por videollamada y WhatsApp; no hacen falta reuniones presenciales.",
  },
  {
    question: "¿Necesito saber de tecnología para trabajar con ustedes?",
    answer:
      "Para nada. Nos ocupamos de toda la parte técnica. Vos nos contás qué necesita tu negocio y nosotros lo traducimos en una solución digital. Explicamos todo en lenguaje simple, sin jerga técnica.",
  },
  {
    question: "¿Qué tecnologías usan?",
    answer:
      "Combinamos desarrollo no-code e IA con código a medida: React, TypeScript, Supabase, Lovable, Webflow y herramientas de automatización. Esto nos permite entregar más rápido y a menor costo que el desarrollo tradicional, sin sacrificar calidad.",
  },
  {
    question: "¿Ofrecen mantenimiento y soporte después del lanzamiento?",
    answer:
      "Sí. Ofrecemos soporte post-lanzamiento para correcciones, actualizaciones de contenido y nuevas funcionalidades. Podemos acordar un plan mensual o por hora según lo que necesites.",
  },
];

const FAQ = () => {
  const [open, setOpen] = useState<number | null>(null);

  const handleWhatsApp = () => {
    window.open(
      `https://wa.me/542323550605?text=${encodeURIComponent("Hola! Tengo una consulta sobre desarrollo web / app web para mi empresa")}`,
      "_blank"
    );
  };

  return (
    <section id="faq" className="py-20 bg-muted/50">
      <div className="container mx-auto px-6">
        <ScrollAnimationWrapper animationType="fade-in">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Preguntas{" "}
              <span className="text-gradient-purple">frecuentes</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Lo que nos preguntan antes de arrancar. Si no encontrás tu respuesta, escribinos.
            </p>
          </div>
        </ScrollAnimationWrapper>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <ScrollAnimationWrapper
              key={index}
              animationType="fade-in"
              delay={index * 60}
            >
              <div className="bg-background rounded-xl border border-border overflow-hidden">
                <button
                  onClick={() => setOpen(open === index ? null : index)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                  aria-expanded={open === index}
                >
                  <span className="font-semibold text-base leading-snug">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-primary flex-shrink-0 transition-transform duration-200 ${
                      open === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {open === index && (
                  <div className="px-6 pb-5 text-muted-foreground leading-relaxed text-sm md:text-base">
                    {faq.answer}
                  </div>
                )}
              </div>
            </ScrollAnimationWrapper>
          ))}
        </div>

        <ScrollAnimationWrapper animationType="fade-in" delay={400}>
          <div className="mt-10 text-center">
            <p className="text-muted-foreground mb-4">
              ¿Tenés otra pregunta? Escribinos directo por WhatsApp.
            </p>
            <Button
              onClick={handleWhatsApp}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-semibold hover-scale"
            >
              Hacer mi consulta
            </Button>
          </div>
        </ScrollAnimationWrapper>
      </div>
    </section>
  );
};

export default FAQ;
