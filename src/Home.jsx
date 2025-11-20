import React, { useState, useRef, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { ArrowUpRight, Globe, Activity, Zap, Box, Layers, Moon, Sun, Hexagon, Brain, Building2, Droplets, Truck, Trees } from 'lucide-react'

// --- 3D Background Components ---
const ParticleField = ({ count = 100, color = '#4f46e5' }) => {
  const mesh = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
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

  useFrame((state) => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle
      t = particle.t += speed / 2
      const a = Math.cos(t) + Math.sin(t * 1) / 10
      const b = Math.sin(t) + Math.cos(t * 2) / 10
      const s = Math.cos(t)
      particle.mx += (state.pointer.x * 1000 - particle.mx) * 0.01
      particle.my += (state.pointer.y * 1000 - 1 - particle.my) * 0.01
      
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      )
      dummy.scale.setScalar(s)
      dummy.rotation.set(s * 5, s * 5, s * 5)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <dodecahedronGeometry args={[0.2, 0]} />
      <meshPhongMaterial color={color} emissive={color} emissiveIntensity={0.5} />
    </instancedMesh>
  )
}

const AnimatedBackground = ({ theme }) => {
  const isDark = theme === 'dark'
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.6 }}>
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={75} />
        <ambientLight intensity={isDark ? 0.2 : 0.8} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Float speed={4} rotationIntensity={1} floatIntensity={2}>
          <ParticleField count={80} color={isDark ? '#3b82f6' : '#64748b'} />
          <ParticleField count={40} color={isDark ? '#8b5cf6' : '#94a3b8'} />
        </Float>
        {isDark && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />}
      </Canvas>
    </div>
  )
}

// --- UI Components ---

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  return isMobile
}

const CustomCursor = () => {
  const cursorRef = useRef(null)
  const [isHovering, setIsHovering] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (isMobile) return 

    const moveCursor = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      }
      
      const target = e.target
      const isClickable = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') ||
        target.style.cursor === 'pointer'
      
      setIsHovering(!!isClickable)
    }
    
    window.addEventListener('mousemove', moveCursor)
    return () => window.removeEventListener('mousemove', moveCursor)
  }, [isMobile])

  if (isMobile) return null

  return (
    <div 
      ref={cursorRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: isHovering ? '48px' : '20px',
        height: isHovering ? '48px' : '20px',
        marginLeft: isHovering ? '-24px' : '-10px',
        marginTop: isHovering ? '-24px' : '-10px',
        borderRadius: '50%',
        border: '2px solid white',
        backgroundColor: isHovering ? 'white' : 'transparent',
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: 'difference',
        transition: 'width 0.25s ease, height 0.25s ease, margin 0.25s ease, background-color 0.25s ease',
        willChange: 'transform, width, height'
      }}
    />
  )
}

const NoiseOverlay = () => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 999, // Below cursor (9999)
    opacity: 0.035,
    background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
  }} />
)

const NavLink = ({ text, theme }) => {
  const [hover, setHover] = useState(false)
  const isDark = theme === 'dark'
  
  return (
    <span 
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ 
        color: isDark ? '#f8fafc' : '#0f172a', 
        cursor: 'pointer',
        position: 'relative',
        fontWeight: 500,
        fontSize: '0.95rem',
        padding: '4px 0'
      }}
    >
      {text}
      <span style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '1.5px',
        background: isDark ? '#f8fafc' : '#0f172a',
        transform: hover ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: hover ? 'left' : 'right',
        transition: 'transform 0.3s cubic-bezier(0.7, 0, 0.3, 1)'
      }} />
    </span>
  )
}

const ScrollProgress = ({ theme }) => {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scroll = `${totalScroll / windowHeight}`
      setProgress(Number(scroll))
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '4px',
      zIndex: 100,
      background: 'transparent'
    }}>
      <div style={{
        width: `${progress * 100}%`,
        height: '100%',
        background: theme === 'dark' ? '#3b82f6' : '#2563eb',
        transition: 'width 0.1s ease-out'
      }} />
    </div>
  )
}

const THEMES = {
  light: {
    bg: '#f8fafc',
    text: '#0f172a',
    textSecondary: '#64748b',
    glass: 'rgba(255, 255, 255, 0.7)',
    border: 'rgba(0, 0, 0, 0.06)',
    accent: '#2563eb'
  },
  dark: {
    bg: '#030712',
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    glass: 'rgba(17, 24, 39, 0.7)',
    border: 'rgba(255, 255, 255, 0.08)',
    accent: '#3b82f6'
  }
}

