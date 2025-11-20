import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Home'
import NexusDashboard from './NexusDashboard'
import DumbbellDemo from './DumbbellDemo'
import SingularityDemo from './SingularityDemo'
import PhysicsDemo from './PhysicsDemo'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nexus" element={<NexusDashboard />} />
        <Route path="/dumbbell" element={<DumbbellDemo />} />
        <Route path="/singularity" element={<SingularityDemo />} />
        <Route path="/physics" element={<PhysicsDemo />} />
      </Routes>
    </Router>
  )
}

export default App
