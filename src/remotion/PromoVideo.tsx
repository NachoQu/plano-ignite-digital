import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { IntroScene } from "./scenes/IntroScene";
import { ServicesScene } from "./scenes/ServicesScene";
import { StatsScene } from "./scenes/StatsScene";
import { CtaScene } from "./scenes/CtaScene";

const TRANSITION_DURATION = 15;

export const PromoVideo: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Scene 1: Intro - 4 seconds */}
      <TransitionSeries.Sequence durationInFrames={120}>
        <IntroScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />

      {/* Scene 2: Services - 4 seconds */}
      <TransitionSeries.Sequence durationInFrames={120}>
        <ServicesScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />

      {/* Scene 3: Stats - 3.5 seconds */}
      <TransitionSeries.Sequence durationInFrames={105}>
        <StatsScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />

      {/* Scene 4: CTA - 4 seconds */}
      <TransitionSeries.Sequence durationInFrames={120}>
        <CtaScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
