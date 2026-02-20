import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { IntroScene } from "./scenes/IntroScene";
import { ServicesScene } from "./scenes/ServicesScene";
import { StatsScene } from "./scenes/StatsScene";
import { CtaScene } from "./scenes/CtaScene";

const FADE_DURATION = 15;

const FadeIn: React.FC<{ children: React.ReactNode; durationInFrames: number }> = ({
  children,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, FADE_DURATION], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - FADE_DURATION, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut) }}>
      {children}
    </AbsoluteFill>
  );
};

export const PromoVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Scene 1: Intro - 4 seconds */}
      <Sequence from={0} durationInFrames={120}>
        <FadeIn durationInFrames={120}>
          <IntroScene />
        </FadeIn>
      </Sequence>

      {/* Scene 2: Services - 4 seconds */}
      <Sequence from={120} durationInFrames={120}>
        <FadeIn durationInFrames={120}>
          <ServicesScene />
        </FadeIn>
      </Sequence>

      {/* Scene 3: Stats - 3.5 seconds */}
      <Sequence from={240} durationInFrames={105}>
        <FadeIn durationInFrames={105}>
          <StatsScene />
        </FadeIn>
      </Sequence>

      {/* Scene 4: CTA - 4 seconds */}
      <Sequence from={345} durationInFrames={120}>
        <FadeIn durationInFrames={120}>
          <CtaScene />
        </FadeIn>
      </Sequence>
    </AbsoluteFill>
  );
};
