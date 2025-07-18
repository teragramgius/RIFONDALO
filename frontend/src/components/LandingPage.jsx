import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Briefcase, Palette, Users, MapPin, Calendar, ExternalLink } from 'lucide-react'
import NetworkGraph from './NetworkGraph'

const LandingPage = ({ projects, setCurrentView }) => {
  const [networkData, setNetworkData] = useState({ nodes: [], edges: [] })
  const [selectedTrack, setSelectedTrack] = useState(null)
  const [stats, setStats] = useState({})

  useEffect(() => {
    generateLandingNetworkData()
    calculateStats()
  }, [projects])

  const generateLandingNetworkData = () => {
    if (!projects.length) return

    // Create simplified network for landing page
    const nodes = []
    const edges = []

    // Add central node
    nodes.push({
      id: 'center',
      label: 'Professional Portfolio',
      type: 'center',
      x: 0,
      y: 0
    })

    // Add category nodes
    const pmProjects = projects.filter(p => p.category === 'PM_Policy')
    const uxProjects = projects.filter(p => p.category === 'UX_Design')

    if (pmProjects.length > 0) {
      nodes.push({
        id: 'pm-policy',
        label: 'Project Management\n& Policy',
        type: 'category',
        category: 'PM_Policy',
        count: pmProjects.length,
        x: -200,
        y: -100
      })
      edges.push({ source: 'center', target: 'pm-policy' })
    }

    if (uxProjects.length > 0) {
      nodes.push({
        id: 'ux-design',
        label: 'UX & Service\nDesign',
        type: 'category',
        category: 'UX_Design',
        count: uxProjects.length,
        x: 200,
        y: -100
      })
      edges.push({ source: 'center', target: 'ux-design' })
    }

    // Add sample project nodes
    const sampleProjects = projects.slice(0, 6)
    sampleProjects.forEach((project, index) => {
      const angle = (index * 2 * Math.PI) / sampleProjects.length
      const radius = 250
      nodes.push({
        id: `project-${project.id}`,
        label: project.title.length > 30 ? project.title.substring(0, 30) + '...' : project.title,
        type: 'project',
        category: project.category,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        data: project
      })
      edges.push({ source: 'center', target: `project-${project.id}` })
    })

    setNetworkData({ nodes, edges })
  }

  const calculateStats = () => {
    if (!projects.length) return

    const pmProjects = projects.filter(p => p.category === 'PM_Policy')
    const uxProjects = projects.filter(p => p.category === 'UX_Design')
    const completedProjects = projects.filter(p => p.status === 'completed')
    const ongoingProjects = projects.filter(p => p.status === 'ongoing')

    // Get unique locations
    const locations = [...new Set(projects.map(p => p.location).filter(Boolean))]
    
    // Get years of experience
    const years = projects.map(p => new Date(p.start_date).getFullYear()).filter(Boolean)
    const yearsRange = years.length > 0 ? Math.max(...years) - Math.min(...years) + 1 : 0

    setStats({
      totalProjects: projects.length,
      pmProjects: pmProjects.length,
      uxProjects: uxProjects.length,
      completedProjects: completedProjects.length,
      ongoingProjects: ongoingProjects.length,
      locations: locations.length,
      yearsExperience: yearsRange
    })
  }

  const handleNodeClick = (node) => {
    if (node.type === 'category') {
      setSelectedTrack(node.category)
    } else if (node.type === 'project') {
      // Could navigate to project detail
      console.log('Project clicked:', node.data)
    }
  }

  const trackData = {
    'PM_Policy': {
      title: 'Project Management & Policy',
      description: 'Strategic leadership in complex projects, policy analysis, and stakeholder engagement across public and private sectors.',
      skills: ['Strategic Planning', 'Stakeholder Management', 'Policy Analysis', 'Program Management', 'Change Management'],
      color: 'navy',
      icon: <Briefcase className="w-8 h-8" />
    },
    'UX_Design': {
      title: 'UX & Service Design',
      description: 'Human-centered design solutions, user research, and service innovation for digital products and experiences.',
      skills: ['User Research', 'Service Design', 'Prototyping', 'Design Systems', 'Accessibility'],
      color: 'orange',
      icon: <Palette className="w-8 h-8" />
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section-padding pt-32 bg-gradient-napoli relative overflow-hidden">
        <div className="container-professional">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="heading-primary text-navy-deep">
                  Strategic Leadership
                  <span className="text-gradient-napoli block">
                    Meets Creative Innovation
                  </span>
                </h1>
                <p className="text-professional text-xl">
                  Bridging the gap between strategic project management and human-centered design 
                  to deliver impactful solutions for complex challenges.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-navy">{stats.totalProjects || 0}</div>
                  <div className="text-sm text-gray-cool">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-navy">{stats.yearsExperience || 0}</div>
                  <div className="text-sm text-gray-cool">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-navy">{stats.locations || 0}</div>
                  <div className="text-sm text-gray-cool">Countries</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  className="btn-primary font-semibold px-8 py-4"
                  onClick={() => setCurrentView('projects')}
                >
                  View All Projects
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  size="lg"
                  className="btn-outline font-semibold px-8 py-4"
                  onClick={() => setCurrentView('network')}
                >
                  Explore Network
                </Button>
              </div>
            </div>

            {/* Network Visualization */}
            <div className="relative">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <NetworkGraph 
                  data={networkData}
                  onNodeClick={handleNodeClick}
                  interactive={true}
                  showLabels={true}
                  width={500}
                  height={400}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Track Section */}
      <section className="section-padding bg-white">
        <div className="container-professional">
          <div className="text-center mb-16">
            <h2 className="heading-secondary text-navy-deep mb-4">
              Dual Expertise, Unified Approach
            </h2>
            <p className="text-professional max-w-3xl mx-auto">
              My unique background spans both strategic project management and creative design, 
              enabling me to tackle complex challenges from multiple perspectives.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {Object.entries(trackData).map(([key, track]) => (
              <Card 
                key={key}
                className={`card-professional cursor-pointer transition-all duration-300 ${
                  selectedTrack === key ? 'ring-2 ring-orange' : ''
                }`}
                onClick={() => setSelectedTrack(selectedTrack === key ? null : key)}
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${
                      track.color === 'navy' ? 'bg-navy text-white' : 'bg-orange text-navy-deep'
                    }`}>
                      {track.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{track.title}</CardTitle>
                      <CardDescription className="text-base">
                        {stats[key === 'PM_Policy' ? 'pmProjects' : 'uxProjects'] || 0} projects
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-cool mb-6">{track.description}</p>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-navy-deep">Key Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {track.skills.map((skill) => (
                        <Badge 
                          key={skill}
                          variant="outline"
                          className={`${
                            track.color === 'navy' 
                              ? 'border-navy text-navy' 
                              : 'border-orange text-orange'
                          }`}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Projects Preview */}
      <section className="section-padding bg-sand-light">
        <div className="container-professional">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="heading-secondary text-navy-deep mb-2">Recent Work</h2>
              <p className="text-professional">
                A selection of recent projects showcasing both tracks
              </p>
            </div>
            <Button 
              className="btn-outline"
              onClick={() => setCurrentView('projects')}
            >
              View All Projects
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.slice(0, 6).map((project) => (
              <Card key={project.id} className="card-professional">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge 
                      className={`${
                        project.category === 'PM_Policy' 
                          ? 'category-pm-policy' 
                          : 'category-ux-design'
                      } mb-2`}
                    >
                      {project.category === 'PM_Policy' ? 'PM & Policy' : 'UX Design'}
                    </Badge>
                    <Badge 
                      variant="outline"
                      className={`status-${project.status}`}
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-cool">
                      <Briefcase className="w-4 h-4" />
                      <span>{project.role}</span>
                    </div>
                    {project.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-cool">
                        <MapPin className="w-4 h-4" />
                        <span>{project.location}</span>
                      </div>
                    )}
                    {project.start_date && (
                      <div className="flex items-center gap-2 text-sm text-gray-cool">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(project.start_date).getFullYear()}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    {project.project_link && (
                      <Button size="sm" variant="outline" className="flex-1">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View Project
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-navy text-white">
        <div className="container-professional text-center">
          <h2 className="heading-secondary mb-4">Ready to Collaborate?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Whether you need strategic project leadership or innovative design solutions, 
            let's discuss how we can work together to achieve your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-orange text-navy-deep hover:bg-orange-warm font-semibold px-8 py-4"
              onClick={() => setCurrentView('contact')}
            >
              Get In Touch
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-navy font-semibold px-8 py-4"
              onClick={() => setCurrentView('about')}
            >
              Learn More About Me
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage

