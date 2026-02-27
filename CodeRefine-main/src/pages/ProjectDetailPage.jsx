import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, FileCode, Calendar, CheckCircle, AlertTriangle } from 'lucide-react'
import AppLayout from '../layouts/AppLayout'
import { projectsData, projectDetailData } from '../data/mockData'

const languageIcon = { Python: '🐍', Java: '☕', 'C++': '⚙️', SQL: '🗄️', YAML: '📋', Docker: '🐳' }

const modeColors = {
  'Security Scan': 'bg-red-500/20 text-red-300',
  'Bug Detection': 'bg-orange-500/20 text-orange-300',
  Performance: 'bg-yellow-500/20 text-yellow-300',
  'Code Cleanup': 'bg-blue-500/20 text-blue-300',
  'Refactor Mode': 'bg-purple-500/20 text-purple-300',
  'Complexity Analysis': 'bg-green-500/20 text-green-300',
}

const statusColors = {
  Active: 'bg-green-500/20 text-green-400',
  'In Progress': 'bg-yellow-500/20 text-yellow-400',
  Archived: 'bg-gray-500/20 text-gray-400',
}

function ProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const projectId = parseInt(id)
  const project = projectsData.find((p) => p.id === projectId)
  const detail = projectDetailData[projectId]

  if (!project || !detail) {
    return (
      <AppLayout>
        <div className="p-6 flex flex-col items-center justify-center h-96 gap-4">
          <div className="text-5xl">😕</div>
          <h2 className="text-xl font-semibold text-white">Project not found</h2>
          <button
            onClick={() => navigate('/projects')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm"
          >
            Back to Projects
          </button>
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
        className="p-6 max-w-[1200px] mx-auto"
      >
        {/* Back button */}
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back to Projects</span>
        </button>

        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="glass rounded-2xl p-6 mb-6"
        >
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold gradient-text">{project.name}</h1>
              <p className="text-gray-400 mt-2 max-w-xl">{project.description}</p>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span className={`text-xs px-2.5 py-0.5 rounded-full ${statusColors[project.status]}`}>
                  {project.status}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <FileCode size={12} /> {project.fileCount} files
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar size={12} /> Updated {project.lastUpdated}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {project.languages.map((lang) => (
                  <span key={lang} className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Saved Analyses */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3 glass rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Saved Analyses</h2>
            <div className="space-y-3">
              {detail.analyses.map((analysis, i) => (
                <motion.div
                  key={analysis.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 + i * 0.06 }}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/8 hover:border-white/15 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center text-sm">
                      📄
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{analysis.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${modeColors[analysis.mode] || 'bg-gray-500/20 text-gray-300'}`}>
                          {analysis.mode}
                        </span>
                        <span className="text-xs text-gray-500">{analysis.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-400">{analysis.confidence}%</p>
                    <p className="text-xs text-gray-500">{analysis.issues} issue{analysis.issues !== 1 ? 's' : ''}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Files List */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-2 glass rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Project Files</h2>
            <div className="space-y-2.5">
              {detail.files.map((file, i) => (
                <motion.div
                  key={file.name}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/8 hover:border-white/15 transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base flex-shrink-0">{languageIcon[file.language] || '📄'}</span>
                    <div className="min-w-0">
                      <p className="text-sm text-white truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{file.lastAnalyzed}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    {file.issues === 0 ? (
                      <CheckCircle size={14} className="text-green-400" />
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-orange-400">
                        <AlertTriangle size={12} /> {file.issues}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AppLayout>
  )
}

export default ProjectDetailPage
