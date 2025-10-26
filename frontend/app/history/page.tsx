"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { mockService } from "@/lib/mock-service"
import type { DetectionResult } from "@/lib/types"
import { formatDate, formatDiseaseName, getConfidenceColor } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown, Check, X } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import { useToast } from "@/hooks/use-toast"

export default function HistoryPage() {
  const [detections, setDetections] = useState<DetectionResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "healthy" | "diseased">("all")
  const { toast } = useToast()

  const loadDetections = async () => {
    setIsLoading(true)
    try {
      const data = await mockService.getDetectionHistory()
      console.log('Loaded detections:', data)
      setDetections(data)
    } catch (error) {
      console.error('Error loading detections:', error)
      toast({
        title: "Error",
        description: "Failed to load detection history",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDetections()
  }, [])

  const filteredDetections = detections.filter((d) => {
    if (filter === "healthy") return d.disease.toLowerCase().includes("healthy")
    if (filter === "diseased") return !d.disease.toLowerCase().includes("healthy")
    return true
  })

  const handleFeedback = async (id: string, accurate: boolean) => {
    try {
      console.log('Submitting feedback for detection:', id, 'accurate:', accurate)
      await mockService.submitFeedback(Number(id), accurate)
      
      toast({
        title: "Success",
        description: "Thank you for your feedback!",
      })
      
      // Update local state immediately
      setDetections(prev => prev.map(d => 
        d.id === id ? { ...d, feedback: accurate } : d
      ))
      
      // Reload to ensure sync
      // setTimeout(() => loadDetections(), 500)
    } catch (error: any) {
      console.error('Feedback submission error:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to submit feedback",
        variant: "destructive",
      })
    }
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background">
        <DashboardHeader />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Detection History</h1>
          <p className="text-muted-foreground mb-8">View all your plant disease detections</p>

          {/* Filters */}
          <div className="flex gap-3 mb-8">
            {(["all", "healthy", "diseased"] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                onClick={() => setFilter(f)}
                className={filter === f ? "bg-primary hover:bg-primary/90" : ""}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>

          {/* Detections List */}
          {isLoading ? (
            <Card className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading history...</p>
            </Card>
          ) : filteredDetections.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No detections found</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredDetections.map((detection) => (
                <Card key={detection.id} className="p-6 border border-border hover:border-primary/50 transition-colors">
                  <div className="flex gap-6">
                    <img
                      src={detection.imageUrl || "/placeholder.svg"}
                      alt="Detection"
                      className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {formatDiseaseName(detection.disease)}
                          </h3>
                          <p className="text-sm text-muted-foreground">{formatDate(detection.createdAt)}</p>
                        </div>
                        <p className={`text-lg font-bold ${getConfidenceColor(detection.confidence)}`}>
                          {Math.round(detection.confidence * 100)}%
                        </p>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-foreground mb-2">Recommendations:</h4>
                        <ul className="space-y-1">
                          {detection.recommendations.map((rec, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex gap-2">
                              <span>•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Feedback buttons */}
                      <div className="flex gap-2">
                        {detection.feedback === null || detection.feedback === undefined ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleFeedback(detection.id, true)}
                              className="hover:bg-green-50 hover:text-green-700 hover:border-green-700"
                            >
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              Helpful
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleFeedback(detection.id, false)}
                              className="hover:bg-red-50 hover:text-red-700 hover:border-red-700"
                            >
                              <ThumbsDown className="w-4 h-4 mr-1" />
                              Not Helpful
                            </Button>
                          </>
                        ) : (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {detection.feedback === true ? (
                              <>
                                <Check className="w-4 h-4 text-green-600" />
                                <span>Marked as helpful</span>
                              </>
                            ) : (
                              <>
                                <X className="w-4 h-4 text-red-600" />
                                <span>Marked as not helpful</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  )
}
