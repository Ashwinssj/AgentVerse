"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect, use } from "react"
import { ArrowLeft, Download, FileText } from "lucide-react"
import api from "@/lib/api"
import Link from "next/link"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#eab308']

export default function ReportDashboardPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [session, setSession] = useState<any>(null)
    const [summary, setSummary] = useState<string>("")
    const [report, setReport] = useState<string>("")
    const [isLoading, setIsLoading] = useState(true)
    const [chartData, setChartData] = useState<any[]>([])

    useEffect(() => {
        fetchData()
    }, [id])

    const fetchData = async () => {
        try {
            // Fetch session details
            const sessionRes = await api.get(`/sessions/${id}/`)
            setSession(sessionRes.data)

            // Fetch summary
            const summaryRes = await api.post(`/sessions/${id}/generate-summary/`)
            setSummary(summaryRes.data.summary)

            // Fetch report
            const reportRes = await api.post(`/sessions/${id}/generate-report/`)
            setReport(reportRes.data.report)

            // Process chart data
            const agentStats: any = {}
            sessionRes.data.turns?.forEach((turn: any) => {
                if (!agentStats[turn.agent_name]) {
                    agentStats[turn.agent_name] = 0
                }
                agentStats[turn.agent_name]++
            })

            const data = Object.entries(agentStats).map(([name, value]) => ({
                name,
                value,
                percentage: ((value as number) / sessionRes.data.turns.length * 100).toFixed(1)
            }))
            setChartData(data)

        } catch (error) {
            console.error("Failed to fetch data", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDownloadPDF = async () => {
        try {
            // Create a comprehensive text document
            let content = "=" * 80 + "\n"
            content += "AGENTVERSE SESSION REPORT\n"
            content += "=" * 80 + "\n\n"

            content += `Session ID: ${id}\n`
            content += `Topic: ${session?.topic}\n`
            content += `Status: ${session?.status}\n`
            content += `Total Turns: ${session?.turns?.length || 0}\n\n`

            content += "=" * 80 + "\n"
            content += "SUMMARY\n"
            content += "=" * 80 + "\n\n"
            content += summary + "\n\n"

            content += "=" * 80 + "\n"
            content += "DETAILED REPORT\n"
            content += "=" * 80 + "\n\n"
            content += report + "\n\n"

            content += "=" * 80 + "\n"
            content += "AGENT PARTICIPATION\n"
            content += "=" * 80 + "\n\n"
            chartData.forEach(item => {
                content += `${item.name}: ${item.value} turns (${item.percentage}%)\n`
            })
            content += "\n"

            content += "=" * 80 + "\n"
            content += "FULL TRANSCRIPT\n"
            content += "=" * 80 + "\n\n"

            session?.turns?.forEach((turn: any, i: number) => {
                content += `Turn ${i + 1} - ${turn.agent_name}\n`
                content += "-" * 80 + "\n"
                content += `${turn.response}\n\n`
            })

            // Download as text file
            const blob = new Blob([content], { type: 'text/plain' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `session-${id}-complete-report.txt`)
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (error) {
            console.error("Failed to download report", error)
            alert("Failed to download report")
        }
    }

    if (isLoading) {
        return <div className="text-center py-12">Loading report...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b-2 border-border pb-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/sessions/${id}`}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-4xl font-display font-bold">{session?.topic || 'SESSION REPORT'}</h1>
                        <p className="text-sm text-muted-foreground">Session #{id}</p>
                    </div>
                </div>
                <Button onClick={handleDownloadPDF} className="gap-2">
                    <Download className="h-4 w-4" />
                    Download Complete Report
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Summary Card */}
                <Card className="border-2 border-border shadow-hard">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Summary
                        </CardTitle>
                        <CardDescription>AI-generated conversation summary</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="prose prose-sm max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {summary}
                            </ReactMarkdown>
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics Card */}
                <Card className="border-2 border-border shadow-hard">
                    <CardHeader>
                        <CardTitle>Session Statistics</CardTitle>
                        <CardDescription>Quick overview</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-accent/20 p-4 rounded border-2 border-border">
                                <p className="text-sm text-muted-foreground">Total Turns</p>
                                <p className="text-3xl font-bold">{session?.turns?.length || 0}</p>
                            </div>
                            <div className="bg-accent/20 p-4 rounded border-2 border-border">
                                <p className="text-sm text-muted-foreground">Agents</p>
                                <p className="text-3xl font-bold">{chartData.length}</p>
                            </div>
                            <div className="bg-accent/20 p-4 rounded border-2 border-border">
                                <p className="text-sm text-muted-foreground">Status</p>
                                <p className="text-xl font-bold">{session?.status}</p>
                            </div>
                            <div className="bg-accent/20 p-4 rounded border-2 border-border">
                                <p className="text-sm text-muted-foreground">Progress</p>
                                <p className="text-xl font-bold">{session?.turns?.length}/{session?.max_turns}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Pie Chart */}
                <Card className="border-2 border-border shadow-hard">
                    <CardHeader>
                        <CardTitle>Agent Participation</CardTitle>
                        <CardDescription>Distribution of turns by agent</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Bar Chart */}
                <Card className="border-2 border-border shadow-hard">
                    <CardHeader>
                        <CardTitle>Turn Count by Agent</CardTitle>
                        <CardDescription>Number of responses per agent</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Report */}
            <Card className="border-2 border-border shadow-hard">
                <CardHeader>
                    <CardTitle>Detailed Analysis</CardTitle>
                    <CardDescription>Complete session report</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="prose prose-sm max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {report}
                        </ReactMarkdown>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
