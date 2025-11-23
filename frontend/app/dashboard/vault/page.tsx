"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import api from "@/lib/api"
import { Key, Trash2, Eye, EyeOff, Plus, Edit } from "lucide-react"

export default function VaultPage() {
    const [credentials, setCredentials] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [showKey, setShowKey] = useState<Record<string, boolean>>({})
    const [newKey, setNewKey] = useState({ provider: "OPENAI", api_key: "", name: "" })
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editForm, setEditForm] = useState({ name: "", api_key: "" })

    useEffect(() => {
        fetchCredentials()
    }, [])

    const fetchCredentials = async () => {
        try {
            const response = await api.get('/vault/credentials/')
            setCredentials(response.data)
        } catch (error) {
            console.error("Failed to fetch credentials", error)
        }
    }

    const handleCreate = async () => {
        if (!newKey.api_key || !newKey.name) {
            alert("Please fill in all fields")
            return
        }
        setIsLoading(true)
        try {
            await api.post('/vault/credentials/', {
                provider: newKey.provider,
                api_key: newKey.api_key,
                name: newKey.name
            })
            fetchCredentials()
            setNewKey({ provider: "OPENAI", api_key: "", name: "" })
        } catch (error: any) {
            console.error("Failed to create credential", error)
            let errorMessage = "Failed to save API key"
            if (error.response && error.response.data) {
                errorMessage = JSON.stringify(error.response.data)
            }
            alert(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return
        try {
            await api.delete(`/vault/credentials/${id}/`)
            setCredentials(credentials.filter(c => c.id !== id))
        } catch (error) {
            console.error("Failed to delete credential", error)
        }
    }

    const startEdit = (cred: any) => {
        setEditingId(cred.id)
        setEditForm({ name: cred.name, api_key: "" })
    }

    const handleUpdate = async (id: number) => {
        setIsLoading(true)
        try {
            const payload: any = { name: editForm.name }
            if (editForm.api_key) {
                payload.api_key = editForm.api_key
            }
            await api.put(`/vault/credentials/${id}/`, payload)
            fetchCredentials()
            setEditingId(null)
            setEditForm({ name: "", api_key: "" })
        } catch (error: any) {
            console.error("Failed to update credential", error)
            alert("Failed to update credential")
        } finally {
            setIsLoading(false)
        }
    }

    const toggleShow = (id: string) => {
        setShowKey(prev => ({ ...prev, [id]: !prev[id] }))
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-display font-bold">VAULT</h1>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Add New Key</CardTitle>
                        <CardDescription>Securely store your LLM provider API keys.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Provider</Label>
                            <select
                                value={newKey.provider}
                                onChange={(e) => setNewKey({ ...newKey, provider: e.target.value })}
                                className="flex h-10 w-full border-2 border-border bg-background px-3 py-2 text-sm shadow-hard-sm focus:shadow-hard transition-all outline-none"
                            >
                                <option value="OPENAI">OpenAI</option>
                                <option value="GEMINI">Gemini</option>
                                <option value="CLAUDE">Claude</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Key Name</Label>
                            <Input
                                placeholder="My Production Key"
                                value={newKey.name}
                                onChange={(e) => setNewKey({ ...newKey, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>API Key</Label>
                            <Input
                                type="password"
                                placeholder="sk-..."
                                value={newKey.api_key}
                                onChange={(e) => setNewKey({ ...newKey, api_key: e.target.value })}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full gap-2 shadow-hard hover:shadow-hard-sm transition-all" onClick={handleCreate} disabled={isLoading}>
                            <Plus className="h-4 w-4" />
                            {isLoading ? "Encrypting..." : "Save to Vault"}
                        </Button>
                    </CardFooter>
                </Card>

                <div className="space-y-4">
                    {credentials.map((cred) => (
                        <Card key={cred.id} className="bg-accent/20">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg">{cred.provider}</CardTitle>
                                        {editingId === cred.id ? (
                                            <Input
                                                className="mt-1"
                                                value={editForm.name}
                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                placeholder="Key name"
                                            />
                                        ) : (
                                            <p className="text-sm font-semibold text-primary">{cred.name}</p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        {editingId === cred.id ? (
                                            <>
                                                <Button size="sm" onClick={() => handleUpdate(cred.id)} disabled={isLoading}>
                                                    Save
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>
                                                    Cancel
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button variant="ghost" size="sm" onClick={() => startEdit(cred)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDelete(cred.id)} className="text-destructive hover:text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <CardDescription>Added on {new Date(cred.created_at).toLocaleDateString()}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {editingId === cred.id ? (
                                    <div className="space-y-2">
                                        <Label>New API Key (leave empty to keep current)</Label>
                                        <Input
                                            type="password"
                                            value={editForm.api_key}
                                            onChange={(e) => setEditForm({ ...editForm, api_key: e.target.value })}
                                            placeholder="sk-..."
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 font-mono text-sm bg-background p-2 border-2 border-border truncate">
                                            {showKey[cred.id] ? cred.encrypted_key : "••••••••••••••••••••••••"}
                                        </div>
                                        <Button variant="outline" size="icon" onClick={() => toggleShow(cred.id.toString())}>
                                            {showKey[cred.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                    {credentials.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-[200px] border-2 border-dashed border-border text-muted-foreground">
                            <Key className="h-12 w-12 mb-4 opacity-50" />
                            <p>No keys in vault</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
