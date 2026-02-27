import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import AppLayout from '../layouts/AppLayout'
import ChartWidget from '../components/ChartWidget'
import * as api from '../services/api'

function useCountUp(target, duration = 1200, delay = 0, started = true) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!started) return
    let startTime = null
    let frame
    const tick = (timestamp) => {
      if (!startTime) startTime = timestamp + delay
      const elapsed = Math.max(0, timestamp - startTime)
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration, delay, started])
  return count
}

function AnimatedMetricCard({ title, value, suffix = '', icon, color, delay, started }) {
  const count = useCountUp(value, 1200, delay * 1000, started)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay + 0.1 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="glass rounded-2xl p-6 flex items-center gap-4 hover:border-white/20 transition-all"
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-2xl font-bold text-white">
          {started ? count : 0}
          <span className="text-base text-gray-400 ml-1">{suffix}</span>
        </p>
      </div>
    </motion.div>
  )
}

function ShimmerCard({ className = '' }) {
  return (
    <div className={`glass rounded-2xl p-6 ${className}`}>
      <div className="shimmer-bg h-4 rounded-lg w-2/3 mb-3" />
      <div className="shimmer-bg h-8 rounded-lg w-1/2" />
    </div>
  )
}

function ShimmerChart({ className = '' }) {
  return (
    <div className={`glass rounded-2xl p-6 ${className}`}>
      <div className="shimmer-bg h-4 rounded-lg w-1/3 mb-4" />
      <div className="shimmer-bg h-48 rounded-xl w-full" />
    </div>
  )
}

function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState({ totalAnalyses: 0, projects: 0, avgConfidence: 0 })
  const [recentAnalyses, setRecentAnalyses] = useState([])
  const startedRef = useRef(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [historyData, projectsData] = await Promise.all([
          api.getHistory().catch(() => []),
          api.getProjects().catch(() => []),
        ])
        const total = historyData.length
        const avgConf = total > 0
          ? Math.round(historyData.reduce((s, h) => s + (h.confidence_score || 0), 0) / total)
          : 0
        setMetrics({ totalAnalyses: total, projects: projectsData.length, avgConfidence: avgConf })
        setRecentAnalyses(historyData.slice(0, 5))
      } catch {
        // leave defaults
      } finally {
        setLoading(false)
        startedRef.current = true
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6 max-w-[1400px] mx-auto">
          <div className="mb-8">
            <div className="shimmer-bg h-8 rounded-lg w-48 mb-2" />
            <div className="shimmer-bg h-4 rounded-lg w-72" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {[...Array(3)].map((_, i) => <ShimmerCard key={i} />)}
          </div>
          <ShimmerChart />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 max-w-[1400px] mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
          <p className="text-gray-400 mt-1">Your development overview</p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <AnimatedMetricCard title="Total Analyses" value={metrics.totalAnalyses} icon="🔍" color="from-blue-500 to-cyan-500" delay={0} started={!loading} />
          <AnimatedMetricCard title="Projects" value={metrics.projects} icon="📁" color="from-purple-500 to-pink-500" delay={0.05} started={!loading} />
          <AnimatedMetricCard title="Avg Confidence" value={metrics.avgConfidence} suffix="%" icon="🎯" color="from-green-500 to-emerald-500" delay={0.1} started={!loading} />
        </div>

        {/* Recent Analyses */}
        <ChartWidget title="Recent Analyses" delay={0.15}>
          {recentAnalyses.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No analyses yet. Start by analyzing some code!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 border-b border-white/5">
                    <th className="text-left pb-3 font-medium">Language</th>
                    <th className="text-left pb-3 font-medium">Mode</th>
                    
                    <th className="text-left pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAnalyses.map((item) => (
                    <tr key={item.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs">{item.language}</span></td>
                      <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs">{item.mode}</span></td>
                     
                      <td className="py-3 text-gray-400">{item.created_at ? new Date(item.created_at).toLocaleDateString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ChartWidget>
      </motion.div>
    </AppLayout>
  )
}

export default Dashboard
