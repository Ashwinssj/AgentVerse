"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import api from "@/lib/api"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    async function onSubmit(event: React.FormEvent) {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget as HTMLFormElement)
        const username = formData.get("username") as string
        const password = formData.get("password") as string

        try {
            const response = await api.post('/users/login/', {
                username,
                password,
            })

            console.log("Login success:", response.data)
            localStorage.setItem('token', response.data.token)
            router.push("/dashboard")
        } catch (error) {
            console.error("Login failed:", error)
            alert("Login failed. Please check your credentials.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-accent/20">
            <Card className="w-full max-w-sm bg-background shadow-hard">
                <CardHeader>
                    <CardTitle className="text-3xl font-display">Login</CardTitle>
                    <CardDescription>
                        Enter your username to login to your account.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <form onSubmit={onSubmit}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" name="username" type="text" placeholder="AgentSmith" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" required />
                            </div>
                            <Button className="w-full shadow-hard hover:shadow-hard-sm transition-all" type="submit" disabled={isLoading}>
                                {isLoading ? "Logging in..." : "Sign in"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <div className="text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link href="/auth/signup" className="text-primary underline-offset-4 hover:underline font-bold">
                            Sign up
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
