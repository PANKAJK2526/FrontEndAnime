'use client'

import { useEffect } from 'react'
import { ScrollSmoother } from '@/lib/gsap'

export default function SmoothWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const smoother = ScrollSmoother.create({
      smooth: 1.2,
      effects: true,
      smoothTouch: 0.1,
    })

    return () => {
      smoother.kill()
    }
  }, [])

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  )
}
