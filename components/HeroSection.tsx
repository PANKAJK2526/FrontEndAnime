'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import BeerScene from './BeerScene'
import FlavourOverlay from './FlavourOverlay'
import BackgroundWaves from './BackgroundWaves'

export const FLAVOURS = [
  {
    name: 'NEIPA',
    note: 'JUICY · HAZY · SOFT',
    bg: '#6b8f7a',
    can: '#6b8f7a',
    label: 'neipa',
  },
  {
    name: 'IPA',
    note: 'BITTER · CITRUS · BOLD',
    bg: '#9b6a4f',
    can: '#9b6a4f',
    label: 'ipa',
  },
  {
    name: 'STOUT',
    note: 'DARK · ROASTED · STRONG',
    bg: '#2b2b2b',
    can: '#2b2b2b',
    label: 'stout',
  },
]

const HEADLINE = 'CLASSIC CRAFT BEERS BREWED WITHOUT FUSS'

export default function HeroSection() {
  const [flavourIndex, setFlavourIndex] = useState(0)
  const [bgIndex, setBgIndex] = useState(0)

  const [waveColour, setWaveColour] = useState<string | null>(null)
  const [startCan, setStartCan] = useState(false)

  const isTransitioning = useRef(false)
  const lettersRef = useRef<HTMLSpanElement[]>([])

  useEffect(() => {
    const tl = gsap.timeline()
    tl.to(lettersRef.current, {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.045,
    })
    tl.call(() => setStartCan(true))
  }, [])

  function startFlavourTransition() {
    if (isTransitioning.current) return
    isTransitioning.current = true

    const next = (flavourIndex + 1) % FLAVOURS.length
    const nextBg = FLAVOURS[next].bg

    // 1️⃣ Start the wave with the NEXT colour
    setWaveColour(nextBg)

    // 2️⃣ GSAP owns the timing from here
    gsap.timeline({
      onComplete: () => {
        setBgIndex(next)
        setWaveColour(null)
        isTransitioning.current = false
      },
    })
      // Wave starts expanding immediately
      .to({}, { duration: 0 }) 

      // Commit beer flavour mid-wave (feels natural)
      .call(() => {
        setFlavourIndex(next)
      }, [], 0.4)

      // Commit background near wave completion
      .call(() => {
        setBgIndex(next)
      }, [], 2.4)
  }

  return (
    <section
      className="relative h-screen w-full overflow-hidden flex items-center justify-center text-white"
      style={{ backgroundColor: FLAVOURS[bgIndex].bg }}
    >
      {/* 🌊 FILLED WAVE */}
      {waveColour && (
        <BackgroundWaves colour={waveColour} />
      )}

      {/* HEADLINE */}
      <h1
        className="
          absolute
          top-1/2
          -translate-y-[55%]
          z-10
          pointer-events-none
          text-center
          font-extrabold
          tracking-tight
          leading-[0.95]
          text-[clamp(3rem,10vw,9rem)]
          md:text-[clamp(6rem,12vw,12rem)]
          max-w-[14ch]
          opacity-90
        "
      >
        {HEADLINE.split('').map((char, i) => (
          <span
            key={i}
            ref={(el) => el && (lettersRef.current[i] = el)}
            className="inline-block"
            style={{
              opacity: 0,
              transform: 'translateX(-20px) translateY(6px)',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h1>

      {/* 🍺 BEER */}
      <BeerScene
        start={startCan}
        flavour={FLAVOURS[flavourIndex]}
        onNextFlavour={startFlavourTransition}
      />

      <FlavourOverlay flavour={FLAVOURS[flavourIndex]} />
    </section>
  )
}
