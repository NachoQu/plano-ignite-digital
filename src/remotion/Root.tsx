import { Composition } from "remotion";
import { PromoVideo } from "./PromoVideo";

// Total duration: 120 + 120 + 105 + 120 - (15 * 3 transitions) = 420 frames = 14 seconds
const TOTAL_DURATION = 420;

export const RemotionRoot = () => {
  return (
    <Composition
      id="PromoVideo"
      component={PromoVideo}
      durationInFrames={TOTAL_DURATION}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
