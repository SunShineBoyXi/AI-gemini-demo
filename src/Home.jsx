import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Globe, Activity, Zap, Box, Layers } from 'lucide-react'

const ProjectCard = ({ title, description, path, category, icon: Icon, color }) => {
  return (
    <Link to={path} className="group" style={{ textDecoration: 'none' }}>
      <div style={{
        background: '#1e293b',
        borderRadius: '12px',
        overflow: 'hidden',
        height: '100%',
        border: '1px solid #334155',
        transition: 'all 0.3s ease',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.borderColor = color
        e.currentTarget.style.boxShadow = `0 10px 30px -10px ${color}40`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = '#334155'
        e.currentTarget.style.boxShadow = 'none'
      }}
      >
        {/* Card Header / Icon Area */}
        <div style={{
          padding: '24px',
          background: `linear-gradient(135deg, ${color}10, transparent)`,
          borderBottom: '1px solid #334155',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '10px',
            background: '#0f172a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color,
            border: '1px solid #334155'
          }}>
            <Icon size={24} />
          </div>
          
          <div style={{
            padding: '6px 12px',
            borderRadius: '20px',
            background: '#0f172a',
            color: '#94a3b8',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.5px',
            border: '1px solid #334155'
          }}>
            {category}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ 
            color: '#f8fafc', 
            fontSize: '1.25rem', 
            fontWeight: 700, 
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {title}
          </h3>
          <p style={{ 
            color: '#94a3b8', 
            fontSize: '0.95rem', 
            lineHeight: 1.6, 
            marginBottom: '24px',
            flex: 1
          }}>
            {description}
          </p>
          
          <div style={{ 
            color: color, 
            fontSize: '0.9rem', 
            fontWeight: 600, 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px'
          }}>
            View Project <ArrowUpRight size={18} />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function Home() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0f172a', 
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: 'white',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      
      {/* Subtle Background Gradients */}
      <div style={{
        position: 'fixed',
        top: '-20%',
        left: '-10%',
        width: '60%',
        height: '60%',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{
        position: 'fixed',
        bottom: '-20%',
        right: '-10%',
        width: '60%',
        height: '60%',
        background: 'radial-gradient(circle, rgba(245, 158, 11, 0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Navbar */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backdropFilter: 'blur(16px)',
        background: 'rgba(15, 23, 42, 0.8)',
        borderBottom: '1px solid #334155'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: '#3b82f6',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Layers size={20} color="white" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>RBL Studio</span>
          </div>
          
          <div style={{ display: 'flex', gap: '24px', color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500 }}>
            <span style={{ color: 'white', cursor: 'pointer' }}>Projects</span>
            <span style={{ cursor: 'pointer', opacity: 0.7 }}>About</span>
            <span style={{ cursor: 'pointer', opacity: 0.7 }}>Contact</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '80px 24px 120px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '800px', marginBottom: '100px' }}>
          <h1 style={{ 
            fontSize: 'clamp(3.5rem, 6vw, 5rem)', 
            fontWeight: 800, 
            lineHeight: 1.1, 
            marginBottom: '30px',
            letterSpacing: '-0.03em',
            background: 'linear-gradient(to right, #fff, #94a3b8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Digital experiences designed for the future.
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            color: '#94a3b8', 
            lineHeight: 1.6, 
            maxWidth: '600px' 
          }}>
            A curated collection of interactive experiments, data visualizations, and immersive interfaces.
          </p>
        </div>

        {/* Projects Grid */}
        <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>Featured Work</h2>
            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>4 Projects Available</div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '32px' 
        }}>
          
          <ProjectCard 
            title="Nexus Core"
            description="Enterprise-grade 3D data visualization dashboard featuring real-time global telemetry scanning."
            category="DATA VISUALIZATION"
            path="/nexus"
            icon={Globe}
            color="#3b82f6"
          />

          <ProjectCard 
            title="The Singularity"
            description="Physics-accurate black hole simulation with custom GLSL shaders for gravitational lensing."
            category="WEBGL SHADER"
            path="/singularity"
            icon={Zap}
            color="#f59e0b"
          />

          <ProjectCard 
            title="Chaos Physics"
            description="Interactive physics sandbox featuring destructible environments and dynamic lighting."
            category="INTERACTIVE PHYSICS"
            path="/physics"
            icon={Box}
            color="#ef4444"
          />

          <ProjectCard 
            title="Vector Fitness"
            description="Procedural character animation system demonstrating skeletal kinematics in vector style."
            category="CHARACTER ANIMATION"
            path="/dumbbell"
            icon={Activity}
            color="#10b981"
          />

        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #334155', background: '#0f172a', padding: '60px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                © 2024 RBL Studio. All rights reserved.
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
                {/* Social icons placeholders */}
                <div style={{ width: '24px', height: '24px', background: '#334155', borderRadius: '4px' }}></div>
                <div style={{ width: '24px', height: '24px', background: '#334155', borderRadius: '4px' }}></div>
            </div>
        </div>
      </footer>

    </div>
  )
}
