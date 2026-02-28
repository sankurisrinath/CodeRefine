function VisualizationView({ visualization }) {
  if (!visualization) return null

  const { type, data } = visualization
  const mermaidCode = data?.mermaid || ''
  const description = data?.description || ''

  return (
    <div className="mt-3 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded px-2 py-0.5 uppercase tracking-wide">{type}</span>
        {description && <span className="text-gray-400 text-xs">{description}</span>}
      </div>
      {mermaidCode ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-2">Mermaid Diagram Definition</p>
          <pre className="text-xs text-gray-200 whitespace-pre-wrap font-mono overflow-x-auto">{mermaidCode}</pre>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <pre className="text-xs text-gray-200 whitespace-pre-wrap font-mono overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default VisualizationView
