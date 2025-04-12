import { useEffect, useState } from 'react'
import { generateGeminiPrompt } from '../lib/utils'
import { supabase } from '../integrations/supabase/client'
import { useGemini } from '@/hooks/useGemini'

export default function DashboardInsight() {
  const [insights, setInsights] = useState('')
  const [loading, setLoading] = useState(true)
    const { sendPrompt } = useGemini()
  useEffect(() => {
    const fetchAndAnalyze = async () => {
      const { data: transactions } = await supabase.from('transactions').select('*')
      if (!transactions) return

      const prompt = generateGeminiPrompt(transactions)
      console.log('Prompt:', prompt)
      const result = await sendPrompt(prompt)
      setInsights(result)
      setLoading(false)
    }

    fetchAndAnalyze()
  }, [])

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">💡 Your Financial Insights</h2>
      {loading ? (
        <p className="animate-pulse text-gray-500">Analyzing your spending patterns...</p>
      ) : (
        <div className="bg-gray-50 dark:bg-[#14213D] p-4 rounded-xl shadow-lg text-gray-900 dark:text-white whitespace-pre-line">
          {insights}
        </div>
      )}
    </div>
  )
}
