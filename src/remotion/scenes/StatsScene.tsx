import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700", "900"],
  subsets: ["latin"],
});

const stats = [
  { value: 10, suffix: "+", label: "Proyectos completados", color: "#818cf8" },
  { value: 100, suffix: "%", label: "Satisfacción del cliente", color: "#a855f7" },
  { value: 5, suffix: "+", label: "Años de experiencia", color: "#ec4899" },
];

const AnimatedStat: React.FC<{
  stat: typeof stats[0];
  index: number;
}> = ({ stat, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    delay: index * 12,
    config: { damping: 200 },
  });

  const scale = interpolate(entrance, [0, 1], [0.5, 1]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  const countProgress = interpolate(
    frame,
    [index * 12 + 10, index * 12 + 40],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const currentValue = Math.round(stat.value * countProgress);

  return (
    <div
      style={{
        textAlign: "center",
        opacity,
        transform: `scale(${scale})`,
        width: 280,
      }}
    >
      <div
        style={{
          fontSize: 80,
          fontWeight: 900,
          color: stat.color,
          lineHeight: 1,
          marginBottom: 12,
        }}
      >
        {currentValue}
        {countProgress > 0.5 ? stat.suffix : ""}
      </div>
      <div
        style={{
          fontSize: 18,
          fontWeight: 400,
          color: "rgba(255,255,255,0.6)",
          letterSpacing: 1,
        }}
      >
        {stat.label}
      </div>
    </div>
  );
};

export const StatsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);
  const titleY = interpolate(titleProgress, [0, 1], [30, 0]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0a0a1a 0%, #12122e 50%, #0d0d2b 100%)",
        fontFamily,
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 140,
          textAlign: "center",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "white",
          }}
        >
          Resultados que hablan
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "flex",
          gap: 80,
          marginTop: 60,
        }}
      >
        {stats.map((stat, i) => (
          <AnimatedStat key={stat.label} stat={stat} index={i} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
