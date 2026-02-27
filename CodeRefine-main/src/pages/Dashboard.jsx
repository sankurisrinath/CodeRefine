import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import AppLayout from '../layouts/AppLayout'
import ChartWidget from '../components/ChartWidget'
import { dashboardMetrics, insightsData, analysisHistory } from '../data/mockData'

const COLORS = ['#60a5fa', '#a855f7', '#34d399', '#f97316', '#ec4899']

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
  const [dateFilter, setDateFilter] = useState('Last 30 Days')
  const startedRef = useRef(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
      startedRef.current = true
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6 max-w-[1400px] mx-auto">
          <div className="mb-8">
            <div className="shimmer-bg h-8 rounded-lg w-48 mb-2" />
            <div className="shimmer-bg h-4 rounded-lg w-72" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
            {[...Array(5)].map((_, i) => <ShimmerCard key={i} />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => <ShimmerChart key={i} />)}
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
        <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
            <p className="text-gray-400 mt-1">Your development insights at a glance</p>
          </div>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-white/10 border border-white/20 text-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option className="bg-gray-900">Last 7 Days</option>
            <option className="bg-gray-900">Last 30 Days</option>
            <option className="bg-gray-900">Last 90 Days</option>
            <option className="bg-gray-900">All Time</option>
          </select>
        </div>

        {/* Animated Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          <AnimatedMetricCard title="Total Analyses" value={dashboardMetrics.totalAnalyses} icon="🔍" color="from-blue-500 to-cyan-500" delay={0} started={!loading} />
          <AnimatedMetricCard title="Bugs Detected" value={dashboardMetrics.bugsDetected} icon="🐛" color="from-red-500 to-orange-500" delay={0.05} started={!loading} />
          <AnimatedMetricCard title="Performance Gains" value={dashboardMetrics.performanceGains} suffix="%" icon="⚡" color="from-yellow-500 to-orange-500" delay={0.1} started={!loading} />
          <AnimatedMetricCard title="Avg Confidence" value={dashboardMetrics.avgConfidenceScore} suffix="%" icon="🎯" color="from-green-500 to-emerald-500" delay={0.15} started={!loading} />
          <AnimatedMetricCard title="Code Quality" value={dashboardMetrics.codeQualityIndex} suffix="/100" icon="✨" color="from-purple-500 to-pink-500" delay={0.2} started={!loading} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <ChartWidget title="Issues Distribution" delay={0.25}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={insightsData.issuesByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #ffffff20', borderRadius: 8 }} />
                <Bar dataKey="count" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </ChartWidget>

          <ChartWidget title="Language Usage" delay={0.3}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={insightsData.languageUsage} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {insightsData.languageUsage.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #ffffff20', borderRadius: 8 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: '#9ca3af' }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWidget>

          <ChartWidget title="Confidence Trend" delay={0.35}>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={insightsData.confidenceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis domain={[60, 100]} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #ffffff20', borderRadius: 8 }} />
                <Line type="monotone" dataKey="score" stroke="#60a5fa" strokeWidth={2} dot={{ fill: '#60a5fa', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartWidget>
        </div>

        {/* Recent Analyses */}
        <ChartWidget title="Recent Analyses" delay={0.4}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b border-white/5">
                  <th className="text-left pb-3 font-medium">File</th>
                  <th className="text-left pb-3 font-medium">Language</th>
                  <th className="text-left pb-3 font-medium">Mode</th>
                  <th className="text-left pb-3 font-medium">Confidence</th>
                  <th className="text-left pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {analysisHistory.slice(0, 5).map((item) => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="py-3 text-white font-medium">{item.title}</td>
                    <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs">{item.language}</span></td>
                    <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs">{item.mode}</span></td>
                    <td className="py-3 font-semibold text-green-400">{item.confidence}%</td>
                    <td className="py-3 text-gray-400">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartWidget>
      </motion.div>
    </AppLayout>
  )
}

export default Dashboard
