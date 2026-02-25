"use client"

import { motion } from "framer-motion"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import type { ChartDataPoint } from "@/lib/aegis-store"

interface ActivityChartProps {
  data: ChartDataPoint[]
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number; dataKey: string; color: string }[]
  label?: string
}) {
  if (!active || !payload) return null
  return (
    <div className="glass-panel rounded-lg p-3 text-sm">
      <p className="mb-1.5 font-medium text-foreground">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground capitalize">
            {entry.dataKey}:
          </span>
          <span className="font-mono text-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export function ActivityChart({ data }: ActivityChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="glass-panel rounded-xl p-5"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-foreground">
            Interception Activity
          </h3>
          <p className="text-xs text-muted-foreground">Last 24 hours</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-md bg-success/10 px-2.5 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-live" />
          <span className="text-xs font-medium text-success">Live</span>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillInterceptions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(217, 91%, 53%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(217, 91%, 53%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillPassed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(215, 20%, 14%)"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval={4}
            />
            <YAxis
              tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={30}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: "12px", color: "hsl(215, 15%, 55%)" }}
            />
            <Area
              type="monotone"
              dataKey="interceptions"
              stroke="hsl(217, 91%, 53%)"
              strokeWidth={2}
              fill="url(#fillInterceptions)"
              name="Interceptions"
            />
            <Area
              type="monotone"
              dataKey="passed"
              stroke="hsl(142, 71%, 45%)"
              strokeWidth={2}
              fill="url(#fillPassed)"
              name="Redacted & Passed"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
