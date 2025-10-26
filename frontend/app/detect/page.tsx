"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { mockService } from "@/lib/mock-service"
import type { DetectionResponse } from "@/lib/types"
import { formatDiseaseName, getConfidenceColor, getConfidenceLevel } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, AlertCircle, CheckCircle } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import ImageUploadZone from "@/components/image-upload-zone"

export default function DetectPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
  const [result, setResult] = useState<DetectionResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleImageSelect = (file: File) => {
    setSelectedImage(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
    setResult(null)
    setError("")
  }

  const handleDetect = async () => {
    if (!selectedImage) return

    setIsLoading(true)
    setError("")

    try {
      const detectionResult = await mockService.detectDisease(selectedImage)
      setResult(detectionResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Detection failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setSelectedImage(null)
    setPreview("")
    setResult(null)
    setError("")
  }

  // Helper function to render markdown-formatted advisory
  const renderAdvisory = (advisory: string) => {
    return advisory.split('\n').map((line, i) => {
      // Handle bold text (**text**)
      if (line.includes('**')) {
        const parts = line.split('**')
        return (
          <p key={i} className="leading-relaxed mb-2">
            {parts.map((part, j) => 
              j % 2 === 1 ? (
                <strong key={j} className="font-semibold text-foreground">
                  {part}
                </strong>
              ) : (
                part
              )
            )}
          </p>
        )
      }
      
      // Handle emoji section headers (🔬, 🛡️, ⚠️)
      if (line.startsWith('🔬') || line.startsWith('🛡️') || line.startsWith('⚠️')) {
        return (
          <p key={i} className="font-semibold text-foreground mt-4 mb-2">
            {line}
          </p>
        )
      }
      
      // Handle numbered/bulleted lists
      if (line.match(/^\d+\./)) {
        return (
          <p key={i} className="leading-relaxed ml-4 mb-1 text-muted-foreground">
            {line}
          </p>
        )
      }
      
      // Regular lines
      if (line.trim()) {
        return (
          <p key={i} className="leading-relaxed mb-2 text-muted-foreground">
            {line}
          </p>
        )
      }
      
      return null
    })
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background">
        <DashboardHeader />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Detect Plant Disease</h1>
          <p className="text-muted-foreground mb-8">Upload an image of your plant to detect diseases</p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div>
              <ImageUploadZone onImageSelect={handleImageSelect} disabled={isLoading} />

              {preview && (
                <div className="mt-6">
                  <img
                    src={preview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full rounded-lg border border-border"
                  />
                  <div className="flex gap-3 mt-4">
                    <Button
                      onClick={handleDetect}
                      disabled={isLoading}
                      className="flex-1 bg-primary hover:bg-primary/90"
                    >
                      {isLoading ? "Analyzing..." : "Analyze Image"}
                    </Button>
                    <Button onClick={handleReset} variant="outline" disabled={isLoading}>
                      Clear
                    </Button>
                  </div>
                </div>
              )}

              {error && (
                <Card className="mt-6 p-4 border-destructive/50 bg-destructive/5">
                  <p className="text-destructive text-sm">{error}</p>
                </Card>
              )}
            </div>

            {/* Results Section */}
            <div>
              {result && (
                <Card className="p-6 border border-border">
                  <div className="flex items-start gap-4 mb-6">
                    {result.disease.toLowerCase().includes("healthy") ? (
                      <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                    ) : (
                      <AlertCircle className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
                    )}
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">{formatDiseaseName(result.disease)}</h2>
                      <p className={`text-sm font-semibold mt-1 ${getConfidenceColor(result.confidence)}`}>
                        {getConfidenceLevel(result.confidence)} Confidence ({Math.round(result.confidence * 100)}%)
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Treatment Advisory</h3>
                      
                      {/* Render markdown-formatted advisory */}
                      <div className="text-sm space-y-1">
                        {result.recommendations[0] ? (
                          renderAdvisory(result.recommendations[0])
                        ) : (
                          <p className="text-muted-foreground">No advisory available</p>
                        )}
                      </div>
                    </div>

                    <Button className="w-full bg-primary hover:bg-primary/90 mt-6">
                      Save to History
                    </Button>
                  </div>
                </Card>
              )}

              {!result && !preview && (
                <Card className="p-8 text-center border border-border">
                  <Upload className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">Upload an image to see results</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
