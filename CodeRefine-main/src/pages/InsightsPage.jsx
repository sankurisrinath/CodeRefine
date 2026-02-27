import { motion } from 'framer-motion'
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import AppLayout from '../layouts/AppLayout'
import ChartWidget from '../components/ChartWidget'
import { insightsData } from '../data/mockData'

const COLORS = ['#60a5fa', '#a855f7', '#34d399', '#f97316', '#ec4899']

function InsightsPage() {
  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 max-w-[1400px] mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text">Insights</h1>
          <p className="text-gray-400 mt-1">Analytics and trends from your code analyses</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartWidget title="Most Frequent Issues" delay={0}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={insightsData.issuesByType} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} width={80} />
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #ffffff20', borderRadius: 8 }} />
                <Bar dataKey="count" fill="url(#barGrad)" radius={[0, 4, 4, 0]}>
                  {insightsData.issuesByType.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartWidget>

          <ChartWidget title="Language Distribution" delay={0.1}>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={insightsData.languageUsage} cx="50%" cy="50%" outerRadius={100} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}%`} labelLine={false}>
                  {insightsData.languageUsage.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #ffffff20', borderRadius: 8 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: '#9ca3af' }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWidget>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartWidget title="Confidence Score Trend" delay={0.2}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={insightsData.confidenceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis domain={[60, 100]} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #ffffff20', borderRadius: 8 }} />
                <Line type="monotone" dataKey="score" stroke="#60a5fa" strokeWidth={2.5} dot={{ fill: '#60a5fa', r: 5 }} name="Confidence %" />
              </LineChart>
            </ResponsiveContainer>
          </ChartWidget>

          <ChartWidget title="Performance Improvement Trend" delay={0.3}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={insightsData.performanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #ffffff20', borderRadius: 8 }} formatter={(v) => [`${v}%`, 'Improvement']} />
                <Line type="monotone" dataKey="gain" stroke="#a855f7" strokeWidth={2.5} dot={{ fill: '#a855f7', r: 5 }} name="Performance %" />
              </LineChart>
            </ResponsiveContainer>
          </ChartWidget>
        </div>

        {/* AI Summary Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass rounded-2xl p-6 mt-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-600/30 flex items-center justify-center text-lg">
              🤖
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">AI Insights Summary</h2>
              <p className="text-xs text-gray-500">Generated from your analysis trends</p>
            </div>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">Mock AI</span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            Your <span className="text-blue-300 font-medium">confidence scores have improved by 20%</span> over the last 6 months, rising from 72% in September to 87% in February — a strong indicator of improving code quality practices.
            {' '}<span className="text-purple-300 font-medium">Python continues to be your most analyzed language</span> (45% of all analyses), followed by Java (30%) and C++ (25%).
            {' '}<span className="text-red-300 font-medium">Bug detection remains the most common issue type</span> (89 issues), closely followed by Style issues (103) and Performance (67) — suggesting a focus on automated testing and linting would be highly beneficial.
            Performance gains have also steadily increased from <span className="text-yellow-300 font-medium">18% to 34%</span>, showing effective optimization work. Consider investing more in security scanning as it accounts for only 42 of the total 356 flagged issues, while security risks often have the highest impact.
          </p>
        </motion.div>
      </motion.div>
    </AppLayout>
  )
}

export default InsightsPage
