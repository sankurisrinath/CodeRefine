import { motion } from 'framer-motion'

const pipeline = [
  { label: 'Frontend', sublabel: 'React + Monaco', color: 'from-blue-500 to-cyan-500', icon: '💻' },
  { label: 'FastAPI', sublabel: 'REST Endpoints', color: 'from-cyan-500 to-teal-500', icon: '⚡' },
  { label: 'Static Analyzer', sublabel: 'Rule Engine', color: 'from-teal-500 to-green-500', icon: '🔬' },
  { label: 'LLM API', sublabel: 'GPT / Gemini', color: 'from-purple-500 to-pink-500', icon: '🧠' },
  { label: 'Aggregator', sublabel: 'Score Engine', color: 'from-orange-500 to-red-500', icon: '⚙️' },
  { label: 'Structured Response', sublabel: 'JSON Output', color: 'from-blue-500 to-purple-500', icon: '📦' },
]

function Architecture() {
  return (
    <section id="architecture" className="py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-5xl font-bold mb-4">
            System <span className="gradient-text">Architecture</span>
          </h2>
          <p className="text-gray-400 text-lg">How CodeRefine processes and analyzes your code</p>
        </motion.div>

        {/* Pipeline */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-2">
          {pipeline.map((node, index) => (
            <div key={node.label} className="flex flex-col lg:flex-row items-center gap-2 lg:gap-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                className="glass rounded-xl p-4 text-center min-w-[120px] hover:border-white/20 transition-all"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${node.color} flex items-center justify-center text-xl mx-auto mb-2`}>
                  {node.icon}
                </div>
                <div className="font-semibold text-white text-sm">{node.label}</div>
                <div className="text-gray-500 text-xs mt-1">{node.sublabel}</div>
              </motion.div>

              {index < pipeline.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
                  className="text-blue-500 font-bold text-xl lg:text-2xl rotate-90 lg:rotate-0"
                >
                  →
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Description cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {[
            { title: 'Hybrid Analysis', desc: 'Combines AI language models with deterministic static analysis for reliable, comprehensive results.', icon: '🔀' },
            { title: 'Confidence Scoring', desc: 'Each finding is assigned a confidence score based on the agreement between AI and static rules.', icon: '📊' },
            { title: 'Structured Output', desc: 'Results are returned as structured JSON with severity, line numbers, and actionable suggestions.', icon: '📋' },
          ].map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass rounded-xl p-6"
            >
              <div className="text-3xl mb-3">{card.icon}</div>
              <h3 className="font-bold text-white mb-2">{card.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Architecture
