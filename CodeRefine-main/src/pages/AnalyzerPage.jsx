import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Download, RefreshCw, Save, FolderOpen } from 'lucide-react'
import AppLayout from '../layouts/AppLayout'
import CodeEditor from '../components/CodeEditor'
import ResultsPanel from '../components/ResultsPanel'
import LoadingSpinner from '../components/LoadingSpinner'
import { languageLabels } from '../data/mockData'
import { analyzeCode, getProjects, getProjectFiles } from '../services/api'
import { transformResponse } from '../utils/transformResponse'

const TOTAL_STEPS = 4

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
}

function StepProgress({ step }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400 font-medium">Step {step} of {TOTAL_STEPS}</span>
        <span className="text-sm text-gray-500">{Math.round((step / TOTAL_STEPS) * 100)}%</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
      <div className="flex justify-between mt-2">
        {['Code', 'Instruction', 'Review', 'Result'].map((label, i) => (
          <span
            key={label}
            className={`text-xs ${i + 1 <= step ? 'text-blue-400' : 'text-gray-600'} hidden sm:block`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

function AnalyzerPage() {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [language, setLanguage] = useState('python')
  const [code, setCode] = useState('')
  const [customInstruction, setCustomInstruction] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)

  // File selector state
  const [useProjectFile, setUseProjectFile] = useState(false)
  const [projects, setProjects] = useState([])
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [projectFiles, setProjectFiles] = useState([])
  const [selectedFileId, setSelectedFileId] = useState('')
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [loadingFiles, setLoadingFiles] = useState(false)

  // Load projects when file selector is enabled
  useEffect(() => {
    if (useProjectFile && projects.length === 0) {
      setLoadingProjects(true)
      getProjects()
        .then((data) => setProjects(data || []))
        .catch(() => setProjects([]))
        .finally(() => setLoadingProjects(false))
    }
  }, [useProjectFile, projects.length])

  // Load files when a project is selected
  useEffect(() => {
    if (selectedProjectId) {
      setLoadingFiles(true)
      setProjectFiles([])
      setSelectedFileId('')
      getProjectFiles(selectedProjectId)
        .then((data) => setProjectFiles(data || []))
        .catch(() => setProjectFiles([]))
        .finally(() => setLoadingFiles(false))
    } else {
      setProjectFiles([])
      setSelectedFileId('')
    }
  }, [selectedProjectId])

  // Load file content when a file is selected
  useEffect(() => {
    if (selectedFileId) {
      const file = projectFiles.find((f) => f.id === selectedFileId)
      if (file) {
        setCode(file.content || '')
        setLanguage(file.language || 'python')
      }
    }
  }, [selectedFileId, projectFiles])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const goToStep = (next) => {
    setDirection(next > step ? 1 : -1)
    setStep(next)
  }

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang)
    // Don't load mock sample code on language change
  }

  const handleAnalyze = async () => {
    goToStep(4)
    setIsLoading(true)
    setResults(null)
    setError(null)
    try {
      const params = { language, mode: 'standard', code, instruction: customInstruction }
      if (useProjectFile && selectedProjectId && selectedFileId) {
        params.projectId = selectedProjectId
        params.fileId = selectedFileId
      }
      const apiResponse = await analyzeCode(params)
      setResults(transformResponse(apiResponse))
    } catch {
      setError('AI Analysis Failed. Please try again.')
      setResults(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadReport = () => {
    if (!results) return
    const lines = [
      `CodeRefine Analysis Report`,
      `==========================`,
      `Language: ${languageLabels[language]}`,
      customInstruction ? `Custom Instruction: ${customInstruction}` : '',
      `Date: ${new Date().toLocaleDateString()}`,
      `Confidence Score: ${results.confidence}%`,
      ``,
      `BUGS (${results.bugs?.length || 0})`,
      ...(results.bugs || []).map((b) => `  [${b.severity}] Line ${b.line}: ${b.message}`),
      ``,
      `SECURITY (${results.security?.length || 0})`,
      ...(results.security || []).map((s) => `  [${s.severity}] Line ${s.line}: ${s.message}`),
      ``,
      `PERFORMANCE (${results.performance?.length || 0})`,
      ...(results.performance || []).map((p) => `  [${p.severity}] Line ${p.line}: ${p.message}`),
      ``,
      `BEST PRACTICES (${results.bestPractices?.length || 0})`,
      ...(results.bestPractices || []).map((bp) => `  [${bp.severity}] Line ${bp.line}: ${bp.message}`),
    ].filter(Boolean).join('\n')

    const blob = new Blob([lines], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `coderefine-report-${language}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleRerun = () => {
    setResults(null)
    setUseProjectFile(false)
    setSelectedProjectId('')
    setSelectedFileId('')
    goToStep(1)
  }

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 max-w-[1000px] mx-auto"
      >
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Code Analyzer</h1>
          <p className="text-gray-400 text-sm mt-1">AI-powered code analysis — step by step</p>
        </div>

        <StepProgress step={step} />

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {/* Step 1: Paste Code */}
            {step === 1 && (
              <div className="glass rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Paste Your Code</h2>

                {/* Toggle: paste code vs select from project */}
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => setUseProjectFile(false)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${!useProjectFile ? 'bg-blue-500/30 border border-blue-500/50 text-blue-300' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'}`}
                  >
                    Paste Code
                  </button>
                  <button
                    onClick={() => setUseProjectFile(true)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${useProjectFile ? 'bg-blue-500/30 border border-blue-500/50 text-blue-300' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'}`}
                  >
                    <FolderOpen size={13} /> Select File from Project
                  </button>
                </div>

                {useProjectFile ? (
                  <div className="space-y-3 mb-4">
                    <div>
                      <label className="text-xs text-gray-400 mb-1.5 block">Select Project</label>
                      {loadingProjects ? (
                        <p className="text-sm text-gray-500">Loading projects…</p>
                      ) : (
                        <select
                          value={selectedProjectId}
                          onChange={(e) => setSelectedProjectId(e.target.value ? parseInt(e.target.value) : '')}
                          className="w-full bg-white/10 border border-white/20 text-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                          <option value="" className="bg-gray-900">— Choose a project —</option>
                          {projects.map((p) => (
                            <option key={p.id} value={p.id} className="bg-gray-900">{p.name}</option>
                          ))}
                        </select>
                      )}
                    </div>
                    {selectedProjectId && (
                      <div>
                        <label className="text-xs text-gray-400 mb-1.5 block">Select File</label>
                        {loadingFiles ? (
                          <p className="text-sm text-gray-500">Loading files…</p>
                        ) : projectFiles.length === 0 ? (
                          <p className="text-sm text-gray-500">No files in this project</p>
                        ) : (
                          <select
                            value={selectedFileId}
                            onChange={(e) => setSelectedFileId(e.target.value ? parseInt(e.target.value) : '')}
                            className="w-full bg-white/10 border border-white/20 text-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
                          >
                            <option value="" className="bg-gray-900">— Choose a file —</option>
                            {projectFiles.map((f) => (
                              <option key={f.id} value={f.id} className="bg-gray-900">{f.name} ({f.language})</option>
                            ))}
                          </select>
                        )}
                      </div>
                    )}
                    {selectedFileId && code && (
                      <p className="text-xs text-green-400">✔ File loaded — you can preview or edit the code below</p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 mb-4">
                    <label className="text-sm font-medium text-gray-400">Language:</label>
                    <select
                      value={language}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                      className="bg-white/10 border border-white/20 text-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      {Object.entries(languageLabels).map(([value, label]) => (
                        <option key={value} value={value} className="bg-gray-900">{label}</option>
                      ))}
                    </select>
                  </div>
                )}

                <CodeEditor language={language} value={code} onChange={(val) => setCode(val || '')} />
              </div>
            )}

            {/* Step 2: Custom Instruction */}
            {step === 2 && (
              <div className="glass rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-2">Custom Instruction</h2>
                <p className="text-gray-400 text-sm mb-4">Optionally guide the analysis with a specific focus area.</p>
                <textarea
                  value={customInstruction}
                  onChange={(e) => setCustomInstruction(e.target.value)}
                  placeholder="e.g. Focus on security vulnerabilities in the authentication flow..."
                  rows={6}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">Leave blank to use the default analysis.</p>
              </div>
            )}

            {/* Step 3: Review & Confirm */}
            {step === 3 && (
              <div className="glass rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-5">Review & Confirm</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-lg">💻</span>
                    <div>
                      <p className="text-xs text-gray-500">Language</p>
                      <p className="text-sm font-medium text-white">{languageLabels[language]}</p>
                    </div>
                  </div>
                  {customInstruction && (
                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-lg mt-0.5">📝</span>
                      <div>
                        <p className="text-xs text-gray-500">Custom Instruction</p>
                        <p className="text-sm text-gray-300 mt-0.5 line-clamp-2">{customInstruction}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-lg">📄</span>
                    <div>
                      <p className="text-xs text-gray-500">Code Preview</p>
                      <p className="text-sm text-gray-300 font-mono truncate max-w-md">{code.split('\n')[0]}</p>
                    </div>
                  </div>
                </div>
                <motion.button
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all ${isLoading ? 'bg-gray-700 cursor-not-allowed opacity-60' : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/20'}`}
                >
                  🔍 Analyze Now
                </motion.button>
              </div>
            )}

            {/* Step 4: Results */}
            {step === 4 && (
              <div>
                {isLoading ? (
                  <div className="glass rounded-2xl p-6 min-h-[400px] flex items-center justify-center">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <>
                    {!isLoading && error && (
                      <div className="glass rounded-2xl p-6 min-h-[400px] flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-red-400 text-lg font-semibold mb-2">⚠️ {error}</div>
                        </div>
                      </div>
                    )}
                    {!isLoading && !error && (
                    <>
                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <motion.button
                        onClick={() => showToast('✅ Saved to project!')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-500/20 border border-green-500/30 text-green-300 text-sm hover:bg-green-500/30 transition-all"
                      >
                        <Save size={14} /> Save to Project
                      </motion.button>
                      <motion.button
                        onClick={handleDownloadReport}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm hover:bg-blue-500/30 transition-all"
                      >
                        <Download size={14} /> Download Report
                      </motion.button>
                      <motion.button
                        onClick={handleRerun}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 border border-white/15 text-gray-300 text-sm hover:bg-white/15 transition-all"
                      >
                        <RefreshCw size={14} /> Re-run
                      </motion.button>
                    </div>
                    <div className="glass rounded-2xl p-5 min-h-[500px] flex flex-col">
                      <ResultsPanel results={results} language={language} />
                    </div>
                    </>
                    )}
                  </>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {!(step === 4 && !isLoading) && (
          <div className="flex justify-between mt-6">
            <motion.button
              onClick={() => goToStep(step - 1)}
              disabled={step === 1}
              whileHover={{ scale: step === 1 ? 1 : 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                step === 1
                  ? 'opacity-30 cursor-not-allowed bg-white/5 text-gray-400'
                  : 'bg-white/10 border border-white/15 text-gray-300 hover:bg-white/15'
              }`}
            >
              <ChevronLeft size={16} /> Back
            </motion.button>
            {step < 3 && (
              <motion.button
                onClick={() => goToStep(step + 1)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                Next <ChevronRight size={16} />
              </motion.button>
            )}
            {step === 3 && (
              <motion.button
                onClick={handleAnalyze}
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${isLoading ? 'bg-gray-700 cursor-not-allowed opacity-60 text-white' : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'}`}
              >
                Analyze 🔍
              </motion.button>
            )}
          </div>
        )}

        {/* Toast notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500/90 to-purple-600/90 backdrop-blur-sm text-white text-sm font-medium shadow-xl"
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AppLayout>
  )
}

export default AnalyzerPage
