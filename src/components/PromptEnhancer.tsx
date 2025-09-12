'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

interface PromptEnhancerProps {
  currentPrompt: string
  onPromptChange: (prompt: string) => void
}

const promptSuggestions = [
  'Add dramatic lighting',
  'Include vibrant colors',
  'Make it more detailed',
  'Add depth of field',
  'Include natural textures',
  'Add professional composition',
  'Make it more artistic',
  'Include atmospheric mood'
]

const quickPrompts = [
  'A majestic mountain landscape at sunset',
  'A futuristic city with flying cars',
  'A cozy library with warm lighting',
  'A magical forest with glowing mushrooms',
  'A steampunk mechanical invention',
  'A minimalist modern architecture',
  'A vintage car on a country road',
  'A space station orbiting Earth'
]

export default function PromptEnhancer({ currentPrompt, onPromptChange }: PromptEnhancerProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showQuickPrompts, setShowQuickPrompts] = useState(false)

  const handleAddSuggestion = (suggestion: string) => {
    const newPrompt = currentPrompt 
      ? `${currentPrompt}, ${suggestion.toLowerCase()}`
      : suggestion.toLowerCase()
    onPromptChange(newPrompt)
  }

  const handleQuickPrompt = (prompt: string) => {
    onPromptChange(prompt)
    setShowQuickPrompts(false)
  }

  const systemPromptInfo = `
Current System Configuration:
• AI Model: Flux 1.1 Pro (High-Quality Image Generation)
• Endpoint: Custom AI Gateway (No API Keys Required)
• Style Enhancement: Automatic based on selection
• Quality: Professional-grade outputs
• Processing: Advanced neural networks optimized for artistic generation
  `.trim()

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="text-sm"
        >
          {showSuggestions ? 'Hide' : 'Show'} Enhancement Suggestions
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowQuickPrompts(!showQuickPrompts)}
          className="text-sm"
        >
          {showQuickPrompts ? 'Hide' : 'Show'} Quick Prompts
        </Button>
      </div>

      {showSuggestions && (
        <Card>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Enhance Your Prompt:</h4>
              <div className="flex flex-wrap gap-2">
                {promptSuggestions.map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handleAddSuggestion(suggestion)}
                  >
                    + {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {showQuickPrompts && (
        <Card>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Quick Start Prompts:</h4>
              <div className="grid gap-2">
                {quickPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="justify-start text-left h-auto p-3"
                    onClick={() => handleQuickPrompt(prompt)}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-muted/50">
        <CardContent className="pt-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              AI System Configuration
            </h4>
            <Textarea
              value={systemPromptInfo}
              readOnly
              className="text-xs font-mono bg-background/50 h-32 resize-none"
            />
            <p className="text-xs text-muted-foreground">
              System prompt is automatically configured for optimal image generation. 
              Style enhancements are applied based on your selected art style.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}