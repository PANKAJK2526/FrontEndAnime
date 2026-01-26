'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import BeerScene from './BeerScene'
import FlavourOverlay from './FlavourOverlay'

export const FLAVOURS = [
  {
    name: 'NEIPA',
    note: 'JUICY · HAZY · SOFT',
    bg: '#6b8f7a',
    can: '#1e2f28',
    label: 'neipa',
  },
  {
    name: 'IPA',
    note: 'BITTER · CITRUS · BOLD',
    bg: '#9b6a4f',
    can: '#3a2417',
    label: 'ipa',
  },
  {
    name: 'STOUT',
    note: 'DARK · ROASTED · STRONG',
    bg: '#2b2b2b',
    can: '#0f0f0f',
    label: 'stout',
  },
]

const HEADLINE = 'CLASSIC CRAFT BEERS BREWED WITHOUT FUSS'

export default function HeroSection() {
  const [flavourIndex, setFlavourIndex] = useState(0)
  const [startCan, setStartCan] = useState(false)

  const lettersRef = useRef<HTMLSpanElement[]>([])

  useEffect(() => {
    const tl = gsap.timeline()

    // Letter-by-letter reveal (slow, cinematic)
    tl.to(lettersRef.current, {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.045, // ⬅️ controls speed (increase = slower)
    })

    // Start can AFTER text completes
    tl.call(() => setStartCan(true))
  }, [])

  return (
    <section
      className="relative h-screen w-full overflow-hidden flex items-center justify-center transition-colors duration-500"
      style={{ backgroundColor: FLAVOURS[flavourIndex].bg }}
    >
      {/* HEADLINE */}
      <h1 className="absolute z-10 text-center text-7xl md:text-9xl font-bold tracking-tight leading-tight pointer-events-none">
        {HEADLINE.split('').map((char, i) => (
          <span
            key={i}
            ref={(el) => {
              if (el) lettersRef.current[i] = el
            }}
            className="inline-block"
            style={{
              opacity: 0,                 // 🔒 prevents initial flash
              transform: 'translateX(-20px) translateY(6px)',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h1>

      {/* CAN */}
      <BeerScene
        start={startCan}
        flavour={FLAVOURS[flavourIndex]}
        onNextFlavour={() =>
          setFlavourIndex((i) => (i + 1) % FLAVOURS.length)
        }
      />

      {/* FLAVOUR OVERLAY */}
      <FlavourOverlay flavour={FLAVOURS[flavourIndex]} />
    </section>
  )
}
