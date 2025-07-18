import { useState, useEffect } from 'react'
import Header from './components/Header'
import LandingPage from './components/LandingPage'
import ProjectsView from './components/ProjectsView'
import NetworkView from './components/NetworkView'
import ScrollProgress from './components/ScrollProgress'
import ScrollToTop from './components/ScrollToTop'
import './App.css'

function App() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState('landing')

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('https://5002-i06g08ev89n8sa2x920am-a395c2b7.manusvm.computer/api/projects')
      const data = await response.json()
      setProjects(data.projects || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-light flex items-center justify-center">
        <div className="text-navy-deep text-xl">Loading Portfolio...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sand-light text-navy-deep">
      <ScrollProgress />
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      
      <main>
        {currentView === 'landing' && (
          <LandingPage projects={projects} setCurrentView={setCurrentView} />
        )}
        
        {currentView === 'projects' && (
          <ProjectsView projects={projects} />
        )}
        
        {currentView === 'network' && (
          <NetworkView projects={projects} />
        )}
        
        {currentView === 'about' && (
          <div className="min-h-screen pt-24 pb-16">
            <div className="container-professional">
              <h1 className="heading-primary text-navy-deep mb-8">About Me</h1>
              <p className="text-professional text-xl">
                Professional background and experience coming soon...
              </p>
            </div>
          </div>
        )}
        
        {currentView === 'contact' && (
          <div className="min-h-screen pt-24 pb-16">
            <div className="container-professional">
              <h1 className="heading-primary text-navy-deep mb-8">Contact</h1>
              <p className="text-professional text-xl">
                Get in touch - contact information coming soon...
              </p>
            </div>
          </div>
        )}
      </main>
      
      <ScrollToTop />
    </div>
  )
}

export default App

