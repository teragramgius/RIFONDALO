import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Briefcase, 
  Palette, 
  MapPin, 
  Calendar, 
  Users, 
  ExternalLink, 
  Search,
  Filter,
  Grid,
  List,
  Clock
} from 'lucide-react'

const ProjectsView = ({ projects }) => {
  const [filteredProjects, setFilteredProjects] = useState(projects)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [yearFilter, setYearFilter] = useState('all')
  const [viewMode, setViewMode] = useState('grid') // grid, list, timeline
  const [sortBy, setSortBy] = useState('date-desc')

  useEffect(() => {
    let filtered = [...projects]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(project => project.category === categoryFilter)
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter)
    }

    // Year filter
    if (yearFilter !== 'all') {
      filtered = filtered.filter(project => {
        const year = new Date(project.start_date).getFullYear()
        return year.toString() === yearFilter
      })
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.start_date) - new Date(a.start_date)
        case 'date-asc':
          return new Date(a.start_date) - new Date(b.start_date)
        case 'title-asc':
          return a.title.localeCompare(b.title)
        case 'title-desc':
          return b.title.localeCompare(a.title)
        default:
          return 0
      }
    })

    setFilteredProjects(filtered)
  }, [projects, searchTerm, categoryFilter, statusFilter, yearFilter, sortBy])

  // Get unique years for filter
  const availableYears = [...new Set(
    projects.map(p => new Date(p.start_date).getFullYear()).filter(Boolean)
  )].sort((a, b) => b - a)

  const ProjectCard = ({ project, isListView = false }) => (
    <Card className={`card-professional ${isListView ? 'mb-4' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex gap-2 mb-2">
            <Badge 
              className={`${
                project.category === 'PM_Policy' 
                  ? 'category-pm-policy' 
                  : 'category-ux-design'
              }`}
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
        </div>
        <CardTitle className={`${isListView ? 'text-xl' : 'text-lg'} line-clamp-2`}>
          {project.title}
        </CardTitle>
        <CardDescription className="line-clamp-3">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`${isListView ? 'grid grid-cols-2 md:grid-cols-4 gap-4' : 'space-y-3'}`}>
          <div className="flex items-center gap-2 text-sm text-gray-cool">
            <Briefcase className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{project.role}</span>
          </div>
          {project.location && (
            <div className="flex items-center gap-2 text-sm text-gray-cool">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{project.location}</span>
            </div>
          )}
          {project.start_date && (
            <div className="flex items-center gap-2 text-sm text-gray-cool">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>{new Date(project.start_date).getFullYear()}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-cool">
            <Users className="w-4 h-4 flex-shrink-0" />
            <span>{project.people_count || 0} collaborators</span>
          </div>
        </div>
        
        {/* Skills/Tags */}
        {project.skills && project.skills.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-1">
              {project.skills.slice(0, isListView ? 8 : 4).map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {project.skills.length > (isListView ? 8 : 4) && (
                <Badge variant="outline" className="text-xs">
                  +{project.skills.length - (isListView ? 8 : 4)} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex gap-2 mt-4">
          {project.project_link && (
            <Button size="sm" variant="outline" className="flex-1">
              <ExternalLink className="w-4 h-4 mr-1" />
              Project
            </Button>
          )}
          {project.research_link && (
            <Button size="sm" variant="outline" className="flex-1">
              <ExternalLink className="w-4 h-4 mr-1" />
              Research
            </Button>
          )}
          {project.photos_link && (
            <Button size="sm" variant="outline" className="flex-1">
              <ExternalLink className="w-4 h-4 mr-1" />
              Photos
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  const TimelineView = () => (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-sand-dark"></div>
      
      <div className="space-y-8">
        {filteredProjects.map((project, index) => (
          <div key={project.id} className="relative flex items-start gap-8">
            {/* Timeline dot */}
            <div className={`w-4 h-4 rounded-full border-2 border-white shadow-md ${
              project.category === 'PM_Policy' ? 'bg-navy' : 'bg-orange'
            }`}></div>
            
            {/* Project card */}
            <div className="flex-1">
              <ProjectCard project={project} isListView={true} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container-professional">
        {/* Header */}
        <div className="mb-12">
          <h1 className="heading-primary text-navy-deep mb-4">Projects Portfolio</h1>
          <p className="text-professional text-xl max-w-3xl">
            A comprehensive collection of my work spanning project management, policy analysis, 
            and user experience design across various industries and contexts.
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-sand-dark mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-cool w-4 h-4" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="PM_Policy">PM & Policy</SelectItem>
                <SelectItem value="UX_Design">UX Design</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>

            {/* Year Filter */}
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {availableYears.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* View Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-cool">View:</span>
              <div className="flex border border-sand-dark rounded-lg overflow-hidden">
                <Button
                  size="sm"
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('grid')}
                  className="rounded-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('list')}
                  className="rounded-none"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'timeline' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('timeline')}
                  className="rounded-none"
                >
                  <Clock className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-cool">
                {filteredProjects.length} of {projects.length} projects
              </span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Newest First</SelectItem>
                  <SelectItem value="date-asc">Oldest First</SelectItem>
                  <SelectItem value="title-asc">Title A-Z</SelectItem>
                  <SelectItem value="title-desc">Title Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Projects Display */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-cool text-lg mb-4">No projects found</div>
            <p className="text-gray-cool">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}

            {viewMode === 'list' && (
              <div className="space-y-6">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} isListView={true} />
                ))}
              </div>
            )}

            {viewMode === 'timeline' && <TimelineView />}
          </>
        )}
      </div>
    </div>
  )
}

export default ProjectsView

