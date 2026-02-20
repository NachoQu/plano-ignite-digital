import { Composition } from "remotion";
import { PromoVideo } from "./PromoVideo";

// Total duration: 120 + 120 + 105 + 120 = 465 frames = 15.5 seconds
const TOTAL_DURATION = 465;

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
