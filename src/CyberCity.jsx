import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import { EffectComposer, Bloom, Scanline, Vignette } from '@react-three/postprocessing'
import { Link } from 'react-router-dom'
import { ArrowLeft, Building2 } from 'lucide-react'
import * as THREE from 'three'

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
      const check = () => setIsMobile(window.innerWidth < 768)
      check()
      window.addEventListener('resize', check)
      return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

// Procedural City Blocks
const City = ({ isMobile }) => {
    const buildings = useMemo(() => {
        const temp = []
        // Generate a grid of buildings
        const range = isMobile ? 10 : 20
        const spacing = 4
        
        for(let x = -range; x <= range; x++) {
            // Leave a "road" in the middle
            if (Math.abs(x) < 2) continue 

            for(let z = -range; z <= range; z++) {
                const height = Math.random() * Math.random() * 10 + 2
                temp.push({
                    position: [x * spacing, height / 2, -z * spacing],
                    args: [spacing * 0.8, height, spacing * 0.8],
                    color: Math.random() > 0.9 ? '#ff00ff' : '#220033' // Occasional neon building
                })
            }
        }
        return temp
    }, [isMobile])

    const ref = useRef()
    
    useFrame((state) => {
        if (!ref.current) return
        // Infinite scroll effect
        ref.current.position.z = (state.clock.getElapsedTime() * 5) % 4
    })

    return (
        <group ref={ref}>
            {buildings.map((b, i) => (
                <mesh key={i} position={b.position}>
                    <boxGeometry args={b.args} />
                    <meshStandardMaterial 
                        color={b.color} 
                        roughness={0.2}
                        metalness={0.8}
                        emissive={b.color === '#ff00ff' ? '#ff00ff' : '#000'}
                        emissiveIntensity={2}
                    />
                    {/* Windows / Grid lines */}
                    <lineSegments>
                        <edgesGeometry args={[new THREE.BoxGeometry(...b.args)]} />
                        <lineBasicMaterial color="#ff00ff" opacity={0.3} transparent />
                    </lineSegments>
                </mesh>
            ))}
        </group>
    )
}

const RetroGrid = () => {
    return (
        <gridHelper args={[200, 100, '#ff00ff', '#220033']} position={[0, 0, 0]} />
    )
}

export default function CyberCity() {
  const isMobile = useIsMobile()
  
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0010' }}>
      <Canvas camera={{ position: [0, 5, 20], fov: 60 }}>
        <color attach="background" args={['#0a0010']} />
        <fog attach="fog" args={['#0a0010', 10, 50]} />

        <ambientLight intensity={0.2} />
        <pointLight position={[0, 10, 0]} intensity={1} color="#ff00ff" />
        
        <City isMobile={isMobile} />
        <RetroGrid />
        
        {/* Sun on the horizon */}
        <mesh position={[0, 5, -40]}>
            <circleGeometry args={[10, 32]} />
            <meshBasicMaterial color="#ffaa00" />
        </mesh>

        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3} />
        
        <EffectComposer>
          <Bloom luminanceThreshold={0.5} mipmapBlur intensity={2.0} radius={0.5} />
          <Scanline density={1.5} opacity={0.2} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>

      {/* UI Overlay */}
      <div style={{
        position: 'absolute',
        top: isMobile ? '20px' : '30px',
        left: isMobile ? '20px' : '30px',
        fontFamily: "'Inter', sans-serif",
        pointerEvents: 'none',
        maxWidth: isMobile ? '80%' : 'auto'
      }}>
        <Link to="/" style={{ color: '#c084fc', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', pointerEvents: 'auto', marginBottom: isMobile ? '10px' : '16px', fontSize: '0.9rem', fontWeight: '500' }}>
            <ArrowLeft size={16} /> {isMobile ? 'Back' : 'Back to Lab'}
        </Link>
        <h1 style={{ 
            margin: 0, 
            fontSize: isMobile ? '2rem' : '3rem', 
            fontWeight: '900', 
            letterSpacing: '-0.02em', 
            color: '#fff', 
            lineHeight: 1,
            textShadow: '0 0 20px rgba(255, 0, 255, 0.8)',
            fontFamily: 'monospace'
        }}>
          CYBER CITY
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#ff00ff', marginTop: '10px', fontFamily: 'monospace' }}>
            <Building2 size={16} />
            <span>INFINITE PROCEDURAL METROPOLIS</span>
        </div>
      </div>
    </div>
  )
}
