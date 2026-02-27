import { motion } from 'framer-motion'

const steps = [
  { number: '01', title: 'Paste Your Code', description: 'Select your programming language and paste or type your code into the Monaco editor.', icon: '📝' },
  { number: '02', title: 'AI + Rule Engine Analyze', description: 'Our hybrid system combines LLM analysis with static rule-based checks for comprehensive coverage.', icon: '🔍' },
  { number: '03', title: 'Confidence Score Calculated', description: 'Each finding is scored for confidence and severity, giving you prioritized, actionable insights.', icon: '📊' },
  { number: '04', title: 'Optimized Code Returned', description: 'Receive the refactored, optimized version of your code with all issues resolved.', icon: '✨' },
]

function HowItWorks() {
  return (
    <section className="py-24 px-4 sm:px-6 bg-white/2">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-5xl font-bold mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-gray-400 text-lg">Four simple steps to better code</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-30" />

          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 rounded-2xl glass flex items-center justify-center text-4xl mb-6 relative z-10 hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">
                <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">
                  {step.number}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
