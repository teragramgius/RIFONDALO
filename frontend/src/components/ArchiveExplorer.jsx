import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, FileText, Tag, Calendar, MapPin, Users } from 'lucide-react'

const ArchiveExplorer = ({ archives }) => {
  const [selectedArchive, setSelectedArchive] = useState(null)
  const [items, setItems] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // grid, list, timeline

  useEffect(() => {
    if (archives.length > 0 && !selectedArchive) {
      setSelectedArchive(archives[0])
    }
  }, [archives])

  useEffect(() => {
    if (selectedArchive) {
      fetchArchiveItems(selectedArchive.slug)
    }
  }, [selectedArchive])

  const fetchArchiveItems = async (archiveSlug) => {
    setLoading(true)
    try {
      const response = await fetch(`https://zmhqivcveqyg.manus.space/api/archives/${archiveSlug}/items`)
      const data = await response.json()
      setItems(data.items || [])
    } catch (error) {
      console.error('Error fetching archive items:', error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const annotationTypeColors = {
    'Place': '#10B981',
    'Period': '#3B82F6', 
    'Entity': '#8B5CF6',
    'Objects': '#F59E0B',
    'Events': '#EF4444',
    'Terms': '#6B7280'
  }

  const getAnnotationIcon = (type) => {
    switch (type) {
      case 'Place': return <MapPin className="w-3 h-3" />
      case 'Period': return <Calendar className="w-3 h-3" />
      case 'Entity': return <Users className="w-3 h-3" />
      case 'Objects': return <FileText className="w-3 h-3" />
      case 'Events': return <Calendar className="w-3 h-3" />
      case 'Terms': return <Tag className="w-3 h-3" />
      default: return <Tag className="w-3 h-3" />
    }
  }

  return (
    <section className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            See Biblio-Graph in use
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore the archives and discover how collections are transformed into interactive data networks
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

        {/* Search and View Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search items, descriptions, content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            />
          </div>
          
          <div className="flex gap-2">
            {['grid', 'list', 'timeline'].map((mode) => (
              <Button
                key={mode}
                variant={viewMode === mode ? 'default' : 'outline'}
                onClick={() => setViewMode(mode)}
                className="capitalize"
              >
                {mode}
              </Button>
            ))}
          </div>
        </div>

        {/* Archive Info */}
        {selectedArchive && (
          <Card className="mb-8 bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: selectedArchive.color }}
                ></div>
                {selectedArchive.name}
              </CardTitle>
              <CardDescription className="text-gray-300">
                {selectedArchive.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <span>{items.length} items</span>
                <span>•</span>
                <span>Last updated: {new Date().toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading archive items...</p>
          </div>
        )}

        {/* Items Grid/List */}
        {!loading && (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredItems.map((item) => (
              <Card key={item.id} className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{item.title}</CardTitle>
                      {item.code && (
                        <Badge variant="outline" className="text-xs mb-2">
                          {item.code}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {item.description && (
                    <CardDescription className="text-gray-300">
                      {item.description}
                    </CardDescription>
                  )}
                </CardHeader>
                
                <CardContent>
                  {/* Content Preview */}
                  {item.content && (
                    <p className="text-sm text-gray-400 mb-4 line-clamp-3">
                      {item.content.substring(0, 150)}...
                    </p>
                  )}

                  {/* Annotations */}
                  {item.annotation_count > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">
                        {item.annotation_count} annotations
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(annotationTypeColors).map(([type, color]) => (
                          <Badge
                            key={type}
                            variant="outline"
                            className="text-xs flex items-center gap-1"
                            style={{ borderColor: color, color: color }}
                          >
                            {getAnnotationIcon(type)}
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    {item.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1">
                      View Details
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      style={{ backgroundColor: selectedArchive?.color, color: 'black' }}
                    >
                      Annotate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No items found</h3>
            <p className="text-gray-500">
              {searchQuery 
                ? `No items match "${searchQuery}"`
                : 'This archive doesn\'t have any items yet.'
              }
            </p>
          </div>
        )}

        {/* System Description */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4">The Biblio-Graph system</h3>
          <p className="text-gray-300 max-w-4xl mx-auto mb-8">
            Biblio-graph is part of an ongoing method to translate the collections of cultural 
            libraries and archives into data, using the Mobile Archive Unit as a bridge between 
            physical and digital realms. The system enables collaborative annotation, voice recording, 
            and semantic linking of archival materials.
          </p>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="p-6 bg-gray-900 rounded-lg border border-gray-700">
              <Tag className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Semantic Annotation</h4>
              <p className="text-sm text-gray-400">
                6 annotation categories: Place, Period, Entity, Objects, Events, and Terms
              </p>
            </div>
            
            <div className="p-6 bg-gray-900 rounded-lg border border-gray-700">
              <FileText className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Voice Recording</h4>
              <p className="text-sm text-gray-400">
                Record fragments of text with automatic transcription and linking
              </p>
            </div>
            
            <div className="p-6 bg-gray-900 rounded-lg border border-gray-700">
              <Users className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Linked Open Data</h4>
              <p className="text-sm text-gray-400">
                Export datasets as linked open data for interoperability and reuse
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ArchiveExplorer

