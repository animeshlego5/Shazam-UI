"use client";

import React from "react";
import { Timeline } from "@/components/ui/timeline";
import { motion } from "framer-motion";
import { FlashlightText } from "@/components/ui/flashlight-text";

const journeyData = [
    {
        title: "Curiosity",
        titleElement: (
            <FlashlightText
                enableTextBeam={true}
                className="text-xl md:text-5xl font-bold text-white/80"
                spotlightSize={80}
            >
                Curiosity
            </FlashlightText>
        ),
        content: (
            <div>
                <h4 className="text-xl md:text-2xl font-semibold text-white mb-4">
                    Curiosity to Concept
                </h4>
                <p className="text-white/70 text-base md:text-lg leading-relaxed">
                    This project began from wondering how Shazam can recognize a song from a tiny,
                    noisy clip and trying to rebuild that magic for the web. I was fascinated by
                    the idea that a few seconds of humming or background music could be matched
                    against millions of tracks in an instant.
                </p>
            </div>
        ),
    },
    {
        title: "Fingerprinting",
        titleElement: (
            <FlashlightText
                enableTextBeam={true}
                className="text-xl md:text-5xl font-bold text-white/80"
                spotlightSize={80}
            >
                Fingerprinting
            </FlashlightText>
        ),
        content: (
            <div>
                <h4 className="text-xl md:text-2xl font-semibold text-white mb-4">
                    Audio Fingerprinting
                </h4>
                <p className="text-white/70 text-base md:text-lg leading-relaxed">
                    Raw audio is transformed into compact fingerprints that capture stable
                    time–frequency patterns, making songs identifiable even with noise and short
                    recordings. These fingerprints are essentially a compressed "signature" of the
                    audio that remains robust across different recording conditions.
                </p>
            </div>
        ),
    },
    {
        title: "KNN",
        titleElement: (
            <FlashlightText
                enableTextBeam={true}
                className="text-xl md:text-5xl font-bold text-white/80"
                spotlightSize={80}
            >
                KNN
            </FlashlightText>
        ),
        content: (
            <div>
                <h4 className="text-xl md:text-2xl font-semibold text-white mb-4">
                    K-Nearest Neighbors
                </h4>
                <p className="text-white/70 text-base md:text-lg leading-relaxed">
                    Each new recording's fingerprint is compared using K-nearest neighbors,
                    finding the closest matches in a high-dimensional fingerprint space. This
                    approach allows us to find similar songs even when the input is imperfect
                    or contains ambient noise.
                </p>
            </div>
        ),
    },
    {
        title: "Scaling",
        titleElement: (
            <FlashlightText
                enableTextBeam={true}
                className="text-xl md:text-5xl font-bold text-white/80"
                spotlightSize={80}
            >
                Scaling
            </FlashlightText>
        ),
        content: (
            <div>
                <h4 className="text-xl md:text-2xl font-semibold text-white mb-4">
                    Scaling the Search
                </h4>
                <p className="text-white/70 text-base md:text-lg leading-relaxed">
                    Ideas from locality-sensitive hashing and vector search keep lookup fast,
                    so matching remains near real-time even as the song catalog grows. These
                    techniques allow us to search through thousands of songs in milliseconds
                    without sacrificing accuracy.
                </p>
            </div>
        ),
    },
    {
        title: "Inspiration",
        titleElement: (
            <FlashlightText
                enableTextBeam={true}
                className="text-xl md:text-5xl font-bold text-white/80"
                spotlightSize={80}
            >
                Inspiration
            </FlashlightText>
        ),
        content: (
            <div>
                <h4 className="text-xl md:text-2xl font-semibold text-white mb-4">
                    Inspired by Shazam
                </h4>
                <p className="text-white/70 text-base md:text-lg leading-relaxed">
                    Research into Shazam's spectrogram constellations and time-aligned hashing
                    guided the design of NoteSpy's feature extraction and matching pipeline.
                    Their pioneering work on audio fingerprinting laid the foundation for
                    modern music recognition systems.
                </p>
            </div>
        ),
    },
];

export default function JourneySection() {
    return (
        <section
            id="journey"
            className="relative w-full overflow-hidden"
        >
            {/* Semi-transparent overlay for readability */}
            <div className="absolute inset-0 -z-20 bg-black/70" />

            {/* Animated Gradient Blobs */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div
                    className="absolute w-[500px] h-[500px] rounded-full opacity-30 blur-[100px]"
                    style={{
                        background: 'radial-gradient(circle, #1e3a5f 0%, transparent 70%)',
                        top: '10%',
                        right: '5%',
                        animation: 'floatBlue 22s ease-in-out infinite',
                    }}
                />
                <div
                    className="absolute w-[400px] h-[400px] rounded-full opacity-35 blur-[80px]"
                    style={{
                        background: 'radial-gradient(circle, #4c1d6e 0%, transparent 70%)',
                        bottom: '20%',
                        left: '10%',
                        animation: 'floatPurple 20s ease-in-out infinite',
                    }}
                />
            </div>

            <style jsx>{`
        @keyframes floatBlue {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 20px) scale(1.1); }
        }
        @keyframes floatPurple {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -30px) scale(1.05); }
        }
      `}</style>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                {/* Section Header - Centered */}
                <div className="max-w-7xl mx-auto pt-20 px-4 md:px-8 lg:px-10 text-center">
                    <motion.h2
                        className="text-4xl md:text-5xl font-bold text-white mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        The Journey
                    </motion.h2>
                    <motion.p
                        className="text-white/60 text-lg max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        From a spark of curiosity to a working music recognition system—here's
                        how NoteSpy came to life.
                    </motion.p>
                </div>

                <Timeline data={journeyData} />
            </motion.div>
        </section>
    );
}

