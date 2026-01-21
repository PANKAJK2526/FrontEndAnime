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

  // Single authoritative state
  const state = useRef({
    y: 3,
    rotation: 0,
  })

  // Texture preload
  const textures = useTexture({
    neipa: '/labels/neipa.png',
    ipa: '/labels/ipa.png',
    stout: '/labels/stout.png',
  })

  Object.values(textures).forEach((t) => {
    t.wrapS = THREE.RepeatWrapping
    t.wrapT = THREE.ClampToEdgeWrapping
  })

  const currentLabel = useRef(label)
  const swappedThisTurn = useRef(false)

  // 🔒 LOCK WHERE "FRONT" IS
  const FRONT_ANGLE = 0                // label faces camera here
  const BACK_START = Math.PI * 0.55
  const BACK_END   = Math.PI * 1.45

  useEffect(() => {
    // Drop
    gsap.to(state.current, {
      y: 0,
      duration: 1.4,
      ease: 'power3.out',
      onComplete: () => {
        // Rotate forever — single clock
        gsap.to(state.current, {
          rotation: `+=${Math.PI * 2}`,
          duration: 2.2,
          ease: 'none',
          repeat: -1,
          onRepeat: () => {
            swappedThisTurn.current = false
            onNextFlavour() // 🔥 flavour increments ONLY here
          },
        })
      },
    })
  }, [])

  useFrame(() => {
    if (!mesh.current || !sideMaterial.current) return

    const raw = state.current.rotation
    const rot = ((raw % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)

    mesh.current.position.y = state.current.y
    mesh.current.rotation.y = raw

    const isBackside = rot > BACK_START && rot < BACK_END

    if (isBackside && !swappedThisTurn.current) {
      sideMaterial.current.map = textures[label]
      sideMaterial.current.needsUpdate = true
      currentLabel.current = label
      swappedThisTurn.current = true
    }
  })

  return (
    <mesh ref={mesh}>
      <cylinderGeometry args={[0.6, 0.6, 2.2, 64]} />

      <meshStandardMaterial
        ref={sideMaterial}
        attach="material-0"
        map={textures[label]}
        metalness={0.4}
        roughness={0.6}
        depthTest={false}
      />

      <meshStandardMaterial attach="material-1" color={colour} metalness={0.9} />
      <meshStandardMaterial attach="material-2" color={colour} metalness={0.9} />
    </mesh>
  )
}

export default function BeerScene({ flavour, onNextFlavour }) {
  return (
    <Canvas className="absolute inset-0 z-20 pointer-events-none">
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

