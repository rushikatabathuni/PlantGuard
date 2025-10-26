"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { mockService } from "@/lib/mock-service"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import DashboardHeader from "@/components/dashboard-header"
import { ArrowLeft, Activity, ThumbsUp, ThumbsDown, Minus } from "lucide-react"
import { formatDate, formatDiseaseName, getConfidenceColor } from "@/lib/utils"
import Link from "next/link"

interface DetectionData {
  id: number
  user_id: number
  disease: string
  confidence: number
  feedback: boolean | null
  timestamp: string
}

export default function AdminDetectionsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [detections, setDetections] = useState<DetectionData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [limit, setLimit] = useState(50)

  useEffect(() => {
    if (user && user.email !== "admin@plantguard.com") {
      router.push("/dashboard")
      return
    }
    loadDetections()
  }, [user, router, limit])

  const loadDetections = async () => {
    try {
      setIsLoading(true)
      const data = await mockService.getAdminRecentDetections(limit)
      setDetections(data)
    } finally {
      setIsLoading(false)
    }
  }

  const getFeedbackIcon = (feedback: boolean | null) => {
    if (feedback === true) return <ThumbsUp className="w-4 h-4 text-green-600" />
    if (feedback === false) return <ThumbsDown className="w-4 h-4 text-red-600" />
    return <Minus className="w-4 h-4 text-muted-foreground" />
  }

  const getFeedbackText = (feedback: boolean | null) => {
    if (feedback === true) return "Helpful"
    if (feedback === false) return "Not Helpful"
    return "No feedback"
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Recent Detections</h1>
              <p className="text-muted-foreground">Showing {detections.length} recent detections</p>
            </div>
          </div>

          {/* Limit selector */}
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="form-control w-32"
          >
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
        </div>

        {/* Detections Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Disease
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Confidence
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Feedback
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {detections.map((detection) => (
                  <tr key={detection.id} className="hover:bg-muted/50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      #{detection.id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-foreground">
                      User #{detection.user_id}
                    </td>
                    <td className="px-4 py-4 text-sm text-foreground max-w-xs truncate">
                      {formatDiseaseName(detection.disease)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`text-sm font-semibold ${getConfidenceColor(detection.confidence)}`}>
                        {(detection.confidence * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getFeedbackIcon(detection.feedback)}
                        <span className="text-sm text-muted-foreground">
                          {getFeedbackText(detection.feedback)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(detection.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {detections.length === 0 && (
            <div className="p-8 text-center">
              <Activity className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No detections found</p>
            </div>
          )}
        </Card>
      </div>
    </main>
  )
}
