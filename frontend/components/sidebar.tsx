"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Key, MessageSquare, Settings, LogOut } from "lucide-react"

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "Agents", href: "/dashboard/agents" },
    { icon: MessageSquare, label: "Sessions", href: "/dashboard/sessions" },
    { icon: Key, label: "Vault", href: "/dashboard/vault" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex h-screen w-64 flex-col border-r-2 border-border bg-background">
            <div className="flex h-16 items-center justify-center border-b-2 border-border bg-primary">
                <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="Logo" className="h-8 w-8" />
                    <span className="text-xl font-display font-bold">AGENTVERSE</span>
                </div>
            </div>
            <nav className="flex-1 space-y-2 p-4">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-none border-2 border-transparent px-3 py-2 text-sm font-bold transition-all hover:bg-accent hover:text-black hover:shadow-hard-sm",
                                isActive && "border-border bg-secondary shadow-hard hover:bg-secondary"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>
            <div className="border-t-2 border-border p-4">
                <button className="flex w-full items-center gap-3 rounded-none border-2 border-transparent px-3 py-2 text-sm font-bold text-red-500 hover:bg-red-100 hover:border-red-500 hover:shadow-hard-sm transition-all">
                    <LogOut className="h-4 w-4" />
                    Logout
                </button>
            </div>
        </div>
    )
}
