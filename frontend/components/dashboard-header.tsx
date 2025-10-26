"use client"

import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Leaf, LogOut, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DashboardHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Leaf className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold text-foreground">PlantGuard</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors">
            Dashboard
          </Link>
          <Link href="/detect" className="text-foreground hover:text-primary transition-colors">
            Detect
          </Link>
          <Link href="/history" className="text-foreground hover:text-primary transition-colors">
            History
          </Link>
          {/* Show Admin link only for admin user */}
          {user?.email === "admin@plantguard.com" && (
            <Link href="/admin" className="text-foreground hover:text-primary transition-colors font-semibold">
              Admin
            </Link>
          )}
        </nav>

        

        <div className="flex items-center gap-4">
          <Link href="/settings">
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </Link>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
