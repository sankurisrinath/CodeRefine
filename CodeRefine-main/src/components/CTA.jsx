import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

function CTA() {
  return (
    <section className="py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-3xl p-12 text-center relative overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-blue-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-purple-500/20 blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-5xl font-black mb-6">
              Ready to Write{' '}
              <span className="gradient-text">Better Code?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
              Start analyzing your code with AI-powered insights. No sign up required —
              paste your code and get instant feedback.
            </p>
            <Link
              to="/tool"
              className="inline-block px-10 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all transform hover:scale-105 shadow-2xl shadow-blue-500/25"
            >
              Start Analyzing Now →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CTA
