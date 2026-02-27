import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts'
import { motion } from 'framer-motion'
import { getConfidenceLabel, getConfidenceColor } from '../utils/helpers'

function ConfidenceChart({ score }) {
  const label = getConfidenceLabel(score)
  const color = getConfidenceColor(score)
  const data = [{ value: score, fill: color }]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-6"
    >
      <div className="glass rounded-2xl p-8 w-full max-w-sm mx-auto">
        <h3 className="text-center font-semibold text-gray-300 mb-6">Analysis Confidence</h3>
        <div className="relative w-48 h-48 mx-auto">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="100%"
              barSize={12}
              data={data}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar
                background={{ fill: 'rgba(255,255,255,0.05)' }}
                dataKey="value"
                cornerRadius={6}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black" style={{ color }}>{score}%</span>
            <span className="text-sm font-semibold" style={{ color }}>{label}</span>
          </div>
        </div>
      </div>

      <div className="glass rounded-xl p-5 w-full max-w-sm mx-auto">
        <h4 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
          <span>ℹ️</span> How Confidence is Calculated
        </h4>
        <p className="text-gray-400 text-sm leading-relaxed">
          The confidence score reflects the degree of agreement between the AI model&apos;s analysis
          and the static rule engine. High confidence (≥80%) means both systems identified the
          same issues. Lower scores indicate areas where AI and static rules diverge.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full max-w-sm mx-auto">
        {[
          { label: 'High', range: '≥ 80%', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
          { label: 'Medium', range: '60–79%', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
          { label: 'Low', range: '< 60%', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
        ].map((item) => (
          <div key={item.label} className={`glass ${item.bg} border ${item.border} rounded-lg p-3 text-center`}>
            <div className={`font-bold text-sm ${item.color}`}>{item.label}</div>
            <div className="text-gray-500 text-xs mt-1">{item.range}</div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default ConfidenceChart