const ProjectCard = ({ title, description, path, category, icon: Icon, color, theme, index, isMobile }) => {
  const t = THEMES[theme]
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <Link 
      to={path} 
      className="animate-fade-up"
      style={{ 
        textDecoration: 'none', 
        width: '100%',
        animationDelay: `${0.3 + (index * 0.1)}s`
      }}
    >
      <div
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'relative',
          background: t.glass,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${isHovered ? color : t.border}`,
          borderRadius: '24px',
          padding: '32px',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
          boxShadow: isHovered 
            ? `0 20px 40px -10px ${color}40` 
            : `0 4px 6px -1px rgba(0, 0, 0, 0.05)`,
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Gradient Blob Background */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-20%',
          width: '300px',
          height: '300px',
          background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
          opacity: isHovered ? 1 : 0.5,
          transition: 'opacity 0.4s ease',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
          <div 
            className="animate-float"
            style={{
              padding: '16px',
              borderRadius: '16px',
              background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              color: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${t.border}`,
              animationDelay: `${index * 0.5}s` // Stagger floating animation
            }}
          >
            <Icon size={32} strokeWidth={1.5} />
          </div>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: t.textSecondary,
            border: `1px solid ${t.border}`,
            padding: '8px 16px',
            borderRadius: '100px'
          }}>
            {category}
          </div>
        </div>

        <h3 style={{ 
          fontSize: '1.75rem', 
          fontWeight: 800, 
          color: t.text, 
          marginBottom: '12px', 
          letterSpacing: '-0.02em',
          position: 'relative',
          zIndex: 1
        }}>
          {title}
        </h3>
        
        <p style={{ 
          color: t.textSecondary, 
          fontSize: '1rem', 
          lineHeight: 1.6, 
          marginBottom: '32px', 
          flex: 1,
          position: 'relative',
          zIndex: 1
        }}>
          {description}
        </p>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          color: isHovered ? color : t.text,
          fontWeight: 600,
          transition: 'color 0.3s ease',
          position: 'relative',
          zIndex: 1
        }}>
          <span>Explore Project</span>
          <ArrowUpRight size={18} style={{ 
            transform: isHovered ? 'translate(4px, -4px)' : 'translate(0,0)',
            transition: 'transform 0.3s ease'
          }} />
        </div>
      </div>
    </Link>
  )
}

