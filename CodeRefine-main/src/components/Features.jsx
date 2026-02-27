import { motion } from 'framer-motion'

const features = [
  {
    icon: '🤖',
    title: 'AI Capabilities',
    color: 'from-blue-500 to-cyan-500',
    items: ['Bug detection', 'Performance optimization', 'Secure coding checks', 'Code rewriting'],
  },
  {
    icon: '⚙️',
    title: 'Engineering Features',
    color: 'from-purple-500 to-pink-500',
    items: ['Confidence scoring', 'Severity classification', 'Structured output', 'Multi-language support'],
  },
  {
    icon: '🏭',
    title: 'Industry Alignment',
    color: 'from-orange-500 to-red-500',
    items: ['Hybrid analysis (AI + Static)', 'API-based architecture', 'Inspired by real-world tools', 'Production-ready patterns'],
  },
]

function Features() {
  return (
    <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl sm:text-5xl font-bold mb-4">
          Everything You Need for{' '}
          <span className="gradient-text">Better Code</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Comprehensive code analysis powered by AI and static analysis techniques
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="glass rounded-2xl p-8 hover:border-white/20 transition-all"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl mb-6`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-4 text-white">{feature.title}</h3>
            <ul className="space-y-3">
              {feature.items.map((item) => (
                <li key={item} className="flex items-center gap-3 text-gray-400">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.color} flex-shrink-0`} />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default Features
