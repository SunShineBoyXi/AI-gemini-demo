import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Outlines, RoundedBox, useTexture } from '@react-three/drei'
import * as THREE from 'three'

const VECTOR_THICKNESS = 0.06
const OUTLINE_COLOR = "#1a1a1a"

// Generate a dynamic gradient texture for sharp 3-tone shading
const useGradientTexture = () => {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 4
    canvas.height = 1
    const context = canvas.getContext('2d')
    const gradient = context.createLinearGradient(0, 0, 4, 0)
    // 3 hard steps: Shadow, Midtone, Highlight
    gradient.addColorStop(0, '#666')
    gradient.addColorStop(0.5, '#666')
    gradient.addColorStop(0.5, '#ccc')
    gradient.addColorStop(1, '#fff')
    context.fillStyle = gradient
    context.fillRect(0, 0, 4, 1)
    const tex = new THREE.CanvasTexture(canvas)
    tex.minFilter = THREE.NearestFilter
    tex.magFilter = THREE.NearestFilter
    tex.generateMipmaps = false
    return tex
  }, [])
  return texture
}

// Reusable material with custom gradient for "Hard" vector look
const VectorMaterial = ({ color, gradientTexture }) => (
  <meshToonMaterial 
    color={color} 
    gradientMap={gradientTexture} 
    toneMapped={false} // Keep colors vibrant
  />
)

const Arm = ({ side = "right", isAnimated = false, gradientTexture, speed = 2.5, paused = false }) => {
  const forearmRef = useRef()
  const upperArmRef = useRef() // For muscle expansion
  const sign = side === "right" ? 1 : -1
  
  // Colors
  const skinColor = "#FFDCB1"
  const shirtColor = "#3B82F6"
  const dumbbellColor = "#EF4444"
  const dumbbellBarColor = "#374151"

  // Keep track of time manually to support pausing
  const timeRef = useRef(0)

  useFrame((state, delta) => {
    if (!isAnimated || !forearmRef.current) return
    
    // Only advance time if not paused
    if (!paused) {
        timeRef.current += delta * speed
    }

    const time = timeRef.current
    
    // Curl movement: 0 (down) to 1 (up)
    const rawSin = Math.sin(time)
    const curlFactor = (rawSin + 1) * 0.5 
    
    // Rotate forearm
    const curlAngle = curlFactor * 1.8 // Max angle
    forearmRef.current.rotation.x = -curlAngle + 0.1

    // Muscle Bulge: Scale upper arm slightly when curled
    if (upperArmRef.current) {
        // Base thickness 0.3, bulge to 0.35
        const bulge = 1 + (curlFactor * 0.15)
        upperArmRef.current.scale.set(bulge, 1, bulge)
    }
  })

  return (
    <group position={[sign * 0.95, 2.1, 0]}> 
      {/* Shoulder Joint */}
      <mesh>
         <sphereGeometry args={[0.38, 32, 32]} />
         <VectorMaterial color={shirtColor} gradientTexture={gradientTexture} />
         <Outlines thickness={VECTOR_THICKNESS} color={OUTLINE_COLOR} />
      </mesh>

      {/* Upper Arm Group */}
      <group rotation={[0, 0, -sign * 0.15]}>
          {/* Bicep/Upper Arm - animated scale for muscle */}
          <group ref={upperArmRef} position={[0, -0.6, 0]}>
            <mesh>
                <capsuleGeometry args={[0.3, 1.2, 4, 8]} />
                <VectorMaterial color={skinColor} gradientTexture={gradientTexture} />
                <Outlines thickness={VECTOR_THICKNESS} color={OUTLINE_COLOR} />
            </mesh>
          </group>

          {/* Forearm Group (Pivot at elbow) */}
          <group position={[0, -1.3, 0]} ref={forearmRef} rotation={!isAnimated ? [0.2, 0, 0] : [0,0,0]}>
               {/* Elbow joint visual */}
               <mesh>
                  <sphereGeometry args={[0.28, 32, 32]} />
                  <VectorMaterial color={skinColor} gradientTexture={gradientTexture} />
                  <Outlines thickness={VECTOR_THICKNESS} color={OUTLINE_COLOR} />
               </mesh>

               {/* Forearm mesh */}
               <mesh position={[0, -0.6, 0]}>
                  <capsuleGeometry args={[0.27, 1.2, 4, 8]} />
                  <VectorMaterial color={skinColor} gradientTexture={gradientTexture} />
                  <Outlines thickness={VECTOR_THICKNESS} color={OUTLINE_COLOR} />
               </mesh>

               {/* Hand */}
               <group position={[0, -1.35, 0]}>
                  <mesh>
                      <sphereGeometry args={[0.32, 32, 32]} />
                      <VectorMaterial color={skinColor} gradientTexture={gradientTexture} />
                      <Outlines thickness={VECTOR_THICKNESS} color={OUTLINE_COLOR} />
                  </mesh>

                  {/* Dumbbell */}
                  {isAnimated && (
                    <group rotation={[0, 0, Math.PI / 2]}>
                        {/* Bar */}
                        <mesh>
                            <cylinderGeometry args={[0.06, 0.06, 1.4, 12]} />
                            <VectorMaterial color={dumbbellBarColor} gradientTexture={gradientTexture} />
                            <Outlines thickness={VECTOR_THICKNESS} color={OUTLINE_COLOR} />
                        </mesh>
                        {/* Weights */}
                        <mesh position={[0.5, 0, 0]}>
                             <cylinderGeometry args={[0.35, 0.35, 0.25, 32]} />
                             <VectorMaterial color={dumbbellColor} gradientTexture={gradientTexture} />
                             <Outlines thickness={VECTOR_THICKNESS} color={OUTLINE_COLOR} />
                        </mesh>
                         <mesh position={[-0.5, 0, 0]}>
                             <cylinderGeometry args={[0.35, 0.35, 0.25, 32]} />
                             <VectorMaterial color={dumbbellColor} gradientTexture={gradientTexture} />
                             <Outlines thickness={VECTOR_THICKNESS} color={OUTLINE_COLOR} />
                        </mesh>
                    </group>
                  )}
               </group>
          </group>
      </group>
    </group>
  )
}

