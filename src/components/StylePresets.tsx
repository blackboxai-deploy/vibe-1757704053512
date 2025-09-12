'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface StylePresetsProps {
  selectedStyle: string
  onStyleChange: (style: string) => void
}

const styles = [
  {
    id: 'realistic',
    name: 'Realistic',
    description: 'Photorealistic images with high detail',
    color: 'bg-blue-100 text-blue-800 hover:bg-blue-200'
  },
  {
    id: 'artistic',
    name: 'Artistic',
    description: 'Creative and expressive artwork',
    color: 'bg-purple-100 text-purple-800 hover:bg-purple-200'
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    description: 'Movie-like dramatic scenes',
    color: 'bg-red-100 text-red-800 hover:bg-red-200'
  },
  {
    id: 'fantasy',
    name: 'Fantasy',
    description: 'Magical and imaginative worlds',
    color: 'bg-pink-100 text-pink-800 hover:bg-pink-200'
  },
  {
    id: 'abstract',
    name: 'Abstract',
    description: 'Geometric and modern designs',
    color: 'bg-orange-100 text-orange-800 hover:bg-orange-200'
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Retro and classic aesthetics',
    color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean and simple compositions',
    color: 'bg-gray-100 text-gray-800 hover:bg-gray-200'
  },
  {
    id: 'portrait',
    name: 'Portrait',
    description: 'Professional character portraits',
    color: 'bg-green-100 text-green-800 hover:bg-green-200'
  }
]

export default function StylePresets({ selectedStyle, onStyleChange }: StylePresetsProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Art Style
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {styles.map((style) => (
          <Button
            key={style.id}
            variant={selectedStyle === style.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => onStyleChange(style.id)}
            className={`h-auto p-3 flex flex-col items-start text-left transition-all duration-200 ${
              selectedStyle === style.id
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'hover:bg-muted'
            }`}
          >
            <div className="font-medium text-sm">{style.name}</div>
            <div className="text-xs opacity-70 mt-1">{style.description}</div>
          </Button>
        ))}
      </div>
      
      {selectedStyle && (
        <div className="flex items-center gap-2 pt-2">
          <Badge variant="secondary" className="text-xs">
            Selected: {styles.find(s => s.id === selectedStyle)?.name}
          </Badge>
        </div>
      )}
    </div>
  )
}