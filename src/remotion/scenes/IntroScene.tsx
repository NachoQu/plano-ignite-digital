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

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const logoRotate = interpolate(logoScale, [0, 1], [-10, 0]);

  const titleProgress = spring({
    frame,
    fps,
    delay: 15,
    config: { damping: 200 },
  });

  const titleY = interpolate(titleProgress, [0, 1], [60, 0]);
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);

  const subtitleProgress = spring({
    frame,
    fps,
    delay: 30,
    config: { damping: 200 },
  });

  const subtitleY = interpolate(subtitleProgress, [0, 1], [40, 0]);
  const subtitleOpacity = interpolate(subtitleProgress, [0, 1], [0, 1]);

  const lineWidth = spring({
    frame,
    fps,
    delay: 25,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 50%, #0d0d2b 100%)",
        fontFamily,
      }}
    >
      {/* Decorative circles */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
          top: -100,
          right: -100,
          transform: `scale(${logoScale})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)",
          bottom: -50,
          left: -50,
          transform: `scale(${subtitleProgress})`,
        }}
      />

      <div style={{ textAlign: "center", zIndex: 1 }}>
        {/* Logo mark */}
        <div
          style={{
            fontSize: 90,
            fontWeight: 900,
            color: "white",
            transform: `scale(${logoScale}) rotate(${logoRotate}deg)`,
            marginBottom: 10,
            letterSpacing: -2,
          }}
        >
          <span style={{ color: "#818cf8" }}>P</span>
          <span>lano</span>
        </div>

        {/* Decorative line */}
        <div
          style={{
            width: interpolate(lineWidth, [0, 1], [0, 200]),
            height: 3,
            background: "linear-gradient(90deg, #818cf8, #a855f7)",
            margin: "0 auto",
            borderRadius: 2,
          }}
        />

        {/* Title */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: "white",
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            marginTop: 20,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          Ignite Digital
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 20,
            fontWeight: 400,
            color: "rgba(255,255,255,0.6)",
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
            marginTop: 16,
            letterSpacing: 2,
          }}
        >
          Transformamos ideas en experiencias digitales
        </div>
      </div>
    </AbsoluteFill>
  );
};
