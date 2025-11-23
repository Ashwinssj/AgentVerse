import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Bot, Zap, Shield } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navbar */}
      <header className="flex h-16 items-center justify-between border-b-2 border-border px-6 bg-primary">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-8 w-8" />
          <span className="text-xl font-display font-bold">AGENTVERSE</span>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" asChild className="font-bold">
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button variant="secondary" asChild className="shadow-hard hover:shadow-hard-sm transition-all">
            <Link href="/auth/signup">Sign Up</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto flex flex-col items-center justify-center py-24 text-center">
          <h1 className="mb-6 text-6xl font-display font-bold leading-tight tracking-tighter md:text-8xl">
            ORCHESTRATE <br />
            <span className="text-primary bg-black px-4 text-white">CHAOS</span>
          </h1>
          <p className="mb-12 max-w-[800px] text-xl text-muted-foreground font-sans font-bold">
            Build, deploy, and manage multi-agent systems with a neo-brutalist edge.
            The future of AI conversation is here, and it's loud.
          </p>
          <div className="flex gap-6">
            <Button size="lg" className="h-14 px-8 text-lg gap-2 shadow-hard hover:shadow-hard-sm transition-all" asChild>
              <Link href="/auth/signup">
                Start Building <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg shadow-hard hover:shadow-hard-sm transition-all" asChild>
              <Link href="https://github.com/agentverse" target="_blank">
                View on GitHub
              </Link>
            </Button>
          </div>
        </section>

        {/* Features */}
        <section className="border-t-2 border-border bg-accent/20 py-24">
          <div className="container mx-auto grid gap-12 md:grid-cols-3 px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center bg-secondary border-2 border-black shadow-hard">
                <Bot className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-display font-bold">Multi-Agent Swarms</h3>
              <p className="text-muted-foreground font-bold">
                Create complex interactions between multiple AI agents with different personalities.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center bg-primary border-2 border-black shadow-hard">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-display font-bold">Real-time Execution</h3>
              <p className="text-muted-foreground font-bold">
                Watch conversations unfold in real-time with our high-performance orchestration engine.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center bg-white border-2 border-black shadow-hard">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-display font-bold">Secure Vault</h3>
              <p className="text-muted-foreground font-bold">
                Your API keys are encrypted with AES-256. We take security as seriously as style.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-border bg-black py-8 text-white">
        <div className="container mx-auto flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold">AGENTVERSE</span>
            <span className="text-sm text-gray-400">© 2025</span>
          </div>
          <div className="flex gap-6 text-sm font-bold">
            <Link href="#" className="hover:text-primary">Terms</Link>
            <Link href="#" className="hover:text-primary">Privacy</Link>
            <Link href="#" className="hover:text-primary">Twitter</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
