// src/hooks/useGemini.ts
import genAI from '@/lib/gemini'

export const useGemini = () => {
  const sendPrompt = async (prompt: string) => {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro-exp-03-25' })
      const result = await model.generateContent(prompt)
      const response = result.response
      return response.text()
    } catch (error) {
      console.error('Gemini API Error:', error)
      return 'Something went wrong!'
    }
  }

  return { sendPrompt }
}
