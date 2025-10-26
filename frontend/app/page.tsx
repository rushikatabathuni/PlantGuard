import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Leaf, Zap, BarChart3, Shield } from "lucide-react"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-foreground">PlantGuard</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6 text-balance">
          Detect Plant Diseases with AI
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
          PlantGuard uses advanced AI to identify plant diseases instantly. Get accurate diagnoses and actionable
          recommendations to protect your crops.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/register">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Start Free Trial
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Why Choose PlantGuard?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Zap,
              title: "Instant Detection",
              description: "Get disease identification in seconds using AI",
            },
            {
              icon: BarChart3,
              title: "Detailed Analytics",
              description: "Track detection history and trends over time",
            },
            {
              icon: Shield,
              title: "Accurate Results",
              description: "High-confidence disease identification",
            },
            {
              icon: Leaf,
              title: "Expert Recommendations",
              description: "Actionable treatment and prevention advice",
            },
          ].map((feature, i) => (
            <Card key={i} className="p-6 border border-border hover:border-primary/50 transition-colors">
              <feature.icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: "1", title: "Upload Image", description: "Take a photo of your plant or upload an existing image" },
            { step: "2", title: "AI Analysis", description: "Our AI analyzes the image and identifies any diseases" },
            {
              step: "3",
              title: "Get Recommendations",
              description: "Receive detailed treatment and prevention advice",
            },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Card className="p-12 bg-primary/5 border-primary/20">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Protect Your Plants?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of farmers and gardeners using PlantGuard to keep their crops healthy.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Get Started Now
            </Button>
          </Link>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
          <p>&copy; 2025 PlantGuard. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
