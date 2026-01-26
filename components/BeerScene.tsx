'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap } from '@/lib/gsap'
import { useTexture } from '@react-three/drei'

function Can({
  colour,
  label,
  start,
  onNextFlavour,
}: {
  colour: string
  label: 'neipa' | 'ipa' | 'stout'
  start: boolean
  onNextFlavour: () => void
}) {
  const groupRef = useRef<THREE.Group>(null)
  const sideMaterial = useRef<THREE.MeshStandardMaterial>(null)

  // Use a ref to access the latest callback without triggering re-runs
  const onNextFlavourRef = useRef(onNextFlavour)
  onNextFlavourRef.current = onNextFlavour

  const state = useRef({
    y: 3.5,
    rotation: -0.6,
  })

  const textures = useTexture({
    neipa: '/labels/neipa.png',
    ipa: '/labels/ipa.png',
    stout: '/labels/stout.png',
  })

  Object.values(textures).forEach((t) => {
    t.wrapS = THREE.RepeatWrapping
    t.wrapT = THREE.ClampToEdgeWrapping
    t.colorSpace = THREE.SRGBColorSpace
  })

  const swappedThisTurn = useRef(false)
  const BACK_START = Math.PI * 0.55
  const BACK_END = Math.PI * 1.45

  useEffect(() => {
    if (!start) return

    const tl = gsap.timeline()

    // 🐱 Cat-thrown drop
    tl.to(state.current, {
      y: -0.3,
      rotation: 0.4,
      duration: 0.9,
      ease: 'power2.out',
    })

    // 🧲 Settle
    tl.to(state.current, {
      y: 0,
      rotation: 0,
      duration: 0.4,
      ease: 'elastic.out(1, 0.5)',
    })

    // 🔄 Rotate forever
    tl.to(state.current, {
      rotation: `+=${Math.PI * 2}`,
      duration: 2.2,
      ease: 'none',
      repeat: -1,
      onRepeat: () => {
        swappedThisTurn.current = false
        // Call the ref to change state without restarting this timeline
        onNextFlavourRef.current()
      },
    })

    return () => {
      tl.kill()
    }
    // ⚠️ CRITICAL FIX: Only run this effect when 'start' changes. 
    // Do not include onNextFlavour or label here.
  }, [start])

  useFrame(({ clock }) => {
    if (!groupRef.current || !sideMaterial.current) return

    const raw = state.current.rotation
    const rot = ((raw % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
    const time = clock.getElapsedTime()

    // Apply transforms to the GROUP
    groupRef.current.position.y = state.current.y
    groupRef.current.rotation.y = raw

    // Slanted axis
    groupRef.current.rotation.x = 0.15
    groupRef.current.rotation.z = 0.08

    // Subtle shake
    groupRef.current.rotation.x += Math.sin(time * 6) * 0.015
    groupRef.current.rotation.z += Math.cos(time * 5) * 0.015

    // Backside-only label swap
    const isBackside = rot > BACK_START && rot < BACK_END

    if (isBackside && !swappedThisTurn.current) {
      sideMaterial.current.map = textures[label]
      sideMaterial.current.needsUpdate = true
      swappedThisTurn.current = true
    }
  })

  // Realistic Aluminum Material
  const metalMaterialProps = {
    color: '#dadada',
    metalness: 1,
    roughness: 0.3,
  }

  return (
    <group ref={groupRef}>
      {/* 1. Main Body (Label) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 1.6, 64]} />
        <meshStandardMaterial
          ref={sideMaterial}
          map={textures[label]}
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>

      {/* 2. The Neck (Tapered Top) */}
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.52, 0.6, 0.3, 64]} />
        <meshStandardMaterial {...metalMaterialProps} />
      </mesh>

      {/* 3. The Top Rim */}
      <mesh position={[0, 1.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.52, 0.02, 16, 64]} />
        <meshStandardMaterial {...metalMaterialProps} />
      </mesh>

      {/* 4. The Top Lid */}
      <mesh position={[0, 1.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.52, 64]} />
        <meshStandardMaterial {...metalMaterialProps} />
      </mesh>

      {/* 5. The Bottom Curve */}
      <mesh position={[0, -0.9, 0]}>
        <cylinderGeometry args={[0.6, 0.45, 0.2, 64]} />
        <meshStandardMaterial {...metalMaterialProps} />
      </mesh>

      {/* 6. Bottom Rim */}
      <mesh position={[0, -1.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.45, 0.02, 16, 64]} />
        <meshStandardMaterial {...metalMaterialProps} />
      </mesh>
    </group>
  )
}

export default function BeerScene({
  flavour,
  start,
  onNextFlavour,
}: {
  flavour: { can: string; label: 'neipa' | 'ipa' | 'stout' }
  start: boolean
  onNextFlavour: () => void
}) {
  return (
    <Canvas
      className="absolute inset-0 z-20 pointer-events-none"
      camera={{ position: [0, 0, 4], fov: 45 }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <Can
        colour={flavour.can}
        label={flavour.label}
        start={start}
        onNextFlavour={onNextFlavour}
      />
    </Canvas>
  )
}