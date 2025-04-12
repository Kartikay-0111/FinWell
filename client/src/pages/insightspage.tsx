// src/pages/InsightsPage.tsx
import { useState } from 'react'
import { useGemini } from '@/hooks/useGemini'

export default function InsightsPage() {
  const { sendPrompt } = useGemini()
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAsk = async () => {
    setLoading(true)
    const result = await sendPrompt(input)
    setResponse(result)
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gemini Insights</h1>
      <textarea
        className="w-full border rounded p-2 text-black"
        rows={4}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask something like: 'Summarize my expenses for this month'"
      />
      <button
        onClick={handleAsk}
        className="mt-4 bg-[#00B386] hover:bg-[#01916e] text-black px-4 py-2 rounded"
      >
        {loading ? 'Thinking...' : 'Ask Gemini'}
      </button>

      {response && (
        <div className="mt-6 p-4 bg-gray-100 rounded border text-gray-800 whitespace-pre-wrap">
          {response}
        </div>
      )}
    </div>
  )
}
