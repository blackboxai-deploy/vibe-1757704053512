export const downloadImage = async (imageUrl: string, filename: string) => {
  try {
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading image:', error)
    throw error
  }
}

export const copyImageToClipboard = async (imageUrl: string) => {
  try {
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    
    if (navigator.clipboard && window.ClipboardItem) {
      const item = new ClipboardItem({ [blob.type]: blob })
      await navigator.clipboard.write([item])
    } else {
      // Fallback: copy URL to clipboard
      await navigator.clipboard.writeText(imageUrl)
    }
  } catch (error) {
    console.error('Error copying image:', error)
    // Fallback: copy URL to clipboard
    try {
      await navigator.clipboard.writeText(imageUrl)
    } catch (fallbackError) {
      throw new Error('Unable to copy image or URL to clipboard')
    }
  }
}

export const generateFilename = (prompt: string, style: string): string => {
  const sanitizedPrompt = prompt
    .substring(0, 50)
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
  
  const timestamp = new Date().toISOString().substring(0, 16).replace(/[:]/g, '-')
  return `ai-image-${sanitizedPrompt}-${style}-${timestamp}.png`
}

export const validateImageUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

export const estimateGenerationTime = (prompt: string, style: string): number => {
  // Base time in seconds
  let baseTime = 30
  
  // Add time based on prompt complexity
  const wordCount = prompt.split(' ').length
  baseTime += Math.min(wordCount * 2, 60)
  
  // Add time based on style complexity
  const styleMultipliers: Record<string, number> = {
    realistic: 1.5,
    artistic: 1.3,
    cinematic: 1.4,
    fantasy: 1.6,
    abstract: 1.0,
    minimalist: 0.8,
    vintage: 1.1,
    portrait: 1.2
  }
  
  const multiplier = styleMultipliers[style] || 1.0
  return Math.round(baseTime * multiplier)
}

export const formatTimestamp = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}