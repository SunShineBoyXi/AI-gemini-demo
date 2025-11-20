import React, { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

// Helper to generate random points on a sphere
const generateSpherePoints = (count, radius) => {
  const points = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(-1 + (2 * i) / count)
    const theta = Math.sqrt(count * Math.PI) * phi
    points[i * 3] = radius * Math.cos(theta) * Math.sin(phi)
    points[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi)
    points[i * 3 + 2] = radius * Math.cos(phi)
  }
  return points
}

const Marker = ({ position, label, value, color = "#3b82f6" }) => {
    const [hovered, setHover] = useState(false)
    const ref = useRef()

    useFrame((state) => {
        if (ref.current) {
            // Pulse effect
            const t = state.clock.getElapsedTime()
            const scale = 1 + Math.sin(t * 3) * 0.2
            ref.current.scale.set(scale, scale, scale)
        }
    })

    return (
        <group position={position}>
            {/* Marker Rod */}
            <mesh position={[0, 0.5, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
                <meshBasicMaterial color={color} transparent opacity={0.6} />
            </mesh>
            
            {/* Pulsing Top */}
            <mesh ref={ref} position={[0, 1.0, 0]} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshBasicMaterial color={hovered ? "white" : color} toneMapped={false} />
            </mesh>

            {/* Hover Label */}
            {hovered && (
                <Html distanceFactor={15}>
                    <div style={{
                        background: 'rgba(0,0,0,0.8)',
                        border: `1px solid ${color}`,
                        padding: '8px 12px',
                        borderRadius: '4px',
                        color: 'white',
                        whiteSpace: 'nowrap',
                        fontFamily: 'monospace',
                        pointerEvents: 'none',
                        transform: 'translate3d(-50%, -150%, 0)'
                    }}>
                        <div style={{ fontWeight: 'bold', color }}>{label}</div>
                        <div style={{ fontSize: '0.8em' }}>TRAFFIC: {value} TB/s</div>
                    </div>
                </Html>
            )}
        </group>
    )
}

export default function HoloGlobe({ radius = 4, onMarkerClick }) {
  const pointsRef = useRef()
  const groupRef = useRef()
  const ring1Ref = useRef()
  const ring2Ref = useRef()

  // Generate persistent points
  const particleCount = 4000
  const particles = useMemo(() => generateSpherePoints(particleCount, radius), [radius])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    
    if (groupRef.current) {
        groupRef.current.rotation.y += 0.001 // Auto rotate
    }

    // Animate Scanning Rings
    if (ring1Ref.current) {
        ring1Ref.current.position.y = Math.sin(t * 0.5) * (radius * 0.8)
        ring1Ref.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.2) * 0.1
    }
    if (ring2Ref.current) {
        ring2Ref.current.position.y = Math.cos(t * 0.3) * (radius * 0.8)
        ring2Ref.current.rotation.x = Math.PI / 2.2 + Math.cos(t * 0.2) * 0.1
    }
  })

  // Mock Markers
  const markers = [
      { pos: [1.5, 2.5, 2.5], label: "N. AMERICA", color: "#ef4444", value: "84.2" },
      { pos: [-2.5, 1.5, 2.0], label: "EUROPE", color: "#3b82f6", value: "62.1" },
      { pos: [3.5, 0.5, -1.0], label: "ASIA PACIFIC", color: "#10b981", value: "95.4" },
      { pos: [0.5, -2.5, 2.8], label: "S. AMERICA", color: "#f59e0b", value: "31.8" },
  ]

  return (
    <group ref={groupRef}>
      {/* 1. Particle Shell */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color="#60a5fa"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>

      {/* 2. Inner Core Glow */}
      <mesh>
          <sphereGeometry args={[radius * 0.95, 32, 32]} />
          <meshBasicMaterial color="#1e3a8a" transparent opacity={0.1} side={THREE.BackSide} />
      </mesh>

      {/* 3. Animated Scanning Rings */}
      <group ref={ring1Ref}>
         <mesh>
             <torusGeometry args={[radius * 1.1, 0.02, 16, 100]} />
             <meshBasicMaterial color="#3b82f6" transparent opacity={0.4} />
         </mesh>
      </group>
      <group ref={ring2Ref}>
         <mesh>
             <torusGeometry args={[radius * 1.2, 0.02, 16, 100]} />
             <meshBasicMaterial color="#60a5fa" transparent opacity={0.3} />
         </mesh>
      </group>

      {/* 4. Interactive Markers */}
      {markers.map((m, i) => {
          const v = new THREE.Vector3(...m.pos).normalize().multiplyScalar(radius)
          return (
            <Marker 
                key={i} 
                position={v} 
                label={m.label} 
                color={m.color} 
                value={m.value} 
                onClick={(e) => {
                    e.stopPropagation()
                    onMarkerClick && onMarkerClick(v)
                }}
            />
          )
      })}
    </group>
  )
}
