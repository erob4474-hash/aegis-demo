"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import {
  Cpu,
  HardDrive,
  Wifi,
  WifiOff,
  RefreshCw,
  Globe,
  Monitor,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AgentStatus {
  online: boolean
  latencyMs: number
  lastCheck: string
}

interface ExtensionInfo {
  name: string
  version: string
  browser: string
  status: "connected" | "idle" | "offline"
}

const mockExtensions: ExtensionInfo[] = [
  {
    name: "Aegis Shield - Universal",
    version: "1.0.0",
    browser: "Chrome",
    status: "connected",
  },
]

const statusColors = {
  connected: "text-success",
  idle: "text-chart-3",
  offline: "text-critical",
}

const statusDotColors = {
  connected: "bg-success",
  idle: "bg-chart-3",
  offline: "bg-critical",
}

export function SystemHealth() {
  const [agentStatus, setAgentStatus] = useState<AgentStatus>({
    online: false,
    latencyMs: 0,
    lastCheck: new Date().toLocaleTimeString(),
  })
  const [isChecking, setIsChecking] = useState(false)

  // Simulated telemetry
  const [cpuUsage] = useState(2.4)
  const [memUsage] = useState(18.7)

  const checkAgent = useCallback(async () => {
    setIsChecking(true)
    const start = Date.now()

    try {
      const res = await fetch("http://127.0.0.1:3000/api/anonymize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: "health-check" }),
        signal: AbortSignal.timeout(3000),
      })

      const latency = Date.now() - start

      if (res.ok) {
        setAgentStatus({
          online: true,
          latencyMs: latency,
          lastCheck: new Date().toLocaleTimeString(),
        })
      } else {
        throw new Error("Agent error")
      }
    } catch {
      setAgentStatus({
        online: false,
        latencyMs: 0,
        lastCheck: new Date().toLocaleTimeString(),
      })
    } finally {
      setIsChecking(false)
    }
  }, [])

  useEffect(() => {
    checkAgent()
    const interval = setInterval(checkAgent, 15000)
    return () => clearInterval(interval)
  }, [checkAgent])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="flex flex-col gap-4"
    >
      {/* Agent Status Card */}
      <div className="glass-panel rounded-xl p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">
            Rust Agent Status
          </h3>
          <button
            onClick={checkAgent}
            disabled={isChecking}
            className="flex items-center gap-1.5 rounded-md bg-secondary/60 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <RefreshCw
              className={cn("h-3 w-3", isChecking && "animate-spin")}
            />
            Check
          </button>
        </div>

        {/* Connection Status */}
        <div className="mb-5 flex items-center gap-3 rounded-lg bg-secondary/40 p-4">
          <div
            className={cn(
              "rounded-lg p-2.5",
              agentStatus.online ? "bg-success/10" : "bg-critical/10"
            )}
          >
            {agentStatus.online ? (
              <Wifi className="h-5 w-5 text-success" />
            ) : (
              <WifiOff className="h-5 w-5 text-critical" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  agentStatus.online
                    ? "bg-success animate-pulse-live"
                    : "bg-critical"
                )}
              />
              <span
                className={cn(
                  "text-sm font-medium",
                  agentStatus.online ? "text-success" : "text-critical"
                )}
              >
                {agentStatus.online ? "Online" : "Unreachable"}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              http://127.0.0.1:3000
              {agentStatus.online && ` - ${agentStatus.latencyMs}ms`}
            </p>
          </div>
        </div>

        {/* Telemetry */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-secondary/40 p-3">
            <div className="mb-2 flex items-center gap-2">
              <Cpu className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs text-muted-foreground">CPU</span>
            </div>
            <p className="text-lg font-semibold text-foreground">
              {cpuUsage}%
            </p>
            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${cpuUsage}%` }}
              />
            </div>
          </div>
          <div className="rounded-lg bg-secondary/40 p-3">
            <div className="mb-2 flex items-center gap-2">
              <HardDrive className="h-3.5 w-3.5 text-chart-3" />
              <span className="text-xs text-muted-foreground">Memory</span>
            </div>
            <p className="text-lg font-semibold text-foreground">
              {memUsage} MB
            </p>
            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-chart-3 transition-all"
                style={{ width: `${(memUsage / 128) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <p className="mt-3 text-center text-[10px] text-muted-foreground/60">
          Last check: {agentStatus.lastCheck}
        </p>
      </div>

      {/* Connected Extensions */}
      <div className="glass-panel rounded-xl p-5">
        <h3 className="mb-3 text-sm font-medium text-foreground">
          Connected Extensions
        </h3>
        <div className="space-y-2">
          {mockExtensions.map((ext, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg bg-secondary/40 p-3"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-secondary p-1.5">
                  {ext.browser === "Chrome" ? (
                    <Globe className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <Monitor className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">
                    {ext.browser}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {ext.name} {ext.version}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    statusDotColors[ext.status],
                    ext.status === "connected" && "animate-pulse-live"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium capitalize",
                    statusColors[ext.status]
                  )}
                >
                  {ext.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
