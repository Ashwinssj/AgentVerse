"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import api from "@/lib/api"
import { useRouter } from "next/navigation"

export default function SignupPage() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    async function onSubmit(event: React.FormEvent) {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget as HTMLFormElement)
        const username = formData.get("username") as string
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        try {
            await api.post('/users/register/', {
                username,
                email,
                password,
            })

            alert("Account created! Please login.")
            router.push("/auth/login")
        } catch (error: any) {
            console.error("Signup failed:", error)
            let errorMessage = "Signup failed. Please try again."

            if (error.response && error.response.data) {
                const data = error.response.data
                // Django DRF returns errors as { field: [errors] }
                const firstError = Object.values(data)[0]
                if (Array.isArray(firstError)) {
                    errorMessage = firstError[0] as string
                } else if (typeof data.error === 'string') {
                    errorMessage = data.error
                }
            }

            alert(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-secondary/20">
            <Card className="w-full max-w-sm bg-background">
                <CardHeader>
                    <CardTitle className="text-3xl">Sign Up</CardTitle>
                    <CardDescription>
                        Create an account to start building agents.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <form onSubmit={onSubmit}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" name="username" placeholder="AgentSmith" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" required />
                            </div>
                            <Button className="w-full" type="submit" disabled={isLoading}>
                                {isLoading ? "Creating account..." : "Create account"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <div className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="text-primary underline-offset-4 hover:underline font-bold">
                            Login
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
