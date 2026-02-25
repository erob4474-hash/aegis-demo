"use client"

import { Shield, FileText, Puzzle, Clock } from "lucide-react"
import { motion } from "framer-motion"
import type { KPIData } from "@/lib/aegis-store"

interface KPICardsProps {
  data: KPIData
}

const cards = [
  {
    key: "totalInterceptions" as const,
    label: "Total Interceptions",
    icon: Shield,
    format: (v: number) => v.toString(),
    accentClass: "text-primary",
    bgClass: "bg-primary/10",
  },
  {
    key: "activePolicyRules" as const,
    label: "Active REDACT Rules",
    icon: FileText,
    format: (v: number) => v.toString(),
    accentClass: "text-success",
    bgClass: "bg-success/10",
  },
  {
    key: "connectedExtensions" as const,
    label: "Connected Extensions",
    icon: Puzzle,
    format: (v: number) => v.toString(),
    accentClass: "text-chart-3",
    bgClass: "bg-chart-3/10",
  },
  {
    key: "agentUptimeHours" as const,
    label: "Agent Uptime",
    icon: Clock,
    format: (v: number) => `${v}h`,
    accentClass: "text-success",
    bgClass: "bg-success/10",
  },
]

export function KPICards({ data }: KPICardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => {
        const value = data[card.key]
        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="glass-panel rounded-xl p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{card.label}</span>
              <div className={`rounded-lg p-2 ${card.bgClass}`}>
                <card.icon className={`h-4 w-4 ${card.accentClass}`} />
              </div>
            </div>
            <p className={`mt-3 text-2xl font-semibold tracking-tight ${card.accentClass}`}>
              {card.format(value)}
            </p>
          </motion.div>
        )
      })}
    </div>
  )
}
