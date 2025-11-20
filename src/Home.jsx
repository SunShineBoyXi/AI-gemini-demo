import React from 'react'
import { Link } from 'react-router-dom'
import { Activity, Globe, ArrowRight, Zap, Box } from 'lucide-react'

const DemoCard = ({ title, description, path, icon: Icon, color }) => (
  <Link to={path} style={{ textDecoration: 'none' }}>
    <div className="card" style={{
      background: '#1e293b',
      borderRadius: '16px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      border: '1px solid #334155',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      height: '100%'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: `${color}20`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color
      }}>
        <Icon size={24} />
      </div>
      
      <div>
        <h3 style={{ margin: '0 0 8px 0', color: '#f8fafc', fontSize: '1.25rem' }}>{title}</h3>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5' }}>
          {description}
        </p>
      </div>

      <div style={{ 
        marginTop: 'auto', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        color: color, 
        fontSize: '0.9rem',
        fontWeight: '500' 
      }}>
        Launch Demo <ArrowRight size={16} />
      </div>
    </div>
  </Link>
)

export default function Home() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0f172a', 
      color: 'white', 
      fontFamily: "'Inter', sans-serif",
      padding: '40px'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <header style={{ marginBottom: '60px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '16px', background: 'linear-gradient(to right, #60a5fa, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Creative Lab
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '600px' }}>
            A collection of 3D experiments, data visualizations, and interactive interfaces built with React Three Fiber.
          </p>
        </header>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '24px' 
        }}>
          <DemoCard 
            title="Nexus Core"
            description="Interactive 3D data visualization dashboard featuring a holographic globe with real-time node scanning and telemetry monitoring."
            path="/nexus"
            icon={Globe}
            color="#3b82f6"
          />
          
          <DemoCard 
            title="The Singularity"
            description="Experience the event horizon. A shader-based black hole simulation with gravitational lensing and accretion disk physics."
            path="/singularity"
            icon={Zap}
            color="#fbbf24"
          />
          
          <DemoCard 
            title="Vector Fitness"
            description="Procedural character animation system demonstrating skeletal movement and cel-shading techniques for vector-style graphics."
            path="/dumbbell"
            icon={Activity}
            color="#f59e0b"
          />
          <DemoCard 
            title="Chaos Physics"
            description="Destructible environment using Cannon.js physics engine. Click to fire high-impact projectiles at a neon block structure."
            path="/physics"
            icon={Box}
            color="#ef4444"
          />
        </div>
      </div>
      
      <style>{`
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border-color: #475569 !important;
        }
      `}</style>
    </div>
  )
}
