import { Button } from '@/components/ui/button'
import { Mail, ExternalLink } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Publish Section */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Publish</h3>
          <p className="text-gray-300 mb-2">Catching Up in the Archive, de Appel Amsterdam</p>
          <p className="text-sm text-gray-500 mb-6">
            Catching Up in the Archive, 2022, installation views. Photography: Johannes Schwartz
          </p>
          
          {/* Sample network visualization */}
          <div className="max-w-md mx-auto mb-8">
            <div className="bg-black rounded-lg p-6 border border-gray-700">
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div className="space-y-2">
                  <div className="bg-green-400 text-black px-2 py-1 rounded">Ragnar</div>
                  <div className="bg-blue-400 text-black px-2 py-1 rounded">Bjorn</div>
                </div>
                <div className="space-y-2">
                  <div className="bg-purple-400 text-black px-2 py-1 rounded">Harald</div>
                  <div className="bg-orange-400 text-black px-2 py-1 rounded">Ivar</div>
                </div>
                <div className="space-y-2">
                  <div className="bg-red-400 text-black px-2 py-1 rounded">Ubbe</div>
                  <div className="bg-yellow-400 text-black px-2 py-1 rounded">Hvitserk</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mb-12">
          <Button 
            size="lg"
            className="bg-green-400 text-black hover:bg-green-300 font-semibold px-8 py-3"
          >
            Sign up for future updates
          </Button>
        </div>

        {/* Credits Section */}
        <div className="bg-gray-800 rounded-lg p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Funding */}
            <div>
              <h4 className="font-semibold mb-4">Funding & Support</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>ACKnowledge - Advancing Co-creation of Knowledge</p>
                <p>NWA (Dutch Research Agenda)</p>
                <p>Creative Industries Fund NL</p>
                <p>MediaFutures - Horizon 2020</p>
                <p>European Union's research and innovation programme</p>
              </div>
            </div>

            {/* Partners */}
            <div>
              <h4 className="font-semibold mb-4">Partners & Collaborators</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>de Appel arts centre, Amsterdam</p>
                <p>Jan van Eyck Academie, Maastricht</p>
                <p>Framer Framed, Amsterdam</p>
                <p>Casa do Povo, São Paulo</p>
                <p>Yiddish Study Group</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <span>© 2024 Archival Consciousness</span>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>Marcusstraat 52 studio 3B, 1091 TK Amsterdam, The Netherlands</p>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Mail className="w-4 h-4" />
            <span>info[at]archivalconsciousness.org</span>
          </div>

          {/* Links */}
          <div className="flex justify-center gap-6 pt-4">
            <a 
              href="https://mediafutures.eu/projects/1st-cohort-projects/biblio-graph/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm"
            >
              MediaFutures Project
              <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="https://biblio-graph.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm"
            >
              Biblio-Graph.org
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Technical Info */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-xs text-gray-600">
            Built with React, D3.js, and Flask • Powered by Linked Open Data • 
            Semantic Web Technologies • SPARQL Endpoint Available
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

