"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Menu, Leaf, BookOpen, Users, Trophy, Brain, MessageCircle, HelpCircle, User, Bell } from "lucide-react"
import Link from "next/link"

interface MobileNavProps {
  currentPath?: string
}

export default function MobileNav({ currentPath }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    {
      href: "/",
      label: "Home",
      icon: Leaf,
      description: "Back to homepage",
    },
    {
      href: "/missions",
      label: "Missions",
      icon: BookOpen,
      description: "Learning missions",
      badge: "12 Active",
    },
    {
      href: "/quiz",
      label: "Quiz",
      icon: Brain,
      description: "Test your knowledge",
      badge: "Earn Coins",
    },
    {
      href: "/community",
      label: "Community",
      icon: Users,
      description: "Connect with farmers",
      badge: "10k+ Members",
    },
    {
      href: "/rewards",
      label: "Rewards",
      icon: Trophy,
      description: "Redeem your coins",
      badge: "1,250 Coins",
    },
    {
      href: "/support",
      label: "AI Support",
      icon: MessageCircle,
      description: "Get instant help",
      badge: "24/7",
    },
    {
      href: "/faq",
      label: "FAQ",
      icon: HelpCircle,
      description: "Common questions",
    },
    {
      href: "/leaderboard",
      label: "Leaderboard",
      icon: Trophy,
      description: "Top quiz scores"
    },
    {
      href: "/activity",
      label: "Activity",
      icon: Brain,
      description: "Recent events"
    },
    {
      href: "/data",
      label: "Data",
      icon: HelpCircle,
      description: "Local storage info"
    },
    {
      href: "/notifications",
      label: "Notifications",
      icon: Bell,
      description: "Recent alerts"
    },
  ]

  const closeNav = () => setIsOpen(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="p-6 pb-4 border-b bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <div>
              <SheetTitle className="text-xl font-bold">FarmGrow</SheetTitle>
              <p className="text-sm text-muted-foreground">Sustainable farming made easy</p>
            </div>
          </div>
        </SheetHeader>

        <div className="p-4">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPath === item.href

              return (
                <Link key={item.href} href={item.href} onClick={closeNav}>
                  <div
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "hover:bg-muted text-foreground"
                      }`}
                  >
                    <Icon className="h-5 w-5" />
                    <div className="flex-1">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.description}</div>
                    </div>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </Link>
              )
            })}
          </nav>

          <div className="mt-6 pt-6 border-t">
            <Link href="/dashboard" onClick={closeNav}>
              <Button variant="outline" className="w-full bg-transparent">
                <User className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
