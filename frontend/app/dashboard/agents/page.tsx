"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { Plus, Bot, Trash2, Edit } from "lucide-react"
import api from "@/lib/api"
import Link from "next/link"

export default function AgentsPage() {
    const [agents, setAgents] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchAgents()
    }, [])

    const fetchAgents = async () => {
        try {
            const response = await api.get('/agents/')
            setAgents(response.data)
        } catch (error) {
            console.error("Failed to fetch agents", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this agent?")) return
        try {
            await api.delete(`/agents/${id}/`)
            setAgents(agents.filter(a => a.id !== id))
        } catch (error) {
            console.error("Failed to delete agent", error)
            alert("Failed to delete agent")
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-display font-bold">AGENTS</h1>
                <Button size="lg" className="gap-2 shadow-hard hover:shadow-hard-sm transition-all" asChild>
                    <Link href="/dashboard/agents/create">
                        <Plus className="h-5 w-5" />
                        Create Agent
                    </Link>
                </Button>
            </div>

            {isLoading ? (
                <div className="text-center py-12">Loading agents...</div>
            ) : agents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-border rounded-lg bg-accent/10">
                    <Bot className="h-16 w-16 mb-4 opacity-50" />
                    <h3 className="text-xl font-bold mb-2">No Agents Found</h3>
                    <p className="text-muted-foreground mb-6">Create your first agent to get started.</p>
                    <Button asChild>
                        <Link href="/dashboard/agents/create">Create Agent</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {agents.map((agent) => (
                        <Card key={agent.id} className="group hover:shadow-hard-sm transition-all cursor-pointer border-2 border-border">
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-primary border-2 border-black flex items-center justify-center">
                                        <Bot className="h-6 w-6 text-black" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-bold">{agent.name}</CardTitle>
                                        <CardDescription className="text-xs font-mono">{agent.model}</CardDescription>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" asChild>
                                        <Link href={`/dashboard/agents/edit/${agent.id}`}>
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={(e) => {
                                        e.preventDefault()
                                        handleDelete(agent.id)
                                    }}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                    {agent.system_message || "No system message defined."}
                                </p>
                                <div className="mt-4 flex items-center gap-2">
                                    <span className="inline-flex items-center rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                        {agent.provider}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
