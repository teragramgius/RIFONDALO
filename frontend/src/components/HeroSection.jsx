import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import NetworkGraph from './NetworkGraph'

const HeroSection = ({ archives, setCurrentView }) => {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] })
  const [selectedArchive, setSelectedArchive] = useState(null)

  useEffect(() => {
    generateHeroGraphData()
  }, [archives])

  const generateHeroGraphData = () => {
    // Create a simplified graph for the hero section
    const nodes = [
      { id: 'biblio-graph', label: 'Biblio-Graph', type: 'central', x: 0, y: 0 },
      { id: 'archival', label: 'Archival Consciousness', type: 'concept', x: -200, y: -100 },
      { id: 'documents', label: 'Documents', type: 'concept', x: 200, y: -100 },
      { id: 'collections', label: 'Collections', type: 'concept', x: -200, y: 100 },
      { id: 'network', label: 'Network Visualization', type: 'concept', x: 200, y: 100 },
      { id: 'semantic', label: 'Semantic Web', type: 'concept', x: 0, y: -200 },
      { id: 'linked-data', label: 'Linked Data', type: 'concept', x: 0, y: 200 },
    ]

    // Add archive nodes
    archives.forEach((archive, index) => {
      const angle = (index * 2 * Math.PI) / archives.length
      const radius = 300
      nodes.push({
        id: `archive-${archive.id}`,
        label: archive.name,
        type: 'archive',
        color: archive.color,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        archive: archive
      })
    })

    const edges = [
      { source: 'biblio-graph', target: 'archival' },
      { source: 'biblio-graph', target: 'documents' },
      { source: 'biblio-graph', target: 'collections' },
      { source: 'biblio-graph', target: 'network' },
      { source: 'biblio-graph', target: 'semantic' },
      { source: 'biblio-graph', target: 'linked-data' },
    ]

    // Connect archives to central node
    archives.forEach((archive) => {
      edges.push({
        source: 'biblio-graph',
        target: `archive-${archive.id}`
      })
    })

    setGraphData({ nodes, edges })
  }

  const handleNodeClick = (node) => {
    if (node.type === 'archive') {
      setSelectedArchive(node.archive)
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-gray-900 via-black to-black"></div>
      
      {/* Network Graph Background */}
      <div className="absolute inset-0">
        <NetworkGraph 
          data={graphData}
          onNodeClick={handleNodeClick}
          interactive={true}
          showLabels={true}
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
          Biblio-Graph
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          A digital archiving system for cultural organizations, publishers, collectives, 
          and social movements that want to make their collections accessible through 
          interactive network visualization and linked open data.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg"
            className="bg-green-400 text-black hover:bg-green-300 font-semibold px-8 py-3"
            onClick={() => setCurrentView('explore')}
          >
            Explore Archives
          </Button>
          
          <Button 
            size="lg"
            variant="outline"
            className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black px-8 py-3"
            onClick={() => setCurrentView('graph')}
          >
            View Graph
          </Button>
        </div>

        {/* Archive Selection Info */}
        {selectedArchive && (
          <div className="mt-8 p-6 bg-black/60 backdrop-blur-sm rounded-lg border border-gray-700 max-w-md mx-auto">
            <h3 className="text-xl font-semibold mb-2" style={{ color: selectedArchive.color }}>
              {selectedArchive.name}
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              {selectedArchive.description}
            </p>
            <Button 
              size="sm"
              style={{ backgroundColor: selectedArchive.color, color: 'black' }}
              onClick={() => setCurrentView('explore')}
            >
              Explore {selectedArchive.name}
            </Button>
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection

