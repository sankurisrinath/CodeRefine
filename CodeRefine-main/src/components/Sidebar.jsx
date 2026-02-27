import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Code2, FolderOpen, BarChart3, User,
  ChevronLeft, ChevronRight, ChevronDown, Clock,
  Bug, Gauge, Shield, Sparkles, GitBranch, BookOpen
} from 'lucide-react'
import { analysisHistory } from '../data/mockData'

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/analyzer', label: 'Analyzer', icon: Code2 },
  { to: '/projects', label: 'Projects', icon: FolderOpen },
  { to: '/insights', label: 'Insights', icon: BarChart3 },
  { to: '/profile', label: 'Profile', icon: User },
]

const analyzerModes = [
  { icon: Bug, label: 'Bug Detection', mode: 'Bug Detection' },
  { icon: Shield, label: 'Security Scan', mode: 'Security Scan' },
  { icon: Gauge, label: 'Performance', mode: 'Performance' },
  { icon: Sparkles, label: 'Code Cleanup', mode: 'Code Cleanup' },
  { icon: GitBranch, label: 'Refactor Mode', mode: 'Refactor Mode' },
  { icon: BookOpen, label: 'Complexity', mode: 'Complexity Analysis' },
]

const recentAnalyses = analysisHistory.slice(0, 3)

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [analyzerExpanded, setAnalyzerExpanded] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => location.pathname === path || (path === '/analyzer' && location.pathname.startsWith('/analyzer'))

  return (
    <motion.aside
      animate={{ width: collapsed ? 60 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative flex-shrink-0 h-full bg-[#0d0d14] border-r border-white/10 overflow-hidden flex flex-col"
    >
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 z-10 w-6 h-6 rounded-full bg-[#1a1a2e] border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4">
        {/* Main nav links */}
        <div className="px-2 mb-4 space-y-0.5">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const active = isActive(to)
            const isAnalyzer = to === '/analyzer'

            return (
              <div key={to}>
                <div
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                    active
                      ? 'bg-gradient-to-r from-blue-500/25 to-purple-600/20 border border-blue-500/30 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  } ${collapsed ? 'justify-center' : ''}`}
                  onClick={() => {
                    if (isAnalyzer && !collapsed) {
                      setAnalyzerExpanded((p) => !p)
                    }
                    navigate(to)
                  }}
                >
                  {active && !collapsed && (
                    <span className="absolute left-2 h-5 w-0.5 rounded-full bg-blue-400" />
                  )}
                  <Icon size={16} className={`flex-shrink-0 ${active ? 'text-blue-400' : ''}`} />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="flex-1 text-sm font-medium whitespace-nowrap overflow-hidden"
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isAnalyzer && !collapsed && (
                    <ChevronDown
                      size={13}
                      className={`flex-shrink-0 transition-transform text-gray-500 ${analyzerExpanded ? 'rotate-180' : ''}`}
                    />
                  )}
                </div>

                {/* Analyzer sub-items */}
                {isAnalyzer && !collapsed && (
                  <AnimatePresence>
                    {analyzerExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-4 mt-0.5 space-y-0.5 border-l border-white/10 pl-3">
                          {analyzerModes.map(({ icon: ModeIcon, label: modeLabel, mode }) => (
                            <Link
                              key={mode}
                              to={`/analyzer?mode=${encodeURIComponent(mode)}`}
                              className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                            >
                              <ModeIcon size={12} className="flex-shrink-0" />
                              <span className="truncate">{modeLabel}</span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            )
          })}
        </div>

        {/* Recent Analyses */}
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-3 mt-2"
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock size={12} className="text-gray-500" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent</span>
            </div>
            <div className="space-y-1">
              {recentAnalyses.map((item) => (
                <Link
                  key={item.id}
                  to="/analyzer"
                  className="flex items-start gap-2 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors group"
                >
                  <span className="text-xs mt-0.5">📄</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-300 truncate group-hover:text-white transition-colors">{item.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs text-gray-500 truncate">{item.language}</span>
                      <span className="text-gray-600">·</span>
                      <span className="text-xs text-gray-600">{item.date}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.aside>
  )
}

export default Sidebar
