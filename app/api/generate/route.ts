import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
})

export async function POST(req: NextRequest) {
  const { productName, keywords, platform } = await req.json()

  if (!productName || !platform) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

const platformGuides: Record<string, string> = {
  shopify: 'conversion-focused, clean and persuasive, highlight benefits',
  etsy:    'warm, handcrafted tone, storytelling, emotional connection',
  amazon:  'keyword-dense, feature-focused, use bullet points with caps',
}
const platformGuide = platformGuides[platform] || 'clear and professional'

  const prompt = `
You are an expert e-commerce copywriter.
Generate a product listing for the following product:

Product Name: ${productName}
Keywords: ${keywords}
Platform: ${platform}
Style guide: ${platformGuide}

Return ONLY a JSON object with this exact structure, no markdown:
{
  "title": "SEO-optimized product title (max 80 chars)",
  "description": "compelling product description (150-200 words)",
  "bullets": [
    "bullet point 1",
    "bullet point 2",
    "bullet point 3",
    "bullet point 4",
    "bullet point 5"
  ]
}
`

  const response = await client.chat.completions.create({
    model: 'qwen/qwen3-coder-480b-a35b-instruct',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  })

  const text = response.choices[0].message.content || ''

  try {
    const clean = text.replace(/```json|```/g, '').trim()
    const result = JSON.parse(clean)
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Failed to parse response' }, { status: 500 })
  }
}