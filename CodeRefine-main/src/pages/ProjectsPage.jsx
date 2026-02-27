import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Plus, FolderOpen, Calendar, FileCode } from 'lucide-react'
import AppLayout from '../layouts/AppLayout'
import { projectsData } from '../data/mockData'

const statusColors = {
  Active: 'bg-green-500/20 text-green-400',
  'In Progress': 'bg-yellow-500/20 text-yellow-400',
  Archived: 'bg-gray-500/20 text-gray-400',
}

function ProjectsPage() {
  const navigate = useNavigate()

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 max-w-[1400px] mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Projects</h1>
            <p className="text-gray-400 mt-1">Manage and analyze your code projects</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            <Plus size={16} /> Create Project
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projectsData.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="glass rounded-2xl p-6 hover:border-white/20 transition-all flex flex-col cursor-pointer"
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-600/30 flex items-center justify-center">
                  <FolderOpen size={18} className="text-blue-400" />
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[project.status]}`}>
                  {project.status}
                </span>
              </div>
              <h3 className="font-bold text-white text-lg mb-2">{project.name}</h3>
              <p className="text-gray-400 text-sm leading-relaxed flex-1 mb-4">{project.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                <span className="flex items-center gap-1"><FileCode size={12} /> {project.fileCount} files</span>
                <span className="flex items-center gap-1"><Calendar size={12} /> {project.lastUpdated}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.languages.map((lang) => (
                  <span key={lang} className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">{lang}</span>
                ))}
              </div>
              <button className="w-full py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all text-sm">
                View Project Details
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AppLayout>
  )
}

export default ProjectsPage
