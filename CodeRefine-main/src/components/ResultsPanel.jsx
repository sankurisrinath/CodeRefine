import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import TabButton from './TabButton'
import IssueCard from './IssueCard'

import OptimizedCodeView from './OptimizedCodeView'

const tabs = [
  { id: 'bugs', label: '🐛 Bugs' },
  { id: 'performance', label: '⚡ Performance' },
  { id: 'security', label: '🔒 Security' },
  { id: 'bestPractices', label: '✅ Best Practices' },
  { id: 'optimizedCode', label: '🔧 Optimized Code' },
  
]

function ResultsPanel({ results, language }) {
  const [activeTab, setActiveTab] = useState('bugs')

  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
        <div className="text-6xl">🔍</div>
        <h3 className="text-xl font-semibold text-gray-300">Ready to Analyze</h3>
        <p className="text-gray-500 text-sm max-w-xs">
          Paste your code in the editor and click &quot;Analyze&quot; to get AI-powered insights
        </p>
      </div>
    )
  }

  const getTabCount = (tabId) => {
    if (['bugs', 'performance', 'security', 'bestPractices'].includes(tabId)) {
      return results[tabId]?.length || 0
    }
    return undefined
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'bugs':
      case 'performance':
      case 'security':
      case 'bestPractices': {
        const issues = results[activeTab] || []
        if (issues.length === 0) {
          return (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <div className="text-4xl">✅</div>
              <p className="text-gray-400">No issues found in this category</p>
            </div>
          )
        }
        return (
          <div className="flex flex-col gap-4">
            {issues.map((issue, index) => (
              <IssueCard key={index} issue={issue} index={index} />
            ))}
          </div>
        )
      }
      case 'optimizedCode':
        return <OptimizedCodeView code={results.optimizedCode} language={language} />
      
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex gap-1 flex-wrap mb-4 p-1 glass rounded-xl">
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            label={tab.label}
            isActive={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            count={getTabCount(tab.id)}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ResultsPanel
