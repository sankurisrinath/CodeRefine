import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import CodeEditor from '../components/CodeEditor'
import ResultsPanel from '../components/ResultsPanel'
import LoadingSpinner from '../components/LoadingSpinner'
import { languageLabels } from '../data/mockData'
import { analyzeCode } from '../services/api'
import { transformResponse } from '../utils/transformResponse'

function ToolPage() {
  const [language, setLanguage] = useState('python')
  const [code, setCode] = useState('')
  const [results, setResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang)
    setResults(null)
  }

  const handleAnalyze = async () => {
    setIsLoading(true)
    setResults(null)
    setError(null)
    try {
      const apiResponse = await analyzeCode({ language, mode: "Bug Detection", code, instruction: "" })
      setResults(transformResponse(apiResponse))
    } catch {
      setError('AI Analysis Failed. Please try again.')
      setResults(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-[#0a0a0f] min-h-screen">
      <Navbar />
      <div className="pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8"
        >
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Code Analysis Tool</h1>
            <p className="text-gray-400 text-sm mt-1">Paste your code and get AI-powered analysis</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 min-h-[calc(100vh-200px)]">
            {/* Left: Editor */}
            <div className="flex flex-col gap-4">
              <div className="glass rounded-2xl p-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-400">Language:</label>
                    <select
                      value={language}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                      className="bg-white/10 border border-white/20 text-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      {Object.entries(languageLabels).map(([value, label]) => (
                        <option key={value} value={value} className="bg-gray-900">
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <CodeEditor
                  language={language}
                  value={code}
                  onChange={(val) => setCode(val || '')}
                />

                <motion.button
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  className={`w-full mt-4 py-3.5 rounded-xl font-semibold text-white transition-all ${
                    isLoading
                      ? 'bg-gray-700 cursor-not-allowed opacity-60'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/20'
                  }`}
                >
                  {isLoading ? '⏳ Analyzing...' : '🔍 Analyze Code'}
                </motion.button>
              </div>
            </div>

            {/* Right: Results */}
            <div className="glass rounded-2xl p-5 min-h-[600px] flex flex-col">
              {isLoading ? (
                <LoadingSpinner />
              ) : error ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="text-red-400 text-lg font-semibold mb-2">⚠️ {error}</div>
                  </div>
                </div>
              ) : (
                <ResultsPanel results={results} language={language} />
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ToolPage
