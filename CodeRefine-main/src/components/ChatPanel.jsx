import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'

function ChatPanel({ onSend, loading }) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return
    const userMsg = { role: 'user', content: text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }))
      const reply = await onSend(text, history)
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${err.message}` }])
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col gap-3 mt-3">
      <div className="bg-white/5 border border-white/10 rounded-xl p-3 min-h-[200px] max-h-[350px] overflow-y-auto space-y-3">
        {messages.length === 0 && (
          <p className="text-gray-500 text-xs text-center py-8">Ask a question about your code…</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] px-3 py-2 rounded-xl text-sm whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-blue-500/30 text-white border border-blue-500/40'
                  : 'bg-white/10 text-gray-200 border border-white/10'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about the code… (Enter to send)"
          rows={2}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="px-3 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white disabled:opacity-50 flex items-center gap-1 text-sm"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  )
}

export default ChatPanel
