"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { Save, ArrowLeft, CheckSquare, Square } from "lucide-react"
import api from "@/lib/api"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function CreateSessionPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [agents, setAgents] = useState<any[]>([])
    const [selectedAgentIds, setSelectedAgentIds] = useState<number[]>([])
    const [topic, setTopic] = useState("")
    const [maxTurns, setMaxTurns] = useState(10)

    useEffect(() => {
        fetchAgents()
    }, [])

    const fetchAgents = async () => {
        try {
            const response = await api.get('/agents/')
            setAgents(response.data)
        } catch (error) {
            console.error("Failed to fetch agents", error)
        }
    }

    const toggleAgent = (id: number) => {
        setSelectedAgentIds(prev =>
            prev.includes(id) ? prev.filter(aid => aid !== id) : [...prev, id]
        )
    }

    const handleSubmit = async () => {
        if (selectedAgentIds.length === 0) {
            alert("Please select at least one agent.")
            return
        }
        if (!topic.trim()) {
            alert("Please enter a topic for the session.")
            return
        }
        setIsLoading(true)
        try {
            await api.post('/sessions/', {
                agent_ids: selectedAgentIds,
                topic: topic,
                max_turns: maxTurns
            })
            router.push("/dashboard/sessions")
        } catch (error: any) {
            console.error("Failed to create session", error)
            let errorMessage = "Failed to create session"
            if (error.response && error.response.data) {
                errorMessage = JSON.stringify(error.response.data)
            }
            alert(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/sessions">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-4xl font-display font-bold">NEW SESSION</h1>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Configuration */}
                <Card>
                    <CardHeader>
                        <CardTitle>Session Configuration</CardTitle>
                        <CardDescription>Define the topic and conversation limits.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Topic</Label>
                            <Input
                                placeholder="e.g., Quantum Computing Ethics"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Max Turns (Total Messages)</Label>
                            <Input
                                type="number"
                                min="1"
                                max="100"
                                value={maxTurns}
                                onChange={(e) => setMaxTurns(parseInt(e.target.value) || 10)}
                            />
                            <p className="text-xs text-muted-foreground">
                                The conversation will stop after {maxTurns} total messages.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Agent Selection */}
                <Card>
                    <CardHeader>
                        <CardTitle>Select Agents</CardTitle>
                        <CardDescription>Choose agents to participate in this conversation.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 max-h-[300px] overflow-y-auto">
                        {agents.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No agents found. <Link href="/dashboard/agents/create" className="text-primary underline">Create one first.</Link>
                            </div>
                        ) : (
                            agents.map((agent) => {
                                const isSelected = selectedAgentIds.includes(agent.id)
                                return (
                                    <div
                                        key={agent.id}
                                        onClick={() => toggleAgent(agent.id)}
                                        className={`flex items-center justify-between p-4 border-2 cursor-pointer transition-all ${isSelected ? 'border-primary bg-secondary/20' : 'border-border hover:border-primary/50'}`}
                                    >
                                        <div>
                                            <h3 className="font-bold">{agent.name}</h3>
                                            <p className="text-xs text-muted-foreground">{agent.model} • {agent.provider}</p>
                                        </div>
                                        {isSelected ? <CheckSquare className="h-5 w-5 text-primary" /> : <Square className="h-5 w-5 text-muted-foreground" />}
                                    </div>
                                )
                            })
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full gap-2 shadow-hard hover:shadow-hard-sm transition-all" onClick={handleSubmit} disabled={isLoading || agents.length === 0}>
                            <Save className="h-4 w-4" />
                            {isLoading ? "Creating..." : "Start Session"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
