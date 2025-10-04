import React from "react";
import RecorderAndUploader from "../components/audio/RecorderAndUploader";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { HeroHeader } from "./header";
import { Variants } from "framer-motion";
import { TextScrambleHover } from "@/components/ui/text-scramble-hover";
import { GradientText } from "@/components/ui/gradient-text";
import { SpotlightBorder } from '@/components/ui/spotlight-border';

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

export default function HeroSection() {
  return (
    <>
      <HeroHeader />      
      <main className="overflow-hidden [--color-primary-foreground:var(--color-white)] [--color-primary:var(--color-green-600)]">
        <section>
          <div className="relative mx-auto max-w-6xl px-6 pb-10 pt-10 lg:pt-20">
            <div className="relative z-10 mx-auto max-w-4xl text-center">
              <TextScrambleHover
                text="NoteSpy"
                scrambleSpeed={50} // ms per step (recommended: 40-80)
                scrambleCycles={3} // higher = longer scrambling effect
                hoverDuration={2} // Aceternity hover animation duration in seconds
              />
              {/* <TextEffect
                preset="fade-in-blur"
                speedSegment={0.3}
                as="h1"
                className="text-balance mt-20 text-5xl font-medium md:text-6xl"
              >
                Identify Any Song Instantly
              </TextEffect> */}
              {/* <TextEffect
                per="line"
                preset="fade-in-blur"
                speedSegment={0.3}
                delay={0.5}
                as="p"
                className="mx-auto mt-6 max-w-2xl text-pretty text-lg"
              >
                Tap “Start Recording” and let NoteSpy listen.
                We’ll tell you the song playing—fast and accurate.
              </TextEffect> */}
              
              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: {
                        staggerChildren: 0.05,
                        delayChildren: 0.75,
                      },
                    },
                  },
                  ...transitionVariants,
                }}
                className="mt-6"
              >
                <div className="text-balance text-5xl font-medium md:text-6xl">
                  Identify Any Song{" "}
                  <GradientText
                    text="Instantly"
                    gradient="linear-gradient(90deg, #32a850 0%, #084f1a 50%, #0d8c2d 100%)"
                  />
                </div>
                <div className="mx-auto mt-6 mb-10 max-w-2xl text-pretty text-lg">
                  Tap “Start Recording” and let NoteSpy listen. We’ll tell you
                  the song playing—fast and accurate.
                </div>
                <RecorderAndUploader />
              </AnimatedGroup>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
