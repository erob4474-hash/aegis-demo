"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, CheckCircle, Info, ShieldAlert } from "lucide-react"
import type { ActivityEvent } from "@/lib/aegis-store"
import { cn } from "@/lib/utils"

interface LiveFeedProps {
  events: ActivityEvent[]
}

const iconMap = {
  info: Info,
  warning: AlertTriangle,
  critical: ShieldAlert,
  success: CheckCircle,
}

const colorMap = {
  info: "text-primary",
  warning: "text-chart-3",
  critical: "text-critical",
  success: "text-success",
}

const bgMap = {
  info: "bg-primary/10",
  warning: "bg-chart-3/10",
  critical: "bg-critical/10",
  success: "bg-success/10",
}

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime()
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ago`
}

export function LiveFeed({ events }: LiveFeedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="glass-panel flex h-full flex-col rounded-xl p-5"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-foreground">Live Activity</h3>
          <p className="text-xs text-muted-foreground">Real-time event stream</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-md bg-success/10 px-2.5 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-live" />
          <span className="text-xs font-medium text-success">Streaming</span>
        </div>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto pr-1" style={{ maxHeight: 340 }}>
        <AnimatePresence initial={false}>
          {events.map((event, i) => {
            const Icon = iconMap[event.type]
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-start gap-3 rounded-lg bg-secondary/40 p-3"
              >
                <div className={cn("mt-0.5 rounded-md p-1.5", bgMap[event.type])}>
                  <Icon className={cn("h-3.5 w-3.5", colorMap[event.type])} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs leading-relaxed text-foreground">
                    {event.message}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground font-mono">
                    {timeAgo(event.timestamp)}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