export default function DumbbellCurl({ speed = 2.5, paused = false }) {
  const gradientTexture = useGradientTexture()
  const torsoRef = useRef()
  const headRef = useRef()

  // Colors
  const skinColor = "#FFDCB1"
  const shirtColor = "#3B82F6" 
  const pantsColor = "#111827"
  const shoesColor = "#ffffff"

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    // Breathing Animation: Scale torso slightly
    if (torsoRef.current) {
        const breath = Math.sin(time * 1.5) * 0.02 + 1
        torsoRef.current.scale.set(1, breath, 1) // Breathe up/down mostly
    }

    // Subtle Head bob
    if (headRef.current) {
        headRef.current.rotation.z = Math.sin(time * 2.5) * 0.02
        headRef.current.position.y = 2.95 + Math.sin(time * 1.5) * 0.01
    }
  })

  return (
    <group position={[0, -2, 0]} scale={1.1}>
      {/* Torso Group for Breathing */}
      <group ref={torsoRef} position={[0, 1.4, 0]}>
          <RoundedBox args={[1.5, 1.9, 0.85]} radius={0.15} smoothness={4}>
             <VectorMaterial color={shirtColor} gradientTexture={gradientTexture} />
             <Outlines thickness={VECTOR_THICKNESS} color={OUTLINE_COLOR} />
          </RoundedBox>
          
          {/* Neck */}
          <mesh position={[0, 1.0, 0]}>
             <cylinderGeometry args={[0.25, 0.25, 0.5, 16]} />
             <VectorMaterial color={skinColor} gradientTexture={gradientTexture} />
             <Outlines thickness={VECTOR_THICKNESS} color={OUTLINE_COLOR} />
          </mesh>
      </group>

      {/* Head Group */}
      <group ref={headRef} position={[0, 2.95, 0.1]}>
        <mesh>
          <sphereGeometry args={[0.65, 32, 32]} />
          <VectorMaterial color={skinColor} gradientTexture={gradientTexture} />
          <Outlines thickness={VECTOR_THICKNESS} color={OUTLINE_COLOR} />
        </mesh>
        
        {/* Eyes */}
        <group position={[0, 0.1, 0.55]}>
            <mesh position={[-0.2, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
                <cylinderGeometry args={[0.08, 0.08, 0.1, 16]} />
                <meshBasicMaterial color="#1a1a1a" />
            </mesh>
            <mesh position={[0.2, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
                <cylinderGeometry args={[0.08, 0.08, 0.1, 16]} />
                <meshBasicMaterial color="#1a1a1a" />
            </mesh>
        </group>
      </group>

      {/* Hips */}
      <mesh position={[0, 0.4, 0]}>
         <cylinderGeometry args={[0.73, 0.7, 0.6, 32]} />
         <VectorMaterial color={pantsColor} gradientTexture={gradientTexture} />
         <Outlines thickness={VECTOR_THICKNESS} color={OUTLINE_COLOR} />
      </mesh>

      {/* Legs */}
      <group>
        <group position={[-0.45, -0.8, 0]}>
             <mesh>
                 <capsuleGeometry args={[0.28, 1.8, 4, 8]} />
                 <VectorMaterial color={pantsColor} gradientTexture={gradientTexture} />
                 <Outlines thickness={VECTOR_THICKNESS} color={OUTLINE_COLOR} />
             </mesh>
             <mesh position={[0, -1.0, 0.2]}>
                 <boxGeometry args={[0.35, 0.25, 0.7]} />
                 <VectorMaterial color={shoesColor} gradientTexture={gradientTexture} />
                 <Outlines thickness={VECTOR_THICKNESS} color={OUTLINE_COLOR} />
             </mesh>
        </group>

        <group position={[0.45, -0.8, 0]}>
             <mesh>
                 <capsuleGeometry args={[0.28, 1.8, 4, 8]} />
                 <VectorMaterial color={pantsColor} gradientTexture={gradientTexture} />
                 <Outlines thickness={VECTOR_THICKNESS} color={OUTLINE_COLOR} />
             </mesh>
              <mesh position={[0, -1.0, 0.2]}>
                 <boxGeometry args={[0.35, 0.25, 0.7]} />
                 <VectorMaterial color={shoesColor} gradientTexture={gradientTexture} />
                 <Outlines thickness={VECTOR_THICKNESS} color={OUTLINE_COLOR} />
             </mesh>
        </group>
      </group>

      <Arm side="right" isAnimated={true} gradientTexture={gradientTexture} />
      <Arm side="left" isAnimated={false} gradientTexture={gradientTexture} />
    </group>
  )
}
