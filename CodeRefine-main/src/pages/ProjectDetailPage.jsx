import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, Plus, Save, Download, Trash2, FileCode, Clock } from 'lucide-react'
import Editor from '@monaco-editor/react'
import AppLayout from '../layouts/AppLayout'
import * as api from '../services/api'

const LANGUAGE_OPTIONS = ['python', 'javascript', 'java', 'cpp', 'c', 'text']

const MONACO_LANG_MAP = {
  python: 'python',
  javascript: 'javascript',
  java: 'java',
  cpp: 'cpp',
  c: 'c',
  text: 'plaintext',
}

const ACTION_ICONS = {
  CREATE_FILE: '📝',
  UPLOAD_FILE: '📤',
  EDIT_FILE: '✏️',
  ANALYZE_FILE: '🔍',
  EXPORT_FILE: '📦',
}

function relativeTime(dateStr) {
  if (!dateStr) return ''
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return `${diff} second${diff !== 1 ? 's' : ''} ago`
  if (diff < 3600) {
    const m = Math.floor(diff / 60)
    return `${m} minute${m !== 1 ? 's' : ''} ago`
  }
  if (diff < 86400) {
    const h = Math.floor(diff / 3600)
    return `${h} hour${h !== 1 ? 's' : ''} ago`
  }
  const d = Math.floor(diff / 86400)
  return `${d} day${d !== 1 ? 's' : ''} ago`
}

function formatActionType(actionType) {
  const label = actionType.replace(/_/g, ' ').toLowerCase()
  return label.charAt(0).toUpperCase() + label.slice(1)
}

