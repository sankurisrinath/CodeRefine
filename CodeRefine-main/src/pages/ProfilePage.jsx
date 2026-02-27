import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AppLayout from '../layouts/AppLayout'
import ProfileCard from '../components/ProfileCard'
import MetricCard from '../components/MetricCard'
import { userProfile } from '../data/mockData'

const roles = [
  {
    id: 'beginner',
    label: 'Beginner',
    icon: '🌱',
    description: 'Simplified view with guided tips',
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    icon: '🔧',
    description: 'Standard dashboard with moderate detail',
  },
  {
    id: 'senior',
    label: 'Senior',
    icon: '🚀',
    description: 'Advanced metrics and power-user tools',
  },
]

function BeginnerUI() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass rounded-2xl p-6 mt-6"
    >
      <h3 className="text-lg font-semibold text-white mb-4">🌱 Getting Started</h3>
      <div className="space-y-3">
        {[
          { step: 1, tip: 'Start with Bug Detection — it\'s the easiest mode to understand.', icon: '🐛' },
          { step: 2, tip: 'Paste a small function first to get familiar with the results.', icon: '📋' },
          { step: 3, tip: 'Check the Confidence Score — above 80% means the analysis is reliable.', icon: '🎯' },
          { step: 4, tip: 'Use the Optimized Code tab to see improved versions of your code.', icon: '✨' },
        ].map((item) => (
          <div key={item.step} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/8">
            <span className="text-xl">{item.icon}</span>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-0.5">Step {item.step}</p>
              <p className="text-sm text-gray-300">{item.tip}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
        <p className="text-sm text-blue-300">
          💡 <strong>Tip:</strong> Hover over any issue in the results panel to see a detailed suggestion on how to fix it.
        </p>
      </div>
    </motion.div>
  )
}

function IntermediateUI() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass rounded-2xl p-6 mt-6"
    >
      <h3 className="text-lg font-semibold text-white mb-4">🔧 Analysis Overview</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: 'Most Used Mode', value: 'Bug Detection', icon: '🐛' },
          { label: 'Avg Issues/Scan', value: '4.2', icon: '⚠️' },
          { label: 'Best Confidence', value: '94%', icon: '🎯' },
          { label: 'Analyses This Month', value: '18', icon: '📊' },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
            <span className="text-2xl">{stat.icon}</span>
            <div>
              <p className="text-xs text-gray-500">{stat.label}</p>
              <p className="text-base font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function SeniorUI() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass rounded-2xl p-6 mt-6"
    >
      <h3 className="text-lg font-semibold text-white mb-2">🚀 Advanced Metrics</h3>
      <p className="text-gray-500 text-xs mb-4">Raw data and power-user shortcuts</p>

      {/* Raw data table */}
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-gray-500 border-b border-white/10">
              <th className="text-left pb-2 font-medium">Metric</th>
              <th className="text-left pb-2 font-medium">Value</th>
              <th className="text-left pb-2 font-medium">Trend</th>
              <th className="text-left pb-2 font-medium">Percentile</th>
            </tr>
          </thead>
          <tbody>
            {[
              { metric: 'Avg Confidence', value: '87%', trend: '+2.4%', percentile: '92nd' },
              { metric: 'Bug Detection Rate', value: '94.2%', trend: '+1.1%', percentile: '88th' },
              { metric: 'Security Coverage', value: '78.5%', trend: '+5.2%', percentile: '75th' },
              { metric: 'Code Quality Index', value: '92/100', trend: '+3', percentile: '95th' },
              { metric: 'Complexity Reduction', value: '23%', trend: '+4.5%', percentile: '80th' },
            ].map((row) => (
              <tr key={row.metric} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                <td className="py-2 text-gray-300 font-medium">{row.metric}</td>
                <td className="py-2 text-white">{row.value}</td>
                <td className="py-2 text-green-400">{row.trend}</td>
                <td className="py-2">
                  <span className="px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300">{row.percentile}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Power-user shortcuts */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Keyboard Shortcuts</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { keys: '⌘K', action: 'Open global search' },
            { keys: '⌘⇧A', action: 'New analysis' },
            { keys: '⌘⇧D', action: 'Go to dashboard' },
            { keys: '⌘⇧P', action: 'Go to projects' },
          ].map((sc) => (
            <div key={sc.keys} className="flex items-center gap-2 text-xs text-gray-400 p-2 rounded-lg bg-white/5">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-gray-300">{sc.keys}</kbd>
              <span>{sc.action}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function ProfilePage() {
  const [form, setForm] = useState({ name: userProfile.name, email: userProfile.email, role: userProfile.role })
  const [saved, setSaved] = useState(false)
  const [selectedRole, setSelectedRole] = useState('intermediate')

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 max-w-[900px] mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text">Profile</h1>
          <p className="text-gray-400 mt-1">Manage your account settings</p>
        </div>

        <ProfileCard user={userProfile} />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <MetricCard title="Total Analyses" value={userProfile.totalAnalyses} icon="🔍" color="from-blue-500 to-cyan-500" delay={0.1} />
          <MetricCard title="Saved Projects" value={userProfile.savedProjects} icon="📁" color="from-purple-500 to-pink-500" delay={0.15} />
          <MetricCard title="Avg Confidence" value={userProfile.avgConfidenceScore} suffix="%" icon="🎯" color="from-green-500 to-emerald-500" delay={0.2} />
        </div>

        {/* Role Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22 }}
          className="glass rounded-2xl p-6 mt-6"
        >
          <h3 className="text-lg font-semibold text-white mb-1">Experience Level</h3>
          <p className="text-gray-400 text-sm mb-4">Select your role to customize the UI experience</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {roles.map((role) => (
              <motion.button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl text-left border transition-all ${
                  selectedRole === role.id
                    ? 'border-blue-500/60 bg-gradient-to-br from-blue-500/15 to-purple-600/15'
                    : 'border-white/10 hover:border-white/25 hover:bg-white/5'
                }`}
              >
                <div className="text-2xl mb-2">{role.icon}</div>
                <p className="text-sm font-semibold text-white">{role.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{role.description}</p>
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {selectedRole === 'beginner' && <BeginnerUI key="beginner" />}
            {selectedRole === 'intermediate' && <IntermediateUI key="intermediate" />}
            {selectedRole === 'senior' && <SeniorUI key="senior" />}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="glass rounded-2xl p-6 mt-6"
        >
          <h3 className="text-lg font-semibold text-white mb-5">Edit Profile</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Role</label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <motion.button
                type="submit"
                whileTap={{ scale: 0.98 }}
                whileHover={{ scale: 1.01 }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                Save Changes
              </motion.button>
              {saved && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-green-400"
                >
                  ✓ Saved successfully
                </motion.span>
              )}
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AppLayout>
  )
}

export default ProfilePage
