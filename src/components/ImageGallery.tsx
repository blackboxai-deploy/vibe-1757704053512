'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ImageCard from './ImageCard'
import type { GeneratedImage } from '@/app/page'

interface ImageGalleryProps {
  images: GeneratedImage[]
  onDeleteImage: (id: string) => void
  onRegenerateImage: (image: GeneratedImage) => void
}

export default function ImageGallery({ 
  images, 
  onDeleteImage, 
  onRegenerateImage 
}: ImageGalleryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest')

  // Get unique styles from images
  const availableStyles = Array.from(new Set(images.map(img => img.style)))

  // Filter and sort images
  const filteredImages = images
    .filter(image => {
      const matchesSearch = image.prompt.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStyle = !selectedStyle || image.style === selectedStyle
      return matchesSearch && matchesStyle
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      } else {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      }
    })

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedStyle(null)
    setSortBy('newest')
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          No images generated yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Start creating amazing AI-generated images using the Generate tab
        </p>
        <Button onClick={() => {
          const generateTab = document.querySelector('[value="generate"]') as HTMLElement
          generateTab?.click()
        }}>
          Generate Your First Image
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search images by prompt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={sortBy === 'newest' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('newest')}
            >
              Newest First
            </Button>
            <Button
              variant={sortBy === 'oldest' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('oldest')}
            >
              Oldest First
            </Button>
          </div>
        </div>

        {/* Style Filters */}
        {availableStyles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground self-center">Filter by style:</span>
            <Button
              variant={!selectedStyle ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStyle(null)}
            >
              All ({images.length})
            </Button>
            {availableStyles.map(style => {
              const count = images.filter(img => img.style === style).length
              return (
                <Button
                  key={style}
                  variant={selectedStyle === style ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStyle(style)}
                >
                  {style} ({count})
                </Button>
              )
            })}
          </div>
        )}

        {/* Active Filters */}
        {(searchTerm || selectedStyle) && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {searchTerm && (
              <Badge variant="secondary">
                Search: "{searchTerm}"
              </Badge>
            )}
            {selectedStyle && (
              <Badge variant="secondary">
                Style: {selectedStyle}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-xs"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {filteredImages.length} of {images.length} images
        </p>
      </div>

      {/* Images Grid */}
      {filteredImages.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            No images match your current filters
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="mt-2"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              onDelete={onDeleteImage}
              onRegenerate={onRegenerateImage}
            />
          ))}
        </div>
      )}
    </div>
  )
}