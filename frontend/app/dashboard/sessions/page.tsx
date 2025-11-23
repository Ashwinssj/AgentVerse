"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, MessageSquare, Clock } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import api from "@/lib/api"

export default function SessionsPage() {
    const [sessions, setSessions] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchSessions()
    }, [])

    const fetchSessions = async () => {
        try {
            const response = await api.get('/sessions/')
            setSessions(response.data)
        } catch (error) {
            console.error("Failed to fetch sessions", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-display font-bold">SESSIONS</h1>
                <Button size="lg" className="gap-2 shadow-hard hover:shadow-hard-sm transition-all" asChild>
                    <Link href="/dashboard/sessions/create">
                        <Plus className="h-5 w-5" />
                        New Session
                    </Link>
                </Button>
            </div>

            {isLoading ? (
                <div className="text-center py-12">Loading sessions...</div>
            ) : sessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-border rounded-lg bg-accent/10">
                    <MessageSquare className="h-16 w-16 mb-4 opacity-50" />
                    <h3 className="text-xl font-bold mb-2">No Sessions</h3>
                    <p className="text-muted-foreground mb-6">Start a new conversation with your agents.</p>
                    <Button asChild>
                        <Link href="/dashboard/sessions/create">New Session</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {sessions.map((session) => (
                        <Card key={session.id} className="group hover:shadow-hard-sm transition-all border-2 border-border">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="h-12 w-12 bg-primary border-2 border-black flex items-center justify-center shrink-0">
                                        <MessageSquare className="h-6 w-6 text-black" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <CardTitle className="text-xl font-bold truncate">{session.topic}</CardTitle>
                                        <CardDescription className="text-sm">
                                            {session.agents?.map((a: any) => a.name).join(', ')}
                                        </CardDescription>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        <span>{new Date(session.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/dashboard/sessions/${session.id}`}>Open</Link>
                                    </Button>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
