import Editor from '@monaco-editor/react'
import { monacoLanguageMap } from '../data/mockData'

function CodeEditor({ language, value, onChange }) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/10" style={{ height: '400px' }}>
      <Editor
        height="100%"
        language={monacoLanguageMap[language]}
        value={value}
        onChange={onChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          suggest: { showKeywords: true },
        }}
      />
    </div>
  )
}

export default CodeEditor
