import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Network, 
  Filter, 
  Download, 
  Share2, 
  Info, 
  Users, 
  Briefcase,
  MapPin,
  Calendar,
  Target,
  Zap
} from 'lucide-react'
import NetworkGraph from './NetworkGraph'

const NetworkView = ({ projects }) => {
  const [networkData, setNetworkData] = useState({ nodes: [], edges: [] })
  const [selectedNode, setSelectedNode] = useState(null)
  const [filters, setFilters] = useState({
    showProjects: true,
    showPeople: true,
    showConnections: true,
    category: 'all',
    minStrength: 0.3,
    timeRange: 'all'
  })
  const [stats, setStats] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    generateNetworkData()
  }, [projects, filters])

  const generateNetworkData = async () => {
    setIsLoading(true)
    
    try {
      // Simulate API call for network data
      const nodes = []
      const edges = []
      
      // Add project nodes
      if (filters.showProjects) {
        const filteredProjects = projects.filter(project => {
          if (filters.category !== 'all' && project.category !== filters.category) return false
          if (filters.timeRange !== 'all') {
            const year = new Date(project.start_date).getFullYear()
            if (filters.timeRange === 'recent' && year < 2022) return false
            if (filters.timeRange === 'older' && year >= 2022) return false
          }
          return true
        })

        filteredProjects.forEach(project => {
          nodes.push({
            id: `project-${project.id}`,
            label: project.title.length > 40 ? project.title.substring(0, 40) + '...' : project.title,
            type: 'project',
            category: project.category,
            data: project,
            size: 15 + (project.people_count || 0) * 2,
            color: project.category === 'PM_Policy' ? '#1B365D' : '#D4A574'
          })
        })
      }

      // Add people nodes (simulated)
      if (filters.showPeople) {
        const people = [
          { id: 'person-1', name: 'Marco Rossi', role: 'Client', organization: 'Regional Government' },
          { id: 'person-2', name: 'Anna Bianchi', role: 'Technical Lead', organization: 'TechConsult' },
          { id: 'person-3', name: 'Dr. Giuseppe Verde', role: 'Medical Director', organization: 'Hospital' },
          { id: 'person-4', name: 'Laura Neri', role: 'UX Researcher', organization: 'Freelance' },
          { id: 'person-5', name: 'Jean-Pierre Dubois', role: 'Policy Advisor', organization: 'EU Commission' },
          { id: 'person-6', name: 'Alessandro Conti', role: 'Product Manager', organization: 'BancaDigitale' },
          { id: 'person-7', name: 'Francesca Lombardi', role: 'Mayor', organization: 'City of Turin' },
          { id: 'person-8', name: 'Roberto Ferrari', role: 'CEO', organization: 'ShopItalia' }
        ]

        people.forEach(person => {
          nodes.push({
            id: person.id,
            label: person.name,
            type: 'person',
            data: person,
            size: 12,
            color: '#718096'
          })
        })
      }

      // Add skill/domain nodes
      const skills = ['Digital Transformation', 'User Research', 'Policy Analysis', 'Service Design', 'Project Management']
      skills.forEach((skill, index) => {
        nodes.push({
          id: `skill-${index}`,
          label: skill,
          type: 'skill',
          data: { name: skill },
          size: 10,
          color: '#E8DDD4'
        })
      })

      // Add connections
      if (filters.showConnections) {
        // Project-person connections
        const connections = [
          { source: 'project-1', target: 'person-1', strength: 0.9, type: 'collaboration' },
          { source: 'project-1', target: 'person-2', strength: 0.8, type: 'collaboration' },
          { source: 'project-2', target: 'person-3', strength: 0.9, type: 'collaboration' },
          { source: 'project-2', target: 'person-4', strength: 0.7, type: 'collaboration' },
          { source: 'project-3', target: 'person-5', strength: 0.8, type: 'collaboration' },
          { source: 'project-4', target: 'person-6', strength: 0.9, type: 'collaboration' },
          { source: 'project-5', target: 'person-7', strength: 0.8, type: 'collaboration' },
          { source: 'project-6', target: 'person-8', strength: 0.7, type: 'collaboration' }
        ]

        // Project-skill connections
        const skillConnections = [
          { source: 'project-1', target: 'skill-0', strength: 0.9, type: 'skill' },
          { source: 'project-1', target: 'skill-4', strength: 0.8, type: 'skill' },
          { source: 'project-2', target: 'skill-1', strength: 0.9, type: 'skill' },
          { source: 'project-2', target: 'skill-3', strength: 0.8, type: 'skill' },
          { source: 'project-3', target: 'skill-2', strength: 0.9, type: 'skill' },
          { source: 'project-4', target: 'skill-1', strength: 0.8, type: 'skill' },
          { source: 'project-5', target: 'skill-0', strength: 0.7, type: 'skill' },
          { source: 'project-6', target: 'skill-1', strength: 0.8, type: 'skill' }
        ]

        // Project-project connections (based on shared skills/people)
        const projectConnections = [
          { source: 'project-1', target: 'project-5', strength: 0.6, type: 'domain' },
          { source: 'project-2', target: 'project-4', strength: 0.7, type: 'skills' },
          { source: 'project-2', target: 'project-6', strength: 0.5, type: 'skills' }
        ]

        const allConnections = [...connections, ...skillConnections, ...projectConnections]
        
        allConnections.forEach(conn => {
          if (conn.strength >= filters.minStrength) {
            edges.push({
              source: conn.source,
              target: conn.target,
              strength: conn.strength,
              type: conn.type,
              color: conn.type === 'collaboration' ? '#D4A574' : 
                     conn.type === 'skill' ? '#1B365D' : '#718096'
            })
          }
        })
      }

      setNetworkData({ nodes, edges })
      
      // Calculate stats
      const projectNodes = nodes.filter(n => n.type === 'project')
      const personNodes = nodes.filter(n => n.type === 'person')
      const skillNodes = nodes.filter(n => n.type === 'skill')
      
      setStats({
        totalNodes: nodes.length,
        projectNodes: projectNodes.length,
        personNodes: personNodes.length,
        skillNodes: skillNodes.length,
        totalConnections: edges.length,
        avgConnections: edges.length > 0 ? (edges.length / nodes.length).toFixed(1) : 0
      })
      
    } catch (error) {
      console.error('Error generating network data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNodeClick = (node) => {
    setSelectedNode(node)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const exportNetwork = () => {
    const dataStr = JSON.stringify(networkData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'portfolio-network.json'
    link.click()
  }

  const shareNetwork = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Portfolio Network Visualization',
        text: 'Check out my professional network visualization',
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      // Could show a toast notification here
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container-professional">
        {/* Header */}
        <div className="mb-8">
          <h1 className="heading-primary text-navy-deep mb-4">Network Visualization</h1>
          <p className="text-professional text-xl max-w-3xl">
            Explore the interconnected relationships between projects, collaborators, and skills 
            that form my professional network.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1">
            <Card className="card-professional sticky top-32">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Network Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Node Type Filters */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-navy-deep">Show Elements</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Projects</label>
                      <Switch
                        checked={filters.showProjects}
                        onCheckedChange={(checked) => handleFilterChange('showProjects', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm">People</label>
                      <Switch
                        checked={filters.showPeople}
                        onCheckedChange={(checked) => handleFilterChange('showPeople', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Connections</label>
                      <Switch
                        checked={filters.showConnections}
                        onCheckedChange={(checked) => handleFilterChange('showConnections', checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Category Filter */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-navy-deep">Category</h4>
                  <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="PM_Policy">PM & Policy</SelectItem>
                      <SelectItem value="UX_Design">UX Design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Time Range Filter */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-navy-deep">Time Range</h4>
                  <Select value={filters.timeRange} onValueChange={(value) => handleFilterChange('timeRange', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="recent">Recent (2022+)</SelectItem>
                      <SelectItem value="older">Older (Pre-2022)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Connection Strength */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-navy-deep">Min Connection Strength</h4>
                  <Slider
                    value={[filters.minStrength]}
                    onValueChange={([value]) => handleFilterChange('minStrength', value)}
                    max={1}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-cool text-center">
                    {(filters.minStrength * 100).toFixed(0)}%
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-4 border-t border-sand-dark">
                  <Button onClick={exportNetwork} variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <Button onClick={shareNetwork} variant="outline" className="w-full">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Network
                  </Button>
                </div>

                {/* Stats */}
                <div className="space-y-2 pt-4 border-t border-sand-dark">
                  <h4 className="font-semibold text-navy-deep">Network Stats</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center p-2 bg-sand-light rounded">
                      <div className="font-semibold text-navy">{stats.totalNodes}</div>
                      <div className="text-gray-cool">Nodes</div>
                    </div>
                    <div className="text-center p-2 bg-sand-light rounded">
                      <div className="font-semibold text-navy">{stats.totalConnections}</div>
                      <div className="text-gray-cool">Links</div>
                    </div>
                    <div className="text-center p-2 bg-sand-light rounded">
                      <div className="font-semibold text-navy">{stats.projectNodes}</div>
                      <div className="text-gray-cool">Projects</div>
                    </div>
                    <div className="text-center p-2 bg-sand-light rounded">
                      <div className="font-semibold text-navy">{stats.personNodes}</div>
                      <div className="text-gray-cool">People</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Network Visualization */}
          <div className="lg:col-span-3">
            <Card className="card-professional">
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex items-center justify-center h-96">
                    <div className="text-gray-cool">Loading network...</div>
                  </div>
                ) : (
                  <div className="relative">
                    <NetworkGraph
                      data={networkData}
                      onNodeClick={handleNodeClick}
                      interactive={true}
                      showLabels={true}
                      showLegend={true}
                      width={800}
                      height={600}
                    />
                    
                    {/* Network Info Overlay */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm">
                      <div className="flex items-center gap-2 text-sm text-gray-cool">
                        <Network className="w-4 h-4" />
                        <span>{stats.totalNodes} nodes, {stats.totalConnections} connections</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Selected Node Details */}
            {selectedNode && (
              <Card className="card-professional mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {selectedNode.type === 'project' && <Briefcase className="w-5 h-5" />}
                    {selectedNode.type === 'person' && <Users className="w-5 h-5" />}
                    {selectedNode.type === 'skill' && <Target className="w-5 h-5" />}
                    {selectedNode.label}
                  </CardTitle>
                  <CardDescription>
                    {selectedNode.type === 'project' && 'Project Details'}
                    {selectedNode.type === 'person' && 'Collaborator Information'}
                    {selectedNode.type === 'skill' && 'Skill/Domain Area'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedNode.type === 'project' && selectedNode.data && (
                    <div className="space-y-4">
                      <p className="text-gray-cool">{selectedNode.data.description}</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-gray-cool" />
                          <span className="text-sm">{selectedNode.data.role}</span>
                        </div>
                        {selectedNode.data.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-cool" />
                            <span className="text-sm">{selectedNode.data.location}</span>
                          </div>
                        )}
                        {selectedNode.data.start_date && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-cool" />
                            <span className="text-sm">{new Date(selectedNode.data.start_date).getFullYear()}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-gray-cool" />
                          <span className="text-sm">{selectedNode.data.status}</span>
                        </div>
                      </div>
                      <Badge className={selectedNode.data.category === 'PM_Policy' ? 'category-pm-policy' : 'category-ux-design'}>
                        {selectedNode.data.category === 'PM_Policy' ? 'PM & Policy' : 'UX Design'}
                      </Badge>
                    </div>
                  )}
                  
                  {selectedNode.type === 'person' && selectedNode.data && (
                    <div className="space-y-2">
                      <div><strong>Role:</strong> {selectedNode.data.role}</div>
                      <div><strong>Organization:</strong> {selectedNode.data.organization}</div>
                    </div>
                  )}
                  
                  {selectedNode.type === 'skill' && selectedNode.data && (
                    <div>
                      <p className="text-gray-cool">Core competency area used across multiple projects</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NetworkView

