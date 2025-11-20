import React, { useState, useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html, Stats, Edges, useCursor } from '@react-three/drei'
import { Link } from 'react-router-dom'
import { ArrowLeft, Box, Activity, Truck, Server } from 'lucide-react'
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

// --- Components ---

const AGV = ({ path, offset = 0, color = '#3b82f6' }) => {
    const ref = useRef()
    const [hovered, setHovered] = useState(false)
    useCursor(hovered)

    useFrame((state) => {
        const t = (state.clock.getElapsedTime() * 0.5 + offset) % path.length
        const currentPointIndex = Math.floor(t)
        const nextPointIndex = (currentPointIndex + 1) % path.length
        const progress = t % 1

        const p1 = path[currentPointIndex]
        const p2 = path[nextPointIndex]

        if (ref.current) {
            ref.current.position.x = THREE.MathUtils.lerp(p1[0], p2[0], progress)
            ref.current.position.z = THREE.MathUtils.lerp(p1[1], p2[1], progress)
            ref.current.lookAt(p2[0], 0, p2[1])
        }
    })

    return (
        <group ref={ref} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
            <mesh position={[0, 0.25, 0]}>
                <boxGeometry args={[0.8, 0.5, 1.2]} />
                <meshStandardMaterial color={hovered ? '#60a5fa' : color} />
                <Edges />
            </mesh>
            {/* Status Light */}
            <mesh position={[0, 0.6, -0.5]}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshBasicMaterial color="#22c55e" />
            </mesh>
            
            {hovered && (
                <Html position={[0, 1.5, 0]} center distanceFactor={10}>
                    <div style={{ 
                        background: 'rgba(15, 23, 42, 0.9)', 
                        color: 'white', 
                        padding: '8px 12px', 
                        borderRadius: '4px',
                        border: '1px solid #3b82f6',
                        fontSize: '0.8rem',
                        whiteSpace: 'nowrap',
                        fontFamily: 'monospace'
                    }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>AGV-0{Math.floor(offset + 1)}</div>
                        <div style={{ color: '#22c55e' }}>STATUS: ACTIVE</div>
                        <div>BATTERY: {Math.floor(80 + Math.random() * 20)}%</div>
                    </div>
                </Html>
            )}
        </group>
    )
}

const Shelf = ({ position, rotation = [0, 0, 0] }) => {
    const [hovered, setHovered] = useState(false)
    useCursor(hovered)

    return (
        <group position={position} rotation={rotation} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
            {/* Rack Structure */}
            <mesh position={[0, 1.5, 0]}>
                <boxGeometry args={[1, 3, 4]} />
                <meshStandardMaterial color="#334155" transparent opacity={0.9} />
                <Edges color="#475569" />
            </mesh>
            
            {/* Cargo Boxes */}
            {[...Array(6)].map((_, i) => (
                <mesh key={i} position={[0, 0.5 + Math.floor(i/2) * 1, (i%2 ? 1 : -1) * 1]}>
                    <boxGeometry args={[0.8, 0.8, 0.8]} />
                    <meshStandardMaterial color={hovered ? '#f59e0b' : '#d97706'} />
                </mesh>
            ))}

            {hovered && (
                <Html position={[0, 3.5, 0]} center distanceFactor={10}>
                    <div style={{ 
                        background: 'rgba(15, 23, 42, 0.9)', 
                        color: 'white', 
                        padding: '8px 12px', 
                        borderRadius: '4px',
                        border: '1px solid #f59e0b',
                        fontSize: '0.8rem',
                        whiteSpace: 'nowrap',
                        fontFamily: 'monospace'
                    }}>
                        <div style={{ fontWeight: 'bold', color: '#f59e0b' }}>SECTION A-{Math.abs(position[0])}</div>
                        <div>UTILIZATION: 85%</div>
                        <div>TEMP: 22°C</div>
                    </div>
                </Html>
            )}
        </group>
    )
}

const Floor = () => (
    <group rotation={[-Math.PI / 2, 0, 0]}>
        <gridHelper args={[40, 40, '#334155', '#1e293b']} />
        <mesh position={[0, 0, -0.1]}>
            <planeGeometry args={[40, 40]} />
            <meshBasicMaterial color="#0f172a" />
        </mesh>
    </group>
)

export default function SmartLogistics() {
  const isMobile = useIsMobile()
  
  // Simple rectangular paths for AGVs
  const path1 = [[-5, -5], [5, -5], [5, 5], [-5, 5]]
  const path2 = [[-8, 8], [8, 8], [8, -8], [-8, -8]]

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0f172a' }}>
      <Canvas camera={{ position: [10, 10, 10], fov: 50 }} shadows dpr={[1, 1.5]} gl={{ antialias: false }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
        <pointLight position={[-10, 10, -10]} color="#3b82f6" intensity={0.5} />

        <Floor />
        
        {/* Shelves Layout */}
        <Shelf position={[-4, 0, -2]} />
        <Shelf position={[-4, 0, 2]} />
        <Shelf position={[4, 0, -2]} />
        <Shelf position={[4, 0, 2]} />
        <Shelf position={[0, 0, 0]} rotation={[0, Math.PI/2, 0]} />

        {/* Moving AGVs */}
        <AGV path={path1} offset={0} />
        <AGV path={path1} offset={2} color="#8b5cf6" />
        <AGV path={path2} offset={1} color="#f59e0b" />

        <OrbitControls maxPolarAngle={Math.PI / 2.2} />
      </Canvas>

      {/* UI Overlay */}
      <div style={{
        position: 'absolute',
        top: isMobile ? '20px' : '30px',
        left: isMobile ? '20px' : '30px',
        fontFamily: "'Inter', sans-serif",
        pointerEvents: 'none',
        width: '100%',
        maxWidth: '1200px'
      }}>
        <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', pointerEvents: 'auto', marginBottom: '20px', fontSize: '0.9rem', fontWeight: '500' }}>
            <ArrowLeft size={16} /> {isMobile ? 'Back' : 'Back to Lab'}
        </Link>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div>
                <h1 style={{ 
                    margin: 0, 
                    fontSize: isMobile ? '1.5rem' : '2.5rem', 
                    fontWeight: '900', 
                    color: '#fff', 
                    letterSpacing: '-0.02em'
                }}>
                SMART LOGISTICS HUB
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#3b82f6', marginTop: '8px', fontFamily: 'monospace' }}>
                    <Server size={16} />
                    <span>DIGITAL TWIN v1.0</span>
                </div>
            </div>

            {/* Dashboard Stats Panel */}
            <div style={{ 
                background: 'rgba(30, 41, 59, 0.8)', 
                backdropFilter: 'blur(10px)',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #334155',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '20px',
                pointerEvents: 'auto',
                width: isMobile ? 'calc(100% - 40px)' : '300px',
                marginRight: isMobile ? '40px' : '60px'
            }}>
                <div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '4px' }}>ACTIVE AGVs</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>3</div>
                </div>
                <div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '4px' }}>THROUGHPUT</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#22c55e' }}>120/h</div>
                </div>
                <div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '4px' }}>STORAGE</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>85%</div>
                </div>
                <div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '4px' }}>SYSTEM</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#3b82f6', marginTop: '4px' }}>OPTIMAL</div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
