import React from "react";
import RecorderAndUploader from "../components/audio/RecorderAndUploader";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { Variants } from "framer-motion";
import { GradientText } from "@/components/ui/gradient-text";
import { FlashlightText } from "@/components/ui/flashlight-text";
import { ClickSpark } from "@/components/ui/click-spark";
import { ScrambledText } from "@/components/ui/scrambled-text";

const transitionVariants: { item: Variants } = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

interface HeroSectionProps {
  onShowTestSongs?: () => void;
}

export default function HeroSection({ onShowTestSongs }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden min-h-[100vh] flex flex-col justify-center [--color-primary-foreground:var(--color-white)] [--color-primary:var(--color-green-600)]">

      <section className="relative z-10 w-full">
        <div className="relative mx-auto max-w-6xl px-6 pb-10 pt-10 lg:pt-20">
          <div className="relative z-10 mx-auto max-w-4xl text-center flex flex-col items-center gap-8">

            {/* Logo / Main Brand */}
            <div className="cursor-zoom-in">
              <FlashlightText
                enableTextBeam={true}
                className="text-7xl md:text-8xl font-bold tracking-tighter text-white font-syne"
                spotlightSize={150}
                enableAutoTrigger={true}
                autoTriggerInitialDelay={1000}
                autoTriggerDelay={2500}
              >
                NoteSpy
              </FlashlightText>
            </div>

            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.2,
                    },
                  },
                },
                ...transitionVariants,
              }}
              className="flex flex-col items-center gap-6"
            >
              <div className="text-balance text-4xl font-medium md:text-5xl text-white">
                Identify Any Song{" "}
                <GradientText
                  text="Instantly"
                  gradient="linear-gradient(90deg, #60a5fa 0%, #a78bfa 50%, #e879f9 100%)"
                  className="font-semibold"
                />
              </div>

              <div className="mx-auto max-w-2xl text-pretty text-base md:text-lg text-white/90">
                <ScrambledText
                  className="scrambled-text-demo"
                  radius={20}
                  duration={1.2}
                  speed={0.5}
                  scrambleChars=".:"
                >
                  Tap “Start Recording” and let NoteSpy listen.
                  We’ll tell you the song playing—fast and accurate.
                </ScrambledText>
              </div>

              {/* Interactive Action Area */}
              <div className="pt-8 w-full max-w-md">
                <ClickSpark
                  sparkColor="#8b5cf6"
                  sparkRadius={100}
                  sparkCount={12}
                  sparkSize={15}
                  className="w-full flex justify-center"
                >
                  <RecorderAndUploader onShowTestSongs={onShowTestSongs} />
                </ClickSpark>
              </div>

            </AnimatedGroup>
          </div>
        </div>
      </section>
    </section>
  );
}
