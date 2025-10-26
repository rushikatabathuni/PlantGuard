"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/context/auth-context"
import { mockService } from "@/lib/mock-service"
import type { DetectionResult } from "@/lib/types"
import { formatDate, formatDiseaseName, getConfidenceColor } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart3, Leaf, Upload, History } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import QuickUploadWidget from "@/components/quick-upload-widget"

export default function DashboardPage() {
  const { user } = useAuth()
  const [detections, setDetections] = useState<DetectionResult[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await mockService.getDetectionHistory()
        setDetections(data.slice(0, 5))
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  // FIX #1 & #3: Correctly identify healthy vs diseased
  const stats = [
    { label: "Total Detections", value: detections.length, icon: BarChart3 },
    { 
      label: "Healthy Plants", 
      value: detections.filter((d) => d.disease.toLowerCase().includes("healthy")).length, 
      icon: Leaf 
    },
    { 
      label: "Diseases Found", 
      value: detections.filter((d) => !d.disease.toLowerCase().includes("healthy")).length, 
      icon: Upload 
    },
  ]

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background">
        <DashboardHeader />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-muted-foreground">Monitor your plant health and detect diseases instantly</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, i) => (
              <Card key={i} className="p-6 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <stat.icon className="w-8 h-8 text-primary/50" />
                </div>
              </Card>
            ))}
          </div>

          {/* Quick Upload Widget */}
          <QuickUploadWidget />

          {/* Recent Activity */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Recent Detections</h2>
              <Link href="/history">
                <Button variant="outline" size="sm">
                  <History className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </Link>
            </div>

            {isLoading ? (
              <Card className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading detections...</p>
              </Card>
            ) : detections.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground mb-4">No detections yet. Start by uploading a plant image!</p>
                <Link href="/detect">
                  <Button className="bg-primary hover:bg-primary/90">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {detections.map((detection) => (
                  <Card
                    key={detection.id}
                    className="p-4 border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={detection.imageUrl || "/placeholder.svg"}
                        alt="Detection"
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{formatDiseaseName(detection.disease)}</h3>
                        <p className="text-sm text-muted-foreground">{formatDate(detection.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${getConfidenceColor(detection.confidence)}`}>
                          {Math.round(detection.confidence * 100)}%
                        </p>
                        <p className="text-xs text-muted-foreground">Confidence</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}