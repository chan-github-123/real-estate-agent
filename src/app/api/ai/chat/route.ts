import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    // Check API key first
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured')
      return NextResponse.json(
        { error: 'AI service is not configured properly' },
        { status: 500 }
      )
    }

    // Parse and validate request body
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const { message, context } = body

    // Validate message
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required and must be a non-empty string' },
        { status: 400 }
      )
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { error: 'Message is too long (max 1000 characters)' },
        { status: 400 }
      )
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const systemPrompt = `당신은 부동산 중개 전문 AI 상담사입니다.
고객의 부동산 관련 질문에 친절하고 전문적으로 답변해주세요.

역할:
- 매물 문의 및 상담 안내
- 부동산 용어 설명
- 지역 정보 제공
- 계약 절차 안내

주의사항:
- 항상 정중하고 친절하게 응대하세요
- 확실하지 않은 정보는 "정확한 확인이 필요합니다"라고 말해주세요
- 구체적인 법률 조언은 피하고, 전문가 상담을 권유하세요
- 답변은 간결하고 명확하게 해주세요 (3-5문장)

${context ? `현재 보고 있는 매물 정보:\n${context}` : ''}`

    const result = await model.generateContent([
      { text: systemPrompt },
      { text: `고객 질문: ${message}` }
    ])
    const response = await result.response
    const reply = response.text()

    if (!reply) {
      throw new Error('Empty response from AI model')
    }

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('AI chat error:', error)

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'AI service authentication failed' },
          { status: 500 }
        )
      }
      if (error.message.includes('quota') || error.message.includes('limit')) {
        return NextResponse.json(
          { error: 'AI service quota exceeded. Please try again later' },
          { status: 429 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to process your request. Please try again' },
      { status: 500 }
    )
  }
}
