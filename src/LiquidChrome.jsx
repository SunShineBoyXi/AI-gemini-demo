import React, { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, MeshDistortMaterial, Float, Lightformer } from '@react-three/drei'
import { Link } from 'react-router-dom'
import { ArrowLeft, Droplets } from 'lucide-react'

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

const LiquidSphere = () => {
    const materialRef = useRef()
    
    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh>
                {/* Reduced geometry resolution for performance */}
                <sphereGeometry args={[2.5, 32, 32]} />
                <MeshDistortMaterial 
                    ref={materialRef}
                    color="#ffffff" 
                    envMapIntensity={1} 
                    clearcoat={1} 
                    clearcoatRoughness={0} 
                    metalness={1} 
                    roughness={0}
                    distort={0.4} // Slightly reduced distortion strength
                    speed={2} // Slightly reduced speed
                />
            </mesh>
        </Float>
    )
}

// Simple fake shadow to replace expensive ContactShadows
const SimpleShadow = () => (
    <mesh position={[0, -3.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial color="#000" transparent opacity={0.2} />
    </mesh>
)

export default function LiquidChrome() {
  const isMobile = useIsMobile()
  
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#e2e8f0' }}>
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ powerPreference: "high-performance", antialias: true }}
        dpr={[1, 1.5]} // Limit pixel ratio for performance
      >
        {/* Custom Lighting Environment (No network request required) */}
        <Environment resolution={512}>
            {/* Ceiling lights */}
            <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
            <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
            <group rotation={[Math.PI / 2, 1, 0]}>
              {/* Side lights for nice reflections */}
              <Lightformer intensity={5} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[20, 0.1, 1]} />
              <Lightformer rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[20, 0.5, 1]} />
              <Lightformer rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 1, 1]} />
            </group>
        </Environment>
        
        <LiquidSphere />

        {/* Replaced ContactShadows with a cheap alternative */}
        <SimpleShadow />

        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
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
        <Link to="/" style={{ color: '#64748b', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', pointerEvents: 'auto', marginBottom: isMobile ? '10px' : '16px', fontSize: '0.9rem', fontWeight: '500' }}>
            <ArrowLeft size={16} /> {isMobile ? 'Back' : 'Back to Lab'}
        </Link>
        <h1 style={{ 
            margin: 0, 
            fontSize: isMobile ? '2rem' : '3.5rem', 
            fontWeight: '900', 
            letterSpacing: '-0.04em', 
            color: '#0f172a', 
            lineHeight: 1
        }}>
          LIQUID CHROME
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#475569', marginTop: '10px' }}>
            <Droplets size={16} />
            <span>REAL-TIME REFLECTION SHADER</span>
        </div>
      </div>
    </div>
  )
}
