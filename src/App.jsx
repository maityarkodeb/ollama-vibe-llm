import React from 'react'
import { useState } from 'react'
import './index.css'
import ChatMessage from './ChatMessage'

export default function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.2',
          messages: [...messages, userMessage],
          stream: false
        }),
      })

      const data = await res.json()
      const botMessage = { role: 'assistant', content: data.message.content }
      setMessages((prev) => [...prev, botMessage])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '⚠️ Error talking to Ollama.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chat-container">
      <h1>🧠 Ollama Vibe LLM</h1>
      <div className="chat-window">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} role={msg.role} content={msg.content} />
        ))}
        {loading && <ChatMessage role="assistant" content="..." />}
      </div>
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}
