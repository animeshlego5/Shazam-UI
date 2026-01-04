"use client";

import { useState } from 'react'
import HeroSection from '@/components/hero-section'
import AboutSection from '@/components/about-section'
import JourneySection from '@/components/journey-section'
import Footer from '@/components/footer'
import TestSongsNote from '@/components/test-songs-note'
import { LetterGlitch } from '@/components/ui/letter-glitch'
import { GradientBorderHeader } from '@/components/headers/GradientBorderHeader'

export default function Home() {
  const [isTestSongsOpen, setIsTestSongsOpen] = useState(false);

  return (
    <>
      <GradientBorderHeader />
      <main className="relative overflow-hidden">
        {/* Shared Letter Glitch Background */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <LetterGlitch
            glitchColors={["#2b2b2b", "#3d3d3d", "#4c1d95", "#8b5cf6", "#0ea5e9"]}
            glitchSpeed={50}
            centerVignette={true}
            outerVignette={true}
            smooth={true}
          />
        </div>

        <HeroSection onShowTestSongs={() => setIsTestSongsOpen(true)} />
        <AboutSection />
        <JourneySection />
        <Footer />
      </main>
      <TestSongsNote
        isOpen={isTestSongsOpen}
        onToggle={() => setIsTestSongsOpen(!isTestSongsOpen)}
      />
    </>
  )
}
