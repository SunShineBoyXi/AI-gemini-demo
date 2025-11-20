import React, { useState, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useCursor, Float, Text, Environment, ContactShadows } from '@react-three/drei'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, Music, Star } from 'lucide-react'
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

// --- Interactive Components ---

const Tree = ({ position, scale = 1, color = "#22c55e" }) => {
    const [hovered, setHovered] = useState(false)
    const [active, setActive] = useState(false)
    useCursor(hovered)
    const ref = useRef()

    useFrame((state) => {
        if (active && ref.current) {
            ref.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 10) * 0.1
        } else if (ref.current) {
            ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, 0, 0.1)
        }
    })

    const handleClick = () => {
        setActive(true)
        setTimeout(() => setActive(false), 500)
    }

    return (
        <group 
            position={position} 
            scale={active ? scale * 1.2 : scale} 
            onPointerOver={() => setHovered(true)} 
            onPointerOut={() => setHovered(false)}
            onClick={handleClick}
            ref={ref}
        >
            {/* Trunk */}
            <mesh position={[0, 0.5, 0]}>
                <cylinderGeometry args={[0.1, 0.2, 1, 8]} />
                <meshStandardMaterial color="#78350f" />
            </mesh>
            {/* Leaves */}
            <mesh position={[0, 1.5, 0]}>
                <dodecahedronGeometry args={[0.8, 0]} />
                <meshStandardMaterial color={hovered ? "#4ade80" : color} />
            </mesh>
        </group>
    )
}

const Animal = ({ position, type = "bear" }) => {
    const [hovered, setHovered] = useState(false)
    const [jump, setJump] = useState(false)
    useCursor(hovered)
    const ref = useRef()

    useFrame((state) => {
        if (jump && ref.current) {
            ref.current.position.y = Math.sin(state.clock.getElapsedTime() * 10) * 0.5 + 0.5
        } else if (ref.current) {
            ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, 0.5, 0.1)
        }
    })

    const handleClick = () => {
        setJump(true)
        setTimeout(() => setJump(false), 1000)
    }

    return (
        <group 
            position={position} 
            onPointerOver={() => setHovered(true)} 
            onPointerOut={() => setHovered(false)}
            onClick={handleClick}
            ref={ref}
        >
            {type === 'bear' ? (
                <group>
                    {/* Body */}
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[0.8, 0.6, 0.8]} />
                        <meshStandardMaterial color="#d97706" />
                    </mesh>
                    {/* Head */}
                    <mesh position={[0, 0.6, 0.3]}>
                        <boxGeometry args={[0.5, 0.4, 0.5]} />
                        <meshStandardMaterial color="#fbbf24" />
                    </mesh>
                    {/* Ears */}
                    <mesh position={[-0.2, 0.8, 0.3]}>
                        <sphereGeometry args={[0.1]} />
                        <meshStandardMaterial color="#d97706" />
                    </mesh>
                    <mesh position={[0.2, 0.8, 0.3]}>
                        <sphereGeometry args={[0.1]} />
                        <meshStandardMaterial color="#d97706" />
                    </mesh>
                </group>
            ) : (
                <group>
                    {/* Rabbit Body */}
                    <mesh position={[0, -0.1, 0]}>
                        <sphereGeometry args={[0.4, 16, 16]} />
                        <meshStandardMaterial color="#fff" />
                    </mesh>
                    {/* Ears */}
                    <mesh position={[-0.1, 0.4, 0]}>
                        <capsuleGeometry args={[0.1, 0.4, 4, 8]} />
                        <meshStandardMaterial color="#fecdd3" />
                    </mesh>
                    <mesh position={[0.1, 0.4, 0]}>
                        <capsuleGeometry args={[0.1, 0.4, 4, 8]} />
                        <meshStandardMaterial color="#fecdd3" />
                    </mesh>
                </group>
            )}
            
            {jump && (
                <Text position={[0, 1.5, 0]} fontSize={0.5} color="#fbbf24">
                    Hello!
                </Text>
            )}
        </group>
    )
}

const Cloud = ({ position }) => (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
        <group position={position}>
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.8, 16, 16]} />
                <meshStandardMaterial color="white" />
            </mesh>
            <mesh position={[1, 0, 0]}>
                <sphereGeometry args={[0.6, 16, 16]} />
                <meshStandardMaterial color="white" />
            </mesh>
            <mesh position={[-1, 0, 0]}>
                <sphereGeometry args={[0.6, 16, 16]} />
                <meshStandardMaterial color="white" />
            </mesh>
        </group>
    </Float>
)

export default function MagicForest() {
  const isMobile = useIsMobile()
  
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#7dd3fc' }}>
      <Canvas camera={{ position: [0, 5, 8], fov: 50 }} shadows>
        <color attach="background" args={['#7dd3fc']} />
        {/* Standard Lighting - No external HDR downloads */}
        <ambientLight intensity={1.2} />
        <directionalLight 
            position={[5, 10, 5]} 
            intensity={1.5} 
            castShadow 
            shadow-mapSize={[1024, 1024]} 
        />
        <hemisphereLight skyColor="#ffffff" groundColor="#86efac" intensity={0.5} />
        
        {/* Island Base */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
            <circleGeometry args={[8, 64]} />
            <meshStandardMaterial color="#86efac" />
        </mesh>
        
        {/* Trees */}
        <Tree position={[-2, 0, -2]} scale={1.5} />
        <Tree position={[3, 0, -1]} scale={1.2} color="#16a34a" />
        <Tree position={[-3, 0, 2]} scale={0.8} color="#4ade80" />
        
        {/* Animals */}
        <Animal position={[0, 0.5, 0]} type="bear" />
        <Animal position={[2, 0.5, 2]} type="rabbit" />

        {/* Clouds */}
        <Cloud position={[-4, 4, -5]} />
        <Cloud position={[4, 5, -2]} />
        <Cloud position={[0, 6, 2]} />

        {/* Removed expensive ContactShadows to prevent crash */}
        <OrbitControls maxPolarAngle={Math.PI / 2.2} enableZoom={false} />
      </Canvas>

      {/* UI Overlay */}
      <div style={{
        position: 'absolute',
        top: isMobile ? '20px' : '30px',
        left: isMobile ? '20px' : '30px',
        fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif", // Playful font
        pointerEvents: 'none',
        width: '100%',
        maxWidth: '1200px'
      }}>
        <Link to="/" style={{ 
            color: '#0369a1', 
            textDecoration: 'none', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            pointerEvents: 'auto', 
            marginBottom: '20px', 
            fontSize: '1.1rem', 
            fontWeight: 'bold',
            background: 'white',
            padding: '10px 20px',
            borderRadius: '30px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
            <ArrowLeft size={24} /> {isMobile ? 'Back' : 'Back to Lab'}
        </Link>
        
        <div style={{ marginTop: '10px' }}>
            <h1 style={{ 
                margin: 0, 
                fontSize: isMobile ? '2rem' : '3.5rem', 
                fontWeight: '900', 
                color: '#fff', 
                textShadow: '2px 2px 0px #0ea5e9',
                letterSpacing: '1px'
            }}>
            MAGIC FOREST
            </h1>
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                fontSize: '1.2rem', 
                color: '#0369a1', 
                fontWeight: 'bold', 
                marginTop: '10px',
                background: 'rgba(255,255,255,0.8)',
                padding: '8px 16px',
                borderRadius: '20px',
                width: 'fit-content'
            }}>
                <Sparkles size={24} color="#eab308" />
                <span>CLICK THE ANIMALS!</span>
            </div>
        </div>
      </div>
    </div>
  )
}
