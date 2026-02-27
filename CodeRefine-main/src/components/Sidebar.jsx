import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Code2, FolderOpen, User,
  ChevronLeft, ChevronRight,
} from 'lucide-react'

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/analyzer', label: 'Analyzer', icon: Code2 },
  { to: '/projects', label: 'Projects', icon: FolderOpen },
  { to: '/profile', label: 'Profile', icon: User },
]

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
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

            return (
              <div key={to}>
                <div
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                    active
                      ? 'bg-gradient-to-r from-blue-500/25 to-purple-600/20 border border-blue-500/30 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  } ${collapsed ? 'justify-center' : ''}`}
                  onClick={() => navigate(to)}
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
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </motion.aside>
  )
}

export default Sidebar