export default function Home() {
  const [theme, setTheme] = useState('dark')
  const t = THEMES[theme]
  const isMobile = useIsMobile()
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: t.bg,
      color: t.text,
      fontFamily: "'Inter', sans-serif",
      overflowX: 'hidden',
      transition: 'background 0.5s ease',
      cursor: isMobile ? 'auto' : 'none' // Hide default cursor only on desktop
    }}>
      
      <CustomCursor />
      <ScrollProgress theme={theme} />
      <NoiseOverlay />
      <AnimatedBackground theme={theme} />

      {/* Navigation */}
      <nav style={{
        padding: isMobile ? '20px' : '24px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Hexagon size={28} color={t.accent} strokeWidth={2.5} />
          <span style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.02em' }}>RBL STUDIO</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '20px' : '40px' }}>
            {!isMobile && (
              <div style={{ display: 'flex', gap: '32px' }}>
                  <NavLink text="Work" theme={theme} />
                  <NavLink text="Laboratory" theme={theme} />
                  <NavLink text="About" theme={theme} />
              </div>
            )}

            <button 
            onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            style={{
                background: 'transparent',
                border: `1px solid ${t.border}`,
                color: t.text,
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = t.accent}
            onMouseLeave={e => e.currentTarget.style.borderColor = t.border}
            >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header style={{ 
        padding: isMobile ? '120px 20px 80px' : '80px 40px 120px', 
        maxWidth: '1400px', 
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        <div 
          className="animate-fade-up"
          style={{ 
            fontSize: 'clamp(2.5rem, 12vw, 8rem)', 
            fontWeight: 900, 
            lineHeight: 0.95, 
            letterSpacing: '-0.04em',
            marginBottom: '40px',
            backgroundImage: theme === 'dark' 
              ? 'linear-gradient(to bottom, #fff, #94a3b8)' 
              : 'linear-gradient(to bottom, #0f172a, #475569)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            WebkitTextFillColor: 'transparent'
          }}
        >
          NEXT GEN <br />
          INTERFACES
        </div>
        
        <div 
          className="animate-fade-up"
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: isMobile ? '30px' : '60px',
            maxWidth: '1000px',
            animationDelay: '0.15s'
          }}
        >
          <p style={{ 
            fontSize: isMobile ? '1.1rem' : '1.25rem', 
            color: t.textSecondary, 
            lineHeight: 1.5,
            borderLeft: `2px solid ${t.accent}`,
            paddingLeft: '20px'
          }}>
            Exploring the boundaries of React Three Fiber. 
            A collection of immersive web experiences and data visualizations.
          </p>
        </div>

        <div style={{
          position: 'absolute',
          bottom: isMobile ? '-40px' : '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          opacity: 0.6,
          animation: 'float 3s ease-in-out infinite'
        }}>
          <span style={{ fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600 }}>Scroll</span>
          <div style={{ width: '1px', height: '40px', background: t.textSecondary }}></div>
        </div>
      </header>

      {/* Projects Section */}
      <section style={{ 
        padding: isMobile ? '0 20px 80px' : '0 40px 120px', 
        maxWidth: '1400px', 
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: isMobile ? '20px' : '32px' 
        }}>
          <ProjectCard 
            index={0}
            title="Nexus Core"
            description="Real-time global telemetry dashboard with 3D data mapping and interactive filtering systems."
            category="Data Viz"
            path="/nexus"
            icon={Globe}
            color="#3b82f6"
            theme={theme}
            isMobile={isMobile}
          />
          <ProjectCard 
            index={1}
            title="The Singularity"
            description="Advanced physics simulation rendering gravitational lensing and relativistic effects via GLSL shaders."
            category="WebGL Shader"
            path="/singularity"
            icon={Zap}
            color="#f59e0b"
            theme={theme}
            isMobile={isMobile}
          />
          <ProjectCard 
            index={2}
            title="Chaos Physics"
            description="High-fidelity destruction engine allowing for dynamic environment interaction and rigid body simulations."
            category="Simulation"
            path="/physics"
            icon={Box}
            color="#ef4444"
            theme={theme}
            isMobile={isMobile}
          />
          <ProjectCard 
            index={3}
            title="Vector Fitness"
            description="Procedural skeletal animation system focused on biomechanics and movement fluidity."
            category="Animation"
            path="/dumbbell"
            icon={Activity}
            color="#10b981"
            theme={theme}
            isMobile={isMobile}
          />
          <ProjectCard 
            index={4}
            title="Neural Swarm"
            description="A mesmerizing particle system simulating neural networks and hive mind intelligence."
            category="AI Visualization"
            path="/neural"
            icon={Brain}
            color="#00ffaa"
            theme={theme}
            isMobile={isMobile}
          />
          <ProjectCard 
            index={5}
            title="Cyber City"
            description="Infinite procedural metropolis generation with retro-future aesthetics and bloom effects."
            category="Procedural Gen"
            path="/cybercity"
            icon={Building2}
            color="#d946ef"
            theme={theme}
            isMobile={isMobile}
          />
          <ProjectCard 
            index={6}
            title="Liquid Chrome"
            description="Real-time environment mapping and distortion shaders creating a fluid metal experience."
            category="WebGL Shader"
            path="/liquid"
            icon={Droplets}
            color="#94a3b8"
            theme={theme}
            isMobile={isMobile}
          />
          <ProjectCard 
            index={7}
            title="Smart Logistics"
            description="Digital twin of an automated warehouse with real-time AGV tracking and data overlays."
            category="Enterprise / IoT"
            path="/logistics"
            icon={Truck}
            color="#3b82f6"
            theme={theme}
            isMobile={isMobile}
          />
          <ProjectCard 
            index={8}
            title="Magic Forest"
            description="Interactive 3D learning environment for children with playful animations and sound."
            category="Education / Kids"
            path="/forest"
            icon={Trees}
            color="#22c55e"
            theme={theme}
            isMobile={isMobile}
          />
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: isMobile ? '60px 20px 40px' : '100px 40px 60px',
        borderTop: `1px solid ${t.border}`,
        background: theme === 'dark' ? 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.5))' : 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.05))',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            flexDirection: isMobile ? 'column' : 'row',
            flexWrap: 'wrap', 
            gap: '60px',
            marginBottom: '80px'
          }}>
            <div style={{ maxWidth: '600px' }}>
              <h2 style={{ 
                fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
                fontWeight: 800, 
                lineHeight: 1,
                marginBottom: '30px',
                letterSpacing: '-0.03em'
              }}>
                Ready to create the <span style={{ color: t.textSecondary }}>impossible?</span>
              </h2>
              <button style={{
                padding: '16px 32px',
                borderRadius: '100px',
                background: t.text,
                color: t.bg,
                border: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                width: isMobile ? '100%' : 'auto'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                Start a Project
              </button>
            </div>

            <div style={{ display: 'flex', gap: '60px', flexWrap: 'wrap', flexDirection: isMobile ? 'column' : 'row' }}>
              <div>
                <h4 style={{ color: t.textSecondary, fontSize: '0.875rem', fontWeight: 600, marginBottom: '24px', letterSpacing: '1px' }}>SOCIALS</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {['Twitter', 'GitHub', 'LinkedIn', 'Instagram'].map(item => (
                    <a key={item} href="#" style={{ color: t.text, textDecoration: 'none', fontSize: '1.1rem', fontWeight: 500, transition: 'color 0.2s' }}
                       onMouseEnter={e => e.target.style.color = t.accent}
                       onMouseLeave={e => e.target.style.color = t.text}>
                      {item}
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <h4 style={{ color: t.textSecondary, fontSize: '0.875rem', fontWeight: 600, marginBottom: '24px', letterSpacing: '1px' }}>LEGAL</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
                    <a key={item} href="#" style={{ color: t.text, textDecoration: 'none', fontSize: '1.1rem', fontWeight: 500, transition: 'color 0.2s' }}
                       onMouseEnter={e => e.target.style.color = t.accent}
                       onMouseLeave={e => e.target.style.color = t.text}>
                      {item}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ 
            borderTop: `1px solid ${t.border}`, 
            paddingTop: '40px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
            color: t.textSecondary,
            fontSize: '0.875rem'
          }}>
            <div>
              © 2024 RBL Studio • Experimental Division
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%' }}></div>
              <span>All Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
