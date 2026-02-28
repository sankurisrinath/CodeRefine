function MetricsCard({ metrics }) {
  if (!metrics) return null

  const items = [
    { label: 'Lines of Code', value: metrics.lines_of_code, icon: '📄' },
    { label: 'Cyclomatic Complexity', value: metrics.cyclomatic_complexity, icon: '🔀' },
    { label: 'Maintainability Index', value: metrics.maintainability_index?.toFixed(1), icon: '🛠️' },
    { label: 'Functions', value: metrics.functions_count, icon: '🔧' },
    { label: 'Classes', value: metrics.classes_count, icon: '🏗️' },
    { label: 'Comments Ratio', value: `${(metrics.comments_ratio * 100).toFixed(1)}%`, icon: '💬' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
      {items.map((item) => (
        <div key={item.label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
          <div className="text-xl mb-1">{item.icon}</div>
          <div className="text-white font-semibold text-lg">{item.value ?? '—'}</div>
          <div className="text-gray-400 text-xs mt-0.5">{item.label}</div>
        </div>
      ))}
    </div>
  )
}

export default MetricsCard
