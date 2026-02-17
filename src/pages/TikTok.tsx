import { useEffect, useState } from "react";
import { Globe, Cog, Palette, Brain, Rocket } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ServiceCard {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  highlighted?: boolean;
}

const cards: ServiceCard[] = [
  {
    icon: Globe,
    title: "Web",
    description: "Sitios rápidos y profesionales que generan clientes.",
    href: "https://wa.me/542323550605?text=Hola%20Nacho%2C%20vengo%20de%20TikTok%20%5BTT_WEB%5D.%20Quiero%20crear%20una%20web.%20Mi%20rubro%20es%3A%20___.%20Objetivo%3A%20___.%20%C2%BFMe%20cont%C3%A1s%20tiempos%20y%20precio%3F",
  },
  {
    icon: Cog,
    title: "App Web",
    description: "Sistemas y herramientas internas hechas con IA y No-Code.",
    href: "https://wa.me/542323550605?text=Hola%20Nacho%2C%20vengo%20de%20TikTok%20%5BTT_APP%5D.%20Quiero%20una%20app%20web%20para%20___.%20%C2%BFQu%C3%A9%20necesit%C3%A1s%20para%20cotizar%3F",
  },
  {
    icon: Palette,
    title: "Logo / Branding",
    description: "Identidad visual clara y profesional para tu marca.",
    href: "https://wa.me/542323550605?text=Hola%20Nacho%2C%20vengo%20de%20TikTok%20%5BTT_BRAND%5D.%20Necesito%20logo%20o%20branding%20para%20___.%20%C2%BFPodemos%20ver%20opciones%3F",
  },
  {
    icon: Brain,
    title: "Sesiones 1 a 1",
    description: "Mentorías sobre No-Code, IA y crecimiento digital.",
    href: "https://wa.me/542323550605?text=Hola%20Nacho%2C%20vengo%20de%20TikTok%20%5BTT_1A1%5D.%20Quiero%20una%20sesi%C3%B3n%201%20a%201%20para%20___.%20%C2%BFQu%C3%A9%20disponibilidad%20ten%C3%A9s%3F",
  },
  {
    icon: Rocket,
    title: "Presupuesto rápido",
    description: "Te hago 3 preguntas y te paso precio estimado.",
    href: "https://wa.me/542323550605?text=Hola%20Nacho%2C%20vengo%20de%20TikTok%20%5BTT_FAST%5D.%20Quiero%20un%20presupuesto%20r%C3%A1pido.%20%C2%BFMe%20hac%C3%A9s%203%20preguntas%20para%20cotizar%3F",
    highlighted: true,
  },
];

const TikTok = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in animations after mount
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(102,51,255,0.06) 0%, #ffffff 60%)",
      }}
    >
      <div className="mx-auto max-w-[520px] px-5 py-10">
        {/* HERO */}
        <header
          className="mb-8 text-center transition-all duration-700 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
          }}
        >
          {/* Avatar placeholder */}
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#6633FF] text-3xl font-bold text-white shadow-lg shadow-[#6633FF]/20">
            N
          </div>

          <h1
            className="mb-2 text-3xl font-bold tracking-tight"
            style={{ color: "#22242A" }}
          >
            Hola, soy Nacho{" "}
            <span role="img" aria-label="wave">
              👋
            </span>
          </h1>

          <p
            className="mb-3 text-base leading-relaxed"
            style={{ color: "#22242A" }}
          >
            Te atiendo personalmente por WhatsApp.
            <br />
            Elegí tu consulta y arrancamos ahora:
          </p>

          <span
            className="inline-block rounded-full px-3 py-1 text-xs font-medium"
            style={{
              backgroundColor: "rgba(255,176,22,0.15)",
              color: "#b07800",
            }}
          >
            Vengo de TikTok → te respondo yo.
          </span>
        </header>

        {/* SERVICE CARDS */}
        <section className="mb-10 flex flex-col gap-3">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <a
                key={card.title}
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-2xl border p-4 no-underline transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                style={{
                  backgroundColor: card.highlighted ? "#6633FF" : "#ffffff",
                  borderColor: card.highlighted
                    ? "#6633FF"
                    : "rgba(200,200,200,0.5)",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(20px)",
                  transitionDelay: `${150 + index * 80}ms`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: card.highlighted
                        ? "rgba(255,255,255,0.2)"
                        : "rgba(102,51,255,0.08)",
                    }}
                  >
                    <Icon
                      size={20}
                      style={{
                        color: card.highlighted ? "#ffffff" : "#6633FF",
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <h2
                      className="text-base font-semibold leading-tight"
                      style={{
                        color: card.highlighted ? "#ffffff" : "#22242A",
                      }}
                    >
                      {card.title}
                    </h2>
                    <p
                      className="mt-0.5 text-sm leading-snug"
                      style={{
                        color: card.highlighted
                          ? "rgba(255,255,255,0.85)"
                          : "#666666",
                      }}
                    >
                      {card.description}
                    </p>
                  </div>
                </div>
              </a>
            );
          })}
        </section>

        {/* SOCIAL PROOF */}
        <footer
          className="text-center transition-all duration-700 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transitionDelay: "700ms",
          }}
        >
          <p
            className="mb-1 text-sm font-medium"
            style={{ color: "#22242A" }}
          >
            Proyectos reales en Argentina
          </p>
          <p className="text-xs" style={{ color: "#C8C8C8" }}>
            Plano · Diseño + No-Code + IA
          </p>
        </footer>
      </div>
    </div>
  );
};

export default TikTok;
