import { motion } from 'framer-motion'

function MetricCard({ title, value, suffix = '', icon, color = 'from-blue-500 to-purple-600', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="glass rounded-2xl p-6 flex items-center gap-4 hover:border-white/20 transition-all"
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-2xl font-bold text-white">
          {value}<span className="text-base text-gray-400 ml-1">{suffix}</span>
        </p>
      </div>
    </motion.div>
  )
}

export default MetricCard
