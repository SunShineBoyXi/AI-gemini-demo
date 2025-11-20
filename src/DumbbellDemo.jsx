import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Grid } from '@react-three/drei'
import DumbbellCurl from './DumbbellCurl'

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#f3f4f6' }}>
      <Canvas shadows camera={{ position: [0, 0, 10], zoom: 100 }} orthographic>
        {/* Lighting optimized for Cel Shading */}
        <ambientLight intensity={0.9} />
        <directionalLight 
          position={[5, 8, 5]} 
          intensity={2.0} 
          castShadow 
        />
        <directionalLight 
          position={[-5, 5, -5]} 
          intensity={0.8} 
          color="#dbeafe" // Light blue tint
        />

        <DumbbellCurl />

        {/* Ground Effects */}
        <group position={[0, -2.9, 0]}>
            {/* Subtle Vector Grid */}
            <Grid 
              infiniteGrid 
              cellSize={1} 
              sectionSize={3} 
              fadeDistance={30} 
              sectionColor={"#cbd5e1"} 
              cellColor={"#e2e8f0"}
            />
            
            {/* Shadow */}
            <ContactShadows 
              position={[0, 0, 0]} 
              opacity={0.3} 
              scale={10} 
              blur={2.5} 
              far={4} 
              color="#1e293b"
            />
        </group>

        <OrbitControls 
          enableZoom={true} 
          minZoom={40} 
          maxZoom={200}
          enablePan={true}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 1.8} // Don't let camera go too far below ground
        />
      </Canvas>
      
      <div style={{
        position: 'absolute',
        top: '30px',
        left: '30px',
        fontFamily: "'Inter', sans-serif",
        pointerEvents: 'none'
      }}>
        <Link to="/" style={{ color: '#475569', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', pointerEvents: 'auto', marginBottom: '16px', fontSize: '0.9rem', fontWeight: '500' }}>
            <ArrowLeft size={16} /> Back to Lab
        </Link>
        <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.05em', color: '#0f172a' }}>
          VECTOR CURL
        </h1>
        <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
            <span style={{ background: '#3b82f6', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold'}}>REACT THREE FIBER</span>
            <span style={{ background: '#0f172a', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold'}}>TOON SHADING</span>
        </div>
      </div>
    </div>
  )
}

export default App
