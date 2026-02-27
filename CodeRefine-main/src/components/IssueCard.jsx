import { motion } from 'framer-motion'
import SeverityBadge from './SeverityBadge'

function IssueCard({ issue, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="glass rounded-xl p-5 hover:border-white/20 transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <SeverityBadge severity={issue.severity} />
        <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-md font-mono">
          Line {issue.line}
        </span>
      </div>
      <p className="text-gray-200 font-medium mb-2 text-sm">{issue.message}</p>
      <div className="bg-white/5 rounded-lg p-3 mt-3">
        <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">Suggested Fix</p>
        <p className="text-gray-300 text-sm">{issue.suggestion}</p>
      </div>
    </motion.div>
  )
}

export default IssueCard
