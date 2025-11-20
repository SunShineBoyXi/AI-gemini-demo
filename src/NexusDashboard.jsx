import React, { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import HoloGlobe from './HoloGlobe'

// Camera Controller Component for smooth transitions
const CameraController = ({ targetPosition }) => {
    const { camera, controls } = useThree()
    const vec = new THREE.Vector3()

    useFrame((state, delta) => {
        if (targetPosition) {
            // Calculate the ideal camera position: 
            // It should be some distance away from the marker, along the vector from center to marker
            const distance = 8
            // Clone the target vector (which is on sphere surface)
            vec.copy(targetPosition).normalize().multiplyScalar(distance)
            
            // Smoothly interpolate camera position
            camera.position.lerp(vec, 2 * delta)
            
            // Also make the camera look at the center (0,0,0) or the marker?
            // OrbitControls usually handles the "lookAt" via its target.
            // We should also animate the controls.target if we want to focus ON the marker specifically,
            // but focusing on center (0,0,0) while moving camera gives a nice "orbit to" effect.
            state.camera.lookAt(0, 0, 0)
        }
    })
    return null
}

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

import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

function App() {
  // Mock Data Stream
  const [streamData, setStreamData] = useState([])
  const [focusTarget, setFocusTarget] = useState(null)
  const isMobile = useIsMobile()
  
  useEffect(() => {
      const interval = setInterval(() => {
          const newLog = {
              id: Date.now(),
              time: new Date().toLocaleTimeString(),
              event: `NODE_${Math.floor(Math.random() * 999)} SYNC COMPLETE`,
              latency: Math.floor(Math.random() * 50) + 'ms'
          }
          setStreamData(prev => [newLog, ...prev].slice(0, 6))
      }, 1500)
      return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', overflow: 'hidden', position: 'relative' }}>
      
      {/* 3D Holographic Scene */}
      <Canvas camera={{ position: [0, 2, 10], fov: 50 }} gl={{ antialias: false }}>
        <color attach="background" args={['#050505']} />
        
        {/* Background Starfield */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        <HoloGlobe 
            radius={3.5} 
            isMobile={isMobile}
            onMarkerClick={(pos) => {
                // When clicking a marker, set it as the new focus target
                // Add a slight offset to y so we don't look directly edge-on if we don't want to
                setFocusTarget(pos)
            }} 
        />
        
        <CameraController targetPosition={focusTarget} />

        <OrbitControls 
            enablePan={false} 
            minDistance={5} 
            maxDistance={20} 
            autoRotate={!focusTarget} // Stop auto-rotate when focused
            autoRotateSpeed={0.8}
        />

        {/* Post Processing Pipeline */}
        <EffectComposer disableNormalPass>
            <Bloom 
                luminanceThreshold={0.2} 
                mipmapBlur 
                intensity={1.2} 
                radius={0.6} 
            />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>

      {/* UI Overlay - HUD Style */}
      <div className="hud-layer" style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        padding: isMobile ? '15px' : '30px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: "'Rajdhani', 'Segoe UI', sans-serif",
        color: '#fff',
        overflowY: isMobile ? 'auto' : 'hidden'
      }}>
        
        {/* Top Header */}
        <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: isMobile ? 'flex-start' : 'flex-start',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '20px' : '0'
        }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #334155', padding: '8px 12px', borderRadius: '8px', background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(4px)', pointerEvents: 'auto' }}>
                    <ArrowLeft size={16} /> {isMobile ? '' : 'Back'}
                </Link>
                <div>
                    <h1 style={{ margin: 0, fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 700, letterSpacing: '4px', color: '#fff' }}>
                    NEXUS<span style={{ color: '#3b82f6' }}>CORE</span>
                </h1>
                <div style={{ fontSize: '0.8rem', color: '#64748b', letterSpacing: '2px' }}>
                    GLOBAL DATA VISUALIZATION UNIT
                </div>
            </div>
            </div>
            <div style={{ textAlign: isMobile ? 'left' : 'right', paddingLeft: isMobile ? '60px' : '0' }}>
                <div style={{ fontSize: '1.5rem', fontFamily: 'monospace', color: '#3b82f6' }}>
                    {new Date().toLocaleTimeString()}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#10b981' }}>● SYSTEM ONLINE</div>
                {focusTarget && (
                    <div 
                        style={{ 
                            marginTop: '10px', 
                            color: '#f59e0b', 
                            cursor: 'pointer', 
                            pointerEvents: 'auto',
                            border: '1px solid #f59e0b',
                            padding: '4px 8px',
                            display: 'inline-block',
                            fontSize: '0.7rem'
                        }}
                        onClick={() => setFocusTarget(null)}
                    >
                        RESET VIEW
                    </div>
                )}
            </div>
        </div>

        {/* Middle Content */}
        <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            flex: 1, 
            alignItems: isMobile ? 'flex-end' : 'center',
            flexDirection: isMobile ? 'column' : 'row',
            paddingTop: isMobile ? '40px' : '0',
            pointerEvents: 'none'
        }}>
            
            {/* Left Stats */}
            <div style={{ 
                width: isMobile ? '100%' : '250px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '15px',
                marginBottom: isMobile ? '20px' : '0'
            }}>
                <StatCard label="TOTAL NODES" value="84,291" color="#3b82f6" />
                <StatCard label="ACTIVE SESSIONS" value="12.4M" color="#10b981" />
                <StatCard label="BANDWIDTH USAGE" value="842 TB/s" color="#f59e0b" />
            </div>

            {/* Right Logs */}
            <div style={{ width: isMobile ? '100%' : '300px' }}>
                <div style={{ 
                    background: 'rgba(10,10,20,0.6)', 
                    borderLeft: '2px solid #3b82f6', 
                    padding: '15px',
                    backdropFilter: 'blur(4px)'
                }}>
                    <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '5px' }}>
                        SYSTEM LOGS
                    </div>
                    {streamData.map(log => (
                        <div key={log.id} style={{ fontSize: '0.8rem', marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#64748b' }}>{log.time}</span>
                            <span style={{ color: '#e2e8f0' }}>{log.event}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Bottom Footer */}
        {!isMobile && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', fontSize: '0.8rem', color: '#475569' }}>
                <div>CPU LOAD: 12%</div>
                <div>GPU LOAD: 48%</div>
                <div>MEMORY: 64GB / 128GB</div>
                <div>LATENCY: 14ms</div>
            </div>
        )}

      </div>
    </div>
  )
}

const StatCard = ({ label, value, color }) => (
    <div style={{ 
        background: 'linear-gradient(90deg, rgba(15,23,42,0.8) 0%, transparent 100%)',
        padding: '12px 15px',
        borderLeft: `3px solid ${color}`
    }}>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8', letterSpacing: '1px' }}>{label}</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#fff', textShadow: `0 0 10px ${color}` }}>{value}</div>
    </div>
)

export default App
