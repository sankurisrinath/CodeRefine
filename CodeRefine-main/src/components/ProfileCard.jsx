import { motion } from 'framer-motion'

function ProfileCard({ user }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6"
    >
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
        {user.avatar}
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white">{user.name}</h2>
        <p className="text-gray-400 mt-1">{user.email}</p>
        <div className="flex flex-wrap gap-3 mt-3">
          <span className="text-sm text-gray-500">Joined {user.joinDate}</span>
        </div>
      </div>
    </motion.div>
  )
}

export default ProfileCard
