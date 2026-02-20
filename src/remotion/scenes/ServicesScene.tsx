import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin"],
});

const services = [
  { icon: "🌐", title: "Sitios Web", desc: "Rápidos y profesionales", color: "#818cf8" },
  { icon: "⚡", title: "Web Apps", desc: "Sistemas y herramientas", color: "#a855f7" },
  { icon: "🎨", title: "Branding", desc: "Logos e identidad visual", color: "#ec4899" },
  { icon: "🧠", title: "Mentoría", desc: "Sesiones 1 a 1", color: "#06b6d4" },
];

const ServiceCard: React.FC<{ service: typeof services[0]; index: number }> = ({
  service,
  index,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    delay: index * 8,
    config: { damping: 15, stiffness: 120 },
  });

  const translateY = interpolate(entrance, [0, 1], [80, 0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  const glowOpacity = interpolate(
    frame,
    [index * 8 + 20, index * 8 + 40],
    [0, 0.3],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: 200,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: 24,
          background: `linear-gradient(135deg, ${service.color}22, ${service.color}44)`,
          border: `2px solid ${service.color}66`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 44,
          marginBottom: 16,
          boxShadow: `0 0 ${glowOpacity * 60}px ${service.color}`,
        }}
      >
        {service.icon}
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: "white",
          marginBottom: 6,
        }}
      >
        {service.title}
      </div>
      <div
        style={{
          fontSize: 15,
          fontWeight: 400,
          color: "rgba(255,255,255,0.5)",
        }}
      >
        {service.desc}
      </div>
    </div>
  );
};

export const ServicesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);
  const titleY = interpolate(titleProgress, [0, 1], [40, 0]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0d0d2b 0%, #1a1a3e 50%, #0a0a1a 100%)",
        fontFamily,
      }}
    >
      {/* Section title */}
      <div
        style={{
          position: "absolute",
          top: 120,
          textAlign: "center",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#818cf8",
            textTransform: "uppercase",
            letterSpacing: 4,
            marginBottom: 12,
          }}
        >
          Nuestros servicios
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "white",
          }}
        >
          Lo que hacemos
        </div>
      </div>

      {/* Service cards */}
      <Sequence from={10} layout="none" premountFor={fps}>
        <div
          style={{
            display: "flex",
            gap: 60,
            marginTop: 80,
          }}
        >
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
