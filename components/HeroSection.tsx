'use client'

import { useState } from 'react'
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

export default function HeroSection() {
  const [flavourIndex, setFlavourIndex] = useState(0)

  return (
    <section
      className="relative h-screen w-full overflow-hidden flex items-center justify-center transition-colors duration-500"
      style={{ backgroundColor: FLAVOURS[flavourIndex].bg }}
    >
      {/* Headline (behind can) */}
      <h1 className="absolute z-10 text-center text-7xl md:text-9xl font-bold tracking-tight pointer-events-none">
        CLASSIC CRAFT BEERS
        <br />
        BREWED WITHOUT FUSS
      </h1>

      {/* 3D Can */}
      <BeerScene
        flavour={FLAVOURS[flavourIndex]}
        onNextFlavour={() =>
          setFlavourIndex((i) => (i + 1) % FLAVOURS.length)
        }
      />

      {/* Flavour text */}
      <FlavourOverlay flavour={FLAVOURS[flavourIndex]} />
    </section>
  )
}
