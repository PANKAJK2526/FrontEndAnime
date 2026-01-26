'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

export default function BackgroundWaves({ colour }: { colour: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    gsap.fromTo(
      ref.current,
      { scale: 0 },
      {
        scale: 5,
        duration: 10.8,
        delay: 0.5,
        ease: 'power1.out',
      }
    )
  }, [])

  return (
    <div
      ref={ref}
      className="bg-wave-filled"
      style={{ backgroundColor: colour }}
    />
  )
}
