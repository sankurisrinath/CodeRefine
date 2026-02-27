import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'

function AnalysisCard({ item, delay = 0 }) {
  const confidenceColor = item.confidence >= 90 ? 'text-green-400' : item.confidence >= 75 ? 'text-yellow-400' : 'text-red-400'
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="glass rounded-xl p-4 hover:border-white/20 transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-white truncate">{item.title}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 flex-shrink-0">{item.language}</span>
          </div>
          <p className="text-xs text-gray-500 font-mono truncate mb-2">{item.snippet}</p>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">{item.mode}</span>
            <span>{item.date}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className={`text-sm font-bold ${confidenceColor}`}>{item.confidence}%</span>
          <Link to="/analyzer" className="text-gray-500 hover:text-blue-400 transition-colors">
            <ExternalLink size={14} />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default AnalysisCard
