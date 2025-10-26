"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { mockService } from "@/lib/mock-service"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import DashboardHeader from "@/components/dashboard-header"
import { ArrowLeft, Users as UsersIcon, Activity } from "lucide-react"
import Link from "next/link"

interface UserData {
  id: number
  username: string
  email: string
  detection_count: number
}

export default function AdminUsersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<UserData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (user && user.email !== "admin@plantguard.com") {
      router.push("/dashboard")
      return
    }
    loadUsers()
  }, [user, router])

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      const data = await mockService.getAdminUsers()
      setUsers(data)
    } catch (err: any) {
      setError(err.message || "Failed to load users")
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

  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">All Users</h1>
            <p className="text-muted-foreground">Total: {users.length} users</p>
          </div>
        </div>

        {error && (
          <Card className="p-4 bg-destructive/10 border-destructive mb-6">
            <p className="text-destructive">{error}</p>
          </Card>
        )}

        {/* Users Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Detections
                  </th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {users.map((usr) => (
                  <tr key={usr.id} className="hover:bg-muted/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      #{usr.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {usr.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {usr.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-foreground">
                          {usr.detection_count}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="p-8 text-center">
              <UsersIcon className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No users found</p>
            </div>
          )}
        </Card>
      </div>
    </main>
  )
}
