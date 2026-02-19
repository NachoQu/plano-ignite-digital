import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type MyCompositionProps = {
  title: string;
};

export const MyComposition: React.FC<MyCompositionProps> = ({ title }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const scale = interpolate(frame, [0, 30], [0.8, 1], {
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0f0f23",
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: 80,
            fontWeight: "bold",
            color: "white",
            margin: 0,
          }}
        >
          {title}
        </h1>
      </div>
    </AbsoluteFill>
  );
};
