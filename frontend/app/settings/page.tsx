"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/context/auth-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/dashboard-header"

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background">
        <DashboardHeader />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">Settings</h1>

          {/* Account Section */}
          <Card className="p-6 border border-border mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Account Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Name</label>
                <p className="text-foreground font-medium">{user?.name}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <p className="text-foreground font-medium">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Member Since</label>
                <p className="text-foreground font-medium">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
          </Card>

          {/* Preferences Section */}
          <Card className="p-6 border border-border mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Preferences</h2>
            <p className="text-muted-foreground text-sm mb-4">Additional settings coming soon</p>
          </Card>

          {/* Logout Section */}
          <Card className="p-6 border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-4">Session</h2>
            <Button onClick={handleLogout} variant="destructive" className="w-full">
              Logout
            </Button>
          </Card>
        </div>
      </main>
    </ProtectedRoute>
  )
}
