import React, { useState, useEffect } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Physics, useBox, usePlane, useSphere } from '@react-three/cannon'
import { Link } from 'react-router-dom'
import { ArrowLeft, MousePointer2 } from 'lucide-react'
import { EffectComposer, Bloom, SSAO } from '@react-three/postprocessing'
import * as THREE from 'three'

// --- Physics Components ---

// 1. The Floor
const Floor = () => {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], position: [0, -5, 0] }))
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <shadowMaterial color="#171717" transparent opacity={0.4} />
    </mesh>
  )
}

// 2. Breakable Box
const Box = ({ position, color }) => {
  const [ref] = useBox(() => ({ mass: 1, position, args: [1, 1, 1] }))
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={color} 
        roughness={0.2} 
        metalness={0.8} 
        emissive={color} 
        emissiveIntensity={0.5} 
      />
    </mesh>
  )
}

// 3. The "Bullet" - Invisible force that hits things
const Bullet = ({ position, velocity }) => {
  const [ref] = useSphere(() => ({ 
      mass: 20, // Heavy!
      position, 
      velocity, 
      args: [0.5] 
  }))
  // Invisible, we just want the impact
  return null
}

// --- Scene Logic ---

const Shooter = () => {
  const { camera, pointer } = useThree()
  const [bullets, setBullets] = useState([])

  // Click handler to shoot
  useEffect(() => {
      const handlePointerDown = () => {
        // Calculate direction from camera to mouse pointer
        const vector = new THREE.Vector3(pointer.x, pointer.y, 0.5)
        vector.unproject(camera)
        const dir = vector.sub(camera.position).normalize()
        const velocity = dir.multiplyScalar(40).toArray() // Fast speed!
        
        // Add bullet
        const id = Date.now()
        setBullets(prev => [...prev, { id, position: camera.position.toArray(), velocity }])
        
        // Cleanup bullet after 2s
        setTimeout(() => {
            setBullets(prev => prev.filter(b => b.id !== id))
        }, 2000)
      }

      window.addEventListener('pointerdown', handlePointerDown)
      return () => window.removeEventListener('pointerdown', handlePointerDown)
  }, [camera, pointer])

  return (
      <>
        {bullets.map(b => <Bullet key={b.id} position={b.position} velocity={b.velocity} />)}
      </>
  )
}

export default function PhysicsDemo() {
  // Generate a wall of boxes
  const boxes = []
  for(let x = -4; x <= 4; x++) {
      for(let y = 0; y < 8; y++) {
          // Random neon colors
          const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"]
          const color = colors[Math.floor(Math.random() * colors.length)]
          boxes.push({ position: [x * 1.1, y * 1.1 - 4, 0], color })
      }
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#111', cursor: 'crosshair' }}>
      <Canvas shadows camera={{ position: [0, 0, 12], fov: 50 }}>
        <color attach="background" args={['#111']} />
        
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={2} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={1} color="blue" />

        <Physics gravity={[0, -9.8, 0]}>
            <Floor />
            {boxes.map((box, i) => (
                <Box key={i} position={box.position} color={box.color} />
            ))}
            <Shooter />
        </Physics>

        <EffectComposer>
            <Bloom luminanceThreshold={0.4} intensity={1.5} radius={0.5} />
            <SSAO radius={0.4} intensity={50} luminanceInfluence={0.4} color="black" />
        </EffectComposer>
      </Canvas>

      {/* UI Overlay */}
      <div style={{
        position: 'absolute',
        top: '30px',
        left: '30px',
        color: 'white',
        fontFamily: "'Inter', sans-serif",
        pointerEvents: 'none'
      }}>
        <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', pointerEvents: 'auto', marginBottom: '16px', fontSize: '0.9rem', fontWeight: '500' }}>
            <ArrowLeft size={16} /> Back to Lab
        </Link>
        <h1 style={{ margin: 0, fontSize: '3rem', fontWeight: '900', letterSpacing: '-0.02em', color: '#fff' }}>
          CHAOS PHYSICS
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#f59e0b', marginTop: '10px' }}>
          <MousePointer2 size={16} />
          <span>CLICK ANYWHERE TO SHOOT</span>
        </div>
      </div>
    </div>
  )
}
