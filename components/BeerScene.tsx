'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap } from '@/lib/gsap'
import { useTexture } from '@react-three/drei'

function Can({
  colour,
  label,
  onNextFlavour,
}: {
  colour: string
  label: 'neipa' | 'ipa' | 'stout'
  onNextFlavour: () => void
}) {
  const mesh = useRef<THREE.Mesh>(null)
  const sideMaterial = useRef<THREE.MeshStandardMaterial>(null)

  // Authoritative animation state (NO React state)
  const state = useRef({
    y: 3.5,
    rotation: -0.6,
  })

  // Load textures once
  const textures = useTexture({
    neipa: '/labels/neipa.png',
    ipa: '/labels/ipa.png',
    stout: '/labels/stout.png',
  })

  Object.values(textures).forEach((t) => {
    t.wrapS = THREE.RepeatWrapping
    t.wrapT = THREE.ClampToEdgeWrapping
  })

  const swappedThisTurn = useRef(false)

  // Lock front/back angles (stable, no drift)
  const BACK_START = Math.PI * 0.55
  const BACK_END = Math.PI * 1.45

  useEffect(() => {
    const tl = gsap.timeline()

    // 🐱 Cat-thrown imperfect drop
    tl.to(state.current, {
      y: -0.3,
      rotation: 0.4,
      duration: 0.9,
      ease: 'power2.out',
    })

    // 🧲 Settle with bounce
    tl.to(state.current, {
      y: 0,
      rotation: 0,
      duration: 0.4,
      ease: 'elastic.out(1, 0.5)',
    })

    // 🔄 Single authoritative rotation clock
    tl.to(state.current, {
      rotation: `+=${Math.PI * 2}`,
      duration: 2.2,
      ease: 'none',
      repeat: -1,
      onRepeat: () => {
        swappedThisTurn.current = false
        onNextFlavour()
      },
    })
  }, [])

  useFrame(({ clock }) => {
    if (!mesh.current || !sideMaterial.current) return

    const raw = state.current.rotation
    const rot =
      ((raw % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)

    const time = clock.getElapsedTime()

    // Position
    mesh.current.position.y = state.current.y

    // Main spin
    mesh.current.rotation.y = raw

    // Slanted axis
    mesh.current.rotation.x = 0.15
    mesh.current.rotation.z = 0.08

    // Subtle shake (alive feel)
    mesh.current.rotation.x += Math.sin(time * 6) * 0.015
    mesh.current.rotation.z += Math.cos(time * 5) * 0.015

    // Backside-only label swap (magic)
    const isBackside = rot > BACK_START && rot < BACK_END

    if (isBackside && !swappedThisTurn.current) {
      sideMaterial.current.map = textures[label]
      sideMaterial.current.needsUpdate = true
      swappedThisTurn.current = true
    }
  })

  return (
    <mesh ref={mesh}>
      <cylinderGeometry args={[0.6, 0.6, 2.2, 64]} />

      {/* Side label */}
      <meshStandardMaterial
        ref={sideMaterial}
        attach="material-0"
        map={textures[label]}
        metalness={0.4}
        roughness={0.6}
        depthTest={false}
      />

      {/* Top */}
      <meshStandardMaterial
        attach="material-1"
        color={colour}
        metalness={0.9}
        roughness={0.25}
      />

      {/* Bottom */}
      <meshStandardMaterial
        attach="material-2"
        color={colour}
        metalness={0.9}
        roughness={0.25}
      />
    </mesh>
  )
}

export default function BeerScene({
  flavour,
  onNextFlavour,
}: {
  flavour: { can: string; label: 'neipa' | 'ipa' | 'stout' }
  onNextFlavour: () => void
}) {
  return (
    <Canvas
      className="absolute inset-0 z-20 pointer-events-none"
      camera={{ position: [0, 0, 4], fov: 45 }} // 🔍 2× zoom
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <Can
        colour={flavour.can}
        label={flavour.label}
        onNextFlavour={onNextFlavour}
      />
    </Canvas>
  )
}
