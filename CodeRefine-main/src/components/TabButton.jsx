import { motion } from 'framer-motion'

function TabButton({ label, isActive, onClick, count }) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-2.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
        isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
      }`}
    >
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30"
          transition={{ type: 'spring', duration: 0.4 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        {label}
        {count !== undefined && count > 0 && (
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-blue-500/30 text-blue-300' : 'bg-white/10 text-gray-500'}`}>
            {count}
          </span>
        )}
      </span>
    </button>
  )
}

export default TabButton
