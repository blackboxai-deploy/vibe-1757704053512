'use client'

import { useEffect, useState } from 'react'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface GenerationProgressProps {
  isGenerating: boolean
  estimatedTime: number
  onComplete?: () => void
}

export default function GenerationProgress({ 
  isGenerating, 
  estimatedTime, 
  onComplete 
}: GenerationProgressProps) {
  const [progress, setProgress] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [status, setStatus] = useState('Initializing...')

  useEffect(() => {
    if (!isGenerating) {
      setProgress(0)
      setElapsedTime(0)
      setStatus('Ready')
      return
    }

    setProgress(0)
    setElapsedTime(0)
    setStatus('Connecting to AI service...')

    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      setElapsedTime(elapsed)

      // Calculate progress based on elapsed time vs estimated time
      const progressPercent = Math.min((elapsed / estimatedTime) * 100, 95)
      setProgress(progressPercent)

      // Update status based on progress
      if (elapsed < 3) {
        setStatus('Connecting to AI service...')
      } else if (elapsed < 8) {
        setStatus('Processing your prompt...')
      } else if (elapsed < 15) {
        setStatus('AI is creating your image...')
      } else if (elapsed < estimatedTime * 0.7) {
        setStatus('Generating high-quality details...')
      } else if (elapsed < estimatedTime * 0.9) {
        setStatus('Applying final touches...')
      } else {
        setStatus('Almost ready...')
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isGenerating, estimatedTime])

  if (!isGenerating) {
    return null
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="font-medium text-primary">Generating Image</span>
            </div>
            <Badge variant="secondary">
              {formatTime(elapsedTime)} / {formatTime(estimatedTime)}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{status}</span>
              <span className="text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-lg font-semibold text-primary">
                {Math.round(progress)}%
              </div>
              <div className="text-xs text-muted-foreground">Progress</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-semibold text-blue-600">
                {formatTime(elapsedTime)}
              </div>
              <div className="text-xs text-muted-foreground">Elapsed</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-semibold text-green-600">
                {formatTime(Math.max(0, estimatedTime - elapsedTime))}
              </div>
              <div className="text-xs text-muted-foreground">Remaining</div>
            </div>
          </div>

          {elapsedTime > estimatedTime && (
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Generation is taking longer than expected. Please wait...
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}