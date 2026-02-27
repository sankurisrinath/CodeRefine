import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">CR</span>
            </div>
            <span className="font-bold text-lg gradient-text">CodeRefine</span>
          </div>

          <div className="text-center">
            <p className="text-gray-500 text-sm mb-2">Built with</p>
            <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-600">
              {['React', 'Vite', 'Tailwind CSS', 'Monaco Editor', 'Framer Motion', 'Recharts', 'FastAPI'].map((tech) => (
                <span key={tech} className="px-2 py-1 glass rounded-md text-gray-400">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="text-gray-600 text-sm text-center md:text-right">
            <p>© 2024 CodeRefine</p>
            <p className="mt-1">AI-Powered Code Review Engine</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
