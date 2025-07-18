import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

const Header = ({ currentView, setCurrentView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'projects', label: 'Projects' },
    { id: 'network', label: 'Network' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-sand-dark shadow-sm">
      <div className="container-professional py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Name */}
          <div 
            className="text-2xl font-bold text-navy cursor-pointer hover:text-orange transition-colors"
            onClick={() => setCurrentView('landing')}
          >
            Your Name
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentView === item.id
                    ? 'bg-navy text-white'
                    : 'text-navy-light hover:text-navy hover:bg-sand'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button 
              className="btn-secondary font-semibold"
              onClick={() => setCurrentView('contact')}
            >
              Let's Work Together
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-navy p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-sand-dark">
            <nav className="flex flex-col space-y-2 mt-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id)
                    setIsMenuOpen(false)
                  }}
                  className={`px-4 py-3 rounded-lg text-left font-medium transition-all duration-200 ${
                    currentView === item.id
                      ? 'bg-navy text-white'
                      : 'text-navy-light hover:text-navy hover:bg-sand'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <Button 
                className="btn-secondary font-semibold mt-4"
                onClick={() => {
                  setCurrentView('contact')
                  setIsMenuOpen(false)
                }}
              >
                Let's Work Together
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header

