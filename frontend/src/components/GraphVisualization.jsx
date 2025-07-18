import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import NetworkGraph from './NetworkGraph'
import { Filter, Download, Share2, Maximize2 } from 'lucide-react'

const GraphVisualization = ({ archives }) => {
  const [selectedArchive, setSelectedArchive] = useState(null)
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] })
  const [loading, setLoading] = useState(false)
  const [selectedNode, setSelectedNode] = useState(null)
  const [viewMode, setViewMode] = useState('full') // full, filtered, focus
  const [filterType, setFilterType] = useState('all')
  const [connectionStrength, setConnectionStrength] = useState([0.5])

  useEffect(() => {
    if (archives.length > 0 && !selectedArchive) {
      setSelectedArchive(archives[0])
    }
  }, [archives])

  useEffect(() => {
    if (selectedArchive) {
      fetchGraphData(selectedArchive.slug)
    }
  }, [selectedArchive])

  const fetchGraphData = async (archiveSlug) => {
    setLoading(true)
    try {
      const response = await fetch(`https://zmhqivcveqyg.manus.space/api/archives/${archiveSlug}/graph`)
      const data = await response.json()
      setGraphData(data)
    } catch (error) {
      console.error('Error fetching graph data:', error)
      setGraphData({ nodes: [], edges: [] })
    } finally {
      setLoading(false)
    }
  }

  const handleNodeClick = (node) => {
    setSelectedNode(node)
  }

  const filteredGraphData = () => {
    if (filterType === 'all') return graphData

    const filteredNodes = graphData.nodes.filter(node => {
      if (filterType === 'items') return node.type === 'item'
      if (filterType === 'annotations') return node.type !== 'item'
      return node.type === filterType
    })

    const nodeIds = new Set(filteredNodes.map(n => n.id))
    const filteredEdges = graphData.edges.filter(edge => 
      nodeIds.has(edge.source.id || edge.source) && 
      nodeIds.has(edge.target.id || edge.target) &&
      (edge.strength || 1) >= connectionStrength[0]
    )

    return { nodes: filteredNodes, edges: filteredEdges }
  }

  const exportData = () => {
    const dataStr = JSON.stringify(graphData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${selectedArchive?.slug || 'archive'}-graph-data.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const getNodeTypeColor = (type) => {
    switch (type) {
      case 'item': return '#F59E0B'
      case 'Place': return '#10B981'
      case 'Period': return '#3B82F6'
      case 'Entity': return '#8B5CF6'
      case 'Objects': return '#F59E0B'
      case 'Events': return '#EF4444'
      case 'Terms': return '#6B7280'
      default: return '#9CA3AF'
    }
  }

  const nodeTypeCounts = graphData.nodes.reduce((acc, node) => {
    acc[node.type] = (acc[node.type] || 0) + 1
    return acc
  }, {})

  return (
    <section className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Graph Visualization
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore the semantic relationships and connections within the archive collections
          </p>
        </div>

        {/* Archive Selection */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {archives.map((archive) => (
            <Button
              key={archive.id}
              onClick={() => setSelectedArchive(archive)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                selectedArchive?.id === archive.id
                  ? 'text-black font-semibold'
                  : 'bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
              style={selectedArchive?.id === archive.id ? { backgroundColor: archive.color } : {}}
            >
              {archive.name}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* View Controls */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  View Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Filter by Type</label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Nodes</SelectItem>
                      <SelectItem value="item">Items Only</SelectItem>
                      <SelectItem value="annotations">Annotations Only</SelectItem>
                      <SelectItem value="Place">Places</SelectItem>
                      <SelectItem value="Period">Periods</SelectItem>
                      <SelectItem value="Entity">Entities</SelectItem>
                      <SelectItem value="Objects">Objects</SelectItem>
                      <SelectItem value="Events">Events</SelectItem>
                      <SelectItem value="Terms">Terms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Connection Strength: {connectionStrength[0].toFixed(2)}
                  </label>
                  <Slider
                    value={connectionStrength}
                    onValueChange={setConnectionStrength}
                    max={1}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={exportData} className="flex-1">
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle>Graph Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Nodes:</span>
                    <span className="font-medium">{graphData.nodes.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Edges:</span>
                    <span className="font-medium">{graphData.edges.length}</span>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-700">
                    <h4 className="font-medium mb-2">Node Types:</h4>
                    <div className="space-y-2">
                      {Object.entries(nodeTypeCounts).map(([type, count]) => (
                        <div key={type} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: getNodeTypeColor(type) }}
                            ></div>
                            <span className="text-sm text-gray-400 capitalize">{type}</span>
                          </div>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selected Node Info */}
            {selectedNode && (
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getNodeTypeColor(selectedNode.type) }}
                    ></div>
                    Node Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400 text-sm">Label:</span>
                      <p className="font-medium">{selectedNode.label}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Type:</span>
                      <Badge 
                        variant="outline" 
                        className="ml-2"
                        style={{ borderColor: getNodeTypeColor(selectedNode.type) }}
                      >
                        {selectedNode.type}
                      </Badge>
                    </div>
                    {selectedNode.data && (
                      <div>
                        <span className="text-gray-400 text-sm">Description:</span>
                        <p className="text-sm mt-1">
                          {selectedNode.data.description || selectedNode.data.text || 'No description available'}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Graph Visualization */}
          <div className="lg:col-span-3">
            <Card className="bg-gray-900 border-gray-700 h-[600px]">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {selectedArchive?.name} Network Graph
                  </CardTitle>
                  <Button size="sm" variant="outline">
                    <Maximize2 className="w-4 h-4 mr-1" />
                    Fullscreen
                  </Button>
                </div>
                <CardDescription>
                  Interactive visualization of archive items and their semantic relationships
                </CardDescription>
              </CardHeader>
              <CardContent className="h-full pb-6">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
                      <p className="text-gray-400">Loading graph data...</p>
                    </div>
                  </div>
                ) : (
                  <NetworkGraph
                    data={filteredGraphData()}
                    onNodeClick={handleNodeClick}
                    interactive={true}
                    showLabels={true}
                    width={800}
                    height={500}
                  />
                )}
              </CardContent>
            </Card>

            {/* Graph Legend */}
            <Card className="bg-gray-900 border-gray-700 mt-4">
              <CardHeader>
                <CardTitle>Legend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries({
                    'Items': '#F59E0B',
                    'Places': '#10B981',
                    'Periods': '#3B82F6',
                    'Entities': '#8B5CF6',
                    'Objects': '#F59E0B',
                    'Events': '#EF4444',
                    'Terms': '#6B7280'
                  }).map(([type, color]) => (
                    <div key={type} className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: color }}
                      ></div>
                      <span className="text-sm text-gray-300">{type}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle>Mobile Archive Unit</CardTitle>
              <CardDescription>RFID Reading and image capturing table</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400 mb-4">
                The Mobile Archive Unit bridges physical and digital archives through RFID tracking 
                and real-time digitization of materials.
              </p>
              <Button variant="outline" className="w-full">
                Learn More
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle>Linked Open Data</CardTitle>
              <CardDescription>Export and share semantic data</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400 mb-4">
                All annotations and connections are available as linked open data, 
                enabling interoperability with other cultural heritage systems.
              </p>
              <Button variant="outline" className="w-full">
                Access SPARQL Endpoint
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle>Collaborative Annotation</CardTitle>
              <CardDescription>Community-driven knowledge creation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400 mb-4">
                Multiple users can collaboratively annotate and enrich archive materials, 
                creating a shared knowledge graph.
              </p>
              <Button variant="outline" className="w-full">
                Start Annotating
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default GraphVisualization

