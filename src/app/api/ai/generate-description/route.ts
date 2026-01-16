import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { propertyType, transactionType, area, rooms, bathrooms, floor, features, address, city, district } = body

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'AI API key not configured' }, { status: 500 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `당신은 부동산 전문가입니다. 다음 매물 정보를 바탕으로 고객에게 매력적으로 어필할 수 있는 매물 설명을 한국어로 작성해주세요.

매물 정보:
- 매물 유형: ${propertyType || '미정'}
- 거래 유형: ${transactionType || '미정'}
- 면적: ${area || '미정'}㎡
- 방 개수: ${rooms || '미정'}개
- 욕실 개수: ${bathrooms || '미정'}개
- 층수: ${floor || '미정'}층
- 위치: ${city || ''} ${district || ''} ${address || ''}
- 특징: ${features?.join(', ') || '없음'}

요구사항:
1. 3-5문장으로 작성해주세요
2. 매물의 장점을 부각해주세요
3. 전문적이면서도 친근한 톤으로 작성해주세요
4. 과장된 표현은 피해주세요`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const description = response.text()

    return NextResponse.json({ description })
  } catch (error) {
    console.error('AI generation error:', error)
    return NextResponse.json({ error: 'Failed to generate description' }, { status: 500 })
  }
}
