import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, style = 'realistic' } = body

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Enhance prompt based on style
    const enhancedPrompt = enhancePromptWithStyle(prompt, style)

    // Call AI API using custom endpoint (no API keys required)
    const response = await fetch('https://oi-server.onrender.com/chat/completions', {
      method: 'POST',
      headers: {
        'CustomerId': 'cus_T2hPAuJB6bNZjy',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx'
      },
      body: JSON.stringify({
        model: 'replicate/black-forest-labs/flux-1.1-pro',
        messages: [
          {
            role: 'user',
            content: enhancedPrompt
          }
        ]
      }),
      signal: AbortSignal.timeout(300000) // 5 minute timeout
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('AI API Error:', errorText)
      return NextResponse.json(
        { error: 'Failed to generate image', details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Extract image URL from response
    let imageUrl = ''
    if (data.choices?.[0]?.message?.content) {
      const content = data.choices[0].message.content
      // Look for image URL in the response
      const urlMatch = content.match(/https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)/i)
      if (urlMatch) {
        imageUrl = urlMatch[0]
      } else {
        // If no direct URL found, use the content as URL (some APIs return direct URLs)
        imageUrl = content.trim()
      }
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'No image URL received from AI service' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      prompt: enhancedPrompt,
      originalPrompt: prompt,
      style,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Image generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error during image generation' },
      { status: 500 }
    )
  }
}

function enhancePromptWithStyle(prompt: string, style: string): string {
  const styleEnhancements = {
    realistic: `${prompt}, photorealistic, high quality, detailed, professional photography`,
    artistic: `${prompt}, artistic masterpiece, creative composition, vibrant colors, expressive style`,
    abstract: `${prompt}, abstract art, geometric patterns, bold colors, modern design`,
    vintage: `${prompt}, vintage style, retro aesthetic, aged texture, classic composition`,
    cinematic: `${prompt}, cinematic lighting, dramatic composition, movie still, high contrast`,
    minimalist: `${prompt}, minimalist design, clean lines, simple composition, elegant`,
    fantasy: `${prompt}, fantasy art, magical atmosphere, ethereal lighting, imaginative`,
    portrait: `${prompt}, professional portrait, studio lighting, sharp focus, detailed features`
  }

  return styleEnhancements[style as keyof typeof styleEnhancements] || 
         `${prompt}, high quality, detailed, professional`
}