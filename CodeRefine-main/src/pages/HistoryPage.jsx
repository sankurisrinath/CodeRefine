import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AppLayout from '../layouts/AppLayout'
import AnalysisCard from '../components/AnalysisCard'
import { getHistory } from '../services/api'

function HistoryPage() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLang, setFilterLang] = useState('')
  const [filterMode, setFilterMode] = useState('')

  useEffect(() => {
    getHistory()
      .then((data) => setHistory(data || []))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false))
  }, [])

  const transformItem = (item) => ({
    id: item.id,
    title: item.code_snippet ? item.code_snippet.split('\n')[0].slice(0, 60) : `${item.language} analysis`,
    language: item.language,
    mode: item.mode,
    confidence: item.confidence_score != null ? Math.round(item.confidence_score) : 0,
    date: item.created_at ? new Date(item.created_at).toLocaleDateString() : '',
    snippet: item.code_snippet ? item.code_snippet.split('\n')[0] : '',
  })

  const filtered = history
    .map(transformItem)
    .filter((item) => {
      const search = searchTerm.toLowerCase()
      const matchSearch = !search || item.title.toLowerCase().includes(search) || item.snippet.toLowerCase().includes(search)
      const matchLang = !filterLang || item.language.toLowerCase() === filterLang
      const matchMode = !filterMode || item.mode.toLowerCase().includes(filterMode)
      return matchSearch && matchLang && matchMode
    })

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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 max-w-md bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
          />
          <select
            value={filterLang}
            onChange={(e) => setFilterLang(e.target.value)}
            className="bg-white/5 border border-white/10 text-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="" className="bg-gray-900">All Languages</option>
            <option value="python" className="bg-gray-900">Python</option>
            <option value="java" className="bg-gray-900">Java</option>
            <option value="cpp" className="bg-gray-900">C++</option>
            <option value="javascript" className="bg-gray-900">JavaScript</option>
          </select>
          <select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
            className="bg-white/5 border border-white/10 text-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="" className="bg-gray-900">All Modes</option>
            <option value="bug" className="bg-gray-900">Bug Detection</option>
            <option value="security" className="bg-gray-900">Security Scan</option>
            <option value="performance" className="bg-gray-900">Performance</option>
          </select>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="shimmer-bg h-20 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-500">
            <span className="text-4xl">📭</span>
            <p className="text-base">No activity yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item, i) => (
              <AnalysisCard key={item.id} item={item} delay={i * 0.05} />
            ))}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <p className="text-center text-gray-500 text-sm mt-8">Showing {filtered.length} {filtered.length === 1 ? 'analysis' : 'analyses'}</p>
        )}
      </motion.div>
    </AppLayout>
  )
}

export default HistoryPage
