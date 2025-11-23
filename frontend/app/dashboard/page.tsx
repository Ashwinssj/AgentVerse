"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Activity, Zap, DollarSign } from "lucide-react"
import { useEffect, useState } from "react"
import api from "@/lib/api"
import Link from "next/link"

export default function DashboardPage() {
    const [stats, setStats] = useState({ agents: 0, sessions: 0, tokens: 0 })
    const [recentSessions, setRecentSessions] = useState<any[]>([])
    const [user, setUser] = useState<any>(null)
    const [avatarUrl, setAvatarUrl] = useState("/avatar.png")
    const [bannerUrl, setBannerUrl] = useState("/banner.png")

    useEffect(() => {
        fetchData()
        fetchUser()
        // Load custom images from localStorage
        const savedAvatar = localStorage.getItem('userAvatar')
        const savedBanner = localStorage.getItem('userBanner')
        if (savedAvatar) setAvatarUrl(savedAvatar)
        if (savedBanner) setBannerUrl(savedBanner)
    }, [])

    const fetchData = async () => {
        try {
            const agentsRes = await api.get('/agents/')
            const sessionsRes = await api.get('/sessions/')

            setStats({
                agents: agentsRes.data.length,
                sessions: sessionsRes.data.length,
                tokens: 1200000 // Mock for now as backend doesn't track tokens yet
            })
            setRecentSessions(sessionsRes.data.slice(0, 3))
        } catch (error) {
            console.error("Failed to fetch dashboard data", error)
        }
    }

    const fetchUser = async () => {
        try {
            const response = await api.get('/users/me/')
            setUser(response.data)
        } catch (error) {
            console.error("Failed to fetch user info", error)
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-display font-bold">DASHBOARD</h1>
                <Button size="lg" className="gap-2" asChild>
                    <Link href="/dashboard/sessions">
                        <Plus className="h-5 w-5" />
                        New Session
                    </Link>
                </Button>
            </div>

            {/* Banner */}
            <div className="relative h-48 w-full overflow-hidden rounded-none border-2 border-border shadow-hard">
                <img src={bannerUrl} alt="Banner" className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center bg-black/40 p-8">
                    <div className="flex items-center gap-4">
                        <img src={avatarUrl} alt="Avatar" className="h-20 w-20 rounded-none border-2 border-white shadow-hard" />
                        <div className="text-white">
                            <h2 className="text-2xl font-display font-bold">Welcome back, {user?.username || 'User'}!</h2>
                            <p className="font-sans">Ready to orchestrate some chaos?</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-accent">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xl font-bold">Active Agents</CardTitle>
                        <Activity className="h-5 w-5" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-display font-bold">{stats.agents}</div>
                        <p className="text-xs font-bold text-muted-foreground">Ready to deploy</p>
                    </CardContent>
                </Card>
                <Card className="bg-secondary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xl font-bold">Total Sessions</CardTitle>
                        <Zap className="h-5 w-5" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-display font-bold">{stats.sessions}</div>
                        <p className="text-xs font-bold text-muted-foreground">Conversations logged</p>
                    </CardContent>
                </Card>
                <Card className="bg-primary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xl font-bold">Token Usage</CardTitle>
                        <DollarSign className="h-5 w-5" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-display font-bold">{(stats.tokens / 1000000).toFixed(1)}M</div>
                        <p className="text-xs font-bold text-muted-foreground">Est. cost: $24.00</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Sessions */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentSessions.map((session) => (
                            <div key={session.id} className="flex items-center justify-between border-b-2 border-border py-4 last:border-0">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-muted border-2 border-border flex items-center justify-center font-bold">
                                        #{session.id}
                                    </div>
                                    <div>
                                        <p className="font-bold">{session.topic}</p>
                                        <p className="text-sm text-muted-foreground">{session.status}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`rounded-full px-2 py-1 text-xs font-bold border-2 ${session.status === 'ACTIVE' ? 'bg-green-100 text-green-800 border-green-800' : 'bg-gray-100 text-gray-800 border-gray-800'}`}>
                                        {session.status}
                                    </span>
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`/dashboard/sessions/${session.id}`}>View</Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {recentSessions.length === 0 && (
                            <p className="text-muted-foreground text-center py-4">No sessions found.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
