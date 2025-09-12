'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import StylePresets from './StylePresets'
import PromptEnhancer from './PromptEnhancer'
import GenerationProgress from './GenerationProgress'
import { estimateGenerationTime } from '@/lib/image-utils'
import type { GeneratedImage } from '@/app/page'

interface ImageGeneratorProps {
  onImageGenerated: (image: GeneratedImage) => void
  isGenerating: boolean
  setIsGenerating: (generating: boolean) => void
}

export default function ImageGenerator({
  onImageGenerated,
  isGenerating,
  setIsGenerating
}: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('realistic')
  const [error, setError] = useState('')
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null)
  const [estimatedTime, setEstimatedTime] = useState(30)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt for image generation')
      return
    }

    setError('')
    setIsGenerating(true)
    setGeneratedImage(null)
    setEstimatedTime(estimateGenerationTime(prompt, selectedStyle))

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style: selectedStyle,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image')
      }

      if (data.success && data.imageUrl) {
        const newImage: GeneratedImage = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          url: data.imageUrl,
          prompt: data.originalPrompt || prompt,
          style: selectedStyle,
          timestamp: new Date(data.timestamp || Date.now())
        }

        setGeneratedImage(newImage)
        onImageGenerated(newImage)
      } else {
        throw new Error('Invalid response from image generation service')
      }
    } catch (err) {
      console.error('Image generation error:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate image. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveToGallery = () => {
    if (generatedImage) {
      // Image is already saved via onImageGenerated
      setGeneratedImage(null)
      setPrompt('')
    }
  }

  const handleRegenerateWithSamePrompt = () => {
    if (generatedImage) {
      handleGenerate()
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="enhance">Enhance & Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6 mt-6">
          {/* Main Generation Interface */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Image Description
              </label>
              <Textarea
                placeholder="Describe the image you want to generate... (e.g., 'A serene mountain lake at sunset with reflections')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] resize-none"
                disabled={isGenerating}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{prompt.length} characters</span>
                <span>Recommended: 20-200 characters</span>
              </div>
            </div>

            <StylePresets
              selectedStyle={selectedStyle}
              onStyleChange={setSelectedStyle}
            />

            <div className="flex gap-3">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="flex-1 h-12 text-base font-medium"
              >
                {isGenerating ? 'Generating...' : 'Generate Image'}
              </Button>
              
              {generatedImage && !isGenerating && (
                <Button
                  variant="outline"
                  onClick={handleRegenerateWithSamePrompt}
                  className="h-12"
                >
                  Regenerate
                </Button>
              )}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Generation Progress */}
          {isGenerating && (
            <GenerationProgress
              isGenerating={isGenerating}
              estimatedTime={estimatedTime}
            />
          )}

          {/* Generated Image Display */}
          {generatedImage && !isGenerating && (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={generatedImage.url}
                  alt={generatedImage.prompt}
                  className="w-full h-auto max-h-96 object-contain mx-auto"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleSaveToGallery}
                  className="flex-1"
                >
                  Save to Gallery
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Download functionality
                    const link = document.createElement('a')
                    link.href = generatedImage.url
                    link.download = `ai-image-${Date.now()}.png`
                    link.click()
                  }}
                >
                  Download
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRegenerateWithSamePrompt}
                >
                  Regenerate
                </Button>
              </div>

              <div className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">
                <p><strong>Prompt:</strong> {generatedImage.prompt}</p>
                <p><strong>Style:</strong> {generatedImage.style}</p>
                <p><strong>Generated:</strong> {generatedImage.timestamp.toLocaleString()}</p>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="enhance" className="mt-6">
          <PromptEnhancer
            currentPrompt={prompt}
            onPromptChange={setPrompt}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}