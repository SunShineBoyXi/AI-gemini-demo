import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Home'
import NexusDashboard from './NexusDashboard'
import DumbbellDemo from './DumbbellDemo'
import SingularityDemo from './SingularityDemo'
import PhysicsDemo from './PhysicsDemo'
import NeuralSwarm from './NeuralSwarm'
import CyberCity from './CyberCity'
import LiquidChrome from './LiquidChrome'
import SmartLogistics from './SmartLogistics'
import MagicForest from './MagicForest'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nexus" element={<NexusDashboard />} />
        <Route path="/dumbbell" element={<DumbbellDemo />} />
        <Route path="/singularity" element={<SingularityDemo />} />
        <Route path="/physics" element={<PhysicsDemo />} />
        <Route path="/neural" element={<NeuralSwarm />} />
        <Route path="/cybercity" element={<CyberCity />} />
        <Route path="/liquid" element={<LiquidChrome />} />
        <Route path="/logistics" element={<SmartLogistics />} />
        <Route path="/forest" element={<MagicForest />} />
      </Routes>
    </Router>
  )
}

export default App
