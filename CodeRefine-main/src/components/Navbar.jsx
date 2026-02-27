import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Code2, FolderOpen, History, BarChart3, ChevronDown, User, Settings, LogOut, Search } from 'lucide-react'
import { searchResults } from '../data/mockData'
import * as api from "../services/api"


function Navbar() {
  const [profile,setProfile] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const dropdownRef = useRef(null)
  const searchRef = useRef(null)
  const isLanding = location.pathname === '/'

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(()=> {
    async function loadprofile(){
      const data = await api.getProfile()
      setProfile(data)
    }
    loadprofile()
  })


  const appNavLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/analyzer', label: 'Analyzer', icon: Code2 },
    { to: '/projects', label: 'Projects', icon: FolderOpen },
    { to: '/history', label: 'History', icon: History },
    { to: '/insights', label: 'Insights', icon: BarChart3 },
  ]

  const filteredResults = searchQuery.trim().length > 0
    ? searchResults.filter(
        (r) =>
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : []

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10"
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">CR</span>
            </div>
            <span className="font-bold text-lg gradient-text">CodeRefine</span>
          </Link>

          {isLanding ? (
            <div className="flex items-center gap-4">
              <Link to="/" className="text-sm font-medium text-blue-400">Home</Link>
              <Link to="/analyzer" className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all">
                Try Now
              </Link>
            </div>
          ) : (
            <>
              {/* Global Search */}
              <div className="relative flex-1 max-w-sm hidden md:block" ref={searchRef}>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true) }}
                    onFocus={() => setSearchOpen(true)}
                    placeholder="Search analyses, projects..."
                    className="w-full glass border-white/15 rounded-xl pl-8 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <AnimatePresence>
                  {searchOpen && filteredResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full mt-2 w-full glass rounded-xl border border-white/10 overflow-hidden shadow-xl z-50"
                    >
                      {filteredResults.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => {
                            setSearchOpen(false)
                            setSearchQuery('')
                            navigate(result.type === 'Project' ? '/projects' : '/analyzer')
                          }}
                          className="w-full flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                        >
                          <span className="text-lg flex-shrink-0">{result.type === 'Project' ? '📁' : '🔍'}</span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">{result.title}</p>
                            <p className="text-xs text-gray-400">{result.description}</p>
                          </div>
                          <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 flex-shrink-0">{result.type}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Nav links */}
              <div className="flex items-center gap-1">
                {appNavLinks.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      location.pathname === to
                        ? 'bg-white/10 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={15} />
                    <span className="hidden sm:inline">{label}</span>
                  </Link>
                ))}
                <div className="relative ml-2" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 transition-all"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                      AJ
                    </div>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-48 glass rounded-xl border border-white/10 overflow-hidden shadow-xl"
                      >
                        <div className="px-4 py-3 border-b border-white/10">
                          <p className="text-sm font-medium text-white">{profile.full_name}</p>
                          <p className="text-xs text-gray-400">{profile.email}</p>
                        </div>
                        <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                          <User size={14} /> View Profile
                        </Link>
                        <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                          <Settings size={14} /> Settings
                        </button>
                        <button onClick={() => { setProfileOpen(false); navigate('/') }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors border-t border-white/10">
                          <LogOut size={14} /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
