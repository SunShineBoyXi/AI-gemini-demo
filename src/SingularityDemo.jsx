import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber'
import { OrbitControls, Stars, CameraShake } from '@react-three/drei'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import * as THREE from 'three'
import { shaderMaterial } from '@react-three/drei'

// --- Custom Shaders ---

// 1. Accretion Disk Shader (The glowing ring)
const DiskMaterial = shaderMaterial(
  { time: 0, color: new THREE.Color(1.0, 0.8, 0.4) },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vPos;
    void main() {
      vUv = uv;
      vPos = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float time;
    uniform vec3 color;
    varying vec2 vUv;
    varying vec3 vPos;

    // Simplex noise function (simplified)
    float noise(vec3 p) {
        return fract(sin(dot(p, vec3(12.9898, 78.233, 45.543))) * 43758.5453);
    }

    void main() {
      // Polar coordinates
      float dist = length(vUv - 0.5) * 2.0;
      float angle = atan(vUv.y - 0.5, vUv.x - 0.5);

      // Animated noise texture for the swirling gas
      float n = noise(vec3(dist * 10.0, angle * 5.0 + time * 2.0, time));
      
      // Ring shape mask
      float ring = smoothstep(0.4, 0.6, dist) * smoothstep(0.9, 0.6, dist);
      
      // Inner brightness
      float brightness = 2.0 * ring * (0.5 + 0.5 * n);

      // Color ramp: Hot center (white/blue) to Cool edge (orange/red)
      vec3 finalColor = mix(vec3(1.0, 0.3, 0.1), vec3(1.0, 0.9, 0.8), dist);
      
      gl_FragColor = vec4(finalColor * brightness * 4.0, ring);
    }
  `
)

extend({ DiskMaterial })

// --- Components ---

const BlackHoleCore = () => {
  return (
    <group>
      {/* The Event Horizon (Pure Black Sphere) */}
      <mesh>
        <sphereGeometry args={[1.8, 64, 64]} />
        <meshBasicMaterial color="black" />
      </mesh>
      
      {/* Gravitational Lensing Halo (Subtle distortion ring) */}
      <mesh>
         <sphereGeometry args={[2.0, 64, 64]} />
         <meshBasicMaterial color="#000" transparent opacity={0.0} side={THREE.BackSide} />
      </mesh>
    </group>
  )
}

const AccretionDisk = () => {
  const materialRef = useRef()
  
  useFrame((state) => {
    if (materialRef.current) {
        materialRef.current.time = state.clock.getElapsedTime()
    }
  })

  return (
    <group rotation={[Math.PI / 3, 0, 0]}> {/* Tilted disk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 12, 64, 64]} />
        {/* @ts-ignore */}
        <diskMaterial ref={materialRef} transparent side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  )
}

const Particles = () => {
    const count = 2000
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3)
        for(let i=0; i<count; i++) {
            // Spiral distribution
            const angle = Math.random() * Math.PI * 2
            const radius = 3 + Math.random() * 10
            pos[i*3] = Math.cos(angle) * radius
            pos[i*3+1] = (Math.random() - 0.5) * 0.5 // Flattened
            pos[i*3+2] = Math.sin(angle) * radius
        }
        return pos
    }, [])

    const ref = useRef()
    useFrame((state) => {
        if(ref.current) {
            ref.current.rotation.y += 0.005
        }
    })

    return (
        <points ref={ref} rotation={[Math.PI / 3, 0, 0]}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.05} color="#fbbf24" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
        </points>
    )
}

export default function SingularityDemo() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 2, 12], fov: 45 }} gl={{ antialias: false }}>
        <color attach="background" args={['#020207']} />
        
        <Stars radius={200} depth={50} count={10000} factor={6} saturation={0} fade speed={2} />
        
        <BlackHoleCore />
        <AccretionDisk />
        <Particles />

        {/* Camera Shake for intensity */}
        <CameraShake 
            maxYaw={0.05} 
            maxPitch={0.05} 
            maxRoll={0.05} 
            yawFrequency={0.1} 
            pitchFrequency={0.1} 
            rollFrequency={0.1} 
            intensity={0.5}
        />

        <OrbitControls enablePan={false} minDistance={4} maxDistance={20} autoRotate autoRotateSpeed={0.5} />

        <EffectComposer>
          {/* Insane Bloom for the blinding light effect */}
          <Bloom luminanceThreshold={0.1} mipmapBlur intensity={1.5} radius={0.8} />
          <Noise opacity={0.15} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
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
        <h1 style={{ margin: 0, fontSize: '3rem', fontWeight: '900', letterSpacing: '0.2em', color: '#fff', textShadow: '0 0 20px rgba(255,255,255,0.5)' }}>
          SINGULARITY
        </h1>
        <div style={{ fontSize: '0.8rem', color: '#f59e0b', letterSpacing: '2px', marginTop: '5px' }}>
          EVENT HORIZON SIMULATION
        </div>
      </div>
    </div>
  )
}
