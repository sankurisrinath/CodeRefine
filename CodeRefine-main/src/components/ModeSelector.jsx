import { motion } from 'framer-motion'

const modes = [
  { id: 'bug', label: 'Bug Detection', icon: '🐛', description: 'Find bugs and logical errors' },
  { id: 'performance', label: 'Performance', icon: '⚡', description: 'Optimize code performance' },
  { id: 'security', label: 'Security Scan', icon: '🔒', description: 'Detect security vulnerabilities' },
  { id: 'cleanup', label: 'Code Cleanup', icon: '✨', description: 'Clean up code style' },
  { id: 'refactor', label: 'Refactor', icon: '🔄', description: 'Suggest refactoring patterns' },
  { id: 'explain', label: 'Explain Code', icon: '📖', description: 'Explain what code does' },
  { id: 'complexity', label: 'Complexity', icon: '📊', description: 'Analyze code complexity' },
  { id: 'convert', label: 'Code Convert', icon: '🔀', description: 'Convert between languages' },
]

function ModeSelector({ selectedMode, onSelect }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-400 mb-3">Analysis Mode</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {modes.map((mode) => (
          <motion.button
            key={mode.id}
            onClick={() => onSelect(mode.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-3 rounded-xl text-left transition-all border ${
              selectedMode === mode.id
                ? 'bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-blue-500/50 text-white'
                : 'glass border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
            }`}
          >
            <div className="text-lg mb-1">{mode.icon}</div>
            <div className="text-xs font-medium leading-tight">{mode.label}</div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default ModeSelector
