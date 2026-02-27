import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

function Hero() {
  const scrollToArchitecture = () => {
    document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-2 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 mb-6">
            ✨ Powered by Generative AI
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-7xl font-black leading-tight mb-6"
        >
          AI-Powered{' '}
          <span className="gradient-text">Code Review</span>
          <br />& Optimization Engine
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Detect bugs, performance issues, and security vulnerabilities using Generative AI.
          Get instant, actionable code improvements with confidence scoring.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/tool"
            className="px-8 py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all transform hover:scale-105 shadow-lg shadow-blue-500/25"
          >
            Try Now →
          </Link>
          <button
            onClick={scrollToArchitecture}
            className="px-8 py-4 rounded-xl font-semibold text-lg glass hover:bg-white/10 text-gray-300 hover:text-white transition-all border border-white/10"
          >
            View Architecture
          </button>
        </motion.div>

        {/* Floating code snippet */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 max-w-2xl mx-auto glass rounded-2xl p-6 text-left font-mono text-sm overflow-hidden"
        >
          <div className="flex gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="text-gray-500 text-xs mb-2"># CodeRefine Analysis</div>
          <div><span className="text-purple-400">def</span> <span className="text-blue-400">process_data</span><span className="text-gray-300">(data):</span></div>
          <div className="text-gray-500 ml-4"># ⚠️ High severity: No null check</div>
          <div className="ml-4"><span className="text-yellow-400">result</span> <span className="text-gray-300">= data.transform()</span></div>
          <div className="mt-2 text-green-400 text-xs">✓ AI Analysis Complete — Confidence: 87%</div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
