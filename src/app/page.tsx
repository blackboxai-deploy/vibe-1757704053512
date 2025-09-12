'use client'

import { useState } from 'react'
import ImageGenerator from '@/components/ImageGenerator'
import ImageGallery from '@/components/ImageGallery'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export interface GeneratedImage {
  id: string
  url: string
  prompt: string
  style: string
  timestamp: Date
}

export default function HomePage() {
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const handleImageGenerated = (newImage: GeneratedImage) => {
    setGeneratedImages(prev => [newImage, ...prev])
  }

  const handleDeleteImage = (id: string) => {
    setGeneratedImages(prev => prev.filter(img => img.id !== id))
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
          AI Image Generator
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Create stunning AI-generated images with advanced prompts and artistic styles. 
          Powered by cutting-edge AI technology for professional-quality results.
        </p>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="generate">Generate Images</TabsTrigger>
          <TabsTrigger value="gallery">
            Gallery ({generatedImages.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Image Generation Studio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImageGenerator
                onImageGenerated={handleImageGenerated}
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery">
          <Card>
            <CardHeader>
              <CardTitle>Generated Images Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageGallery
                images={generatedImages}
                onDeleteImage={handleDeleteImage}
                onRegenerateImage={(image) => {
                  // Switch to generate tab and populate with image data
                  const generateTab = document.querySelector('[value="generate"]') as HTMLElement
                  generateTab?.click()
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}