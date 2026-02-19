import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "700", "900"],
  subsets: ["latin"],
});

export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgPulse = interpolate(
    frame % (2 * fps),
    [0, fps, 2 * fps],
    [1, 1.05, 1],
  );

  const headlineProgress = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const headlineScale = interpolate(headlineProgress, [0, 1], [0.7, 1]);
  const headlineOpacity = interpolate(headlineProgress, [0, 1], [0, 1]);

  const subProgress = spring({
    frame,
    fps,
    delay: 15,
    config: { damping: 200 },
  });

  const subOpacity = interpolate(subProgress, [0, 1], [0, 1]);
  const subY = interpolate(subProgress, [0, 1], [30, 0]);

  const buttonProgress = spring({
    frame,
    fps,
    delay: 30,
    config: { damping: 12 },
  });

  const buttonScale = interpolate(buttonProgress, [0, 1], [0, 1]);

  const buttonPulse = interpolate(
    Math.max(0, frame - 50) % (1.5 * fps),
    [0, 0.75 * fps, 1.5 * fps],
    [1, 1.06, 1],
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
      }}
    >
      {/* Animated gradient background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, #1a1a3e 0%, #2d1b69 40%, #1a1a3e 70%, #0d0d2b 100%)",
          transform: `scale(${bgPulse})`,
        }}
      />

      {/* Glow effect */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(129,140,248,0.2) 0%, transparent 60%)",
          transform: `scale(${bgPulse})`,
        }}
      />

      <div style={{ textAlign: "center", zIndex: 1 }}>
        {/* Headline */}
        <div
          style={{
            fontSize: 60,
            fontWeight: 900,
            color: "white",
            opacity: headlineOpacity,
            transform: `scale(${headlineScale})`,
            lineHeight: 1.2,
            maxWidth: 900,
          }}
        >
          <span style={{ color: "#818cf8" }}>Llevemos</span> tu idea
          <br />
          al mundo digital
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 22,
            fontWeight: 400,
            color: "rgba(255,255,255,0.6)",
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
            marginTop: 24,
            letterSpacing: 1,
          }}
        >
          Web, Apps, Branding & Mentoría
        </div>

        {/* CTA Button */}
        <div
          style={{
            marginTop: 48,
            transform: `scale(${buttonScale * buttonPulse})`,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              background: "linear-gradient(135deg, #818cf8, #a855f7)",
              color: "white",
              fontSize: 24,
              fontWeight: 700,
              padding: "18px 48px",
              borderRadius: 60,
              boxShadow: "0 4px 30px rgba(129,140,248,0.4)",
            }}
          >
            planoignitedigital.com
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
