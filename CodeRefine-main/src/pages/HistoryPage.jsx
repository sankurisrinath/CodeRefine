import { motion } from 'framer-motion'
import AppLayout from '../layouts/AppLayout'
import AnalysisCard from '../components/AnalysisCard'
import { analysisHistory } from '../data/mockData'

function HistoryPage() {
  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 max-w-[1400px] mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text">Analysis History</h1>
          <p className="text-gray-400 mt-1">Review and re-open your past analyses</p>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search analyses..."
            className="flex-1 max-w-md bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
          />
          <select className="bg-white/5 border border-white/10 text-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 cursor-pointer">
            <option value="" className="bg-gray-900">All Languages</option>
            <option value="python" className="bg-gray-900">Python</option>
            <option value="java" className="bg-gray-900">Java</option>
            <option value="cpp" className="bg-gray-900">C++</option>
          </select>
          <select className="bg-white/5 border border-white/10 text-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 cursor-pointer">
            <option value="" className="bg-gray-900">All Modes</option>
            <option value="bug" className="bg-gray-900">Bug Detection</option>
            <option value="security" className="bg-gray-900">Security Scan</option>
            <option value="performance" className="bg-gray-900">Performance</option>
          </select>
        </div>

        <div className="space-y-3">
          {analysisHistory.map((item, i) => (
            <AnalysisCard key={item.id} item={item} delay={i * 0.05} />
          ))}
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">Showing {analysisHistory.length} analyses</p>
      </motion.div>
    </AppLayout>
  )
}

export default HistoryPage
