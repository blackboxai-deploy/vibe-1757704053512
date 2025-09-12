'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { downloadImage, copyImageToClipboard, generateFilename, formatTimestamp } from '@/lib/image-utils'
import type { GeneratedImage } from '@/app/page'

interface ImageCardProps {
  image: GeneratedImage
  onDelete: (id: string) => void
  onRegenerate: (image: GeneratedImage) => void
}

export default function ImageCard({ image, onDelete, onRegenerate }: ImageCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  const handleDownload = async () => {
    try {
      setIsLoading(true)
      const filename = generateFilename(image.prompt, image.style)
      await downloadImage(image.url, filename)
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      setIsLoading(true)
      await copyImageToClipboard(image.url)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={image.url}
            alt={image.prompt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleDownload}
                disabled={isLoading}
                className="bg-white/90 hover:bg-white text-black"
              >
                {isLoading ? '...' : 'Download'}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleCopy}
                disabled={isLoading}
                className="bg-white/90 hover:bg-white text-black"
              >
                {copySuccess ? 'Copied!' : isLoading ? '...' : 'Copy'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 space-y-3">
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {image.style}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatTimestamp(image.timestamp)}
            </span>
          </div>
          
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
            {image.prompt}
          </p>
        </div>
        
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRegenerate(image)}
            className="flex-1 text-xs"
          >
            Regenerate
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(image.id)}
            className="text-xs"
          >
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}