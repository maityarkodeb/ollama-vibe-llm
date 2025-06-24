import React from 'react'

export default function ChatMessage({ role, content }) {
  return (
    <div className={`message ${role}`}>
      <strong>{role === 'user' ? 'You' : 'Bot'}:</strong> {content}
    </div>
  )
}
