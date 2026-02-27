import { motion } from 'framer-motion'

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 rounded-full border-2 border-white/10 border-t-blue-500"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-gray-400 text-sm"
      >
        Analyzing with AI...
      </motion.div>
    </div>
  )
}

export default LoadingSpinner
