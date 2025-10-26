"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { mockService } from "@/lib/mock-service"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import DashboardHeader from "@/components/dashboard-header"
import { 
  Users, 
  Activity, 
  ThumbsUp, 
  ThumbsDown, 
  TrendingUp,
  AlertCircle 
} from "lucide-react"

interface AdminStats {
  total_users: number
  total_detections: number
  feedback: {
    helpful: number
    not_helpful: number
    pending: number
    accuracy_rate: number
  }
  top_diseases: Array<{
    disease: string
    count: number
    avg_confidence: number
  }>
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // Check if user is admin
    if (user && user.email !== "admin@plantguard.com") {
      router.push("/dashboard")
      return
    }

    loadStats()
  }, [user, router])

  const loadStats = async () => {
    try {
      setIsLoading(true)
      const response = await mockService.getAdminStats()
      setStats(response)
    } catch (err: any) {
      console.error("Failed to load admin stats:", err)
      setError(err.message || "Failed to load statistics")
    } finally {
      setIsLoading(false)
    }
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

  if (error) {
    return (
      <main className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-8 text-center border-destructive/50">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="text-destructive">{error}</p>
            <Button onClick={loadStats} className="mt-4">
              Retry
            </Button>
          </Card>
        </div>
      </main>
    )
  }

  if (!stats) return null

  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">System overview and analytics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Total Users</p>
                <p className="text-3xl font-bold text-foreground">{stats.total_users}</p>
              </div>
              <Users className="w-8 h-8 text-primary/50" />
            </div>
          </Card>

          <Card className="p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Total Detections</p>
                <p className="text-3xl font-bold text-foreground">{stats.total_detections}</p>
              </div>
              <Activity className="w-8 h-8 text-primary/50" />
            </div>
          </Card>

          <Card className="p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Helpful Feedback</p>
                <p className="text-3xl font-bold text-green-600">{stats.feedback.helpful}</p>
              </div>
              <ThumbsUp className="w-8 h-8 text-green-600/50" />
            </div>
          </Card>

          <Card className="p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Accuracy Rate</p>
                <p className="text-3xl font-bold text-primary">{stats.feedback.accuracy_rate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary/50" />
            </div>
          </Card>
        </div>

        {/* Feedback Breakdown */}
        <Card className="p-6 border border-border mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Feedback Overview</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <ThumbsUp className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Helpful</p>
                <p className="text-2xl font-bold text-foreground">{stats.feedback.helpful}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThumbsDown className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Not Helpful</p>
                <p className="text-2xl font-bold text-foreground">{stats.feedback.not_helpful}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-foreground">{stats.feedback.pending}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Top Diseases */}
        <Card className="p-6 border border-border">
          <h2 className="text-xl font-bold text-foreground mb-4">Top 10 Detected Diseases</h2>
          <div className="space-y-4">
            {stats.top_diseases.map((disease, index) => (
              <div key={index} className="flex items-center justify-between pb-4 border-b border-border last:border-0">
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {disease.disease.split('___').join(' - ').replace(/_/g, ' ')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Avg Confidence: {(disease.avg_confidence * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{disease.count}</p>
                  <p className="text-xs text-muted-foreground">detections</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 flex gap-4">
          <Button onClick={() => router.push("/admin/users")} variant="outline">
            View All Users
          </Button>
          <Button onClick={() => router.push("/admin/detections")} variant="outline">
            Recent Detections
          </Button>
        </div>
      </div>
    </main>
  )
}
