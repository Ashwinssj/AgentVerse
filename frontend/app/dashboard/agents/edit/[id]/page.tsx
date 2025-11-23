"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect, use } from "react"
import { Save, ArrowLeft } from "lucide-react"
import api from "@/lib/api"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function EditAgentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        provider: "OPENAI",
        model: "",
        system_message: "",
        web_search_enabled: false
    })

    useEffect(() => {
        fetchAgent()
    }, [id])

    const fetchAgent = async () => {
        try {
            const response = await api.get(`/agents/${id}/`)
            setFormData({
                name: response.data.name,
                provider: response.data.provider,
                model: response.data.model,
                system_message: response.data.system_message,
                web_search_enabled: response.data.web_search_enabled || false
            })
        } catch (error) {
            console.error("Failed to fetch agent", error)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            await api.put(`/agents/${id}/`, formData)
            router.push("/dashboard/agents")
        } catch (error: any) {
            console.error("Failed to update agent", error)
            let errorMessage = "Failed to update agent"
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
                    <Link href="/dashboard/agents">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-4xl font-display font-bold">EDIT AGENT</h1>
            </div>

            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Agent Configuration</CardTitle>
                    <CardDescription>Update your agent's settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Agent Name</Label>
                        <Input name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Socrates" />
                    </div>
                    <div className="space-y-2">
                        <Label>Provider</Label>
                        <select name="provider" value={formData.provider} onChange={handleChange} className="flex h-10 w-full border-2 border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-hard-sm focus:shadow-hard transition-all">
                            <option value="OPENAI">OpenAI</option>
                            <option value="GEMINI">Gemini</option>
                            <option value="CLAUDE">Claude</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label>Model</Label>
                        <Input name="model" value={formData.model} onChange={handleChange} placeholder="e.g., gpt-4-turbo" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between p-4 border-2 border-border rounded bg-accent/10">
                            <div className="space-y-1">
                                <Label className="text-base font-bold">Web Search Access</Label>
                                <p className="text-sm text-muted-foreground">Allow this agent to search the web for real-time information</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, web_search_enabled: !formData.web_search_enabled })}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.web_search_enabled ? 'bg-primary' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.web_search_enabled ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>System Message</Label>
                        <Textarea
                            name="system_message"
                            value={formData.system_message}
                            onChange={handleChange}
                            className="min-h-[200px] font-mono text-sm"
                            placeholder="You are a helpful assistant..."
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full gap-2 shadow-hard hover:shadow-hard-sm transition-all" onClick={handleSubmit} disabled={isLoading}>
                        <Save className="h-4 w-4" />
                        {isLoading ? "Saving..." : "Update Agent"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
