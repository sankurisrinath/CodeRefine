import { motion } from 'framer-motion'

function ChartWidget({ title, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass rounded-2xl p-6"
    >
      <h3 className="text-base font-semibold text-white mb-4">{title}</h3>
      {children}
    </motion.div>
  )
}

export default ChartWidget
