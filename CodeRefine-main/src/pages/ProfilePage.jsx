import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AppLayout from '../layouts/AppLayout'
import ProfileCard from '../components/ProfileCard'
import MetricCard from '../components/MetricCard'
import * as api from '../services/api'

function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({ name: '', email: '' })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await api.getProfile()
        setProfile(data)
        setForm({ name: data.full_name || data.username || '', email: data.email || '' })
      } catch {
        // leave empty
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      await api.updateProfile({ full_name: form.name, email: form.email })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      // ignore
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6 max-w-[900px] mx-auto">
          <div className="shimmer-bg h-8 rounded-lg w-48 mb-8" />
          <div className="shimmer-bg h-40 rounded-2xl mb-6" />
        </div>
      </AppLayout>
    )
  }

  const profileUser = profile ? {
    avatar: (profile.full_name || profile.username || '?')[0].toUpperCase(),
    name: profile.full_name || profile.username,
    email: profile.email,
    joinDate: profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—',
    projectsCount: profile.projects_count ?? 0,
    totalAnalyses: profile.total_analyses ?? 0,
  } : null

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

        {profileUser && <ProfileCard user={profileUser} />}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <MetricCard title="Total Analyses" value={profileUser?.totalAnalyses ?? 0} icon="🔍" color="from-blue-500 to-cyan-500" delay={0.1} />
          <MetricCard title="Projects" value={profileUser?.projectsCount ?? 0} icon="📁" color="from-purple-500 to-pink-500" delay={0.15} />
        </div>

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
