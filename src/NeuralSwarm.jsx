import React, { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Link } from 'react-router-dom'
import { ArrowLeft, Brain } from 'lucide-react'
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

const Particles = ({ count = 3000, isMobile }) => {
  const mesh = useRef()
  const lightRef = useRef()
  
  // Generate random initial positions and velocities
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100
      const factor = 20 + Math.random() * 100
      const speed = 0.01 + Math.random() / 200
      const xFactor = -50 + Math.random() * 100
      const yFactor = -50 + Math.random() * 100
      const zFactor = -50 + Math.random() * 100
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 })
    }
    return temp
  }, [count])

  // Re-use geometry and material for performance
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state) => {
    if (!mesh.current) return

    const time = state.clock.getElapsedTime()
    
    // Interactive cursor influence
    const { pointer } = state
    const mx = (pointer.x * state.viewport.width) / 2
    const my = (pointer.y * state.viewport.height) / 2

    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle
      
      // Update time variable
      t = particle.t += speed / 2
      
      // Lissajous curve motion + Noise simulation
      const a = Math.cos(t) + Math.sin(t * 1) / 10
      const b = Math.sin(t) + Math.cos(t * 2) / 10
      const s = Math.cos(t)
      
      // Base position
      let x = (particle.mx += (mx - particle.mx) * 0.02) + Math.cos(t / 10) * xFactor + Math.sin(t * 1) * factor + Math.cos(t * 2) * factor
      let y = (particle.my += (my - particle.my) * 0.02) + Math.sin(t / 10) * yFactor + Math.cos(t * 2) * factor + Math.sin(t * 3) * factor
      let z = Math.cos(t / 10) * zFactor + Math.cos(t * 3) * factor + Math.sin(t * 2) * factor

      // Apply position to dummy object
      dummy.position.set(x / 10, y / 10, z / 10)
      dummy.scale.setScalar(s > 0 ? s * s * s : 0.001) // Pulse scale
      dummy.rotation.set(s * 5, s * 5, s * 5)
      dummy.updateMatrix()
      
      // Update the instance matrix
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial 
        color="#00ffaa" 
        roughness={0.1} 
        metalness={0.8} 
        emissive="#00ffaa" 
        emissiveIntensity={0.5}
      />
    </instancedMesh>
  )
}

export default function NeuralSwarm() {
  const isMobile = useIsMobile()
  
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050505' }}>
      <Canvas camera={{ position: [0, 0, 20], fov: 50 }} gl={{ antialias: false }}>
        <color attach="background" args={['#050505']} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00ffaa" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#00aaff" />
        
        <Particles count={isMobile ? 1000 : 3000} isMobile={isMobile} />
        
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0} mipmapBlur intensity={1.5} radius={0.6} />
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
        <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', pointerEvents: 'auto', marginBottom: isMobile ? '10px' : '16px', fontSize: '0.9rem', fontWeight: '500' }}>
            <ArrowLeft size={16} /> {isMobile ? 'Back' : 'Back to Lab'}
        </Link>
        <h1 style={{ 
            margin: 0, 
            fontSize: isMobile ? '2rem' : '3rem', 
            fontWeight: '900', 
            letterSpacing: '-0.02em', 
            color: '#fff', 
            lineHeight: 1,
            textShadow: '0 0 20px rgba(0, 255, 170, 0.5)'
        }}>
          NEURAL SWARM
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#00ffaa', marginTop: '10px' }}>
          <Brain size={16} />
          <span>ARTIFICIAL INTELLIGENCE VISUALIZER</span>
        </div>
      </div>
    </div>
  )
}