function ActivityTimeline({ activities }) {
  if (!activities || activities.length === 0) {
    return <p className="text-gray-500 text-xs text-center py-6">No activity yet</p>
  }
  return (
    <div className="space-y-2">
      {activities.map((a) => (
        <div key={a.id} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/8">
          <span className="text-base leading-none mt-0.5">{ACTION_ICONS[a.actionType] || '📋'}</span>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-white truncate">
              <span className="text-gray-400">{formatActionType(a.actionType)}:</span>{' '}
              {a.fileName}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{relativeTime(a.timestamp)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function ProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const projectId = parseInt(id)

  const [project, setProject] = useState(null)
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState(null)
  const [editorContent, setEditorContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [newFileName, setNewFileName] = useState('')
  const [newFileLang, setNewFileLang] = useState('python')
  const [error, setError] = useState(null)
  const [activities, setActivities] = useState([])
  const fileInputRef = useRef(null)

  const refreshActivity = useCallback(async () => {
    try {
      const data = await api.getProjectActivity(projectId)
      setActivities(data.activities || [])
    } catch {
      // ignore
    }
  }, [projectId])

  useEffect(() => {
    const load = async () => {
      try {
        const [proj, fileList] = await Promise.all([
          api.getProject(projectId),
          api.getProjectFiles(projectId),
        ])
        setProject(proj)
        setFiles(fileList)
        await refreshActivity()
      } catch {
        setError('Project not found')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [projectId, refreshActivity])

  const handleSelectFile = (file) => {
    setSelectedFile(file)
    setEditorContent(file.content || '')
  }

  const handleSave = async () => {
    if (!selectedFile) return
    setSaving(true)
    try {
      const updated = await api.saveFile(projectId, selectedFile.id, { content: editorContent })
      setFiles((prev) => prev.map((f) => (f.id === updated.id ? updated : f)))
      setSelectedFile(updated)
      await refreshActivity()
    } catch {
      // ignore
    } finally {
      setSaving(false)
    }
  }

  const handleCreateFile = async (e) => {
    e.preventDefault()
    if (!newFileName.trim()) return
    try {
      const file = await api.createFile(projectId, { name: newFileName.trim(), language: newFileLang, content: '' })
      setFiles((prev) => [...prev, file])
      setSelectedFile(file)
      setEditorContent('')
      setShowCreate(false)
      setNewFileName('')
      setNewFileLang('python')
      await refreshActivity()
    } catch {
      // ignore
    }
  }

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const uploaded = await api.uploadFile(projectId, file)
      setFiles((prev) => [...prev, uploaded])
      setSelectedFile(uploaded)
      setEditorContent(uploaded.content || '')
      await refreshActivity()
    } catch (err) {
      alert(err.message || 'Upload failed')
    }
    e.target.value = ''
  }

  const handleDeleteFile = async (fileId) => {
    if (!confirm('Delete this file?')) return
    try {
      await api.deleteFile(projectId, fileId)
      setFiles((prev) => prev.filter((f) => f.id !== fileId))
      if (selectedFile?.id === fileId) {
        setSelectedFile(null)
        setEditorContent('')
      }
    } catch {
      // ignore
    }
  }

  const handleDownload = async (fileId) => {
    try {
      await api.downloadFile(projectId, fileId)
    } catch (err) {
      alert(err.message || 'Download failed')
    }
  }

  const handleExportZip = async () => {
    try {
      await api.exportZip(projectId, project?.name)
      await refreshActivity()
    } catch (err) {
      alert(err.message || 'Export failed')
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6 max-w-[1200px] mx-auto">
          <div className="shimmer-bg h-8 rounded-lg w-48 mb-6" />
          <div className="shimmer-bg h-40 rounded-2xl mb-6" />
        </div>
      </AppLayout>
    )
  }

  if (error || !project) {
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
        className="p-6 max-w-[1400px] mx-auto"
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
              <p className="text-gray-400 mt-2 max-w-xl">{project.description || 'No description'}</p>
              <p className="text-xs text-gray-500 mt-2">Created {project.created_at ? new Date(project.created_at).toLocaleDateString() : '—'}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <input
                ref={fileInputRef}
                type="file"
                accept=".py,.js,.java,.cpp,.c,.txt"
                onChange={handleUpload}
                className="hidden"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 text-gray-300 hover:text-white hover:bg-white/5 text-sm transition-all"
              >
                <Upload size={14} /> Upload File
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 text-gray-300 hover:text-white hover:bg-white/5 text-sm transition-all"
              >
                <Plus size={14} /> Create File
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExportZip}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm"
              >
                <Download size={14} /> Export ZIP
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Create File Modal */}
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6 mb-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Create New File</h3>
            <form onSubmit={handleCreateFile} className="flex flex-wrap gap-4">
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="filename.py"
                className="flex-1 min-w-48 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                required
              />
              <select
                value={newFileLang}
                onChange={(e) => setNewFileLang(e.target.value)}
                className="bg-white/10 border border-white/20 text-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              >
                {LANGUAGE_OPTIONS.map((l) => (
                  <option key={l} value={l} className="bg-gray-900">{l}</option>
                ))}
              </select>
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">
                Create
              </button>
              <button type="button" onClick={() => setShowCreate(false)} className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm">
                Cancel
              </button>
            </form>
          </motion.div>
        )}

        {/* Main Editor Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Files List */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1 glass rounded-2xl p-4"
          >
            <h2 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <FileCode size={16} className="text-blue-400" /> Files ({files.length})
            </h2>
            {files.length === 0 ? (
              <p className="text-gray-500 text-xs text-center py-6">No files yet</p>
            ) : (
              <div className="space-y-1">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all group ${
                      selectedFile?.id === file.id
                        ? 'bg-blue-500/20 border border-blue-500/30'
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                    onClick={() => handleSelectFile(file)}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-white truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{file.language}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDownload(file.id) }}
                        className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-blue-400"
                        title="Download"
                      >
                        <Download size={12} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteFile(file.id) }}
                        className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Editor */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-3 glass rounded-2xl p-4 flex flex-col"
          >
            {selectedFile ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-white font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">{selectedFile.language} · {selectedFile.source}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm disabled:opacity-50"
                  >
                    <Save size={14} /> {saving ? 'Saving…' : 'Save'}
                  </motion.button>
                </div>
                <div className="flex-1 min-h-[400px] rounded-xl overflow-hidden border border-white/10">
                  <Editor
                    height="400px"
                    language={MONACO_LANG_MAP[selectedFile.language] || 'plaintext'}
                    value={editorContent}
                    onChange={(val) => setEditorContent(val || '')}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 13,
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      padding: { top: 16, bottom: 16 },
                    }}
                  />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-500">
                <FileCode size={40} />
                <p>Select a file to view and edit its content</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass rounded-2xl p-4 mt-6"
        >
          <h2 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
            <Clock size={16} className="text-purple-400" /> Activity Timeline
          </h2>
          <ActivityTimeline activities={activities} />
        </motion.div>
      </motion.div>
    </AppLayout>
  )
}

export default ProjectDetailPage
