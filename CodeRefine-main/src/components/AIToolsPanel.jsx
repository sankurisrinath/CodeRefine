import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { extensionsAPI } from '../services/api'
import MetricsCard from './MetricsCard'
import VisualizationView from './VisualizationView'
import ChatPanel from './ChatPanel'

const TOOLS = [
  { id: 'rewrite', label: 'Rewrite', icon: '✏️' },
  { id: 'explain', label: 'Explain', icon: '💡' },
  { id: 'tests', label: 'Tests', icon: '🧪' },
  { id: 'debug', label: 'Debug', icon: '🐛' },
  { id: 'metrics', label: 'Metrics', icon: '📊' },
  { id: 'visualize', label: 'Visualize', icon: '🗺️' },
  { id: 'chat', label: 'Chat', icon: '💬' },
]

const TEST_FRAMEWORKS = ['', 'pytest', 'unittest', 'jest', 'mocha', 'jasmine', 'junit']

function ResultModal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  )
}

function CodeBlock({ code }) {
  return (
    <pre className="bg-black/30 border border-white/10 rounded-xl p-4 text-xs text-gray-200 whitespace-pre-wrap font-mono overflow-x-auto max-h-80 overflow-y-auto">
      {code}
    </pre>
  )
}

function AIToolsPanel({ projectId, fileId }) {
  const [activeTool, setActiveTool] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [modal, setModal] = useState(null)

  // Tool-specific inputs
  const [rewriteInstruction, setRewriteInstruction] = useState('')
  const [testFramework, setTestFramework] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const closeModal = () => setModal(null)

  const runTool = async (toolId) => {
    setError(null)
    setLoading(true)
    try {
      switch (toolId) {
        case 'rewrite': {
          if (!rewriteInstruction.trim()) { setError('Please enter an instruction.'); setLoading(false); return }
          const res = await extensionsAPI.rewrite(projectId, fileId, rewriteInstruction)
          setModal({
            title: '✏️ Rewritten Code',
            content: (
              <div className="space-y-3">
                <CodeBlock code={res.rewritten_code} />
                {res.explanation && <p className="text-gray-300 text-sm">{res.explanation}</p>}
              </div>
            ),
          })
          break
        }
        case 'explain': {
          const res = await extensionsAPI.explain(projectId, fileId)
          setModal({
            title: '💡 Code Explanation',
            content: (
              <div className="space-y-3">
                <p className="text-gray-200 text-sm whitespace-pre-wrap">{res.explanation}</p>
                {res.key_concepts?.length > 0 && (
                  <div>
                    <p className="text-gray-400 text-xs mb-1 font-medium uppercase tracking-wide">Key Concepts</p>
                    <div className="flex flex-wrap gap-2">
                      {res.key_concepts.map((c, i) => (
                        <span key={i} className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded px-2 py-0.5">{c}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ),
          })
          break
        }
        case 'tests': {
          const res = await extensionsAPI.generateTests(projectId, fileId, testFramework)
          setModal({
            title: `🧪 Generated Tests (${res.test_count} test${res.test_count !== 1 ? 's' : ''})`,
            content: <CodeBlock code={res.test_code} />,
          })
          break
        }
        case 'debug': {
          if (!errorMessage.trim()) { setError('Please enter an error message.'); setLoading(false); return }
          const res = await extensionsAPI.debug(projectId, fileId, errorMessage)
          setModal({
            title: '🐛 Fixed Code',
            content: (
              <div className="space-y-3">
                <CodeBlock code={res.fixed_code} />
                {res.explanation && <p className="text-gray-300 text-sm">{res.explanation}</p>}
                {res.changes_made?.length > 0 && (
                  <div>
                    <p className="text-gray-400 text-xs mb-1 font-medium uppercase tracking-wide">Changes Made</p>
                    <ul className="space-y-1">
                      {res.changes_made.map((c, i) => (
                        <li key={i} className="text-xs text-gray-300 flex gap-2"><span className="text-green-400">✓</span>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ),
          })
          break
        }
        case 'metrics': {
          const res = await extensionsAPI.getMetrics(projectId, fileId)
          setModal({
            title: '📊 Code Metrics',
            content: <MetricsCard metrics={res.metrics} />,
          })
          break
        }
        case 'visualize': {
          const res = await extensionsAPI.visualize(projectId, fileId)
          setModal({
            title: '🗺️ Code Visualization',
            content: <VisualizationView visualization={res.visualization} />,
          })
          break
        }
        default:
          break
      }
    } catch (err) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleChatSend = async (message, history) => {
    const res = await extensionsAPI.chat(projectId, fileId, message, history)
    return res.response
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="glass rounded-2xl p-4 mt-6"
      >
        <h2 className="text-base font-semibold text-white mb-3">🤖 AI Tools</h2>

        {/* Tool Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm transition-all border ${
                activeTool === tool.id
                  ? 'bg-blue-500/20 border-blue-500/40 text-white'
                  : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{tool.icon}</span>
              {tool.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-3 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Tool-specific UI */}
        <AnimatePresence mode="wait">
          {activeTool && (
            <motion.div
              key={activeTool}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeTool === 'rewrite' && (
                <div className="flex gap-2 flex-wrap">
                  <input
                    type="text"
                    value={rewriteInstruction}
                    onChange={(e) => setRewriteInstruction(e.target.value)}
                    placeholder="e.g. Make this code more efficient"
                    className="flex-1 min-w-48 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => runTool('rewrite')}
                    disabled={loading}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm disabled:opacity-50"
                  >
                    {loading ? 'Working…' : 'Rewrite'}
                  </button>
                </div>
              )}

              {activeTool === 'explain' && (
                <button
                  onClick={() => runTool('explain')}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm disabled:opacity-50"
                >
                  {loading ? 'Analyzing…' : 'Explain Code'}
                </button>
              )}

              {activeTool === 'tests' && (
                <div className="flex gap-2 flex-wrap">
                  <select
                    value={testFramework}
                    onChange={(e) => setTestFramework(e.target.value)}
                    className="bg-white/10 border border-white/20 text-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  >
                    {TEST_FRAMEWORKS.map((f) => (
                      <option key={f} value={f} className="bg-gray-900">{f || 'Auto-detect framework'}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => runTool('tests')}
                    disabled={loading}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm disabled:opacity-50"
                  >
                    {loading ? 'Generating…' : 'Generate Tests'}
                  </button>
                </div>
              )}

              {activeTool === 'debug' && (
                <div className="flex gap-2 flex-wrap">
                  <input
                    type="text"
                    value={errorMessage}
                    onChange={(e) => setErrorMessage(e.target.value)}
                    placeholder="Paste the error message here…"
                    className="flex-1 min-w-48 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => runTool('debug')}
                    disabled={loading}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm disabled:opacity-50"
                  >
                    {loading ? 'Fixing…' : 'Fix Code'}
                  </button>
                </div>
              )}

              {activeTool === 'metrics' && (
                <button
                  onClick={() => runTool('metrics')}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm disabled:opacity-50"
                >
                  {loading ? 'Calculating…' : 'Get Metrics'}
                </button>
              )}

              {activeTool === 'visualize' && (
                <button
                  onClick={() => runTool('visualize')}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm disabled:opacity-50"
                >
                  {loading ? 'Generating…' : 'Visualize Structure'}
                </button>
              )}

              {activeTool === 'chat' && (
                <ChatPanel onSend={handleChatSend} loading={loading} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Result Modal */}
      <AnimatePresence>
        {modal && (
          <ResultModal title={modal.title} onClose={closeModal}>
            {modal.content}
          </ResultModal>
        )}
      </AnimatePresence>
    </>
  )
}

export default AIToolsPanel
