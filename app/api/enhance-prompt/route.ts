import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prompt, tone, difficulty } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    // Simple prompt enhancement logic
    let enhancedPrompt = prompt

    // Add tone-specific enhancements
    switch (tone) {
      case 'Professional':
        enhancedPrompt = `Write a professional response that is: ${prompt}. Ensure the tone is formal, polite, and business-appropriate.`
        break
      case 'Casual':
        enhancedPrompt = `Write a casual, friendly response: ${prompt}. Use a conversational tone and be approachable.`
        break
      case 'Friendly':
        enhancedPrompt = `Write a warm, friendly response: ${prompt}. Be encouraging and positive in your approach.`
        break
      case 'Formal':
        enhancedPrompt = `Write a formal response: ${prompt}. Use proper business language and maintain a professional demeanor.`
        break
      case 'Creative':
        enhancedPrompt = `Write a creative, engaging response: ${prompt}. Use vivid language and innovative approaches.`
        break
    }

    // Add difficulty-specific enhancements
    switch (difficulty) {
      case 'Easy':
        enhancedPrompt += ' Keep the language simple and easy to understand.'
        break
      case 'Normal':
        enhancedPrompt += ' Use clear, well-structured language.'
        break
      case 'Expert':
        enhancedPrompt += ' Use advanced terminology and sophisticated language structures.'
        break
      case 'Auto':
        enhancedPrompt += ' Adapt the complexity based on the context and audience.'
        break
    }

    return NextResponse.json({ 
      enhancedPrompt,
      originalPrompt: prompt,
      tone,
      difficulty
    })

  } catch (error) {
    console.error('Error enhancing prompt:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
