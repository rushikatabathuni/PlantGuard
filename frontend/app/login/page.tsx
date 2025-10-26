"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/auth-context"
import { Leaf } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  // FIX #5: Remove default demo credentials
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(email, password)
      toast({
        title: "Success",
        description: "Logged in successfully!",
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Login failed",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 border border-border">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Leaf className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">PlantGuard</h1>
        </div>

        <h2 className="text-xl font-semibold text-foreground mb-2">Welcome Back</h2>
        <p className="text-muted-foreground mb-6">Login to your PlantGuard account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-center text-muted-foreground text-sm mt-6">
          Don't have an account?{" "}
          <Link href="/register" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </p>

        {/* FIX #5: Keep demo credentials info box but don't pre-fill */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg text-xs text-muted-foreground">
          <p className="font-semibold mb-2">Demo Credentials:</p>
          <p>Email: demo@plantguard.com</p>
          <p>Password: demo123</p>
        </div>
      </Card>
    </main>
  )
}