"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { Upload, User, Image as ImageIcon, Save } from "lucide-react"
import api from "@/lib/api"

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null)
    const [avatarPreview, setAvatarPreview] = useState<string>("/avatar.png")
    const [bannerPreview, setBannerPreview] = useState<string>("/banner.png")
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        fetchUser()
        // Load from localStorage
        const savedAvatar = localStorage.getItem('userAvatar')
        const savedBanner = localStorage.getItem('userBanner')
        if (savedAvatar) setAvatarPreview(savedAvatar)
        if (savedBanner) setBannerPreview(savedBanner)
    }, [])

    const fetchUser = async () => {
        try {
            const response = await api.get('/users/me/')
            setUser(response.data)
        } catch (error) {
            console.error("Failed to fetch user", error)
        }
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string)
                localStorage.setItem('userAvatar', reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setBannerPreview(reader.result as string)
                localStorage.setItem('userBanner', reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSave = async () => {
        setIsLoading(true)
        try {
            alert("Settings saved successfully! Refresh the dashboard to see changes.")
        } catch (error) {
            console.error("Failed to save settings", error)
            alert("Failed to save settings")
        } finally {
            setIsLoading(false)
        }
    }

    const handleResetToDefault = () => {
        setAvatarPreview("/avatar.png")
        setBannerPreview("/banner.png")
        localStorage.removeItem('userAvatar')
        localStorage.removeItem('userBanner')
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-display font-bold">SETTINGS</h1>
                <p className="text-muted-foreground">Customize your AgentVerse experience</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-2 border-border shadow-hard">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Profile Information
                        </CardTitle>
                        <CardDescription>Your account details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Username</Label>
                            <Input value={user?.username || ''} disabled className="bg-muted" />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input value={user?.email || ''} disabled className="bg-muted" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 border-border shadow-hard">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ImageIcon className="h-5 w-5" />
                            Profile Avatar
                        </CardTitle>
                        <CardDescription>Upload a custom avatar image</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col items-center gap-4">
                            <div className="h-32 w-32 border-2 border-black bg-primary flex items-center justify-center overflow-hidden">
                                <img
                                    src={avatarPreview}
                                    alt="Avatar Preview"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="w-full">
                                <Label htmlFor="avatar-upload" className="cursor-pointer">
                                    <div className="flex items-center justify-center gap-2 p-3 border-2 border-border bg-accent hover:bg-accent/80 transition-colors">
                                        <Upload className="h-4 w-4" />
                                        <span className="font-bold">Choose Avatar</span>
                                    </div>
                                    <Input
                                        id="avatar-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                </Label>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-2 border-border shadow-hard">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5" />
                        Dashboard Banner
                    </CardTitle>
                    <CardDescription>Upload a custom banner for your dashboard</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-4">
                        <div className="h-48 w-full border-2 border-black bg-muted flex items-center justify-center overflow-hidden">
                            <img
                                src={bannerPreview}
                                alt="Banner Preview"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Label htmlFor="banner-upload" className="cursor-pointer flex-1">
                                <div className="flex items-center justify-center gap-2 p-3 border-2 border-border bg-accent hover:bg-accent/80 transition-colors">
                                    <Upload className="h-4 w-4" />
                                    <span className="font-bold">Choose Banner</span>
                                </div>
                                <Input
                                    id="banner-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleBannerChange}
                                    className="hidden"
                                />
                            </Label>
                            <Button variant="outline" onClick={handleResetToDefault}>
                                Reset to Default
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
                <Button
                    size="lg"
                    className="gap-2 shadow-hard hover:shadow-hard-sm transition-all"
                    onClick={handleSave}
                    disabled={isLoading}
                >
                    <Save className="h-4 w-4" />
                    {isLoading ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </div>
    )
}
