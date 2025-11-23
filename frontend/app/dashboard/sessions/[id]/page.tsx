"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useState, useEffect, use } from "react"
import { ArrowLeft, Play, Square, Send, FileText, Download, BarChart } from "lucide-react"
import api from "@/lib/api"
import Link from "next/link"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [session, setSession] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [prompt, setPrompt] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)
    const [thinkingAgent, setThinkingAgent] = useState<string>("")

    useEffect(() => {
        fetchSession()
    }, [id])

    const fetchSession = async () => {
        try {
            const response = await api.get(`/sessions/${id}/`)
            setSession(response.data)
        } catch (error) {
            console.error("Failed to fetch session", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleStart = async () => {
        try {
            await api.post(`/sessions/${id}/start/`)
            fetchSession()
        } catch (error) {
            console.error("Failed to start session", error)
        }
    }

    const handleStop = async () => {
        try {
            await api.post(`/sessions/${id}/stop/`)
            fetchSession()
        } catch (error) {
            console.error("Failed to stop session", error)
        }
    }

    const handleSendPrompt = async () => {
        if (!prompt.trim()) return

        setIsGenerating(true)
        const agentNames = session.agents?.map((a: any) => a.name).join(', ') || 'Agent'
        setThinkingAgent(agentNames)

        try {
            const response = await api.post(`/sessions/${id}/inject/`, {
                prompt: prompt
            })
            setSession(response.data)
            setPrompt("")
        } catch (error: any) {
            console.error("Failed to inject prompt", error)
            let errorMessage = "Failed to send prompt"
            if (error.response && error.response.data && error.response.data.error) {
                errorMessage = error.response.data.error
            }
            alert(errorMessage)
        } finally {
            setIsGenerating(false)
            setThinkingAgent("")
        }
    }

    const handleGenerateSummary = async () => {
        try {
            const response = await api.post(`/sessions/${id}/generate-summary/`)
            alert(`Summary generated!\n\n${response.data.summary}`)
        } catch (error) {
            console.error("Failed to generate summary", error)
            alert("Failed to generate summary. This feature will be implemented soon!")
        }
    }

    const handleDownloadPDF = async () => {
        try {
            const response = await api.get(`/sessions/${id}/export-pdf/`, {
                responseType: 'text'
            })

            // Create blob from text response
            const blob = new Blob([response.data], { type: 'text/plain' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `session-${id}-transcript.txt`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error("Failed to download PDF", error)
            alert("Failed to download transcript")
        }
    }

    if (isLoading) {
        return <div className="text-center py-12">Loading session...</div>
    }

    if (!session) {
        return <div className="text-center py-12">Session not found</div>
    }

    const isActive = session.status === 'ACTIVE'

    return (
        <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
            <div className="flex items-center justify-between border-b-2 border-border pb-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard/sessions">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-display font-bold">{session.topic}</h1>
                        <p className="text-sm text-muted-foreground">Session #{id}</p>
                        <p className="text-xs text-muted-foreground">
                            {session.turns?.length || 0} / {session.max_turns} turns
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleGenerateSummary}>
                        <FileText className="mr-2 h-4 w-4" />
                        Summary
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                        <Download className="mr-2 h-4 w-4" />
                        PDF
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/sessions/${id}/report`}>
                            <BarChart className="mr-2 h-4 w-4" />
                            Report
                        </Link>
                    </Button>
                    {isActive ? (
                        <Button className="bg-red-500 hover:bg-red-600" onClick={handleStop}>
                            <Square className="mr-2 h-4 w-4" />
                            Stop
                        </Button>
                    ) : (
                        <Button onClick={handleStart}>
                            <Play className="mr-2 h-4 w-4" />
                            Resume
                        </Button>
                    )}
                </div>
            </div>

            <Card className="flex-1 overflow-hidden bg-accent/10 border-2 border-border shadow-hard relative">
                <div className="absolute inset-0 overflow-y-auto p-6 space-y-6">
                    {session.turns && session.turns.length > 0 ? (
                        session.turns.map((turn: any, index: number) => {
                            const colors = [
                                { bg: 'bg-blue-100', border: 'border-blue-500', text: 'text-blue-900', avatar: 'bg-blue-500' },
                                { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-900', avatar: 'bg-green-500' },
                                { bg: 'bg-purple-100', border: 'border-purple-500', text: 'text-purple-900', avatar: 'bg-purple-500' },
                                { bg: 'bg-orange-100', border: 'border-orange-500', text: 'text-orange-900', avatar: 'bg-orange-500' },
                                { bg: 'bg-pink-100', border: 'border-pink-500', text: 'text-pink-900', avatar: 'bg-pink-500' },
                                { bg: 'bg-yellow-100', border: 'border-yellow-500', text: 'text-yellow-900', avatar: 'bg-yellow-500' },
                            ]
                            const colorIndex = turn.agent_name ? turn.agent_name.charCodeAt(0) % colors.length : index % colors.length
                            const color = colors[colorIndex]

                            return (
                                <div key={turn.id} className={`flex gap-4 ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}>
                                    <div className={`h-10 w-10 shrink-0 ${color.avatar} border-2 border-black flex items-center justify-center font-bold text-white`}>
                                        {turn.agent_name?.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className={`space-y-1 ${index % 2 === 1 ? 'flex flex-col items-end' : ''}`}>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold">{turn.agent_name}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(turn.created_at).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <div className={`${color.bg} border-2 ${color.border} p-4 shadow-hard-sm max-w-2xl`}>
                                            <div className={`prose prose-sm max-w-none ${color.text}`}>
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />,
                                                        h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-3 mb-2" {...props} />,
                                                        h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-2 mb-1" {...props} />,
                                                        p: ({ node, ...props }) => <p className="mb-2 leading-relaxed" {...props} />,
                                                        strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                                                        em: ({ node, ...props }) => <em className="italic" {...props} />,
                                                        ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                                                        ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
                                                        code: ({ node, inline, ...props }: any) =>
                                                            inline ?
                                                                <code className="bg-black/10 px-1 py-0.5 rounded text-sm font-mono" {...props} /> :
                                                                <code className="block bg-black/10 p-2 rounded text-sm font-mono overflow-x-auto mb-2" {...props} />,
                                                        blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-black/20 pl-4 italic my-2" {...props} />,
                                                        hr: ({ node, ...props }) => <hr className="my-4 border-black/20" {...props} />,
                                                    }}
                                                >
                                                    {turn.response}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    ) : null}

                    {/* Thinking Animation */}
                    {isGenerating && (
                        <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="h-10 w-10 shrink-0 bg-gradient-to-br from-primary to-secondary border-2 border-black flex items-center justify-center font-bold text-white animate-pulse">
                                <span className="animate-bounce">🤔</span>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold">{thinkingAgent}</span>
                                    <span className="text-xs text-muted-foreground animate-pulse">is thinking...</span>
                                </div>
                                <div className="bg-accent/30 border-2 border-border p-4 shadow-hard-sm max-w-2xl">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {!session.turns || session.turns.length === 0 && !isGenerating ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <p>No messages yet. Inject a prompt to start the conversation.</p>
                        </div>
                    ) : null}
                </div>
            </Card>

            <div className="flex gap-2">
                <Input
                    placeholder={isGenerating ? "Agent is thinking..." : "Inject a prompt..."}
                    className="flex-1"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isGenerating}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && prompt.trim() && !isGenerating) {
                            handleSendPrompt()
                        }
                    }}
                />
                <Button
                    size="icon"
                    disabled={!prompt.trim() || isGenerating}
                    onClick={handleSendPrompt}
                    className={isGenerating ? "animate-pulse" : ""}
                >
                    {isGenerating ? (
                        <div className="animate-spin">⏳</div>
                    ) : (
                        <Send className="h-4 w-4" />
                    )}
                </Button>
            </div>
        </div>
    )
}
