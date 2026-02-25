"use client"

import {
  LayoutDashboard,
  FileText,
  ScrollText,
  HeartPulse,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"

export type TabId = "overview" | "policy" | "audit" | "health"

interface SidebarNavProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "policy", label: "Policy Engine", icon: FileText },
  { id: "audit", label: "Audit Logs", icon: ScrollText },
  { id: "health", label: "System Health", icon: HeartPulse },
]

export function SidebarNav({ activeTab, onTabChange }: SidebarNavProps) {
  return (
    <aside className="flex w-full flex-row gap-1 overflow-x-auto border-b border-border/50 bg-card px-4 py-2 lg:w-56 lg:flex-shrink-0 lg:flex-col lg:overflow-x-visible lg:border-b-0 lg:border-r lg:px-3 lg:py-6">
      {/* Logo */}
      <div className="mr-4 hidden items-center gap-2 px-3 pb-5 lg:flex">
        <div className="rounded-lg bg-primary/15 p-1.5">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-foreground">
            Aegis
          </h1>
          <p className="text-[10px] text-muted-foreground">
            DLP Mission Control
          </p>
        </div>
      </div>

      {/* Nav items */}
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-all whitespace-nowrap",
            activeTab === tab.id
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          )}
        >
          <tab.icon className="h-4 w-4 flex-shrink-0" />
          <span>{tab.label}</span>
        </button>
      ))}
    </aside>
  )
}
